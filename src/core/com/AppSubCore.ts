/**
 * Created by tommyZZM on 2015/5/16.
 */
//取代AppCycle和AppProxyer
module alcedo{
    export class AppSubCore extends EventDispatcher{

        //private static uncreateable:boolean = true;

        public constructor(){
            super();
            var _startup:any = this.startUp;
            _startup.started = false;
            this.startUp = (...anyarg)=>{
                if(_startup.started)return;
                _startup.apply(this,anyarg);
                _startup.started = true;
            }
        }

        public startUp(...anyarg){
            //启动
        }

        public shutDown(...anyarg){
            //关闭
        }

        protected addCmdHandler(notify: string, callback: Function):void{
            if(!alcedo["@AppOverCore"].instance.postals.has(alcedo["@AppOverCore"].getCoreFullName(this))){
                alcedo["@AppOverCore"].instance.postals.set(alcedo["@AppOverCore"].getCoreFullName(this),new Dict())
            }
            alcedo["@AppOverCore"].instance.postals.get(alcedo["@AppOverCore"].getCoreFullName(this)).set(notify,{thisobj:this, callback: callback});
        }

        protected removeCmdHandler(notify: string, callback: Function):void{
            if(!alcedo["@AppOverCore"].instance.postals.has(alcedo["@AppOverCore"].getCoreFullName(this))){
                return;
            }
            alcedo["@AppOverCore"].instance.postals.get(alcedo["@AppOverCore"].getCoreFullName(this)).delete(notify);
        }

        protected dispatchDemand(event:string, courier?:any){
            this.emit(event,courier)
        }
    }
}