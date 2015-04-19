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
            this._clouds = new BackGroundClouds();
            this.addChild(this._clouds);
        }
    }

    class BackGroundClouds extends alcedo.canvas.DisplatObjectContainer{
        private _propstextures:Array<any>;
        private _ramdomarray:Array<number>;

        private _propmax:number = 3;
        //private _propcount:number = 0;

        private _props:Array<any>;
        private _propspool:Array<any>;
        private _currprop:alcedo.canvas.Sprite;

        public constructor(){
            super();

            this._props = [];
            this._propspool = []
            this._propstextures = alcedo.proxy(alcedo.canvas.TextureRES).find(/bgcloud\d{2}/);
            this.initProps();

            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.checkProps,this);
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

            trace(this._ramdomarray,this.selectAtexture());

            for(i=0;i<this._propmax;i++){
                this.addChild(this.createAProp());
            }
        }


        private checkProps(){
            //trace("checkProps",this._props);

            for(var i=0;i<this._props.length;i++){
                var prop = this._props[i];
                //if((!prop.isInViewPort())&&(prop.x<stage.viewPort().x)){
                //    this.destoryAProp(prop);
                //    this.createAProp();
                //    trace("destoried",prop.x,stage.viewPort().x,prop.isInViewPort());
                //}
            }
        }

        private createAProp():alcedo.canvas.Sprite{
            var prop:alcedo.canvas.Sprite,texture=this.selectAtexture();
            if(this._propspool && this._propspool.length>0){
                prop = this._propspool.pop();
                prop.texture(texture);
            }else if(this._props.length<this._propmax){
                prop = new Sprite(texture);
                prop.scaleToWidth(stage.width()*1.6)
            }else{
                prop = this._props.shift();
            }

            var lastprop = this._props[this._props.length-1];
            if(lastprop){
                prop.x = lastprop.x+lastprop.visualBound().width;
            }else{
                prop.x = stage.width();
            }
            prop.y = stage.height();
            prop.pivotX(0);prop.pivotY(1);

            this._props.push(prop);
            return prop;
        }

        private destoryAProp(prop){
            var index = this._props.indexOf(prop);
            this._props.splice(index,1);
            this._propspool.push(prop);
        }

        private selectAtexture():alcedo.canvas.Texture{
            return this._propstextures[Math.probabilityPool(this._ramdomarray)];
        }
    }
}