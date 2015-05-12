/**
 * Created by tommyZZM on 2015/4/22.
 */
module alcedo{
    export module canvas{
        export class SpriteSheet extends AppObject{
            public constructor(texture:Texture) {
                super();
                this._texture = texture;
                this._sourceWidth = texture._sourceWidth;
                this._sourceHeight = texture._sourceHeight;

                this._textureMap = new Dict();
            }

            private _texture:Texture;
            private _sourceWidth:number = 0;
            private _sourceHeight:number = 0;

            public _textureMap:Dict;

            //public createTexturesFromConfig(config:any){
            //
            //}

            public getTexture(name:string):Texture {
                return this._textureMap.get(name);
            }

            public createTexture(sourceX:number = 0, sourceY:number = 0, sourceWidth?:number, sourceHeight?:number):Texture {

                var texture = this._texture.clone();

                texture._sourceX = sourceX;
                texture._sourceY = sourceY;
                texture._sourceWidth = sourceWidth;
                texture._sourceHeight = sourceHeight;

                return texture;
            }
        }
    }
}