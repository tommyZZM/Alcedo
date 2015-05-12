/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo{
    export var isdebug = false;

    export function proxy(proxy:any,proxyid?:string):AppProxyer|any{
        return AppFacade.instance.proxy(proxy,proxyid);
    }

    export function dispatchCmd(command:any,cmd:string, courier:Array<any> = []):void{
        AppFacade.instance.dispatchCmd(command, cmd, courier)
    }

    export function addDemandListener(com:any, type:string, callback:Function, thisObject:any):boolean {
        return AppFacade.instance.addDemandListener(com, type, callback, thisObject)
    }

    var _facadeinittask:Array<any> = [];
    export function addFacadeInitTask(fn,thisObject?,param?:Array<any>){
        _facadeinittask.push({callback:fn,thisObject:thisObject,param:param});
    }

    export class AppFacade extends EventDispatcher{
        public static ON_INIT:string = "AppFacadeCreate";

        private _app:AppCycler;

        private _cmdpool:Dict;//Map<string,GameCmder>;//存放所有命令
        private _proxypool:Dict;//Map<string,GameProxyer>;//存放所有业务逻辑

        private _postman:FacadeEvent;
        private _postals:Dict;//Map<NotifyType, Map<string,{thisobj:any; callback: Function}>>;

        public constructor() {
            super();
            if (AppFacade._instance != null) {
                //console.error(core.log_code(1001))
            }

            this._cmdpool = new Dict();
            this._proxypool = new Dict();
            this._postals = new Dict();

            this._postman = new FacadeEvent();
            this.addEventListener(FacadeEvent.UNIQUE,this._postOffice,this);
        }

        private init(){
            this.notifyArray(_facadeinittask);
        }

        public set app(cycler:AppCycler){
            if(!this._app){
                this._app = cycler;
            }else{
                warn("cycler already init");
            }
        }

        public get app():AppCycler{
            return this._app
        }

        public get postals():Dict{
            return this._postals
        }

        //邮局
        private _postOffice(e:FacadeEvent){
            if(!this._postals.has(e.com)){
                this._postals.set(e.com,new Dict());
            }
            var ant:any = this._postals.get(e.com).get(e.notify);
            if(ant && ant.callback && ant.thisobj){ant.callback.apply(ant.thisobj,e.courier);}
        }

        private static _proxycound:number = 0;
        public proxy(proxy:any,proxyid?:string):AppProxyer|any {
            if (isOfClass(proxy, AppProxyer)){
                if(!proxy.prototype.alproxyid){
                    AppFacade._proxycound++;
                    proxy.prototype.alproxyid = AppFacade._proxycound;
                }

                var proxyname = getClassName(proxy)+"_"+proxy.prototype.alproxyid;
                var result = this._proxypool.get(proxyname);
                if (proxy.instanceable === true){
                    if(!result){
                        this._proxypool.set(proxyname,new proxy());
                    }
                    return this._proxypool.get(proxyname);
                }else if(proxyid){
                    var proxydict = this._proxypool.get(proxyname);
                    if (!proxydict || !(proxydict instanceof Dict)) {
                        this._proxypool.set(proxyname, new Dict())
                    }
                    if(!this._proxypool.get(proxyname).has(proxyid)){
                        this._proxypool.get(proxyname).set(proxyid, new proxy());
                    }
                    return this._proxypool.get(proxyname).get(proxyid);
                }else{
                    error("Are you want a instanceable proxy? proxy.instanceable==undefined");
                    return null;
                }
            }else{
                error(proxy,proxyid,"select fail!");return null;
            }
            //return this._proxypool.get(<string>proxyid)
        }

        /**
         * 获得command的唯一id
         * @type {number}
         * @private
         */
        private static _commandcound:number = 0;
        public static getCommandId(command) {
            var idc;
            if(isOfClass(command,AppCmder)){
                if (!command.prototype.alcmdid) {
                    AppFacade._commandcound++;
                    command.prototype.alcmdid = AppFacade._commandcound;
                }
                idc = command.prototype.alcmdid;
            }else if(command instanceof AppCmder){
                if (!command["__proto__"].alcmdid) {
                    AppFacade._commandcound++;
                    command["__proto__"].alcmdid = AppFacade._commandcound;
                }
                idc = command["__proto__"].alcmdid
            }else{
                return undefined;
            }

            return getClassName(command)+"_"+idc;
        }
        private command(command:any):any{
            if(command instanceof AppCmder){return command}
            var commandname = AppFacade.getCommandId(command);
            if(isOfClass(command,AppCmder)) {//c instanceof instance
                if(commandname==AppFacade.getCommandId(AppCmder)){return;}
                if(!this._cmdpool.get(commandname)){
                    if(isOfClass(command,AppCmder)){//c instanceof instance
                        var c = new command();
                        this._cmdpool.set(commandname,c);
                    }else{
                        console.error(command,"is not of",getClassName(AppCmder))
                    }
                }
                return this._cmdpool.get(commandname);
            }
        }

        public dispatchCmd(command:any,cmd:string, courier:Array<any> = []){
            if(AppFacade.getCommandId(command)==AppFacade.getCommandId(AppCmder)){return;}
            if(!(command instanceof AppCmder))this.command(command);
            this._postman.setNotify(command,cmd,courier);
            this.dispatchEvent(this._postman);
        }

        public addDemandListener(com:any,type: string, callback: Function,thisObject: any):boolean{
            if(com instanceof AppProxyer){
                com.addEventListener(type,callback,thisObject);
                return true;
            }
            if(isOfClass(com,AppCmder)){
                var c:AppCmder = this.command(com);
                c.addEventListener(type,callback,thisObject);
                return true;
            }
            return false;
        }

        //instance mode
        private static _instance:AppFacade;
        public static get instance():AppFacade{
            if (!AppFacade._instance) {
                AppFacade._instance = new AppFacade();
                AppFacade._instance.init();
            }
            //if(this._instance['_game'] && this._instance['_display']){this._instance['_isinit'] = true;}
            return AppFacade._instance;
        }
    }
}