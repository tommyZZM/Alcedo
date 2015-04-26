/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class BackGround extends alcedo.canvas.DisplatObjectContainer{
        public constructor(){
            super();
            this.init();
        }

        private _clouds:BackGroundClouds;
        public init(){
            this._clouds = new BackGroundClouds(0.8);
            this.addChild(this._clouds);
        }

        public resReturnPos(){
            //TODO:
        }
    }

    class BackGroundClouds extends alcedo.canvas.DisplatObjectContainer{

        private _propoffset:number = 0.5;
        //private _propoffsetspeed:number = 0.5;

        private _propstextures:Array<any>;
        private _ramdomarray:Array<number>;

        private _propmax:number = 3;
        //private _propcount:number = 0;

        private _props:Array<any>;
        private _propspool:Array<any>;
        private _currprop:alcedo.canvas.Sprite;

        public constructor(offset:number=0.5){
            super();

            if(offset>0.99)offset=0.99;

            /** **/
            this._propoffset = offset;

            this._props = [];
            this._propspool = [];
            this._propstextures = alcedo.proxy(alcedo.canvas.TextureRES).find(/bgcloud\d{2}/);
            this.initProps();

            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.checkProps,this);
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }

        private onEachTime(e){
            this.x+=speed.plane*this._propoffset*e.delay;
        }

        private initProps(){
            this._ramdomarray = [];
            var i,propslength=this._propstextures.length
                ,_totalassigned:number=0,_autoassign;
            var setPropIndex = (prop,probability:number)=>{
                var index = this._propstextures.indexOf(alcedo.proxy(alcedo.canvas.TextureRES).get(prop));
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

            //trace(this._ramdomarray,this.selectAtexture());

            for(i=0;i<this._propmax;i++){
                this.addChild(this.createAProp());
            }
        }


        private checkProps(){
            //trace("checkProps",this._props[0].isInViewPort(),this._props[0].x,this._props[0].localToGlobal(0,0).x);

            for(var i=0;i<this._props.length;i++){
                var prop = this._props[i];

                if((!prop.isInViewPort())&&(prop.x<stage.viewPort().x)){
                    this.destoryAProp(prop);
                    this.addChild(this.createAProp());
                    //trace(this._props.length)
                }
            }
        }

        private createAProp():alcedo.canvas.Sprite{
            var prop:alcedo.canvas.Sprite,texture=this.selectAtexture();
            //trace("create this._props.length=",this._props.length)
            if(this._props.length<this._propmax){
                //trace("this._props.length<this._propmax",this._props.length,this._propmax)
                prop = new alcedo.canvas.Sprite(texture);
                prop.scaleToWidth(stage.width()*1.6)
            }else if(this._propspool && this._propspool.length>0){
                //trace("this._propspool && this._propspool.length>0",this._propspool.length)
                prop = this._propspool.pop();
                prop.texture(texture);
            }else {
                //trace("this._props.shift()");
                prop = this._props.shift();
            }

            var lastprop = this._props[this._props.length-1];
            if(lastprop){
                prop.x = lastprop.x+lastprop.visualBound().width;
                //trace(prop.x,lastprop.visualBound(),lastprop._staticboundingbox);
            }else{
                prop.x = stage.width();
            }
            //TODO:DisplayObject xy和锚点设置有问题哦
            prop.y = stage.height();
            prop.pivotX(0);prop.pivotY(1);
            //trace(prop.y,prop.pivotY())

            this._props.push(prop);
            return prop;
        }

        private destoryAProp(prop){
            var index = this._props.indexOf(prop);
            this._props.splice(index,1);
            this._propspool.push(prop);
            //trace("destoried",prop.x,stage.viewPort().x,prop.isInViewPort(), this._propspool.length);
        }

        private selectAtexture():alcedo.canvas.Texture{
            return this._propstextures[Math.probabilityPool(this._ramdomarray)];
        }
    }
}