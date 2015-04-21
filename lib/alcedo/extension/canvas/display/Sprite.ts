/**
 * Created by tommyZZM on 2015/4/10.
 */
module alcedo{
    export module canvas{
        export class Sprite extends DisplayObject{

            protected _texture:Texture;

            //protected _visualboundingbox:Rectangle;//可视包围盒

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
                //this._visualboundingbox = this._staticboundingbox.clone();
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                return (<Stage>this._root).viewPort().hitRectangelTest(this.visualBound());
            }

            /**
             * OverRide position method
             * 主要更新了可视包围盒，TODO:有Bug,待优化
             */

            public visualBound():Rectangle{
                var _oglobalpoint = this.localToGlobal(0,0,Point2D.identity());

                var _oglobalwidth = this._staticboundingbox.width*this._worldscale.x;
                var _oglobalheight = this._staticboundingbox.height*this._worldscale.y;

                return new Rectangle(_oglobalpoint.x,_oglobalpoint.y,_oglobalwidth,_oglobalheight);
            }
        }
    }
}