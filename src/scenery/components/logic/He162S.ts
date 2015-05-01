/**
 * Created by tommyZZM on 2015/4/26.
 */
module game{
    //He162 Capture By Alies and Refited into a ColourFul Plane happy fly in place sky
    export class He162S extends LogicObject{

        private _plane:LogicObject;

        public constructor(skin:string){
            super();
            this._display = new alcedo.canvas.Sprite(TextureRepository().get(skin));
            this.b.scaleALL(0.6)
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_ADD,this.onAdd,this);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_REMOVE,this.onRemove,this);

            this.bindParticleEmitterAt(-0.5,0);
            this._maxspeed = 12.6;
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
            this._colourEmitter.applyForce(new alcedo.canvas.Vector2D(0,0.03))
        }

        public update(e:alcedo.canvas.ITickerEvent){
            super.update(e);

            this._colourEmitter.initialdegree = this._velocity.toDeg()-180;

            var visualsizerect:any = this.b.localToGlobal(this.b["_staticboundingbox"].width*this._colourEmitterPostion.x+this.b.pivotOffsetX()
                ,this.b["_staticboundingbox"].height*this._colourEmitterPostion.y+this.b.pivotOffsetY());//
            this._colourEmitter.x = visualsizerect.x;
            this._colourEmitter.y = visualsizerect.y;
        }

    }
}