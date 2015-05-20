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
 * Created by tommyZZM on 2015/5/14.
 */
var example;
(function (example) {
    var HelloP2 = (function (_super) {
        __extends(HelloP2, _super);
        function HelloP2() {
            _super.apply(this, arguments);
        }
        //protected size = {
        //    width:480,
        //    height:320
        //};
        //
        HelloP2.prototype.run = function () {
            var _this = this;
            this.world = new p2.World({
                gravity: [0, -98.1]
            });
            // Add a plane
            var planeShape = new p2.Plane();
            var planeBody = new p2.Body({ position: [0, 0] });
            planeBody.addShape(planeShape);
            this.world.addBody(planeBody);
            // Add a box
            var boxShape = new p2.Rectangle(100, 100);
            this.boxbody = new p2.Body({ mass: 1, position: [this.stage.stageWidth / 2 + Math.randomFrom(-20, 20), this.stage.stageHeight - 100], angularVelocity: 1 });
            this.boxbody.addShape(boxShape);
            this.world.addBody(this.boxbody);
            this.boxskin = new alcedo.canvas.graphic.Rectangle(0, 0, 100, 100);
            this.boxskin.pivotX = 0.5;
            this.boxskin.pivotY = 0.5;
            this.boxskin.x = this.boxbody.position[0];
            this.boxskin.y = this.boxbody.position[1];
            this.stage.addChild(this.boxskin);
            // Add a circle
            var r = +Math.randomFrom(25, 60);
            var circleshape = new p2.Circle(r);
            this.circlebody = new p2.Body({ mass: 1, position: [this.stage.stageWidth / 2 + Math.randomFrom(-50, 50), this.stage.stageHeight / 2], angularVelocity: 1 });
            this.circlebody.addShape(circleshape);
            this.world.addBody(this.circlebody);
            this.circleskin = new alcedo.canvas.graphic.Circle(0, 0, r);
            this.circleskin.pivotX = 0.5;
            this.circleskin.pivotY = 0.5;
            this.circleskin.x = this.circlebody.position[0];
            this.circleskin.y = this.circlebody.position[1];
            this.stage.addChild(this.circleskin);
            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_FRAME, function (e) {
                _this.world.step(1 / 60);
                _this.boxskin.x = _this.stage.width - _this.boxbody.position[0];
                _this.boxskin.y = _this.stage.height - _this.boxbody.position[1];
                _this.boxskin.rotation = _this.boxbody.angle * alcedo.canvas.Constant.RAD_TO_DEG;
                _this.circleskin.x = _this.stage.width - _this.circlebody.position[0];
                _this.circleskin.y = _this.stage.height - _this.circlebody.position[1];
                _this.circleskin.rotation = _this.circlebody.angle * alcedo.canvas.Constant.RAD_TO_DEG;
                //console.log(this.boxbody.position)
            }, this);
        };
        return HelloP2;
    })(example.ExampleCycler);
    example.HelloP2 = HelloP2;
})(example || (example = {}));
