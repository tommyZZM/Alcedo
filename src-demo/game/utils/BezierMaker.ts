/**
 * Created by tommyZZM on 2015/5/23.
 */
module game{
    export class BezierMaker {
        public static create(points:Array<any>,accuracy:number=10):canvas.Bezier2D {
            var curve = this.createcontrolpoint(points);

            return new canvas.Bezier2D(curve,accuracy);
        }

        private static tmppoint:canvas.Vector2D = new canvas.Vector2D();
        private static tmplength:canvas.Vector2D = new canvas.Vector2D();

        private static createcontrolpoint(points:Array<any>) {
            //计算控制点
            var i;
            var _curcepolygon = [];
            var _sourcepoints = [];
            var _controlponitsseed = [];
            var _controlpints = [];

            for (i = 0; i < points.length; i++) {
                var point0 = points[i];
                _sourcepoints.push(point0);

                var point1 = points[i + 1];
                if (!point1) {
                    continue;
                }

                this.tmppoint.reset(point0.x, point0.y);
                this.tmppoint.add(point1);
                this.tmppoint.divide(2);

                _controlponitsseed.push({x: this.tmppoint.x, y: this.tmppoint.y});
            }

            if (_controlponitsseed.length === 1) {
                return [points[0], _controlponitsseed[0], points[1]];
            }

            for (i = 0; i < _controlponitsseed.length - 1; i++) {
                var point0 = _controlponitsseed[i];
                var point1 = _controlponitsseed[i + 1];

                this.tmppoint.reset(point0.x, point0.y);
                this.tmppoint.add(point1);
                this.tmppoint.divide(2);

                var point3 = points[i + 1];

                var dpoint = {
                    x: point3.x - this.tmppoint.x,
                    y: point3.y - this.tmppoint.y
                };

                _controlpints.push({
                    x: point0.x + dpoint.x,
                    y: point0.y + dpoint.y,
                    iscontrol: true
                }, {
                    x: point1.x + dpoint.x,
                    y: point1.y + dpoint.y,
                    iscontrol: true
                })
            }

            _curcepolygon.push(_sourcepoints.last);
            for (i = _sourcepoints.length - 2; i > 0; i--) {
                //trace(i);
                _curcepolygon.push(_controlpints.pop());
                _curcepolygon.push(_sourcepoints[i]);
                _curcepolygon.push(_controlpints.pop());
            }
            _curcepolygon.push(_sourcepoints.first);

            //trace(_curcepolygon);
            return _curcepolygon;
        }
    }
}