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
            alcedo.d$.ready(this.onDomReady, this);
        };
        ExampleCycler.prototype.onDomReady = function () {
            alcedo.d$.query("body")[0].css({ margin: 0, padding: 0, border: 0 });
            this.canvas = alcedo.d$.query("#aperturetest1")[0];
            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0], this.size.width, this.size.height, {
                background: "#ecf0f1",
                profiler: true
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
            this.run();
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
        HelloP2.prototype.run = function () {
            var _this = this;
            this.world = new p2.World();
            // Add a box
            var boxShape = new p2.Rectangle(100, 100);
            this.boxbody = new p2.Body({ mass: 1, position: [this.stage.width() / 2, this.stage.height() / 2], angularVelocity: 1 });
            this.boxbody.addShape(boxShape);
            this.world.addBody(this.boxbody);
            // Add a plane
            var planeShape = new p2.Plane();
            var planeBody = new p2.Body({ position: [this.stage.width() / 2, 0] });
            planeBody.addShape(planeShape);
            this.world.addBody(planeBody);
            this.boxskin = new alcedo.canvas.graphic.Rectangle(0, 0, 100, 100);
            this.boxskin.pivotX(0.5);
            this.boxskin.pivotY(0.5);
            this.stage.addChild(this.boxskin);
            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_FRAME, function (e) {
                _this.world.step(1 / 60);
                _this.boxskin.x = _this.boxbody.position[0];
                _this.boxskin.y = _this.boxbody.position[1];
                _this.boxskin.rotation = _this.boxbody.angle * alcedo.canvas.Constant.RAD_TO_DEG;
                //console.log(this.boxbody.position)
            }, this);
        };
        return HelloP2;
    })(example.ExampleCycler);
    example.HelloP2 = HelloP2;
})(example || (example = {}));
