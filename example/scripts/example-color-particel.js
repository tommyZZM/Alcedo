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
 * Created by tommyZZM on 2015/5/27.
 */
var example;
(function (example) {
    var ColourfulParticleExample = (function (_super) {
        __extends(ColourfulParticleExample, _super);
        function ColourfulParticleExample() {
            _super.apply(this, arguments);
        }
        ColourfulParticleExample.prototype.run = function () {
            var _this = this;
            var v = new alcedo.canvas.Vector2D(0, -5);
            var pe = new alcedo.canvas.ParticleEmitter({ initial: v, spread: 20, max: 30, rate: 16, particleClass: Particle });
            pe.x = this.stage.width / 2;
            pe.y = this.stage.height / 2 + 50;
            this.stage.addChild(pe);
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0, 0.09));
            this._startcolour = Art.HexToRGB(ColourfulParticleExample.colour);
            this._currcolour = this._startcolour.clone();
            this.targetcolour = this.getTargetColour();
            var step = [];
            step.push(parseInt(((this.targetcolour[0] - this._startcolour[0]) / 60)));
            step.push(parseInt(((this.targetcolour[1] - this._startcolour[1]) / 60)));
            step.push(parseInt(((this.targetcolour[2] - this._startcolour[2]) / 60)));
            trace(this._startcolour, step, this.targetcolour); //TODO:Still Bug here;
            this.stage.addEventListener(example.canvas.Stage.ENTER_MILLSECOND10, function () {
                for (var i = 0; i < 3; i++) {
                    if (_this._currcolour[i] != _this.targetcolour[i]) {
                        _this._currcolour[i] += step[i];
                    }
                    else {
                        _this._currcolour[i] = _this._startcolour[i];
                    }
                }
                ColourfulParticleExample.colour = Art.RGBToHex(_this._currcolour);
                //trace(this._currcolour)
            }, this);
        };
        ColourfulParticleExample.prototype.getTargetColour = function () {
            var sort, result = [];
            sort = this._startcolour.copy();
            for (var i = 0; i < sort.length; i++) {
                var curr = i - 1;
                if (curr > 2)
                    curr = 0;
                if (curr < 0)
                    curr = 2;
                result.push(sort[curr]);
            }
            return result;
        };
        ColourfulParticleExample.colour = "#40d47e";
        return ColourfulParticleExample;
    })(example.ExampleCycler);
    example.ColourfulParticleExample = ColourfulParticleExample;
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            _super.apply(this, arguments);
        }
        Particle.prototype.display = function (renderer) {
            var context = renderer.context;
            context.beginPath();
            context.arc(0, 0, 6, 0, 2 * Math.PI, false);
            context.fillStyle = this._colour;
            context.fill();
        };
        Particle.prototype.prebron = function () {
            this._colour = ColourfulParticleExample.colour;
            this.scale.x += 0.05;
            this.scale.y += 0.05;
            if (this.scale.x > 1.6) {
                this.scale.x = 1.6;
                this.scale.y = 1.6;
                return true;
            }
        };
        return Particle;
    })(example.canvas.Particle);
    var ColourArea;
    (function (ColourArea) {
        ColourArea[ColourArea["Red"] = 0] = "Red";
        ColourArea[ColourArea["Green"] = 1] = "Green";
        ColourArea[ColourArea["Bule"] = 2] = "Bule";
    })(ColourArea || (ColourArea = {}));
    function quickSort(array) {
        function sort(prev, numsize) {
            var nonius = prev;
            var j = numsize - 1;
            var flag = array[prev];
            if ((numsize - prev) > 1) {
                while (nonius < j) {
                    for (; nonius < j; j--) {
                        if (array[j] < flag) {
                            array[nonius++] = array[j]; //a[i] = a[j]; i += 1;
                            break;
                        }
                        ;
                    }
                    for (; nonius < j; nonius++) {
                        if (array[nonius] > flag) {
                            array[j--] = array[nonius];
                            break;
                        }
                    }
                }
                array[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numsize);
            }
        }
        sort(0, array.length);
        return array;
    }
})(example || (example = {}));
