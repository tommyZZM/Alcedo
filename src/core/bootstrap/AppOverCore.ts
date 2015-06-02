/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo{
    export var a$:any;

    export var isdebug = false;

    /**
     * 获得一个业务核心
     * @param core
     * @returns {undefined|*|null|null}
     * @param name
     */
    export function core(core:any,name?:string):any|AppSubCore{
        return a$.core(core,name);
    }

    /**
     * 向指定业务核心发布一个命令
     * @param core
     * @param cmd
     * @param courier
     */
    export function dispatchCmd(core:any,cmd:string, courier:any={}):void{
        a$.dispatchCmd(core, cmd, courier)
    }


    /**
     * 业务核心管理器
     */
    class AppOverCore extends EventDispatcher{
        private _subcore:Dict;

        private _cmdpool:Dict;//Map<string,GameCmder>;//存放所有命令
        private _proxypool:Dict;//Map<string,GameProxyer>;//存放所有业务逻辑

        private _postman:FacadeEvent;
        private _postals:Dict;//Map<NotifyType, Map<string,{thisobj:any; callback: Function}>>;

        public constructor() {
            super();
            if (AppOverCore._instance != null) {
                //console.error(core.log_code(1001))
            }

            this._subcore = new Dict();

            this._cmdpool = new Dict();
            this._proxypool = new Dict();
            this._postals = new Dict();

            this._postman = new FacadeEvent();
            this.addEventListener(FacadeEvent.UNIQUE,this._postOffice,this);
        }

        private init(){}

        public get postals():Dict{
            return this._postals
        }

        //邮局，传递子系统中的消息
        private _postOffice(e:FacadeEvent){
            if(!this._postals.has(e.core)){
                this._postals.set(e.core,new Dict());
            }
            var ant:any = this._postals.get(e.core).get(e.notify);
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

                var result = this._proxypool.get(corename);
                if (core.instanceable === true || !name){
                    if(!result){
                        this._proxypool.set(corename,new core());
                    }
                    return this._proxypool.get(corename);
                }else if(name){
                    var proxydict = this._proxypool.get(corename);
                    if (!proxydict || !(proxydict instanceof Dict)) {
                        this._proxypool.set(corename, new Dict())
                    }
                    if(!this._proxypool.get(corename).has(name)){
                        this._proxypool.get(corename).set(name, new core());
                    }
                    return this._proxypool.get(corename).get(name);
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
        public dispatchCmd(core:any|AppSubCore,cmd:string, courier:any = {}){
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