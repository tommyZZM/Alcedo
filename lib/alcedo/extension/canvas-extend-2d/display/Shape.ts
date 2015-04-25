/**
 * Created by tommyZZM on 2015/4/25.
 */
module alcedo{
    export module canvas{
        export module shape{
            export class EasyShape extends DisplayObject{
                protected _fillcolour:string;

                protected _linecolour:string;

                private _graphicfn:(context:CanvasRenderingContext2D|any)=>void;
                public graphic(fn:(context:CanvasRenderingContext2D|any)=>void):void{
                    this._graphicfn = fn;
                }

                public _draw(renderer:CanvasRenderer){
                    this._graphicfn(renderer.context);
                }
            }

            export class Circle extends EasyShape{

            }

            export class Rectangle extends EasyShape{

            }
        }

    }
}