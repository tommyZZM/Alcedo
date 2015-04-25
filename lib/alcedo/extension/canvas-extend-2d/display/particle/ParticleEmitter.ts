/**
 * Created by tommyZZM on 2015/4/24.
 * 离子发射器
 */
module alcedo{
    export module canvas{
        export class ParticleEmitter extends DisplayObject{

            private _particlespool:Array<Particle>;
            private _particles:Array<Particle>;

            private _maxparticles:number;

            private _mass:number;
            private _force:Vector2D;
            private _alphadecay:number;//alpha衰减
            private _scaledecay:number;//scale衰减

            public constructor(){
                super();

                this._maxparticles = 1;

                this._particles = [];
                this._particlespool = [];

                this._mass = 1;
                this._force = new Vector2D(0,0.1);
            }

            public _draw(renderer){
                var partile:Particle;
                for(var i=0;i<this._particles.length;i++){
                    partile = this._particles[i];
                    partile._transform();
                    renderer.context.globalAlpha = partile.alpha*this._alpha;
                    //trace(partile.alpha,this._alpha,partile.alpha*this._alpha);
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
                    partile = new Particle();
                }
                partile.create(this.x,this.y);
                partile.applyForce(new Vector2D(Math.randomFrom(-2,2),Math.randomFrom(-1,-6)));
                this._particles.push(partile);
                partile.onDecay((index)=>{
                    this._particles.fastRemove(index);//you dian diao a
                },this,[this._particles.length-1]);
            }

            /**
             * 更新栗子们
             * @param e
             * @private
             */
            private _updateParticles(e){
                var partile:Particle;
                for(var i=0;i<this._particles.length;i++){
                    partile = this._particles[i];
                    this._updateOnePartivle(partile);
                    partile.update(e);
                }

                if(this._particles.length<this._maxparticles){
                    this._createOneParticle()
                }
            }

            /**
             * 更新一枚栗子
             * @param partile
             * @private
             */
            protected _updateOnePartivle(partile:Particle){
                partile.applyForce(this._force);
            }

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
        }
    }
}