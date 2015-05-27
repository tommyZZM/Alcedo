/**
 * Created by tommyZZM on 2015/4/24.
 * 一枚单独的栗子
 * 栗子的生命周期 create prebron alive decaying decay
 *
 */
module alcedo{
    export module canvas{
        export class Particle implements IDisplayObject{
            public position:Vector2D;
            public scale:Vector2D;
            public scaleAll(value){
                this.scale.x = value;
                this.scale.y = value;
            }
            public pivot:Vector2D;
            public rotation:number = 0;
            public alpha:number = 1;

            private _mass:number = 1;//质量哦
            private _velocity:alcedo.canvas.Vector2D;//速度哦
            private _acceleration:alcedo.canvas.Vector2D;//加速度哦

            public worldtransform:Matrix2D;

            private _currtime:number;
            private _lifetime:number;

            public constructor(){
                this.position = new Vector2D();
                this.scale = new Vector2D(1,1);
                this.pivot = new Vector2D();

                this._velocity = new Vector2D();
                this._acceleration = new Vector2D();

                this.worldtransform = new Matrix2D();

                this.create(0,0);
            }

            public _stagetransform(stage:Stage){
                this.worldtransform.identityMatrix(stage.worldtransform)
            }

            public _transform(){
                //this.worldtransform.identityMatrix(Matrix2D.identity);
                this.worldtransform.appendTransform(this.position.x, this.position.y,
                    this.scale.x, this.scale.y, this.rotation, 0, 0, this.pivot.x, this.pivot.y);
            }

            public _draw(renderer:CanvasRenderer|any){
                this.display(renderer);
            }

            protected display(renderer:CanvasRenderer){
                //be overriden
                var context = renderer.context;
                context.beginPath();
                context.arc(0, 0, 6, 0, 2 * Math.PI, false);
                context.fillStyle = '#95a5a6';
                context.fill();
                context.lineWidth = 3;
                context.strokeStyle = '#2c3e50';
                context.stroke();
            }

            /**
             * [控制栗子运动的接口]
             * 给栗子施加一个力
             * @param vector
             */
            public applyForce(vector:Vector2D){
                this._velocity.add(vector.divide(Vector2D.identity(this._mass,this._mass)));
            }

            /**
             * 栗子生命周期开始
             * @param x
             * @param y
             * @param mass
             * @param preserve
             */
            public create(x:number,y:number,mass:number=1,...preserve){
                this.position.reset(x,y);
                this.scale.reset(1,1);
                this.rotation = 0;
                this._velocity.reset();
                this._acceleration.reset();
                this._currtime = 0;
                this._lifetime = 60000;
                this._onDecayTask = [];

                this.alpha = 1;
                this._mass = mass;

                this._isdecayed = false;
                this._currphase = 0;
                this.oncreate(x,y,mass);
                this._lifephase = [this.prebron,this.alive,this.decaying];
            }

            protected oncreate(x:number,y:number,mass:number=1){

            }

            /**
             * 栗子生命周期相位.可变，会在Update方法中调用
             */
            private _currphase:number;
            private _lifephase:Array<(e:ITickerEvent)=>boolean>;
            private readPhase(e){
                if(this._isdecayed)return;
                if(this._lifephase[this._currphase].call(this,e)===true){
                    this._currphase++;
                }
                //trace(this._currtime>this._lifetime);
                if(this._currphase >= this._lifephase.length || this._currtime>this._lifetime){
                    this.decay()
                }
            }
            /**
             * 当栗子诞生
             */
            protected prebron():boolean{
                this.scale.x+=0.05;
                this.scale.y+=0.05;
                if(this.scale.x>1.6){
                    this.scale.x = 1.6;
                    this.scale.y = 1.6;
                    return true;
                }
            }

            /**
             * 栗子
             */
            protected alive():boolean{
                return true;
            }

            /**
             * 栗子逝去
             */
            protected decaying():boolean{
                this.alpha-=0.01;
                this.scale.x-=0.01;
                this.scale.y-=0.01;
                if(this.alpha<0){
                    this.alpha=0;
                    return true;
                }
            }

            private _isdecayed:boolean;
            protected decay(){
                this._isdecayed = true;
                AppNotifyable.notifyArray(this._onDecayTask,[this]);
            }
            private _onDecayTask = [];
            public onDecay(callback:Function,thisObject:any,param:Array<any> = []){
                this._onDecayTask.push({callback:callback,thisObject:thisObject,param:param});
            }

            public update(e:ITickerEvent){
                this._velocity.add(this._acceleration);
                this.position.add(this._velocity);
                this._currtime+=e.dt;
                this.readPhase(e)
            }
        }
    }
}