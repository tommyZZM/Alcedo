



var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/25.
 */
var demo;
(function (demo) {
    demo.stage;
    var ExampleCycler = (function (_super) {
        __extends(ExampleCycler, _super);
        function ExampleCycler() {
            _super.apply(this, arguments);
        }
        ExampleCycler.prototype.cmdStartup = function () {
            alcedo.d$.ready(this.onDomReady, this);
        };
        ExampleCycler.prototype.onDomReady = function () {
            alcedo.d$.query("body")[0].css({ margin: 0, padding: 0, border: 0 });
            this.canvas = alcedo.d$.query("#aperturetest1")[0];
            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0], 320, 480, {
                background: "#ecf0f1",
                profiler: true
            });
            demo.stage = this.stage;
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
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRES.ASSETS_COMPLETE, this.onAssetLoaded, this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload");
        };
        ExampleCycler.prototype.onAssetLoaded = function () {
            this.run();
        };
        ExampleCycler.prototype.run = function () {
        };
        return ExampleCycler;
    })(alcedo.AppCycler);
    demo.ExampleCycler = ExampleCycler;
    ExampleCycler.prototype.__class__ = "demo.ExampleCycler";
    function AsyncRES() {
        return alcedo.proxy(alcedo.net.AsyncRES);
    }
    demo.AsyncRES = AsyncRES;
    function MovieClipRepository() {
        return alcedo.proxy(alcedo.canvas.MovieClipRepository);
    }
    demo.MovieClipRepository = MovieClipRepository;
    function TextureRepository() {
        return alcedo.proxy(alcedo.canvas.TextureRepository);
    }
    demo.TextureRepository = TextureRepository;
})(demo || (demo = {}));
/**
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
var demo;
(function (demo) {
    var ParticleExample = (function (_super) {
        __extends(ParticleExample, _super);
        function ParticleExample() {
            _super.apply(this, arguments);
        }
        ParticleExample.prototype.run = function () {
            var v = new alcedo.canvas.Vector2D(0, -5);
            var pe = new alcedo.canvas.ParticleEmitter(v, { spread: 20, max: 20, rate: 10 });
            pe.x = demo.stage.width() / 2;
            pe.y = demo.stage.height() / 2;
            demo.stage.addChild(pe);
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0, 0.09));
            trace(v.toDeg());
        };
        return ParticleExample;
    })(demo.ExampleCycler);
    demo.ParticleExample = ParticleExample;
    ParticleExample.prototype.__class__ = "demo.ParticleExample";
})(demo || (demo = {}));
