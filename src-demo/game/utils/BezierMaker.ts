/**
 * Created by tommyZZM on 2015/5/23.
 */
module game{
    export class BezierMaker{
        public static create(points:Array<any>){
            var curvepoints = this.createcontrolpoint(points);
            return curvepoints;
        }

        private static tmppoint:canvas.Vector2D = new canvas.Vector2D();
        private static tmplength:canvas.Vector2D = new canvas.Vector2D();

        private static createcontrolpoint(points:Array<any>){
            //计算控制点
            var i;
            var _curcepolygon = [];
            var _controlponitsseed = [];
            var _controlpints = [];

            for(i=0;i<points.length-1;i++){
                var point0 = points[i];
                var point1 = points[i+1];

                this.tmppoint.reset(point0.x,point0.y);
                this.tmppoint.add(point1);
                this.tmppoint.divide(2);

                _controlponitsseed.push({x:this.tmppoint.x, y:this.tmppoint.y});
            }

            for(i=0;i<_controlponitsseed.length-1;i++){
                var point0 = _controlponitsseed[i];
                var point1 = _controlponitsseed[i+1];

                this.tmppoint.reset(point0.x,point0.y);
                this.tmppoint.add(point1);
                this.tmppoint.divide(2);

                var point3 = points[i+1];

                var dpoint = {
                    x:point3.x - this.tmppoint.x,
                    y:point3.y - this.tmppoint.y
                };

                _controlpints.push({
                    x:point0.x+dpoint.x,
                    y:point0.y+dpoint.y
                },{
                    x:point1.x+dpoint.x,
                    y:point1.y+dpoint.y
                })
            }

            var totalpointcount = _controlpints.length+points.length;
            var flag:boolean;
            for(i = 0;i<totalpointcount;i++){
                if(!flag){
                    _curcepolygon.push(points.pop())
                }else{
                    _curcepolygon.push(_controlpints.pop())
                }
                flag = !flag;
            }
            return _curcepolygon;
        }
    }
}