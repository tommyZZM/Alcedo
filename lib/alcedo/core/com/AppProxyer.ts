/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppProxyer extends EventDispatcher{
        //instanceable ?

        public constructor(){
            super()
        }

        public init(...anyarg){
            //as constructor for AppProxyer
        }

        protected dispatchDemand(event:string, courier?:any){
            this.emit(event,courier)
        }
    }
}