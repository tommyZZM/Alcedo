/**
 * Created by tommyZZM on 2015/5/16.
 */
//���ཫȡ��AppCycle��AppProxyer
module alcedo{
    export class AppSubCore extends EventDispatcher{

        private static uncreateable:boolean = true;

        public constructor(){
            super();
        }

        public startUp(...anyarg){
            //��ϵͳ����
        }

        public shutDown(...anyarg){
            //��ϵͳ�ر�
        }

        protected addCmdHandler(notify: string, callback: Function):void{
            if(!_AppOverCore.instance.postals.has(_AppOverCore.getCoreFullName(this))){
                _AppOverCore.instance.postals.set(_AppOverCore.getCoreFullName(this),new Dict())
            }
            _AppOverCore.instance.postals.get(_AppOverCore.getCoreFullName(this)).set(notify,{thisobj:this, callback: callback});
        }

        protected removeCmdHandler(notify: string, callback: Function):void{
            if(!_AppOverCore.instance.postals.has(_AppOverCore.getCoreFullName(this))){
                return;
            }
            _AppOverCore.instance.postals.get(_AppOverCore.getCoreFullName(this)).delete(notify);
        }

        protected dispatchDemand(event:string, courier?:any){
            this.emit(event,courier)
        }
    }
}