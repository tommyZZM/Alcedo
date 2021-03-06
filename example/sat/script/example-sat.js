/**
 * Created by tommyZZM on 2015/4/25.
 */
// 当开启GPU渲染时，Chrome的canvas绘制会锁定在30帧（不接电源的时候是这样。）
// 加入要打包成原生应用，首选考虑工具CocoonJS
// Dom元素操作尽量通过add Class操作
//
//
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
 * Created by tommyZZM on 2015/5/19.
 */
var example;
(function (example) {
    var CircleR = 20;
    var HelloSat = (function (_super) {
        __extends(HelloSat, _super);
        function HelloSat() {
            _super.apply(this, arguments);
        }
        HelloSat.prototype.run = function () {
            var _this = this;
            window.onkeydown = this.keyconrol.bind(this);
            this.resoponse = new SAT.Response();
            this.circle = new alcedo.canvas.graphic.Circle(CircleR);
            this.circle.pivotX = 0.5;
            this.circle.pivotY = 0.5;
            this.circle.x = this.stage.width >> 1;
            this.circle.y = this.stage.height >> 1;
            this.circlebody = new SAT.Circle(new SAT.Vector(this.circle.x, this.circle.y), this.circle.radius);
            var boxw = Math.randomFrom(60, 120);
            var boxh = Math.randomFrom(60, 120);
            var rotate = Math.randomFrom(0, 360);
            this.box = new alcedo.canvas.graphic.Rectangle(boxw, boxh);
            this.box.pivotX = 0.5;
            this.box.pivotY = 0.5;
            this.box.x = Math.randomFrom(120, this.stage.width - 120);
            this.box.y = Math.randomFrom(120, this.stage.height - 120);
            this.box.rotation = rotate;
            var box = new SAT.Box(new SAT.Vector(this.box.x, this.box.y), this.box.width, this.box.height);
            this.boxbody = box.toPolygon();
            this.boxbody.offset.x = -this.box.pivotOffsetX;
            this.boxbody.offset.y = -this.box.pivotOffsetY;
            this.boxbody.setAngle(rotate * alcedo.Constant.DEG_TO_RAD);
            trace(this.boxbody, this.boxbody.edges[0].x, this.box.actualLeftTop());
            trace(this.circlebody);
            var boxbound = new example.canvas.DisplayGraphic();
            boxbound._graphicfn = function (ctx) {
                ctx.beginPath();
                for (var i = 0; i < _this.boxbody.edges.length; i++) {
                    var next = i + 1;
                    if (next == _this.boxbody.edges.length)
                        next = 0;
                    drawLineFromTo(ctx, { x: _this.boxbody.edges[i].x + _this.boxbody.pos.x, y: _this.boxbody.edges[i].y + _this.boxbody.pos.y }, { x: _this.boxbody.edges[next].x + _this.boxbody.pos.x, y: _this.boxbody.edges[next].y + _this.boxbody.pos.y });
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
            this.stage.addChild(this.box);
            this.stage.addChild(this.circle);
            this.stage.addEventListener(example.canvas.Stage.ENTER_MILLSECOND10, function () {
                _this.box.rotation++;
                _this.boxbody.setAngle(_this.box.rotation * alcedo.Constant.DEG_TO_RAD);
                _this.circlebody.pos.x = _this.circle.x;
                _this.circlebody.pos.y = _this.circle.y;
                _this.resoponse.clear();
                if (SAT.testCirclePolygon(_this.circlebody, _this.boxbody, _this.resoponse)) {
                    //trace(this.resoponse,this.resoponse.bInA,this.resoponse.aInB)
                    if (_this.resoponse.aInB) {
                        _this.circle.fillcolour = "#e98b39";
                    }
                    else {
                        _this.circle.fillcolour = "#2ecc71";
                    }
                }
                else {
                    _this.circle.fillcolour = "#000000";
                }
            }, this);
        };
        HelloSat.prototype.keyconrol = function (e) {
            switch (e.keyCode) {
                case 38:
                    {
                        this.circle.y--;
                        break;
                    }
                case 40:
                    {
                        this.circle.y++;
                        break;
                    }
                case 37:
                    {
                        this.circle.x--;
                        break;
                    }
                case 39:
                    {
                        this.circle.x++;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        };
        return HelloSat;
    })(example.ExampleCycler);
    example.HelloSat = HelloSat;
})(example || (example = {}));
