/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module canvas{
        export class Texture{
            /**
             * 表示这个纹理在 源 bitmapData 上的宽度
             */
            public _sourceWidth:number = 0;
            /**
             * 表示这个纹理在 源 bitmapData 上的高度
             */
            public _sourceHeight:number = 0;

            /**
             * 表示这个纹理在 源 bitmapData 上的宽高比
             */
            public _sourceW2H:number = 0;

            public _bitmapData:any = null;

            /**
             * 纹理对象中得位图数据
             * @member {ImageData} canvas.Texture#bitmapData
             */
            public get bitmapData():HTMLImageElement|HTMLElement {
                return this._bitmapData;
            }

            public get sourceUrl():string{
                if(this._bitmapData.src){//不要用currentSrc
                    return this._bitmapData.src;
                }
            }

            public constructor(value?:HTMLImageElement|ImageData,args?:any){
                this._bitmapData = value;
                this._sourceWidth = value.width;
                this._sourceHeight = value.height;
                this._sourceW2H = this._sourceWidth/this._sourceHeight;
            }
        }
    }
}