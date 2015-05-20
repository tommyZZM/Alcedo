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
            var v = new alcedo.canvas.Vector2D(0, -5);
            var pe = new alcedo.canvas.ParticleEmitter({ initial: v, spread: 20, max: 30, rate: 16 });
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0, 0.09));
            var a = new alcedo.canvas.DisplatObjectContainer();
            a.addChild(pe);
            this.stage.addChild(a);
            a.x = this.stage.width / 2;
            a.y = this.stage.height / 2;
            pe.rotation = 10;
            trace(pe);
            return;
            var sp = new example.canvas.graphic.Circle(200, 200);
            sp.radius = 10;
            this.stage.addChild(sp);
            sp.acceleration = new example.canvas.Vector2D();
            sp.velocity = new example.canvas.Vector2D(1, 1);
            trace(sp.force);
            this.stage.addEventListener(example.canvas.Stage.ENTER_MILLSECOND10, function () {
                sp.force = sp.velocity.normalize().clone();
                sp.force.length = 0.1;
                sp.acceleration = sp.force;
                sp.velocity.x += sp.acceleration.x;
                sp.velocity.y += sp.acceleration.y;
                sp.x += sp.velocity.x;
                sp.y += sp.velocity.y;
                sp.velocity.length = 1;
                //trace(sp.velocity.length)
                //trace(sp.x,sp.y);
            }, this);
        };
        return HelloWorld;
    })(example.ExampleCycler);
    example.HelloWorld = HelloWorld;
})(example || (example = {}));
