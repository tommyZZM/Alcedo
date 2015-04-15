/**
 * Created by tommyZZM on 2015/4/10.
 */
module alcedo{
    export module canvas{
        export class Sprite extends DisplayObject{

            protected _texture:Texture;

            public constructor(texture:Texture){
                super();

                if(texture){
                    this._texture = texture;
                    this.width = this._texture._sourceWidth;
                    this.height = this._texture._sourceHeight;
                }
            }

            public _draw(renderer:CanvasRenderer){
                this._texture_to_render = this._texture;

                //console.log(this._position)
                if (this._texture_to_render && this._texture_to_render.bitmapData && this._alpha>0 && this._visible){
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);
                    renderer.context.drawImage(<any>this._texture_to_render.bitmapData,0,0,this._texture_to_render._sourceWidth,this._texture_to_render._sourceHeight)
                }
            }
        }
    }
}