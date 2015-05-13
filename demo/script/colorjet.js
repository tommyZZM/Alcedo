var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/7.
 * a easy demo for alcedo frame work;
 */
var game;
(function (game) {
    game.stage;
    var ColourJetCyc = (function (_super) {
        __extends(ColourJetCyc, _super);
        function ColourJetCyc() {
            _super.apply(this, arguments);
        }
        ColourJetCyc.prototype.cmdStartup = function () {
            alcedo.d$.ready(this.onDomReady, this);
        };
        ColourJetCyc.prototype.onDomReady = function () {
            alcedo.d$.query("body")[0].css({ margin: 0, padding: 0, border: 0 });
            this.canvas = alcedo.d$.query("#aperturetest1")[0];
            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0], 480, 320, {
                background: "#8edced",
                orient: true,
                profiler: true,
                ui: "apertureui"
            });
            game.stage = this.stage;
            this.canvas.css({ display: "block", width: alcedo.dom.width() + "px", height: alcedo.dom.height() + "px", padding: 0, border: 0, margin: "0 auto" });
            this.canvas.parent().css({ display: "block", position: "relative", width: alcedo.dom.width() + "px", height: alcedo.dom.height() + "px", padding: 0, border: 0, margin: "0" });
            alcedo.d$.resize(this.onResize, this);
            this.prepareGame();
        };
        ColourJetCyc.prototype.prepareGame = function () {
            alcedo.proxy(game.MainManager).init(this.stage);
        };
        ColourJetCyc.prototype.onResize = function () {
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
                this.canvas.parent().rotate(-90);
            }
            else {
                this.canvas.parent().css({ width: _domwidth + "px", height: _domheight + "px" });
                this.canvas.parent().css({ top: "0px", left: "0px" });
                this.canvas.parent().rotate(0);
            }
            this.stage.gasket.css({ width: this.canvas.width(), height: this.canvas.height() });
        };
        return ColourJetCyc;
    })(alcedo.AppCycler);
    game.ColourJetCyc = ColourJetCyc;
    game.AsyncAssetsLoader = alcedo.net.AsyncAssetsLoader;
    //export var AsyncRES:any = alcedo.net.AsyncRES;
    function TextureRepository() {
        return alcedo.proxy(alcedo.canvas.TextureRepository);
    }
    game.TextureRepository = TextureRepository;
    function AsyncRES() {
        return alcedo.proxy(alcedo.net.AsyncRES);
    }
    game.AsyncRES = AsyncRES;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/20.
 */
var game;
(function (game) {
    //TODO: 20150422 物体的旋转角度和方向对应 done
    var LogicObject = (function (_super) {
        __extends(LogicObject, _super);
        function LogicObject(displayobject) {
            _super.call(this);
            this._mass = 1;
            this.acceleration_degree = 0;
            this._display = displayobject;
            //this._direction = new alcedo.canvas.Vector2D(1,0);
            this._velocity = new alcedo.canvas.Vector2D();
            this.acceleration = new alcedo.canvas.Vector2D(0, 0);
            this._forcemoment = new alcedo.canvas.Vector2D();
            this._force = new alcedo.canvas.Vector2D();
            //this._isobjactive = true;
            //stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.onCheckTime,this);
        }
        LogicObject.prototype.update = function (e) {
            this._applyForce(this._force);
            if (this._forcemoment.length > 0) {
                this._applyForce(this._forcemoment);
                this._forcemoment.reset();
            }
            if (this._velocity.length) {
                if (this._velocity.length >= this._maxspeed) {
                    this._velocity.length = this._maxspeed;
                }
                //this.updateVelocity();
                this._velocity.x += this.acceleration.x * e.delay;
                this._display.x += this._velocity.x * e.delay;
                this._velocity.y += this.acceleration.y * e.delay;
                this._display.y += this._velocity.y * e.delay;
            }
            this.velocity.deg += this.acceleration_degree;
            this.b.rotation = this.velocity.deg;
        };
        LogicObject.prototype.applyForce = function (force, continute) {
            if (continute === void 0) { continute = true; }
            if (continute) {
                this._force.add(force);
            }
            else {
                this._forcemoment.add(force);
            }
        };
        LogicObject.prototype.clearForce = function () {
            this._force.reset();
            this._forcemoment.reset();
        };
        LogicObject.prototype._applyForce = function (vector) {
            this._velocity.add(vector.divide(alcedo.canvas.Vector2D.identity(this._mass, this._mass)));
        };
        LogicObject.prototype.resetObjct = function () {
            //TODO:重置物体
        };
        Object.defineProperty(LogicObject.prototype, "velocity", {
            /**
             * [物体运动]
             * @returns {alcedo.canvas.Vector2D}
             */
            get: function () {
                return this._velocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicObject.prototype, "speed", {
            get: function () {
                return this._velocity.length;
            },
            set: function (value) {
                this._velocity.length = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicObject.prototype, "maxspeed", {
            set: function (value) {
                this._maxspeed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicObject.prototype, "direction", {
            get: function () {
                return 0;
            },
            set: function (degree) {
            },
            enumerable: true,
            configurable: true
        });
        LogicObject.prototype.updateVelocity = function () {
            var _s = this._velocity.length;
            //trace(_s);
            if (!_s)
                return;
            this._velocity.length = _s;
        };
        Object.defineProperty(LogicObject.prototype, "b", {
            /**
             * 物体显示与边界
             * @returns {alcedo.canvas.Sprite}
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        LogicObject.prototype.shape = function () {
            //返回形状 TODO:扩展shape模块
        };
        return LogicObject;
    })(alcedo.AppObject);
    game.LogicObject = LogicObject;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/1.
 */
var game;
(function (game) {
    var ParallaxObject = (function (_super) {
        __extends(ParallaxObject, _super);
        function ParallaxObject(depth, opts) {
            if (depth === void 0) { depth = 0.5; }
            if (opts === void 0) { opts = {}; }
            _super.call(this);
            this._propdepth = 0.5;
            this._propmax = 3;
            this._propmin = 3;
            this._opts = opts;
            this._propdepth = depth;
            if (this._propdepth > 0.99)
                this._propdepth = 0.99;
            this._props = [];
            this._propspool = [];
            this.initProps();
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND, this.onSecond, this);
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, this.onEachTime, this);
            for (var i = 0; i < this._propmin; i++) {
                this.addChild(this.createAProp());
            }
        }
        Object.defineProperty(ParallaxObject.prototype, "opts", {
            get: function () {
                return this._opts;
            },
            enumerable: true,
            configurable: true
        });
        ParallaxObject.prototype.onEachTime = function (e) {
            //trace(this._propdepth)
            if (game.He162S.reference) {
                this.x += (game.He162S.reference.velocity.x * this._propdepth * e.delay);
            }
        };
        ParallaxObject.prototype.onSecond = function (e) {
            var i;
            for (i = 0; i < this._props.length; i++) {
                var prop = this._props[i];
                //tag:(prop.x-this.x)实际上就是获得prop的全局坐标
                if ((!prop.isInViewPort()) && ((this.x + prop.x) < (game.stage.viewPort().x - 120))) {
                    this.destoryAProp(prop);
                }
            }
            if (this._props.length < this._propmax) {
                for (i = 0; i < (this._propmax - this._props.length); i++) {
                    this.addChild(this.createAProp());
                }
            }
        };
        ParallaxObject.prototype.preInitProps = function () {
            //overrideable
        };
        ParallaxObject.prototype.initProps = function () {
            this.preInitProps();
            //for(var i=0;i<this._propmax;i++){
            //    this.addChild(this.createAProp());
            //}
        };
        ParallaxObject.prototype.createAProp = function () {
            var prop;
            if (!this._propspool || this._propspool.length == 0) {
                prop = new alcedo.canvas.Sprite();
            }
            else {
                prop = this._propspool.pop();
            }
            //trace("here")
            //prop = new alcedo.canvas.Sprite();
            this.onCreateAProp(prop);
            var lastprop = this._props[this._props.length - 1];
            if (lastprop) {
                //trace(this._propspool,this._props.last.x);
                prop.x = lastprop.x + lastprop.actualBound().width;
            }
            else {
                prop.x = this._opts.startpos || game.stage.viewPort().x; //TODO:第一个物体起始点
            }
            //TODO:DisplayObject xy和锚点设置有问题哦
            prop.y = game.stage.height();
            prop.pivotX(0);
            prop.pivotY(1);
            this.onPosAProp(prop);
            this._props.push(prop);
            //trace(prop.x,prop.y);
            return prop;
        };
        ParallaxObject.prototype.onCreateAProp = function (prop) {
            //overrideable
            if (!prop || !prop.texture)
                return;
            prop.scaleToWidth(game.stage.width());
        };
        ParallaxObject.prototype.onPosAProp = function (prop) {
        };
        ParallaxObject.prototype.destoryAProp = function (prop) {
            var index = this._props.indexOf(prop);
            this._props.splice(index, 1);
            this._propspool.push(prop);
        };
        return ParallaxObject;
    })(alcedo.canvas.DisplatObjectContainer);
    game.ParallaxObject = ParallaxObject;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/3.
 */
var game;
(function (game) {
    var SceneryGround = (function (_super) {
        __extends(SceneryGround, _super);
        function SceneryGround() {
            _super.call(this);
            this.init();
            alcedo.addDemandListener(game.GameSceneryControl, game.CmdCatalog.RESET_SCENERY, this.resResetScenery, this);
        }
        SceneryGround.prototype.init = function () {
        };
        SceneryGround.prototype.resResetScenery = function (e) {
        };
        return SceneryGround;
    })(alcedo.canvas.DisplatObjectContainer);
    game.SceneryGround = SceneryGround;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/30.
 */
var game;
(function (game) {
    var DarkCloud = (function (_super) {
        __extends(DarkCloud, _super);
        function DarkCloud(width, height) {
            _super.call(this);
            this._display = new alcedo.canvas.graphic.Rectangle(0, 0, width, height);
            this._display.fillcolour = "#000";
        }
        return DarkCloud;
    })(game.LogicObject);
    game.DarkCloud = DarkCloud;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var game;
(function (game) {
    /**
     * UI
     */
    var GameUIManager = (function (_super) {
        __extends(GameUIManager, _super);
        function GameUIManager() {
            _super.call(this);
        }
        GameUIManager.prototype.init = function () {
            trace("GameUIManager init");
            this._gameui = alcedo.d$.query("#apertureui")[0];
            if (!this._gameui)
                return;
            this.gamescreens = new Dict();
            this.bindScreen("loading", game.LoadingScreen);
            //alcedo.d$.resize(this.onResize,this);
            this.onResize();
            alcedo.d$.resize(this.onResize, this);
            game.stage.addEventListener(alcedo.canvas.Stage.RESIZED, this.onResize, this);
            alcedo.addDemandListener(game.ScreenControl, game.CmdCatalog.TO_SCREEN, this.resToggleScreen, this);
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["loading"]);
        };
        GameUIManager.prototype.ready = function () {
            //:加载完资源后执行此方法;
            this.bindScreen("start", game.StartScreen);
            this.bindScreen("playing", game.PlayingScreen);
            this.bindScreen("preto", game.PretoScreen);
            this.bindScreen("over", game.OverScreen);
        };
        GameUIManager.prototype.onResize = function () {
            var i, ele, width, centers = this._gameui.find(".center");
            for (i = 0; i < centers.length; i++) {
                ele = centers[i];
                width = ele.node.style.width ? ele.node.style.width : ele.abscss()["width"];
                if (width === "auto")
                    width = 0;
                width = alcedo.toValue(width);
                //trace("onResize",alcedo.toValue(width));
                ele.transition = 0;
                ele.css({ left: (stageSize().width - width) / 2 + "px" });
            }
            this.gamescreens.forEach(function (screen) {
                //trace(screen.resize)
                screen.resize();
            });
        };
        GameUIManager.prototype.bindScreen = function (classname, screenClass) {
            var screen = alcedo.d$.query("#apertureui")[0].find(".screen." + classname)[0];
            if (screen) {
                new screenClass(screen, this._gameui, screen.styleClass[1]);
            }
            else {
                warn("bindScreen fail", screenClass);
            }
        };
        GameUIManager.prototype.resToggleScreen = function (data) {
            var _this = this;
            var screenname = data.screenname;
            var screen = this.gamescreens.get(screenname);
            //trace("resToggleScreen",data,screen,this._currscreen == screen.hashIndex)
            if (!screen) {
                warn("no such screen", data, screenname);
                return;
            }
            if (this._currscreen) {
                if (this._currscreen.hashIndex == screen.hashIndex) {
                    return;
                }
                //alcedo.d$.query("#curtain")[0].removeClass("disactive");
                this._currscreen.disactive(function () {
                    //alcedo.d$.query("#curtain")[0].addClass("disactive");
                    _this._currscreen = screen;
                    //trace("this._currscreen.disactive",this._currscreen,screen);
                    screen.active(data);
                });
            }
            else {
                screen.active(data);
                this._currscreen = screen;
            }
        };
        GameUIManager.instanceable = true;
        return GameUIManager;
    })(alcedo.AppProxyer);
    game.GameUIManager = GameUIManager;
    var GameScreen = (function (_super) {
        __extends(GameScreen, _super);
        function GameScreen(screen, root, name) {
            _super.call(this);
            this._screen = screen;
            this._screen.data("name", name);
            alcedo.proxy(GameUIManager).gamescreens.set(name, this);
            this._root = root;
            screen.index = 10;
            //trace("aaa")
            this.init();
        }
        Object.defineProperty(GameScreen.prototype, "screen", {
            get: function () {
                return this._screen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameScreen.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        GameScreen.prototype.init = function () {
        };
        GameScreen.prototype.active = function (data) {
            this._isactive = true;
            this.emit(GameScreen.ACTIVE, this.screen.data(name));
            //overridren
        };
        GameScreen.prototype.disactive = function (callback, thisObject) {
            this._isactive = false;
            this.emit(GameScreen.DISACTIVE, this.screen.data(name));
            //overridren
        };
        GameScreen.prototype.resize = function () {
        };
        GameScreen.ACTIVE = "GameScreen_Active";
        GameScreen.DISACTIVE = "GameScreen_Active";
        return GameScreen;
    })(alcedo.EventDispatcher);
    game.GameScreen = GameScreen;
    function stageSize() {
        return {
            width: alcedo.toValue(game.stage.canvas.node.style.width || game.stage.canvas.abscss().width),
            height: alcedo.toValue(game.stage.canvas.node.style.height || game.stage.canvas.abscss().height)
        };
    }
    game.stageSize = stageSize;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/16.
 */
var game;
(function (game) {
    var GameUIComponent = (function () {
        function GameUIComponent(ele, texture) {
            this.fitsize = true;
            this._com = ele;
            this._texture = texture;
            if (!this._texture) {
                return;
            }
            this._com.css({
                background: "url(" + this._texture.sourceUrl + ")",
                "background-size": "100% 100%",
                "-webkit-background-size": "100% 100%"
            });
            //this.width = texture._sourceWidth;
        }
        Object.defineProperty(GameUIComponent.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (width) {
                this._width = width;
                this._com.css({ width: this._width + "px" });
                if (this.fitsize) {
                    this.fitsize = false;
                    this.height = this._width / this._texture._sourceW2H;
                    this.fitsize = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameUIComponent.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (height) {
                this._height = height;
                this._com.css({ height: this._height + "px" });
                if (this.fitsize) {
                    this.fitsize = false;
                    this.width = this._height * this._texture._sourceW2H;
                    this.fitsize = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameUIComponent.prototype, "index", {
            /**
             * index
             */
            set: function (index) {
                this._com.css({ "z-index": index });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameUIComponent.prototype, "e", {
            /**
             * ele
             */
            get: function () {
                return this._com;
            },
            enumerable: true,
            configurable: true
        });
        return GameUIComponent;
    })();
    game.GameUIComponent = GameUIComponent;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/19.
 */
var game;
(function (game) {
    var CmdCatalog = (function () {
        function CmdCatalog() {
        }
        //Scenery
        CmdCatalog.RESET_SCENERY = "SceneryControl_RESET_SCENERY"; //重置场景
        //Screen
        CmdCatalog.TO_SCREEN = "ScreenControl_TO_SCREEN";
        //GameState
        CmdCatalog.STATE_HELLO = "GameStateControl_STATE_PRE_PLAY"; //还没开始游戏;
        CmdCatalog.STATE_PREPARE_PLAY = "GameStateControl_STATE_READY_PLAY"; //准备开始游戏,重置游戏场景等;
        CmdCatalog.STATE_START_PLAYING = "GameStateControl_START_PLAYING";
        CmdCatalog.STATE_OVER_PLAY = "GameStateControl_STATE_OVER_PLAY";
        CmdCatalog.STATE_RESET_TO_HELLO = "STATE_RESET_TO_HELLO...";
        //GameControl
        CmdCatalog.CTR_FLY_BEGIN = "ON_FLY_BEGIN"; //小灰机网上飞行;
        CmdCatalog.CTR_FLY_RELEASE = "ON_FLY_RELEASE"; //小灰机网放松;
        return CmdCatalog;
    })();
    game.CmdCatalog = CmdCatalog;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/10.
 */
var game;
(function (game) {
    var CollisionManager = (function (_super) {
        __extends(CollisionManager, _super);
        function CollisionManager() {
            _super.apply(this, arguments);
            this._powers = [];
        }
        CollisionManager.prototype.init = function () {
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, this.onEachTime, this);
        };
        CollisionManager.prototype.initClouds = function (clouds) {
            this._collisioncloud = clouds;
            trace("initClouds", this._collisioncloud);
        };
        CollisionManager.prototype.registPower = function (power) {
            if (this._powers.indexOf(power) < 0) {
                this._powers.push(power);
                trace("registPower", this._powers);
            }
        };
        CollisionManager.prototype.unregistPower = function (power) {
            var i = this._powers.indexOf(power);
            if (i >= 0) {
                this._powers.splice(i, 1);
                trace("unregistPower", this._powers);
            }
        };
        CollisionManager.prototype.onEachTime = function () {
        };
        CollisionManager.instanceable = true;
        return CollisionManager;
    })(alcedo.AppProxyer);
    game.CollisionManager = CollisionManager;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/4.
 */
var game;
(function (game) {
    var GameControl = (function (_super) {
        __extends(GameControl, _super);
        function GameControl() {
            _super.call(this);
            this.addCmdHandler(game.CmdCatalog.CTR_FLY_BEGIN, this.cmdFlyBegin);
            this.addCmdHandler(game.CmdCatalog.CTR_FLY_RELEASE, this.cmdFlyRelease);
        }
        GameControl.prototype.cmdFlyBegin = function () {
            this.dispatchDemand(game.CmdCatalog.CTR_FLY_BEGIN);
        };
        GameControl.prototype.cmdFlyRelease = function () {
            this.dispatchDemand(game.CmdCatalog.CTR_FLY_RELEASE);
        };
        return GameControl;
    })(alcedo.AppCmder);
    game.GameControl = GameControl;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/8.
 */
var game;
(function (game) {
    var ColourPowerGroup = (function () {
        function ColourPowerGroup(pointdata) {
            this._sourcepointsdata = pointdata;
            this._pointsdata = [];
            this._powers = [];
        }
        ColourPowerGroup.prototype.eachPower = function (fn) {
            for (var i = 0; i < this._powers.length; i++) {
                fn(this._powers[i]);
            }
        };
        ColourPowerGroup.prototype.createPowers = function (container) {
            this.createAllPowers();
            this.eachPower(function (power) {
                container.addChild(power.b);
            });
        };
        ColourPowerGroup.prototype.destoryPowers = function (container) {
            this.eachPower(function (power) {
                LittlePower.distory(power);
                container.removeChild(power.b);
            });
            this._powers = [];
        };
        ColourPowerGroup.prototype.createAllPowers = function () {
            var _this = this;
            for (var i = 0; i < this._sourcepointsdata.length; i++) {
                this._pointsdata.push(new alcedo.canvas.Point2D(this._sourcepointsdata[i].x, this._sourcepointsdata[i].y));
            }
            this._bzcurve = new alcedo.canvas.Bezier2D(this._sourcepointsdata, +(Math.randomFrom(this._sourcepointsdata.length, this._sourcepointsdata.length + 2).toFixed(0)));
            this._bzcurve.eachPointsOnCurve(function (point) {
                var power = LittlePower.new();
                power.b.x = point.x;
                power.b.y = point.y;
                _this._powers.push(power);
            });
        };
        return ColourPowerGroup;
    })();
    game.ColourPowerGroup = ColourPowerGroup;
    var LittlePower = (function (_super) {
        __extends(LittlePower, _super);
        function LittlePower() {
            _super.call(this);
            this._display = new alcedo.canvas.graphic.Circle(0, 0, 8, "#f1c40f");
        }
        LittlePower.new = function () {
            var p = this._powerspool.pop();
            if (!p) {
                p = new LittlePower();
            }
            alcedo.proxy(game.CollisionManager).registPower(p);
            return p;
        };
        LittlePower.distory = function (p) {
            if (this._powerspool.indexOf(p) < 0) {
                this._powerspool.push(p);
                alcedo.proxy(game.CollisionManager).unregistPower(p);
            }
        };
        LittlePower._powerspool = [];
        return LittlePower;
    })(game.LogicObject);
    game.LittlePower = LittlePower;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/10.
 */
var game;
(function (game) {
    /**
     * 描述关卡的类
     */
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level(levelconfig) {
            _super.call(this);
            this._levelconfig = levelconfig;
            this.width(levelconfig.pixelwidth);
            this.height(levelconfig.pixelheight);
            this._clouds = [];
            this._powers = [];
            //this.debugArea(true);
            this.renderLevel();
        }
        Level.prototype.debugArea = function (active) {
            if (!this._debugdraw) {
                this._debugdraw = new alcedo.canvas.graphic.Rectangle(0, 0, this._levelconfig.pixelwidth, this._levelconfig.pixelheight, "#27AE60");
                this.addChild(this._debugdraw);
                this._debugdraw.alpha = 0.2;
            }
            this._debugdraw.visible = active;
            this.setChildIndex(this._debugdraw, 0);
        };
        Level.prototype.active = function () {
            this._activestate = true;
            for (var i = 0; i < this._powers.length; i++) {
                this._powers[i].createPowers(this);
            }
            alcedo.proxy(game.CollisionManager).initClouds(this._clouds);
            trace("active", this._levelconfig);
        };
        //关闭碰撞检测
        Level.prototype.disactive = function () {
            this._activestate = false;
            for (var i = 0; i < this._powers.length; i++) {
                this._powers[i].destoryPowers(this);
            }
            trace("disactive", this._levelconfig);
        };
        //清除colour power;
        Level.prototype.destory = function () {
        };
        Object.defineProperty(Level.prototype, "isactive", {
            get: function () {
                return this._activestate;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 创建场景
         */
        Level.prototype.renderLevel = function () {
            //TODO:按照地图数据渲染当前关卡
            trace(this._levelconfig);
            var i, objscollect = this._levelconfig.objects;
            if (!objscollect) {
                warn("no objectis found", this._levelconfig);
                return;
            }
            for (var objs in objscollect) {
                switch (objs) {
                    case "obstacle_darkcloud": {
                        if (Array.isArray(objscollect[objs]) && objscollect[objs].length > 0) {
                            for (i = 0; i < objscollect[objs].length; i++) {
                                this._renderdartcloud(objscollect[objs][i]);
                            }
                        }
                        break;
                    }
                    case "clourpower": {
                        if (Array.isArray(objscollect[objs]) && objscollect[objs].length > 0) {
                            for (i = 0; i < objscollect[objs].length; i++) {
                                this._rendercolourpower(objscollect[objs][i]);
                            }
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        Level.prototype._renderdartcloud = function (obj) {
            if (obj.type != 1 /* Rect */) {
                return;
            }
            //trace("_renderdartcloud",cloudobj);
            var cloud = new game.DarkCloud(obj.width, obj.height);
            cloud.b.x = obj.x;
            cloud.b.y = obj.y;
            cloud.b.alpha = 0.6;
            this._clouds.push(cloud);
            this.addChild(cloud.b);
        };
        Level.prototype._rendercolourpower = function (obj) {
            if (obj.type != 3 /* PointLine */) {
                return;
            }
            switch (obj.type) {
                case 3 /* PointLine */: {
                    var powergroup = new game.ColourPowerGroup(obj.points);
                    this._powers.push(powergroup);
                }
            }
        };
        return Level;
    })(alcedo.canvas.DisplatObjectContainer);
    game.Level = Level;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/26.
 */
var game;
(function (game) {
    //bala
    var He162S = (function (_super) {
        __extends(He162S, _super);
        function He162S(skin) {
            _super.call(this);
            //自动驾驶,用于开始界面和debug
            this.autocontrol = false;
            if (!!He162S.reference)
                return;
            game.MovieClipRepository().praseMovieClipData(game.AsyncRES().get("smallalcedo_json"), game.TextureRepository().get("smallalcedo_png"));
            this._display = new alcedo.canvas.MovieClip(game.MovieClipRepository().get("smallalcedo"));
            this.b.scaleALL(0.3);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_ADD, this.onAdd, this);
            this.b.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_REMOVE, this.onRemove, this);
            this.bindParticleEmitterAt(-0.5, 0);
            this._maxspeed = 10.20;
            alcedo.addDemandListener(game.GameControl, game.CmdCatalog.CTR_FLY_BEGIN, this.beginfly, this);
            alcedo.addDemandListener(game.GameControl, game.CmdCatalog.CTR_FLY_RELEASE, this.endfly, this);
            He162S.reference = this;
        }
        He162S.prototype.onAdd = function (e) {
            e.parent.addChildAt(this._colourEmitter, e.index - 1);
            trace(e.parent["_children"]);
        };
        He162S.prototype.onRemove = function (e) {
            e.parent.removeChild(this._colourEmitter);
        };
        He162S.prototype.bindParticleEmitterAt = function (offsetx, offsety) {
            this._colourEmitter = new alcedo.canvas.ParticleEmitter({ spread: 6, max: 60, rate: 20 });
            this._colourEmitterPostion = new alcedo.canvas.Vector2D(offsetx, offsety);
            this._colourEmitter.play();
            //this._colourEmitter.applyForce(new alcedo.canvas.Vector2D(0,0.03))
        };
        He162S.prototype.update = function (e) {
            _super.prototype.update.call(this, e);
            this._colourEmitter.initialdegree = this._velocity.deg - 180;
            var visualsizerect = this.b.localToGlobal(this.b["_staticboundingbox"].width * this._colourEmitterPostion.x + this.b.pivotOffsetX(), this.b["_staticboundingbox"].height * this._colourEmitterPostion.y + this.b.pivotOffsetY()); //
            this._colourEmitter.x = visualsizerect.x;
            this._colourEmitter.y = visualsizerect.y;
            //this.applyForce(new alcedo.canvas.Vector2D(0,0.1));
            //this.acceleration_degree=0;
            if (this.autocontrol)
                this.debugRobot();
            if (this._flystate) {
                this.flyup();
            }
            else {
                this.acceleration_degree = 0;
            }
        };
        He162S.prototype.beginfly = function () {
            if (this._flystate)
                return;
            this._flystate = true;
            //trace("fly");
            this._display.play(6);
            //小灰机刚刚开始往上飞..
            //todo:动画,特效
        };
        He162S.prototype.endfly = function () {
            if (!this._flystate)
                return;
            this._flystate = false;
            this._display.playToAndStop(1);
            //(<alcedo.canvas.MovieClip>this._display).stopAt(1)
        };
        He162S.prototype.flyup = function () {
            this.acceleration_degree = -3;
            this.speed += 0.01;
            this.velocity.y -= 0.01;
        };
        He162S.prototype.readyfly = function () {
            this.autocontrol = false;
            this._flystate = false;
        };
        He162S.prototype.autofly = function () {
            this.autocontrol = true;
        };
        He162S.prototype.debugRobot = function () {
            /**
             * debug状态下小灰机处于最高速度。
             */
            if (!this.autocontrol)
                return;
            this.speed = 5;
            if (this.b.y > game.stage.height() * 0.6 && !this._debugautocontrol) {
                this._debugautocontrol = true;
            }
            if (this.velocity.deg > -30 && this._debugautocontrol) {
                this.beginfly();
            }
            else {
                this._debugautocontrol = false;
                this.endfly();
            }
        };
        return He162S;
    })(game.LogicObject);
    game.He162S = He162S;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/17.
 */
var game;
(function (game) {
    var PlayGround = (function (_super) {
        __extends(PlayGround, _super);
        function PlayGround() {
            _super.apply(this, arguments);
        }
        PlayGround.prototype.init = function () {
            this._gameobjects = [];
            //speed.plane = speed.plane_lazy;
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, this.onEachTime, this);
            alcedo.addDemandListener(game.GameStateControl, game.CmdCatalog.STATE_RESET_TO_HELLO, this.resResetToHello, this);
            alcedo.addDemandListener(game.GameStateControl, game.CmdCatalog.STATE_HELLO, this.resHello, this);
            alcedo.addDemandListener(game.GameStateControl, game.CmdCatalog.STATE_PREPARE_PLAY, this.resPreparePlay, this);
            alcedo.addDemandListener(game.GameStateControl, game.CmdCatalog.STATE_START_PLAYING, this.resStartPlaying, this);
            alcedo.addDemandListener(game.GameStateControl, game.CmdCatalog.STATE_OVER_PLAY, this.resOverPlay, this);
            this.playlayer = new alcedo.canvas.DisplatObjectContainer();
            this.levellayer = new alcedo.canvas.DisplatObjectContainer();
            this.addChild(this.levellayer);
            this.addChild(this.playlayer);
            this._myplane = new game.He162S("paopaotucao");
            this._myplane.b.x = 0;
            this._myplane.b.y = game.stage.height();
            this._myplane.b.pivotX(0.5);
            this._myplane.b.pivotY(0.5);
            //this._myplane.speed = 0;
            this.addPlayObject(this._myplane);
            alcedo.proxy(game.CameraManager).lookAt(this._myplane.b);
            game.stage.camera().focal = 1;
            //trace(this.className,"init");
        };
        PlayGround.prototype.onEachTime = function (e) {
            //trace("MainGround eachtime");
            var i;
            for (i = 0; i < this._gameobjects.length; i++) {
                this._gameobjects[i].update(e);
            }
            if (this._gamestate == 3 /* PLAYING */) {
                if (this._myplane.b.y > game.stage.height() && this._myplane.velocity.y > 0) {
                    //TODO：掉落云雾的特效
                    alcedo.dispatchCmd(game.GameStateControl, game.CmdCatalog.STATE_OVER_PLAY);
                }
            }
        };
        PlayGround.prototype.addPlayObject = function (obj) {
            this.playlayer.addChild(obj.b);
            this._gameobjects.push(obj);
        };
        PlayGround.prototype.removeObject = function (obj) {
            this.removeChild(obj.b);
            var index = this._gameobjects.indexOf(obj);
            this._gameobjects.splice(index, 1);
        };
        /**
         * Response Command
         */
        /**还没开始游戏的状态**/
        PlayGround.prototype.resHello = function () {
            this.levellayer.removeChildren();
            this._gamestate = 1 /* PRE */;
            alcedo.proxy(game.CameraManager).yawX = 0.23;
            this._myplane.clearForce();
            var lastplanex = this._myplane.b.x;
            this._myplane.b.x = 0;
            this._myplane.b.y = game.stage.height() - 100;
            this._myplane.applyForce(new alcedo.canvas.Vector2D(2, -2), false);
            this._myplane.applyForce(new alcedo.canvas.Vector2D(0, 0.1));
            this._myplane.autofly();
            this._myplane.maxspeed = 6;
            trace("resHello");
            alcedo.dispatchCmd(game.GameSceneryControl, game.CmdCatalog.RESET_SCENERY, [lastplanex - this._myplane.b.x]);
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["start"]);
        };
        PlayGround.prototype.resPreparePlay = function () {
            this._gamestate = 2 /* PREPARE */;
            var lastplanex = this._myplane.b.x;
            this._myplane.b.x = 100;
            this._myplane.b.y = game.stage.height() - 100;
            this._myplane.clearForce();
            this._myplane.speed = 0;
            this._myplane.readyfly();
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["playing"]);
            alcedo.dispatchCmd(game.GameSceneryControl, game.CmdCatalog.RESET_SCENERY, [lastplanex - this._myplane.b.x]);
        };
        /**开始游戏**/
        PlayGround.prototype.resStartPlaying = function () {
            this._gamestate = 3 /* PLAYING */;
            this._myplane.applyForce(new alcedo.canvas.Vector2D(5.6, -5.6), false);
            this._myplane.applyForce(new alcedo.canvas.Vector2D(0, 0.1));
            alcedo.proxy(game.LevelManager).startLevel(this._myplane.b.x);
        };
        /**游戏结束游戏**/
        PlayGround.prototype.resOverPlay = function () {
            trace("over");
            this._gamestate = 4 /* OVER */;
            this._myplane.clearForce();
            this._myplane.endfly();
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["over"]);
        };
        PlayGround.prototype.resResetToHello = function () {
            alcedo.proxy(game.LevelManager).turnOffAllLevels();
        };
        /**重置位置**/
        PlayGround.prototype.resResetScenery = function (e) {
            //TODO:
            //trace(this._myplane.b.x);
        };
        return PlayGround;
    })(game.SceneryGround);
    game.PlayGround = PlayGround;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/19.
 */
var game;
(function (game) {
    /**
     * 游戏状态控制器
     *
     */
    (function (GameState) {
        GameState[GameState["PRE"] = 1] = "PRE";
        GameState[GameState["PREPARE"] = 2] = "PREPARE";
        GameState[GameState["PLAYING"] = 3] = "PLAYING";
        GameState[GameState["OVER"] = 4] = "OVER";
    })(game.GameState || (game.GameState = {}));
    var GameState = game.GameState;
    var GameStateControl = (function (_super) {
        __extends(GameStateControl, _super);
        function GameStateControl() {
            _super.call(this);
            this.addCmdHandler(game.CmdCatalog.STATE_START_PLAYING, this.cmdStartPlaying);
            this.addCmdHandler(game.CmdCatalog.STATE_HELLO, this.cmdHello);
            this.addCmdHandler(game.CmdCatalog.STATE_PREPARE_PLAY, this.cmdPreparePlay);
            this.addCmdHandler(game.CmdCatalog.STATE_OVER_PLAY, this.cmdGameOver);
            this.addCmdHandler(game.CmdCatalog.STATE_RESET_TO_HELLO, this.cmdResetToHello);
        }
        GameStateControl.prototype.cmdHello = function () {
            this.dispatchDemand(game.CmdCatalog.STATE_HELLO);
        };
        GameStateControl.prototype.cmdPreparePlay = function () {
            this.dispatchDemand(game.CmdCatalog.STATE_PREPARE_PLAY);
        };
        GameStateControl.prototype.cmdStartPlaying = function () {
            this.dispatchDemand(game.CmdCatalog.STATE_START_PLAYING);
        };
        GameStateControl.prototype.cmdGameOver = function () {
            this.dispatchDemand(game.CmdCatalog.STATE_OVER_PLAY);
        };
        GameStateControl.prototype.cmdResetToHello = function () {
            this.dispatchDemand(game.CmdCatalog.STATE_RESET_TO_HELLO);
        };
        return GameStateControl;
    })(alcedo.AppCmder);
    game.GameStateControl = GameStateControl;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/19.
 */
var game;
(function (game) {
    var ScreenControl = (function (_super) {
        __extends(ScreenControl, _super);
        function ScreenControl() {
            _super.call(this);
            this.addCmdHandler(game.CmdCatalog.TO_SCREEN, this.cmdToScreen);
        }
        ScreenControl.prototype.cmdToScreen = function (sceenname, data) {
            if (!data || !data.stateto)
                data = {};
            data.screenname = sceenname;
            trace("toScreen", data);
            this.dispatchDemand(game.CmdCatalog.TO_SCREEN, data);
        };
        return ScreenControl;
    })(alcedo.AppCmder);
    game.ScreenControl = ScreenControl;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/21.
 */
var game;
(function (game) {
    /**
     * 镜头控制器
     */
    var CameraManager = (function (_super) {
        __extends(CameraManager, _super);
        function CameraManager() {
            _super.apply(this, arguments);
            this.yawX = 0.5;
            this.yawY = 0.5;
        }
        CameraManager.prototype.init = function (camera) {
            this._camera = camera;
            //this._lookat = new alcedo.canvas.Point2D(stage.width()/2,stage.height()/2);
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, this.onEachTime, this, -10);
        };
        CameraManager.prototype.lookAt = function (target) {
            this._lookat = target;
        };
        CameraManager.prototype.onEachTime = function () {
            if (this._lookat) {
                this.updateCamera();
                this.limitTation();
            }
        };
        /**更新镜头**/ //TODO:镜头缓动;
        CameraManager.prototype.updateCamera = function () {
            game.stage.camera().zoomTo(this._lookat.x, this._lookat.y, 1, this.yawX, this.yawY);
        };
        CameraManager.prototype.limitTation = function () {
            //镜头范围限制
            var viewfinder = this._camera.viewfinder();
            if (this._camera.viewfinder().height > game.stage.height()) {
                this._camera.focal = 1;
            }
            if (viewfinder.bottom > game.stage.height()) {
                this._camera.y = game.stage.height() - (viewfinder.height * (1 - this._camera.yawY));
            }
            else if (viewfinder.y <= 0) {
                this._camera.focal = game.stage.height() / (game.stage.height() - viewfinder.y);
                //trace(this._camera.focal);
                if (this._camera.focal > 2.3)
                    this._camera.focal = 2.3;
            }
            viewfinder = this._camera.viewfinder();
            if (viewfinder.x < 0) {
                this._camera.x = viewfinder.width / 2;
            }
        };
        CameraManager.instanceable = true;
        return CameraManager;
    })(alcedo.AppProxyer);
    game.CameraManager = CameraManager;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/29.
 */
var game;
(function (game) {
    /**
     * 游戏关卡,地图管理器...
     */
    var LevelManager = (function (_super) {
        __extends(LevelManager, _super);
        function LevelManager() {
            _super.call(this);
            this._levelspool = [];
            game.stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND, this.checkLevels, this);
        }
        LevelManager.prototype.init = function (mainground) {
            this._levellayer = mainground.levellayer;
            var levels = game.AsyncRES().find(/level_\w+/i);
            if (levels.length > 0) {
                for (var i = 0; i < levels.length; i++) {
                    this._levelspool.push(new game.Level(levels[i]));
                }
            }
        };
        LevelManager.prototype.startLevel = function (positionx) {
            this.resetAllLevels();
            this._off = false;
            this._currlevel = this.selectOneLevel();
            this._currlevel.x = positionx + game.stage.width() / 2 + 100;
            this._currlevel.y = -20;
            this._currlevel.active();
            this._levellayer.addChild(this._currlevel);
            this.createNextLevel();
            trace("startlevel", this._levellayer.children);
        };
        LevelManager.prototype.createNextLevel = function () {
            this._nexlevel = this.selectOneLevel();
            if (!this._nexlevel)
                return;
            this._nexlevel.x = this._currlevel.x + this._currlevel.width() + 10;
            this._nexlevel.y = Math.randomFrom(-20, -30);
            //this._nexlevel.active();
            this._levellayer.addChild(this._nexlevel);
            trace("createNextLevel", this._levelspool);
        };
        LevelManager.prototype.destoryLevel = function (level) {
            this._levellayer.removeChild(level);
            if (this._levelspool.indexOf(level) >= 0 || !level)
                return;
            this._levelspool.push(level);
            trace("destoryLastLevel", this._levelspool);
        };
        LevelManager.prototype.checkLevels = function () {
            if (this._currlevel && !this._off && game.He162S.reference) {
                //检查当前场景是否已经从视图中离去;
                if (!this._currlevel.isInViewPort() && this._currlevel.x < game.He162S.reference.b.x) {
                    this._currlevel.disactive();
                    this._lastlevel = this._currlevel;
                    this._currlevel = this._nexlevel;
                    this._currlevel.active();
                    this.createNextLevel();
                }
                if (this._lastlevel && !this._lastlevel.isInViewPort() && this._lastlevel.x < game.stage.viewPort().x) {
                    this.destoryLevel(this._lastlevel);
                }
            }
        };
        LevelManager.prototype.turnOffAllLevels = function () {
            //重置关卡
            this._off = true;
        };
        LevelManager.prototype.resetAllLevels = function () {
            this.destoryLevel(this._currlevel);
            this.destoryLevel(this._nexlevel);
            this.destoryLevel(this._lastlevel);
        };
        LevelManager.prototype.selectOneLevel = function () {
            //创建关卡
            var result = this._levelspool.randomselect();
            //trace(this._levelspool,result);
            var _index = this._levelspool.indexOf(result);
            this._levelspool.splice(_index, 1);
            return result;
        };
        LevelManager.instanceable = true;
        return LevelManager;
    })(alcedo.AppProxyer);
    game.LevelManager = LevelManager;
    (function (LevelObjectType) {
        LevelObjectType[LevelObjectType["DarkCloud"] = 1] = "DarkCloud";
        LevelObjectType[LevelObjectType["WhiteCloud"] = 2] = "WhiteCloud";
        LevelObjectType[LevelObjectType["ClourPower"] = 3] = "ClourPower";
        LevelObjectType[LevelObjectType["RainBow"] = 6] = "RainBow"; //彩虹
    })(game.LevelObjectType || (game.LevelObjectType = {}));
    var LevelObjectType = game.LevelObjectType;
    (function (LevelShapeType) {
        LevelShapeType[LevelShapeType["Rect"] = 1] = "Rect";
        LevelShapeType[LevelShapeType["Circle"] = 2] = "Circle";
        LevelShapeType[LevelShapeType["PointLine"] = 3] = "PointLine";
        LevelShapeType[LevelShapeType["Uuknow"] = -1] = "Uuknow";
    })(game.LevelShapeType || (game.LevelShapeType = {}));
    var LevelShapeType = game.LevelShapeType;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/17.
 */
var game;
(function (game) {
    var BackGround = (function (_super) {
        __extends(BackGround, _super);
        function BackGround() {
            _super.apply(this, arguments);
        }
        BackGround.prototype.init = function () {
            this._clouds = new BackGroundClouds(0.8);
            this.addChild(this._clouds);
        };
        BackGround.prototype.resResetScenery = function (e) {
            //TODO:
            this._clouds.eachChilder(function (child) {
                child.x -= e.x;
                //child.x+= this._clouds.opts.startpos;
            });
        };
        return BackGround;
    })(game.SceneryGround);
    game.BackGround = BackGround;
    //TODO:[BUG]某些情况下背景会消失的问题
    var BackGroundClouds = (function (_super) {
        __extends(BackGroundClouds, _super);
        function BackGroundClouds(depeth) {
            if (depeth === void 0) { depeth = 0.5; }
            _super.call(this, depeth, { startpos: game.stage.viewPort().width + 100 });
        }
        BackGroundClouds.prototype.onEachTime = function (e) {
            _super.prototype.onEachTime.call(this, e);
            //trace("BackGroundClouds",this.x,speed.plane*this._propdepth*e.delay,this._propdepth*e.delay);
        };
        BackGroundClouds.prototype.preInitProps = function () {
            var _this = this;
            this._propstextures = game.TextureRepository().find(/bgcloud\d{2}/);
            this._ramdomarray = [];
            var i, propslength = this._propstextures.length, _totalassigned = 0, _autoassign;
            var setPropIndex = function (prop, probability) {
                var index = _this._propstextures.indexOf(game.TextureRepository().get(prop));
                if (index >= 0) {
                    _this._ramdomarray[index] = probability;
                    _totalassigned += probability;
                    propslength--;
                }
            };
            setPropIndex("bgcloud01", 0.2);
            setPropIndex("bgcloud03", 0.3);
            setPropIndex("bgcloud05", 0.3);
            _autoassign = 1 - _totalassigned;
            if (_autoassign > 0) {
                _autoassign = _autoassign / propslength;
            }
            for (i = 0; i < this._propstextures.length; i++) {
                if (!this._ramdomarray[i]) {
                    this._ramdomarray[i] = _autoassign;
                }
            }
        };
        BackGroundClouds.prototype.onCreateAProp = function (prop) {
            var prop;
            prop.texture = this.selectAtexture();
            prop.scaleToWidth(game.stage.width() * 1.6);
            //trace(this.selectAtexture(),prop.scale.x, prop.scale.y);
        };
        BackGroundClouds.prototype.onPosAProp = function (prop) {
            prop.y = game.stage.height() - 10;
            prop.alpha = 0.9;
        };
        BackGroundClouds.prototype.selectAtexture = function () {
            return this._propstextures[Math.probabilityPool(this._ramdomarray)];
        };
        return BackGroundClouds;
    })(game.ParallaxObject);
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/17.
 */
var game;
(function (game) {
    var FrontGround = (function (_super) {
        __extends(FrontGround, _super);
        function FrontGround() {
            _super.apply(this, arguments);
        }
        FrontGround.prototype.init = function () {
            this._clouds = new FrontGroundClouds(0.1);
            this.addChild(this._clouds);
        };
        FrontGround.prototype.resResetScenery = function (e) {
            //TODO:
            if (!this._clouds)
                return;
            this._clouds.eachChilder(function (child) {
                child.x -= e.x;
            });
        };
        return FrontGround;
    })(game.SceneryGround);
    game.FrontGround = FrontGround;
    var FrontGroundClouds = (function (_super) {
        __extends(FrontGroundClouds, _super);
        function FrontGroundClouds() {
            _super.apply(this, arguments);
            this._propmax = 5;
        }
        FrontGroundClouds.prototype.preInitProps = function () {
            //trace(this._propmax);
            this._propmax = 5;
            this._propstexture = game.TextureRepository().get("fgcloud");
        };
        FrontGroundClouds.prototype.onCreateAProp = function (prop) {
            prop.texture = this._propstexture;
            //trace(prop.texture)
            prop.scaleToWidth(game.stage.width());
            //trace(prop.scale.x);
            //prop.visible = false;
        };
        return FrontGroundClouds;
    })(game.ParallaxObject);
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/4.
 */
var game;
(function (game) {
    var Curtain = (function () {
        function Curtain() {
            if (Curtain._instance) {
                warn("use Curtain.instance replace");
                return;
            }
            this._ele = alcedo.d$.query("#curtain")[0];
            this.lastwidth = this._ele.width();
            this.lastheight = this._ele.height();
            //trace(this.lastwidth,this._ele.width())
            this._ele.css({ width: 0, height: 0 });
        }
        Curtain.prototype.show = function (callback, thisObject, param) {
            var _this = this;
            this._ele.css({ width: this.lastwidth, height: this.lastheight });
            //trace("Curtain show",this.lastwidth,this.lastheight);
            if (!this._ele.hasClass("disactive")) {
                if (callback)
                    callback.apply(thisObject, param);
            }
            else {
                this._ele.then(function () {
                    _this._ele.removeClass("disactive");
                    _this._ele.then(function () {
                        if (callback)
                            callback.apply(thisObject, param);
                    });
                });
            }
        };
        Curtain.prototype.hide = function (callback, thisObject, param) {
            //this._ele.show();
            //trace("Curtain hided");
            var _this = this;
            this._ele.addClass("disactive");
            this._ele.then(function () {
                if (_this._ele.width() !== "0px" && _this._ele.width() !== "auto" && _this._ele.width() !== "0") {
                    _this.lastwidth = _this._ele.width();
                    _this.lastheight = _this._ele.height();
                }
                _this._ele.css({ width: 0, height: 0 });
                if (callback)
                    callback.apply(thisObject, param);
            });
        };
        Object.defineProperty(Curtain, "instance", {
            get: function () {
                if (this._instance)
                    return this._instance;
                this._instance = new Curtain();
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        return Curtain;
    })();
    game.Curtain = Curtain;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
var game;
(function (game) {
    var GameButton = (function (_super) {
        __extends(GameButton, _super);
        function GameButton(ele, texture) {
            var _this = this;
            _super.call(this, ele, texture);
            //this.width = texture._sourceWidth;
            this._com.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN, function () {
                _this._com.scale(0.8, 200);
            }, this);
            this._com.addEventListener(alcedo.dom.TouchEvent.TOUCH_END, function () {
                _this._com.scale(1, 100);
            }, this);
        }
        return GameButton;
    })(game.GameUIComponent);
    game.GameButton = GameButton;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/29.
 * gulp > <!a
 */
var game;
(function (game) {
    var MainManager = (function (_super) {
        __extends(MainManager, _super);
        function MainManager() {
            _super.apply(this, arguments);
        }
        MainManager.prototype.init = function (stage) {
            trace("game ready...");
            //TODO:游戏主函数
            this._stage = stage;
            //加载游戏主要管理模块
            alcedo.proxy(game.GameUIManager).init();
            alcedo.proxy(game.CameraManager).init(stage.camera());
            //me
            alcedo.proxy(game.AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE, this.onAssetLoaded, this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("demo/res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload", "bgcloud", "fgcloud", "levels", "character");
        };
        MainManager.prototype.onAssetLoaded = function () {
            this.background = new game.BackGround();
            game.stage.addChild(this.background);
            this.playground = new game.PlayGround();
            game.stage.addChild(this.playground);
            this.fronttground = new game.FrontGround();
            game.stage.addChild(this.fronttground);
            alcedo.proxy(game.LevelManager).init(this.playground);
            alcedo.proxy(game.GameUIManager).ready();
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["preto", { stateto: game.CmdCatalog.STATE_HELLO }]);
            //Curtain.instance.hide(()=>{
            //    alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_HELLO);
            //});
        };
        MainManager.instanceable = true;
        return MainManager;
    })(alcedo.AppProxyer);
    game.MainManager = MainManager;
    function MovieClipRepository() {
        return alcedo.proxy(alcedo.canvas.MovieClipRepository);
    }
    game.MovieClipRepository = MovieClipRepository;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/20.
 */
var game;
(function (game) {
    /**
     * 游戏状态控制器
     *
     */
    var GameSceneryControl = (function (_super) {
        __extends(GameSceneryControl, _super);
        function GameSceneryControl() {
            _super.call(this);
            this.addCmdHandler(game.CmdCatalog.RESET_SCENERY, this.cmdResetScenery);
        }
        GameSceneryControl.prototype.cmdResetScenery = function (x) {
            //trace(x);
            this.dispatchDemand(game.CmdCatalog.RESET_SCENERY, { x: x });
        };
        return GameSceneryControl;
    })(alcedo.AppCmder);
    game.GameSceneryControl = GameSceneryControl;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/20.
 */
var game;
(function (game) {
    game.world = {
        size: alcedo.canvas.Rectangle
    };
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/17.
 */
var game;
(function (game) {
    /**
     * 游戏加载界面
     */
    var LoadingScreen = (function (_super) {
        __extends(LoadingScreen, _super);
        function LoadingScreen() {
            _super.apply(this, arguments);
        }
        LoadingScreen.prototype.active = function (callback, thisObject) {
            _super.prototype.active.call(this);
            //callback.apply(thisObject);
        };
        LoadingScreen.prototype.disactive = function (callback, thisObject) {
            _super.prototype.disactive.call(this, callback);
            callback.apply(thisObject);
        };
        return LoadingScreen;
    })(game.GameScreen);
    game.LoadingScreen = LoadingScreen;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/6.
 */
var game;
(function (game) {
    /**
     * 游戏结束界面
     */
    var OverScreen = (function (_super) {
        __extends(OverScreen, _super);
        function OverScreen() {
            _super.apply(this, arguments);
        }
        OverScreen.prototype.init = function () {
            this.screen.hide();
            this._tohomebtn = new game.GameButton(this.screen.find(".btn.tohome")[0], game.TextureRepository().get("homebtn"));
            //this._tohomebtn.e.transition = 260;
            this._tohomebtn.e.css({ top: alcedo.px(game.stageSize().height + 100) });
            this._restartbtn = new game.GameButton(this.screen.find(".btn.restart")[0], game.TextureRepository().get("restartbtn"));
            //this._restartbtn.e.transition = 260;
            this._restartbtn.e.css({ top: alcedo.px(game.stageSize().height + 100) });
            //this.screen.addClass("disactive");
            this.screen.show();
            this.resize();
        };
        OverScreen.prototype.active = function () {
            var _this = this;
            _super.prototype.active.call(this);
            //this.screen.show();
            //this.screen.removeClass("disactive");
            this._restartbtn.e.to({ top: alcedo.percent(48) }, 360).then(function () {
                _this._restartbtn.e.to({ top: alcedo.percent(52) }, 360).then(function () {
                    _this._restartbtn.e.to({ top: alcedo.percent(50) }, 360);
                });
                _this._tohomebtn.e.to({ top: alcedo.percent(48) }, 360).then(function () {
                    _this._tohomebtn.e.to({ top: alcedo.percent(52) }, 360).then(function () {
                        _this._tohomebtn.e.to({ top: alcedo.percent(50) }, 360);
                        _this.enableTouch(true);
                    });
                });
            });
        };
        OverScreen.prototype.disactive = function (callback, thisObject) {
            var _this = this;
            _super.prototype.disactive.call(this, callback, thisObject);
            this._tohomebtn.e.to({ top: alcedo.px(game.stageSize().height + 100) }, 260).then(function () {
                _this._restartbtn.e.to({ top: alcedo.px(game.stageSize().height + 100) }, 260).then(function () {
                    //this.screen.hide();
                    _this.enableTouch(false);
                    callback.apply(thisObject);
                });
            });
        };
        OverScreen.prototype.enableTouch = function (boo) {
            if (boo === void 0) { boo = true; }
            if (boo) {
                this._restartbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toReStart, this);
                this._tohomebtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toHome, this);
            }
            else {
                this._restartbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toReStart, this);
                this._tohomebtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toHome, this);
            }
        };
        OverScreen.prototype.toHome = function () {
            alcedo.dispatchCmd(game.GameStateControl, game.CmdCatalog.STATE_RESET_TO_HELLO);
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["preto", { stateto: game.CmdCatalog.STATE_HELLO }]);
            //this._restartbtn.e.then(()=>{
            //    //todo:alcedo.dispatchCmd(RESTART)
            //
            //})
        };
        OverScreen.prototype.toReStart = function () {
            alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["preto", { stateto: game.CmdCatalog.STATE_PREPARE_PLAY }]);
            //this._restartbtn.e.then(()=>{
            //    //todo:alcedo.dispatchCmd(RESTART)
            //
            //})
        };
        return OverScreen;
    })(game.GameScreen);
    game.OverScreen = OverScreen;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/14.
 */
var game;
(function (game) {
    /**
     * 游戏界面
     */
    var PlayingScreen = (function (_super) {
        __extends(PlayingScreen, _super);
        function PlayingScreen() {
            _super.apply(this, arguments);
        }
        PlayingScreen.prototype.init = function () {
            game.stage.addEventListener(alcedo.canvas.TouchEvent.TOUCH_BEGIN, this.onCanvasTouchBegin, this);
            game.stage.addEventListener(alcedo.canvas.TouchEvent.TOUCH_END, this.onCanvasTouchEnd, this);
        };
        PlayingScreen.prototype.active = function () {
            trace("Playing...");
            //TODO:计分面板
            //TODO:点击控制器
            this._canvastouchable = true;
            alcedo.dispatchCmd(game.GameStateControl, game.CmdCatalog.STATE_START_PLAYING);
        };
        PlayingScreen.prototype.onCanvasTouchBegin = function () {
            if (!this._canvastouchable)
                return;
            alcedo.dispatchCmd(game.GameControl, game.CmdCatalog.CTR_FLY_BEGIN);
            //trace("hi")
        };
        PlayingScreen.prototype.onCanvasTouchEnd = function () {
            if (!this._canvastouchable)
                return;
            alcedo.dispatchCmd(game.GameControl, game.CmdCatalog.CTR_FLY_RELEASE);
            //trace("bye")
        };
        PlayingScreen.prototype.disactive = function (callback, thisObject) {
            //TODO:关闭点击控制器
            this._canvastouchable = false;
            callback.apply(thisObject);
        };
        return PlayingScreen;
    })(game.GameScreen);
    game.PlayingScreen = PlayingScreen;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/5/3.
 */
var game;
(function (game) {
    /**
     * 游戏预备界面
     */
    var PretoScreen = (function (_super) {
        __extends(PretoScreen, _super);
        function PretoScreen() {
            _super.apply(this, arguments);
        }
        PretoScreen.prototype.init = function () {
        };
        PretoScreen.prototype.active = function (data) {
            _super.prototype.active.call(this, data);
            trace("PretoScreen active");
            game.Curtain.instance.show(function () {
                if (data.stateto) {
                    alcedo.dispatchCmd(game.GameStateControl, data.stateto);
                }
            });
        };
        PretoScreen.prototype.disactive = function (callback, thisObject) {
            _super.prototype.disactive.call(this, callback);
            game.Curtain.instance.hide(function () {
                callback.apply(thisObject);
            });
        };
        return PretoScreen;
    })(game.GameScreen);
    game.PretoScreen = PretoScreen;
})(game || (game = {}));
/**
 * Created by tommyZZM on 2015/4/14.
 */
var game;
(function (game) {
    /**
     * 游戏开始界面
     */
    var StartScreen = (function (_super) {
        __extends(StartScreen, _super);
        function StartScreen() {
            _super.apply(this, arguments);
        }
        StartScreen.prototype.init = function () {
            this.screen.hide();
            this._title = new game.GameUIComponent(this.screen.find(".title")[0], game.TextureRepository().get("title"));
            this._title.e.css({ "margin-top": alcedo.px(-100) });
            this._title.width = game.stageSize().height * 0.9;
            this._startbtn = new game.GameButton(this.screen.find(".btn.startgame")[0], game.TextureRepository().get("startbtn"));
            this._aboutbtn = new game.GameButton(this.screen.find(".btn.about")[0], game.TextureRepository().get("aboutbtn"));
            this._startbtn.e.css({ top: alcedo.px(game.stageSize().height) }).hide();
            this._aboutbtn.e.css({ top: alcedo.px(game.stageSize().height) }).hide();
            this.screen.show();
            this.resize();
        };
        StartScreen.prototype.active = function () {
            var _this = this;
            _super.prototype.active.call(this);
            //trace("start active");
            //TODO:why?where? why need then
            this._title.e.show().to({ "margin-top": alcedo.px(game.stageSize().height * 0.08) }, 360).then(function () {
                //trace("transionend",this.screen.index(),this._startbtn.e);
                _this._startbtn.e.show().to({ top: alcedo.percent(48) }, 360).then(function () {
                    //trace("transionend", this.screen.index());
                    _this._startbtn.e.to({ top: alcedo.percent(52) }, 320).then(function () {
                        _this._startbtn.e.to({ top: alcedo.percent(50) }, 300);
                        _this.enableTouch();
                        //trace(this.className, "actived", this.screen.index())
                    });
                    _this._aboutbtn.e.show().to({ top: alcedo.percent(78) }, 320);
                });
            });
        };
        StartScreen.prototype.disactive = function (callback, thisObject) {
            _super.prototype.disactive.call(this, callback, thisObject);
            this.enableTouch(false);
            this._title.e.to({ "margin-top": alcedo.px(-this._title.height) }, 320);
            this._startbtn.e.to({ top: alcedo.px(game.stageSize().height + 50) }, 320);
            this._aboutbtn.e.to({ top: alcedo.px(game.stageSize().height + 50) }, 300).then(function () {
                //this.screen.hide();
                callback.apply(thisObject);
            });
        };
        StartScreen.prototype.enableTouch = function (boo) {
            if (boo === void 0) { boo = true; }
            if (boo) {
                this._startbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toStart, this);
                this._aboutbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toAbout, this);
            }
            else {
                this._startbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toStart, this);
                this._aboutbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.toAbout, this);
            }
        };
        StartScreen.prototype.toStart = function () {
            this._startbtn.e.then(function () {
                trace("toStart");
                alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["preto", { stateto: game.CmdCatalog.STATE_PREPARE_PLAY }]);
            });
        };
        StartScreen.prototype.toAbout = function () {
            this._aboutbtn.e.then(function () {
                trace("toAbout");
                alcedo.dispatchCmd(game.ScreenControl, game.CmdCatalog.TO_SCREEN, ["about"]);
            });
        };
        StartScreen.prototype.resize = function () {
            //this._title.width = stageSize().height*0.9;
            //if(this._isactive){
            //    this._title.e.to({"margin-top":alcedo.px(stageSize().height*0.08)},360)
            //}else{
            //    this._title.e.to({"margin-top":alcedo.px(-this._title.height)},260);
            //}
        };
        return StartScreen;
    })(game.GameScreen);
    game.StartScreen = StartScreen;
})(game || (game = {}));
