/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class BackGround extends SceneryGround implements ISceneryLayer{

        private _clouds:BackGroundClouds;
        protected init(){
            this._clouds = new BackGroundClouds(0.8);
            this.addChild(this._clouds);
        }

        protected resResetScenery(e:any){
            //TODO:
            this._clouds.eachChilder((child)=>{
                child.x-=e.x;
                //child.x+= this._clouds.opts.startpos;
            })
        }
    }

    //TODO:[BUG]某些情况下背景会消失的问题
    class BackGroundClouds extends ParallaxObject{

        private _propstextures:Array<any>;
        private _ramdomarray:Array<number>;

        public constructor(depeth:number=0.5){
            super(depeth,{startpos:stage.viewPort().width+100});
        }

        protected onEachTime(e){
            super.onEachTime(e);
            //trace("BackGroundClouds",this.x,speed.plane*this._propdepth*e.delay,this._propdepth*e.delay);
        }

        protected preInitProps(){
            this._propstextures = TextureRepository().find(/bgcloud\d{2}/);
            this._ramdomarray = [];
            var i,propslength=this._propstextures.length
                ,_totalassigned:number=0,_autoassign;
            var setPropIndex = (prop,probability:number)=>{
                var index = this._propstextures.indexOf(TextureRepository().get(prop));
                if(index>=0){
                    this._ramdomarray[index] = probability;
                    _totalassigned += probability;
                    propslength--;
                }
            };

            setPropIndex("bgcloud01",0.2);
            setPropIndex("bgcloud03",0.3);
            setPropIndex("bgcloud05",0.3);

            _autoassign = 1-_totalassigned;
            if(_autoassign>0){
                _autoassign = _autoassign/propslength;
            }

            for(i=0;i<this._propstextures.length;i++){
                if(!this._ramdomarray[i]){
                    this._ramdomarray[i]=_autoassign;
                }
            }
        }

        protected onCreateAProp(prop:alcedo.canvas.Sprite){
            var prop:alcedo.canvas.Sprite;
            prop.texture = this.selectAtexture();
            prop.scaleToWidth(stage.width()*1.6);
            //trace(this.selectAtexture(),prop.scale.x, prop.scale.y);

        }

        protected onPosAProp(prop){
            prop.y = stage.height()-10;
            prop.alpha = 0.9
        }

        private selectAtexture():alcedo.canvas.Texture{
            return this._propstextures[Math.probabilityPool(this._ramdomarray)];
        }
    }
}