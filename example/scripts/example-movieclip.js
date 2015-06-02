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
 * Created by tommyZZM on 2015/4/23.
 */
///<reference path="../ExampleCycler.ts"/>
var example;
(function (example) {
    var MovieClipExample = (function (_super) {
        __extends(MovieClipExample, _super);
        function MovieClipExample() {
            _super.apply(this, arguments);
        }
        MovieClipExample.prototype.run = function () {
            alcedo.core(alcedo.net.AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE, this.onAssetsLoad, this);
            alcedo.core(alcedo.net.AsyncAssetsLoader).addConfig("resource/resource.json");
            alcedo.core(alcedo.net.AsyncAssetsLoader).loadGroup("preload");
        };
        MovieClipExample.prototype.onAssetsLoad = function () {
            alcedo.core(example.canvas.MovieClipRepository).praseMovieClipData(alcedo.core(alcedo.net.AsyncRES).get("smallstarling_json"), alcedo.core(example.canvas.TextureRepository).get("smallstarling_png"));
            var mc = new alcedo.canvas.MovieClip(alcedo.core(example.canvas.MovieClipRepository).get("smallstarling"));
            mc.play();
            //mc.playToAndStop(1,1);
            mc.x = this.stage.width / 2;
            mc.y = this.stage.height / 2;
            mc.pivotX = 0.6;
            mc.pivotY = 0.8;
            mc.scaleALL(0.5);
            this.stage.addChild(mc);
            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, function () {
                mc.rotation++;
            }, this);
        };
        return MovieClipExample;
    })(example.ExampleCycler);
    example.MovieClipExample = MovieClipExample;
})(example || (example = {}));
