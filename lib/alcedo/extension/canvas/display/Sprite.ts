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
                //if(!this.isInViewPort())return;

                this._texture_to_render = this._texture;

                //console.log(this._position)
                if (this._texture_to_render && this._texture_to_render.bitmapData && this._alpha>0 && this._visible){
                    renderer.context.drawImage(<any>this._texture_to_render.bitmapData
                        ,this._texture_to_render._sourceX,this._texture_to_render._sourceY
                        ,this._texture_to_render._sourceWidth,this._texture_to_render._sourceHeight)
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

                var result = (<Stage>this._root).viewPort().hitRectangelTest(this.visualBound());

                return result;
            }

            /**
             * OverRide position method
             * 主要更新了可视包围盒，TODO:有Bug,待优化
             */
            protected _visualboundingbox:Rectangle = new Rectangle();
            public visualBound():Rectangle{
                //计算最大包围盒
                var _pointlefttop = this.localToGlobal(0,0);
                var _pointrighttop = this.localToGlobal(this._staticboundingbox.width,0);
                var _pointrightbottom = this.localToGlobal(this._staticboundingbox.width
                    ,this._staticboundingbox.height);
                var _pointleftbottom = this.localToGlobal(0,this._staticboundingbox.height);

                Rectangle.rectangleFromFourPoint(_pointlefttop,_pointrighttop,_pointrightbottom,_pointleftbottom,this._visualboundingbox)

                //trace(this._maxboundingbox);
                return this._visualboundingbox;
            }

            public visualWidth():number{
                return this._visualboundingbox.width;
            }

            public visualHeight():number{
                return this._visualboundingbox.height;
            }
        }
    }
}