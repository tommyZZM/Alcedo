/**
 * Created by tommyZZM on 2015/5/1.
 */
module game{
    export class ParallaxObject extends alcedo.canvas.DisplatObjectContainer{
        protected _propdepth:number = 0.5;

        protected _propmax:number = 3;

        protected _props:Array<any>;
        protected _propspool:Array<any>;

        protected _opts:any;

        public static referenceObject:LogicObject;

        public constructor(depth:number=0.5,opts:any={}){

            super();

            this._opts = opts;

            this._propdepth = depth;
            if(this._propdepth>0.99)this._propdepth=0.99;

            this._props = [];
            this._propspool = [];

            this.initProps();

            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.onSecond,this);
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }

        protected onEachTime(e){
            //trace(this._propdepth)
            if(ParallaxObject.referenceObject) {
                this.x += (ParallaxObject.referenceObject.velocity.x * this._propdepth * e.delay);
            }
        }

        protected onSecond(e){
            var i;
            if(this._props.length<this._propmax){
                for(i = 0;i<(this._propmax-this._props.length);i++){
                    this.addChild(this.createAProp());
                }
            }
            for(i=0;i<this._props.length;i++){
                var prop = this._props[i];

                if((!prop.isInViewPort())&&(prop.x<stage.viewPort().x)){
                    this.destoryAProp(prop);
                    this.addChild(this.createAProp());
                }
            }
        }

        protected preInitProps(){
            //overrideable
        }

        protected initProps(){
            this.preInitProps();
            for(var i=0;i<this._propmax;i++){
                this.addChild(this.createAProp());
            }
        }

        private createAProp():alcedo.canvas.Sprite{
            var prop:alcedo.canvas.Sprite;
            if(this._props.length<this._propmax){
                prop = new alcedo.canvas.Sprite();
            }else if(this._propspool && this._propspool.length>0){
                prop = this._propspool.pop();
            }else {
                prop = this._props.shift();
            }

            this.onCreateAProp(prop);

            var lastprop = this._props[this._props.length-1];
            if(lastprop){
                prop.x = lastprop.x+lastprop.actualBound().width;
            }else{
                prop.x = this._opts.startpos || stage.viewPort().x;//TODO:第一个物体起始点
            }
            //TODO:DisplayObject xy和锚点设置有问题哦
            prop.y = stage.height();
            prop.pivotX(0);prop.pivotY(1);
            this.onPosAProp(prop);

            this._props.push(prop);

            return prop;
        }

        protected onCreateAProp(prop:alcedo.canvas.Sprite){
            //overrideable
            if(!prop || !prop.texture)return;
            prop.scaleToWidth(stage.width())
        }

        protected onPosAProp(prop:alcedo.canvas.Sprite){

        }

        private destoryAProp(prop){
            var index = this._props.indexOf(prop);
            this._props.splice(index,1);
            this._propspool.push(prop);
            //trace("destoried",prop.x,stage.viewPort().x,prop.isInViewPort(), this._propspool.length);
        }
    }
}