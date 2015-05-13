/**
 * Created by tommyZZM on 2015/5/8.
 */
module alcedo {
    export module canvas {
        export class Bezier2D{
            private _controlpoints:Array<Point2D>;
            private _curve:Array<Point2D>;

            public constructor(points:Array<Ixy>,accuracy:number=66){
                this._controlpoints = [];

                if(points.length<0)return;
                for(var i=0;i<points.length;i++){
                    this._controlpoints.push(new Point2D(points[i].x, points[i].y));
                }
                this._controlpoints = this._controlpoints.map(p => p);

                this._generate(1/accuracy);
            }

            private _generate(step: number): void {
                var points = [];
                //make sure the curve goes through the first point
                points.push(this._controlpoints[0])

                for (var t = step; t <= 1; t += step) {
                    points.push(Bezier2D.lerpCurve(this._controlpoints, t));
                }

                //make sure the curve goes through the last point
                points.push(this._controlpoints.last);

                this._curve = points;
            }


            //public get length(){
            //
            //}

            public getPointAt(precent:number){
                var _precent = precent;
                if(_precent>100)_precent=_precent%100;

                var _index = this._curve.length*(_precent/100)^0;
                return this._curve[_index];
            }

            public eachPointsOnCurve(fn:(point:Point2D)=>void){
                for(var i=0;i<this._curve.length;i++){
                    fn(this._curve[i]);
                }
            }

            private static lerpCurve(inPoints:Array<Point2D>, t:number):Point2D {
                if (inPoints.length == 1) {
                    return inPoints[0];
                }

                var points = [];

                for (var i = 0; i < inPoints.length - 1; i++) {
                    var pt1 = inPoints[i];
                    var pt2 = inPoints[i + 1];

                    points[i] = this.lerpPoint(pt1, pt2, t);
                }

                return this.lerpCurve(points, t);
            }

            private static lerpPoint(fromPoint:Point2D, toPoint:Point2D, t:number):Point2D {
                var s = 1.0 - t;

                var x = fromPoint.x * s + toPoint.x * t;
                var y = fromPoint.y * s + toPoint.y * t;

                return new Point2D(x, y);
            }

        }
    }
}