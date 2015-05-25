var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/5/25.
 */
var example;
(function (example) {
    example.dom = alcedo.dom;
    var HelloPixi = (function (_super) {
        __extends(HelloPixi, _super);
        function HelloPixi() {
            _super.apply(this, arguments);
        }
        HelloPixi.prototype.cmdStartup = function () {
            this.stage = new alcedo.Stage(example.dom.query("#helloworld")[0], 320, 480, {
                orient: true,
                backgroundColor: "0xecf0f1",
                profiler: true
            });
            this.stage.addEventListener(alcedo.Stage.ENTER_SECOND, function () {
                //trace("hi");
            }, this);
            alcedo.dom.resize(this.onResize, this);
        };
        HelloPixi.prototype.onResize = function () {
            var _domwidth = alcedo.dom.width();
            var _domheight = alcedo.dom.height();
            this.stage.canvas.css({ width: _domwidth + "px", height: _domheight + "px" });
            this.stage.resizeContext();
            if (this.stage.orientchanged) {
                this.stage.canvas.css({ width: _domheight + "px", height: _domwidth + "px" });
                this.stage.warpper.css({
                    width: _domheight + "px",
                    height: _domwidth + "px"
                });
                this.stage.warpper.css({ left: ((_domwidth - _domheight) / 2).toFixed(0) + "px" });
                this.stage.warpper.css({ top: ((_domheight - _domwidth) / 2).toFixed(0) + "px" });
                this.stage.warpper.css_transform_rotate(-90);
            }
            else {
                this.stage.warpper.css({ width: _domwidth + "px", height: _domheight + "px" });
                this.stage.warpper.css({ top: "0px", left: "0px" });
                this.stage.warpper.css_transform_rotate(0);
            }
        };
        return HelloPixi;
    })(alcedo.AppCycler);
    example.HelloPixi = HelloPixi;
})(example || (example = {}));
