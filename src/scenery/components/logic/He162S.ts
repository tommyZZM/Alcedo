/**
 * Created by tommyZZM on 2015/4/26.
 */
module game{
    //He162 Capture By Alies and Refited into a ColourFul Plane happy fly in place sky
    export class He162S extends LogicObject{

        private _plane:LogicObject;

        public constructor(skin:string){
            super();
            this._display = new alcedo.canvas.Sprite(TextureRepository().get("testbird02"));
            this.b.scaleALL(0.6)
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_ADD,this.onAdd,this);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_REMOVE,this.onRemove,this);

            this.bindParticleEmitterAt(-0.5,0);
            this._maxspeed = 10.20;
        }

        private onAdd(e){
            e.parent.addChildAt(this._colourEmitter,e.index-1);
            trace(e.parent["_children"])
        }

        private onRemove(e){
            e.parent.removeChild(this._colourEmitter);
        }

        private _colourEmitter:alcedo.canvas.ParticleEmitter;
        private _colourEmitterPostion:alcedo.canvas.Vector2D;
        public bindParticleEmitterAt(offsetx:number,offsety:number){
            this._colourEmitter =  new alcedo.canvas.ParticleEmitter({spread:6,max:60,rate:20});
            this._colourEmitterPostion = new alcedo.canvas.Vector2D(offsetx,offsety);
            this._colourEmitter.play();
            //this._colourEmitter.applyForce(new alcedo.canvas.Vector2D(0,0.03))
        }

        public update(e:alcedo.canvas.ITickerEvent){
            super.update(e);
            this._colourEmitter.initialdegree = this._velocity.deg-180;

            var visualsizerect:any = this.b.localToGlobal(this.b["_staticboundingbox"].width*this._colourEmitterPostion.x+this.b.pivotOffsetX()
                ,this.b["_staticboundingbox"].height*this._colourEmitterPostion.y+this.b.pivotOffsetY());//
            this._colourEmitter.x = visualsizerect.x;
            this._colourEmitter.y = visualsizerect.y;

            //trace();
            this.applyForce(new alcedo.canvas.Vector2D(0,0.1));
            this.acceleration_degree=0;

            this.debugRobot()
        }

        public flyup(){
            this.acceleration_degree=-2;
            this.speed+=0.01;
        }

        private _debugautocontrol:boolean;
        private debugRobot(){
            /**
             * debug状态下小灰机处于最高速度。
             */

            if(this.b.y>stage.height()*0.6 && ! this._debugautocontrol){
                this._debugautocontrol = true;
                //trace("debugautocontrol on")
            }

            if(this.velocity.deg>-30 && this._debugautocontrol ){
                this.flyup()
            }else{
                this._debugautocontrol = false;
            }
        }


    }
}