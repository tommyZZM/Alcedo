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
                console.error(core.log_code(1001))
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

        public proxy(proxy:any,proxyid?:string):AppProxyer|any {
            if (isOfClass(proxy, AppProxyer)){
                if (proxy.instanceable === true) {
                    if (!this._proxypool.has(getClassName(proxy))) {
                        this._proxypool.set(getClassName(proxy), new proxy())
                    }
                    return this._proxypool.get(getClassName(proxy))
                }else{
                    if(proxyid){
                        if (!this._proxypool.has(getClassName(proxy))) {
                            this._proxypool.set(getClassName(proxy), new Dict())
                        }
                        if(!this._proxypool.get(getClassName(proxy)).has(proxyid)){
                            this._proxypool.get(getClassName(proxy)).set(proxyid, new proxy());
                        }
                        return this._proxypool.get(getClassName(proxy)).get(proxyid);
                    }
                    error("Are you want a instanceable proxy? proxy.instanceable==undefined");return null;
                }
            }else{
                error(proxyid,"select fail!");return null;
            }
            //return this._proxypool.get(<string>proxyid)
        }

        private command(command:any):any{
            if(getClassName(command)==getClassName(AppCmder)){return;}
            var key = command.prototype['__class__'];
            if(!this._cmdpool.get(key)){
                if(isOfClass(command,AppCmder)){//c instanceof instance
                    var c = new command();
                    this._cmdpool.set(key,c);
                }else{
                    console.error(getClassName(command),"is not of",getClassName(AppCmder))
                }
            }
            return this._cmdpool.get(key);
        }

        public dispatchCmd(command:any,cmd:string, courier:Array<any> = []){
            if(getClassName(command)==getClassName(AppCmder)){return;}
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