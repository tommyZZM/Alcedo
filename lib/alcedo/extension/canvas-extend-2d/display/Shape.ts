/**
 * Created by tommyZZM on 2015/4/25.
 */
module alcedo{
    export module canvas{
        export module graphic{
            export class EasyShape extends DisplayObject{
                protected _fillcolour:string;

                protected _linecolour:string;

                protected _graphicfn:(context:CanvasRenderingContext2D|any)=>void;
                //public graphic(fn:(context:CanvasRenderingContext2D|any)=>void):void{
                //    this._graphicfn = fn;
                //}

                public _draw(renderer:CanvasRenderer){
                    this._graphicfn(renderer.context);
                }
            }

            export class Circle extends EasyShape{
                private _radius:number;
                public constructor(x:number,y:number,r:number = 5,coulour:string = "#000"){
                    super();
                    this._fillcolour = coulour;
                    this.x = x;
                    this.y = y;
                    this._radius = r;
                    this._graphicfn = (context:CanvasRenderingContext2D)=>{
                        context.beginPath();
                        context.fillStyle = this._fillcolour;
                        context.arc(0, 0, this._radius, 0, 2 * Math.PI, false);
                        context.closePath();
                        context.fill();
                    }
                }
            }

            export class Rectangle extends EasyShape{
                private _shapewidth:number;
                private _shapeheight:number;

                public constructor(x:number,y:number,width:number,height:number,coulour:string = "#000"){
                    super();
                    this._fillcolour = coulour;
                    this.x = x;
                    this.y = y;
                    this._shapewidth = width;
                    this._shapeheight = height;
                    this._graphicfn = (context:CanvasRenderingContext2D)=>{
                        context.fillStyle = this._fillcolour;
                        context.fillRect(0, 0, this._shapewidth, this._shapeheight);
                    }
                }
            }
        }
    }
}