/**
 * Created by tommyZZM on 2015/4/10.
 */
module alcedo{
    export module canvas{
        export class Sprite extends DisplayObject{

            protected _texture:Texture;

            protected _visualboundingbox:Rectangle;//静态包围盒(不参与旋转)

            public constructor(texture:Texture){
                super();

                if(texture){
                    this.texture(texture)
                }
            }

            public _draw(renderer:CanvasRenderer){
                this._texture_to_render = this._texture;

                //console.log(this._position)
                if (this._texture_to_render && this._texture_to_render.bitmapData && this._alpha>0 && this._visible){
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);
                    renderer.context.drawImage(<any>this._texture_to_render.bitmapData
                        ,0,0,this._texture_to_render._sourceWidth,this._texture_to_render._sourceHeight)
                }
            }

            public texture(texture:Texture){
                this._texture = texture;
                this.width(this._texture._sourceWidth);
                this.height(this._texture._sourceHeight);
                this._visualboundingbox = this._staticboundingbox.clone();
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                return (<Stage>this._root).viewPort().hitRectangelTest(this._visualboundingbox)
            }

            /**
             * OverRide position method
             */
            public scaleX(scalex?:number){
                if(!scalex)return this._scale.x;
                this._scale.x = scalex;
                this._visualboundingbox.width = this._staticboundingbox.width*scalex
            }

            public scaleY(scaley?:number){
                if(!scaley)return this._scale.y;
                this._scale.y = scaley;
                this._visualboundingbox.height = this._staticboundingbox.height*scaley
            }

            protected updateBound(x?,y?,width?,height?){
                if(typeof x == "number"){
                    this._staticboundingbox.x =x-this.pivotOffsetX();
                    this._visualboundingbox.x =x-this.pivotOffsetX()*this.scaleX()-this._visualboundingbox.width*this.pivotX();
                    //trace(this._visualboundingbox.x)
                }
                if(typeof y == "number"){
                    this._staticboundingbox.y =y-this.pivotOffsetY();
                    this._visualboundingbox.y =y-this.pivotOffsetY()*this.scaleY()-this._visualboundingbox.height*this.pivotY();
                }
                if(typeof width == "number")this._staticboundingbox.width =width;
                if(typeof height =="number")this._staticboundingbox.height =height;
            }

            public visualBound():Rectangle{
                return this._visualboundingbox.clone();
            }
        }
    }
}