/**
 * Created by tommyZZM on 2015/4/10.
 */
module alcedo{
    export module canvas{
        export class Sprite extends DisplayObject{

            protected _texture:Texture;

            //protected _visualboundingbox:Rectangle;//可视包围盒

            public constructor(texture?:Texture){
                super();

                if(texture){
                    this.texture = texture;
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


            public set texture(texture:Texture){
                this._texture = texture;
                this.width(this._texture._sourceWidth);
                this.height(this._texture._sourceHeight);
                //this._visualboundingbox = this._staticboundingbox.clone();
            }

            public get texture():Texture{
                return this._texture;
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                var result = (<Stage>this._root).viewPort().hitRectangelTest(this.actualBound());

                return result;
            }
        }
    }
}