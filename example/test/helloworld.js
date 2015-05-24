var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/25.
 */
var example;
(function (example) {
    example.canvas = alcedo.canvas;
    var ExampleCycler = (function (_super) {
        __extends(ExampleCycler, _super);
        function ExampleCycler() {
            _super.apply(this, arguments);
            this.size = {
                width: 320,
                height: 480
            };
        }
        ExampleCycler.prototype.cmdStartup = function () {
            alcedo.dom.ready(this.onDomReady, this);
        };
        ExampleCycler.prototype.onDomReady = function () {
            //alcedo.d$.query("body")[0].css({margin:0,padding:0,border: 0});
            this.canvas = alcedo.dom.query("#aperturetest1")[0];
            this.stage = new alcedo.canvas.Stage(alcedo.dom.query("#aperturetest1")[0], this.size.width, this.size.height, {
                background: "#ecf0f1",
                profiler: true,
                orient: true,
            });
            this.canvas.css({
                display: "block",
                width: alcedo.dom.width() + "px",
                height: alcedo.dom.height() + "px",
                padding: 0,
                border: 0,
                margin: "0 auto"
            });
            this.canvas.parent().css({
                display: "block",
                position: "relative",
                width: alcedo.dom.width() + "px",
                height: alcedo.dom.height() + "px",
                padding: 0,
                border: 0,
                margin: "0"
            });
            alcedo.dom.resize(this.onResize, this);
            this.run();
        };
        ExampleCycler.prototype.onResize = function () {
            var _domwidth = alcedo.dom.width();
            var _domheight = alcedo.dom.height();
            this.canvas.css({ width: _domwidth + "px", height: _domheight + "px" });
            this.stage.resizecontext();
            if (this.stage.orientchanged) {
                this.canvas.css({ width: _domheight + "px", height: _domwidth + "px" });
                this.canvas.parent().css({
                    width: _domheight + "px",
                    height: _domwidth + "px"
                });
                this.canvas.parent().css({ left: (_domwidth - _domheight) / 2 + "px" });
                this.canvas.parent().css({ top: (_domheight - _domwidth) / 2 + "px" });
                this.canvas.parent().css_transform_rotate(-90);
            }
            else {
                this.canvas.parent().css({ width: _domwidth + "px", height: _domheight + "px" });
                this.canvas.parent().css({ top: "0px", left: "0px" });
                this.canvas.parent().css_transform_rotate(0);
            }
        };
        ExampleCycler.prototype.run = function () {
        };
        return ExampleCycler;
    })(alcedo.AppCycler);
    example.ExampleCycler = ExampleCycler;
})(example || (example = {}));
/**
 * Created by tommyZZM on 2015/5/16.
 */
var example;
(function (example) {
    var HelloWorld = (function (_super) {
        __extends(HelloWorld, _super);
        function HelloWorld() {
            _super.apply(this, arguments);
        }
        HelloWorld.prototype.run = function () {
            var points = [{ x: 100, y: 100 }, { x: 100, y: 200 }, { x: 250, y: 300 }, { x: 200, y: 100 }];
            var curve = BezierMaker.create(points);
            var boxbound = new example.canvas.DisplayGraphic();
            boxbound._graphicfn = function (ctx) {
                ctx.beginPath();
                for (var i = 0; i < curve.length; i++) {
                    var next = i + 1;
                    if (next != curve.length) {
                        drawLineFromTo(ctx, { x: curve[i].x, y: curve[i].y }, { x: curve[next].x, y: curve[next].y });
                    }
                }
                ctx.stroke();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#8e44ad';
            };
            boxbound.alpha = 0.66;
            function drawLineFromTo(ctx, point, point2) {
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point2.x, point2.y);
            }
            this.stage.addChild(boxbound);
            for (var i = 0; i < curve.length; i++) {
                var c = new example.canvas.graphic.Circle(5, "#f1c40f");
                c.x = curve[i].x;
                c.y = curve[i].y;
                if (curve[i].iscontrol) {
                    c.fillcolour = "#16a085";
                }
                this.stage.addChild(c);
            }
        };
        return HelloWorld;
    })(example.ExampleCycler);
    example.HelloWorld = HelloWorld;
    var BezierMaker = (function () {
        function BezierMaker() {
        }
        BezierMaker.create = function (points) {
            var curvepoints = this.createcontrolpoint(points);
            return curvepoints;
        };
        BezierMaker.createcontrolpoint = function (points) {
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
                _controlponitsseed.push({ x: this.tmppoint.x, y: this.tmppoint.y });
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
                });
            }
            _curcepolygon.push(_sourcepoints.last);
            for (i = _sourcepoints.length - 2; i > 0; i--) {
                trace(i);
                _curcepolygon.push(_controlpints.pop());
                _curcepolygon.push(_sourcepoints[i]);
                _curcepolygon.push(_controlpints.pop());
            }
            _curcepolygon.push(_sourcepoints.first);
            trace(_curcepolygon);
            return _curcepolygon;
        };
        BezierMaker.tmppoint = new example.canvas.Vector2D();
        BezierMaker.tmplength = new example.canvas.Vector2D();
        return BezierMaker;
    })();
    example.BezierMaker = BezierMaker;
})(example || (example = {}));
