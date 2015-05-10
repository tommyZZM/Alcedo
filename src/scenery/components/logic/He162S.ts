/**
 * Created by tommyZZM on 2015/4/26.
 */
module game{
    //bala
    export class He162S extends LogicObject{

        public static reference:He162S;

        private _plane:LogicObject;

        public constructor(skin:string){
            super();
            if(!!He162S.reference)return;

            MovieClipRepository()
                .praseMovieClipData(AsyncRES().get("smallalcedo_json")
                ,TextureRepository().get("smallalcedo_png"));

            this._display = new alcedo.canvas.MovieClip(MovieClipRepository().get("smallalcedo"));

            this.b.scaleALL(0.3);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_ADD,this.onAdd,this);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_REMOVE,this.onRemove,this);

            this.bindParticleEmitterAt(-0.5,0);
            this._maxspeed = 10.20;

            alcedo.addDemandListener(GameControl,CmdCatalog.CTR_FLY_BEGIN,this.beginfly,this);
            alcedo.addDemandListener(GameControl,CmdCatalog.CTR_FLY_RELEASE,this.endfly,this);

            He162S.reference = this;
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

            //this.applyForce(new alcedo.canvas.Vector2D(0,0.1));
            //this.acceleration_degree=0;

            if(this.autocontrol)this.debugRobot();

            if(this._flystate){
                this.flyup();
            }else{
                this.acceleration_degree = 0;
            }
        }

        private _flystate:boolean;
        public beginfly(){
            if(this._flystate)return;
            this._flystate = true;
            //trace("fly");
            (<alcedo.canvas.MovieClip>this._display).play(6);
            //小灰机刚刚开始往上飞..
            //todo:动画,特效
        }

        public endfly(){
            if(!this._flystate)return;
            this._flystate = false;
            (<alcedo.canvas.MovieClip>this._display).playToAndStop(1)
            //(<alcedo.canvas.MovieClip>this._display).stopAt(1)
        }

        private flyup(){
            this.acceleration_degree=-3;
            this.speed+=0.01;
        }

        public readyfly(){
            this.autocontrol = false;
            this._flystate = false;
        }

        public autofly(){
            this.autocontrol = true;
        }


        //自动驾驶,用于开始界面和debug
        private autocontrol:boolean = false;
        private _debugautocontrol:boolean;
        private debugRobot(){
            /**
             * debug状态下小灰机处于最高速度。
             */
            if(!this.autocontrol)return;
            this.speed = 5;

            if(this.b.y>stage.height()*0.6 && ! this._debugautocontrol){
                this._debugautocontrol = true;
                //trace("debugautocontrol on")
            }

            if(this.velocity.deg>-30 && this._debugautocontrol ){
                this.beginfly()
            }else{
                this._debugautocontrol = false;
               this.endfly()
            }
        }

    }
}