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
                    this._texture = texture;
                    this.width(this._texture._sourceWidth);
                    this.height(this._texture._sourceHeight);
                }

                this._visualboundingbox = this._staticboundingbox.clone();
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
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                return (<Stage>this._root).viewPort().hitRectangelTest(this._visualboundingbox)
            }

            /**
             * OverRide position method
             */
            public get x(){return this._position.x}
            public set x(x:number){
                this._position.x = x;
                this._staticboundingbox.x =x-this.pivotOffsetX();
                this._visualboundingbox.x =x-this.pivotOffsetX();
            }
            public get y(){return this._position.y}
            public set y(y:number){
                this._position.y = y;
                this._staticboundingbox.y =y-this.pivotOffsetY();
                this._visualboundingbox.y =y-this.pivotOffsetY();
            }

            public scaleX(scalex?:number){
                if(!scalex)return this._scale.x;
                this._scale.x = scalex;
                this._visualboundingbox.width = this._visualboundingbox.width*scalex
            }

            public scaleY(scaley?:number){
                if(!scaley)return this._scale.y;
                this._scale.y = scaley;
                this._visualboundingbox.height = this._visualboundingbox.height*scaley
            }
        }
    }
}