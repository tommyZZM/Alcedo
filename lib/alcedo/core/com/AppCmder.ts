/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppCmder extends EventDispatcher{

        public constructor(){
            super();
        }

        protected addCmdHandler(notify: string, callback: Function):void{
            if(!AppFacade.instance.postals.has(AppFacade.getCommandId(this))){
                AppFacade.instance.postals.set(AppFacade.getCommandId(this),new Dict())
            }
            AppFacade.instance.postals.get(AppFacade.getCommandId(this)).set(notify,{thisobj:this, callback: callback});
        }

        protected dispatchDemand(event:string, courier?:any){
            this.emit(event,courier)
        }
    }
}