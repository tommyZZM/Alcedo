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
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
var demo;
(function (demo) {
    var HelloWorld = (function (_super) {
        __extends(HelloWorld, _super);
        function HelloWorld() {
            _super.apply(this, arguments);
        }
        HelloWorld.prototype.run = function () {
            var sp = new alcedo.canvas.graphic.Rectangle(100, 100, 100, 100);
            demo.stage.addChild(sp);
            sp.alpha = 0.5;
            trace(sp);
            //var sp = new alcedo.canvas.Sprite(TextureRepository().get("paopaohappy"))
            //sp.x = stage.width()/2;
            //sp.y = stage.height()/2;
            //sp.pivotX(0.5);sp.pivotY(0.5);
            //stage.addChild(sp);
            //sp.rotation = 180;
            //var splocaltoglobal = sp.localToGlobal(0,0)
            //
            //var cri = new alcedo.canvas.shape.Circle(splocaltoglobal.x,splocaltoglobal.y,5,"#e74c3c")
            //stage.addChild(cri);
            //
            //return;
            //stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,()=>{
            //    sp.rotation++;
            //    var splocaltoglobal = sp.localToGlobal(0,0)
            //
            //    cri.x = splocaltoglobal.x;
            //    cri.y = splocaltoglobal.y;
            //},this)
        };
        return HelloWorld;
    })(demo.ExampleCycler);
    demo.HelloWorld = HelloWorld;
    HelloWorld.prototype.__class__ = "demo.HelloWorld";
})(demo || (demo = {}));
