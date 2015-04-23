



var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/23.
 */
var game;
(function (game) {
    game.stage;
    var MovieClipExample = (function (_super) {
        __extends(MovieClipExample, _super);
        function MovieClipExample() {
            _super.apply(this, arguments);
        }
        MovieClipExample.prototype.cmdStartup = function () {
            alcedo.d$.ready(this.onDomReady, this);
        };
        MovieClipExample.prototype.onDomReady = function () {
            alcedo.d$.query("body")[0].css({ margin: 0, padding: 0, border: 0 });
            this.canvas = alcedo.d$.query("#aperturetest1")[0];
            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0], 320, 480, {
                background: "#16a085",
                profiler: true
            });
            game.stage = this.stage;
            this.canvas.css({ display: "block", width: alcedo.dom.width() + "px", height: alcedo.dom.height() + "px", padding: 0, border: 0, margin: "0 auto" });
            this.canvas.parent().css({ display: "block", position: "relative", width: alcedo.dom.width() + "px", height: alcedo.dom.height() + "px", padding: 0, border: 0, margin: "0" });
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRES.ASSETS_COMPLETE, this.onAssetLoaded, this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload");
        };
        MovieClipExample.prototype.onAssetLoaded = function () {
            MovieClipRepository().praseMovieClipData(AsyncRES().get("smallstarling_json"), TextureRepository().get("smallstarling_png"));
            var mc = new alcedo.canvas.MovieClip(MovieClipRepository().get("smallstarling"));
            mc.play();
            mc.x = game.stage.width() / 2;
            mc.y = game.stage.height() / 2;
            mc.scale(0.5);
            game.stage.addChild(mc);
        };
        return MovieClipExample;
    })(alcedo.AppCycler);
    game.MovieClipExample = MovieClipExample;
    MovieClipExample.prototype.__class__ = "game.MovieClipExample";
    function AsyncRES() {
        return alcedo.proxy(alcedo.net.AsyncRES);
    }
    game.AsyncRES = AsyncRES;
    function MovieClipRepository() {
        return alcedo.proxy(alcedo.canvas.MovieClipRepository);
    }
    game.MovieClipRepository = MovieClipRepository;
    function TextureRepository() {
        return alcedo.proxy(alcedo.canvas.TextureRepository);
    }
    game.TextureRepository = TextureRepository;
})(game || (game = {}));
