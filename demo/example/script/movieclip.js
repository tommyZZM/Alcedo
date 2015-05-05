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
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE, this.onAssetLoaded, this);
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
 * Created by tommyZZM on 2015/4/23.
 */
///<reference path="../ExampleCycler.ts"/>
var demo;
(function (demo) {
    var MovieClipExample = (function (_super) {
        __extends(MovieClipExample, _super);
        function MovieClipExample() {
            _super.apply(this, arguments);
        }
        MovieClipExample.prototype.run = function () {
            demo.MovieClipRepository().praseMovieClipData(demo.AsyncRES().get("smallalcedo_json"), demo.TextureRepository().get("smallalcedo_png"));
            var mc = new alcedo.canvas.MovieClip(demo.MovieClipRepository().get("smallalcedo"));
            mc.play();
            //mc.playToAndStop(1,1);
            mc.x = demo.stage.width() / 2;
            mc.y = demo.stage.height() / 2;
            mc.pivotX(0.5);
            mc.pivotY(0.5);
            //mc.scaleALL(0.5);
            demo.stage.addChild(mc);
            demo.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, function () {
                mc.rotation++;
            }, this);
            trace(mc);
        };
        return MovieClipExample;
    })(demo.ExampleCycler);
    demo.MovieClipExample = MovieClipExample;
    MovieClipExample.prototype.__class__ = "demo.MovieClipExample";
})(demo || (demo = {}));
