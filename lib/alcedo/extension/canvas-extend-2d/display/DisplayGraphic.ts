/**
 * Created by tommyZZM on 2015/4/25.
 */
module alcedo{
    export module canvas{
        export class DisplayGraphic extends DisplayObject{
            protected _fillcolour:string;

            protected _linecolour:string;

            protected _graphicfn:(context:CanvasRenderingContext2D|any)=>void;
            //public graphic(fn:(context:CanvasRenderingContext2D|any)=>void):void{
            //    this._graphicfn = fn;
            //}

            public _draw(renderer:CanvasRenderer){
                this._graphicfn(renderer.context);
            }

            public set fillcolour(clour:string){
                this._fillcolour = clour;
            }
        }
        export module graphic{

            export class Circle extends DisplayGraphic{
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

            export class Rectangle extends DisplayGraphic{
                //private _shapewidth:number;
                //private _shapeheight:number;

                public constructor(x:number,y:number,width:number=100,height:number=100,coulour:string = "#000"){
                    super();
                    this._fillcolour = coulour;
                    this.x = x;
                    this.y = y;
                    this.width(width);
                    this.height(height);
                    this._graphicfn = (context:CanvasRenderingContext2D)=>{
                        context.beginPath();
                        context.fillStyle = this._fillcolour;
                        context.fillRect(0, 0, this.width(), this.height());
                        context.closePath();
                    }
                }
            }
        }
    }
}