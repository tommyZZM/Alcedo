/**
 * Created by tommyZZM on 2015/5/16.
 */
module example {
    export class BezierExample extends ExampleCycler {
        protected run(){
            var points = [{x:100,y:100},{x:100,y:300},{x:250,y:300},{x:200,y:100}];

            var curvebesizer = BezierMaker.create(points);
            var curve = curvebesizer.curve;
            var control = curvebesizer.controlpoints;

            var boxbound:any = new canvas.DisplayGraphic();
            boxbound._graphicfn = (ctx)=>{
                ctx.beginPath();
                for(var i=0;i<curve.length;i++){
                    var next = i+1;
                    if(next!=curve.length){
                        drawLineFromTo(ctx,{x:curve[i].x
                                ,y:curve[i].y}
                            ,{x:curve[next].x
                                ,y:curve[next].y})
                    }
                }

                ctx.stroke();
                ctx.lineWidth=1;
                ctx.strokeStyle='#8e44ad';
            };
            boxbound.alpha=0.66;
            function drawLineFromTo(ctx,point:canvas.Ixy,point2:canvas.Ixy){
                ctx.moveTo(point.x,point.y);
                ctx.lineTo(point2.x,point2.y);
            }
            this.stage.addChild(boxbound)

            for(var i=0;i<control.length;i++){
                var c = new canvas.graphic.Circle(5,"#f1c40f");
                c.x = control[i].x;
                c.y = control[i].y;



                this.stage.addChild(c);
            }

        }
    }

    class BezierMaker{
        public static create(points:Array<any>):canvas.Bezier2D{
            var curvepoints = this.createcontrolpoint(points);

            return new canvas.Bezier2D(curvepoints);
        }
        private static tmppoint:canvas.Vector2D = new canvas.Vector2D();
        private static tmplength:canvas.Vector2D = new canvas.Vector2D();

        private static createcontrolpoint(points:Array<any>){
            //计算控制点
            var i;
            var _curcepolygon = [];
            var _sourcepoints = [];
            var _controlponitsseed = [];
            var _controlpints = [];

            for(i=0;i<points.length;i++){
                var point0 = points[i];
                _sourcepoints.push(point0);

                var point1 = points[i+1];
                if(!point1){
                    continue;
                }

                this.tmppoint.reset(point0.x,point0.y);
                this.tmppoint.add(point1);
                this.tmppoint.divide(2);

                _controlponitsseed.push({x:this.tmppoint.x, y:this.tmppoint.y});
            }

            if(_controlponitsseed.length===1){
                return [points[0],_controlponitsseed[0],points[1]];
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
                    y:point0.y+dpoint.y,
                    iscontrol:true
                },{
                    x:point1.x+dpoint.x,
                    y:point1.y+dpoint.y,
                    iscontrol:true
                })
            }

            _curcepolygon.push(_sourcepoints.last);
            for(i = _sourcepoints.length-2;i>0;i--){
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