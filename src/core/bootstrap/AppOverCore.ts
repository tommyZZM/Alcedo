/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo{
    //export var a$:any;

    export var isdebug = false;

    /**
     * 获得一个业务核心
     * @param core
     * @returns {undefined|*|null|null}
     * @param name
     */
    export function core(core:any,name?:string):any|AppSubCore{
        return alcedo["@AppOverCore"].instance.core(core,name);
    }

    /**
     * 向指定业务核心发布一个命令
     * @param core
     * @param cmd
     * @param courier
     */
    export function dispatchCmd2Core(core:any,cmd:string, courier:any={}):void{
        alcedo["@AppOverCore"].instance.dispatchCmd2Core(core, cmd, courier)
    }

    /**
     * 发布一个命令(所有业务核心)
     * @param cmd
     * @param courier
     */
    export function dispatchCmd(cmd:string, courier:any={}):void{
        var a$:any = alcedo["@AppOverCore"].instance;
        var cores = a$._proxypool.values;
        for(var i=0;i<cores.length;i++){
            var core = cores[i];
            if(core instanceof AppSubCore){
                a$.dispatchCmd2Core(core, cmd, courier)
            }else if(core["$subcoredict"]){
                var brothercores = core[i].values;
                for(var j=0;j<brothercores.length;j++){
                    var brothercore = brothercores[j];
                    if(brothercore instanceof AppSubCore){
                        a$.dispatchCmd2Core(brothercore, cmd, courier)
                    }
                }
            }
        }
    }

    /**
     * 广播
     */
    export function dispatchBoardCast(boardcast:string, courier:any={}){
        var a$:any = alcedo["@AppOverCore"].instance;
        AppNotifyable.notify(a$._boardCastMap,boardcast,[courier])
    }

    /**
     * 广播侦听
     */
    export function addBoardCastListener(boardcast:string, listener:Function, thisObject:any,priority?:number){
        var a$:any = alcedo["@AppOverCore"].instance;
        AppNotifyable.registNotify(a$._boardCastMap,boardcast,listener,thisObject,null,priority);
    }

    /**
     * 业务核心管理器
     */
    class AppOverCore extends EventDispatcher{
        private _subcore:any;

        //private _cmdpool:any;//Map<string,GameCmder>;//存放所有命令
        //private _proxypool:any;//Map<string,GameProxyer>;//存放所有业务逻辑

        private _postman:FacadeEvent;
        private _postals:any;//Map<NotifyType, Map<string,{thisobj:any; callback: Function}>>;

        private _boardCastMap:any;

        public constructor() {
            super();
            if (AppOverCore._instance != null) {
                //console.error(core.log_code(1001))
            }

            this._subcore = {};

            this._postals = {};
            this._boardCastMap = {};

            this._postman = new FacadeEvent();
            this.addEventListener(FacadeEvent.UNIQUE,this._postOffice,this);
        }

        private init(){}

        public get postals():any{
            return this._postals
        }

        //邮局，传递子系统中的消息
        private _postOffice(e:FacadeEvent){
            if(!this._postals[e.core]){
                this._postals[e.core] = {};
            }
            var ant:any = this._postals[e.core][e.notify];
            if(ant && ant.callback && ant.thisobj){ant.callback.apply(ant.thisobj,[e.courier]);}
        }

        //获得一枚业务核心
        private static _subcoreid:number = 0;
        public core(core:any,name?:string){
            if (isOfClass(core, AppSubCore)){
                if(core === AppSubCore){
                    error(core,"could be select");
                    return;
                }
                var corename = getClassName(core)+"_"+AppOverCore.getCoreId(core);

                var result = this._subcore[corename];
                if (core.instanceable === true || !name){
                    if(!result){
                        this._subcore[corename]=new core();
                    }
                    return this._subcore[corename];
                }else if(name){
                    var proxydict = this._subcore[corename];
                    if (!proxydict || !proxydict["$subcoredict"]) {
                        this._subcore[corename]={};
                        this._subcore[corename]["$subcoredict"] = true;
                    }
                    if(!this._subcore[corename][name]){
                        this._subcore[corename][name]=new core();
                    }
                    return this._subcore[corename][name];
                }else{
                    error("Are you want a instanceable core? create a static var instanceable==true");
                    return null;
                }
            }else{
                error(core,name||"","select fail!");return null;
            }
        }

        //获得业务核心的唯一ID
        private static getCoreId(core):any{
            var id;
            if(isOfClass(core,AppSubCore)){
                if(core.uncreateable)return 0;
                if(!core.prototype.___coreid){
                    this._subcoreid++;
                    core.prototype.___coreid = this._subcoreid;
                }
                id = core.prototype.___coreid;
            }else if(core instanceof AppSubCore){
                if (!core["__proto__"].___coreid) {
                    this._subcoreid++;
                    core["__proto__"].___coreid = this._subcoreid;
                }
                id = core["__proto__"].___coreid
            }
            return id;
        }

        //获得业务核心全名
        public static getCoreFullName(core):string{
            if(isOfClass(core,AppSubCore) || core instanceof AppSubCore){
                return getClassName(core)+"_"+this.getCoreId(core);
            }
        }

        //发布命令给业务核心
        private dispatchCmd2Core(core:any|AppSubCore,cmd:string, courier:any = {}){
            if(!(core instanceof AppSubCore))this.core(core);
            courier._cmd = cmd;
            this._postman.setNotify(core,cmd,courier);
            this.dispatchEvent(this._postman);
        }

        //instance mode
        private static _instance:AppOverCore;
        public static get instance():AppOverCore{
            if (!AppOverCore._instance) {
                AppOverCore._instance = new AppOverCore();
                AppOverCore._instance.init();
            }
            return AppOverCore._instance;
        }
    }
    alcedo["@AppOverCore"] = AppOverCore;
}