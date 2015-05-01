/**
 * Created by tommyZZM on 2015/4/24.
 * 离子发射器
 */
module alcedo{
    export module canvas{
        export class ParticleEmitter extends DisplayObject{

            private _particlespool:Array<Particle>;
            private _particles:Array<Particle>;

            private _max:number;

            private _particleClass:any;

            private _currinitial:Vector2D;
            private _initial:Vector2D;
            private _mass:number;

            private _spread:number;
            private _massrandom:number;

            private _rate:number;//喷射速率 个数/秒
            private _raterandom:number;

            /**
             * @param initial
             * @param opts
             * @particleClass 粒子类
             */
            public constructor(opts:any={}){
                super();
                trace(opts)

                this._particles = [];
                this._particlespool = [];

                this._currinitial = new Vector2D();
                this._forcemoment = new Vector2D();
                this._force = new Vector2D();
                this._shouldcreate = 0;

                //frequency
                this._initial = opts.initial?opts.initial.clone():new Vector2D();
                this._spread = opts.spread || 0;
                this._mass   = opts.massrandom || 1;
                this._massrandom = opts.massrandom || 0;
                this._rate = opts.rate || 1;
                this._max = opts.max || 1;

                this._particleClass = isOfClass(opts.particleClass,Particle)?opts.particleClass:Particle;
            }

            public _draw(renderer){
                var wt,partile:Particle;
                for(var i=0;i<this._particles.length;i++){
                    partile = this._particles[i];
                    partile._stagetransform(this._stage)
                    partile._transform();
                    renderer.context.globalAlpha = partile.alpha*this._alpha;
                    //trace(partile.alpha,this._alpha,partile.alpha*this._alpha);
                    //partile.worldtransform = this._getMatrix(partile.worldtransform)
                    renderer.setTransform(partile.worldtransform);
                    partile._draw(renderer);
                }
            }

            /**
             * 创建一枚栗子
             * @private
             */
            private _createOneParticle(){
                var partile:Particle;
                if(this._particlespool.length>0){
                    partile = this._particlespool.pop();
                }else{
                    partile = new this._particleClass();
                }
                this._ParticleInit(partile);
                this._particles.push(partile);
                partile.onDecay((particle)=>{
                    this._particles.fastRemove(this._particles.indexOf(particle));//you dian diao a
                    this._particlespool.push(particle);
                },this);
            }

            private _ParticleInit(paricle:Particle){
                paricle.create(this.x,this.y);

                this._currinitial.resetAs(this._initial);
                if(this._spread){//计算散射角
                    var _randeg = Math.randomFrom(-1,1)*this._spread/2;
                    var _curdeg = _randeg+this._initial.toDeg();
                    this._currinitial.resetToDeg(_curdeg);
                }
                paricle.applyForce(this._currinitial);
            }

            /**
             * 更新栗子们,判断是否创建栗子
             * @param e
             * @private
             */
            private _shouldcreate:number;//本帧数应该创建的粒子数
            private _updateParticles(e){
                var partile:Particle;
                for(var i=0;i<this._particles.length;i++){
                    partile = this._particles[i];
                    this._updateOneParticle(partile);
                    partile.update(e);
                }

                if(this._forcemoment.length>0){
                    this._forcemoment.reset();
                }

                this._shouldcreate+=(this._rate/100);
                var delay = (this._shouldcreate)^0;
                if(this._shouldcreate>1)this._shouldcreate=0;

                //trace(delay,this._particles.length,this._max);
                if(delay<1 || this._particles.length>=this._max)return;
                for(var i=0;i<delay;i++){
                    //TODO:当i>1时说明错过了上次创建粒子的时机
                    this._createOneParticle()
                }
            }

            /**
             * 更新一枚栗子
             * @param partile
             * @private
             */
            protected _updateOneParticle(partile:Particle){
                partile.applyForce(this._force);

                if(this._forcemoment.length>0){
                    partile.applyForce(this._forcemoment);
                }


            }

            //private _particleupdatetask:Function[];
            //public onEachParticleUpdate(fn:(particle:Particle)=>{}){
            //    this._particleupdatetask.push(fn);
            //}

            /**
             * 粒子行为控制
             */
            private _force:Vector2D;
            private _forcemoment:Vector2D;
            public applyForce(force:Vector2D,continute:boolean = true){
                if(continute){
                    this._force.add(force);
                }else{
                    this._forcemoment.add(force);
                }
            }

            public set initialdegree(drgee:number){
                this._initial.resetToDeg(drgee);
            }


            /**
             * 发射器开关控制系统
             * @private
             */
            protected _onAdd(){
                super._onAdd();
                if(this.isAddtoStage()){
                    this.setPlayState(this._playstatetmp);
                }
            }

            public play(){
                this.setPlayState(true)
            }

            public stop(){
                this.setPlayState(false)
            }

            private _playstate:boolean;
            private _playstatetmp:boolean;
            private setPlayState(value:boolean){
                //trace(this._playstate , value)
                if(this._playstate == value) {
                    return;
                }

                if(!this.isAddtoStage()){
                    this._playstatetmp = value;
                    trace("'[dev]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if(value){
                    this._stage.addEventListener(Stage.ENTER_MILLSECOND10,this._updateParticles, this);
                }else{
                    this._stage.removeEventListener(Stage.ENTER_MILLSECOND10,this._updateParticles, this);
                }
            }

            public dispose(){
                //todo:释放粒子发射器
            }
        }
    }
}