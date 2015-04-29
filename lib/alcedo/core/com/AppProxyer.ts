/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppProxyer extends EventDispatcher{
        //instanceable ?

        public constructor(){
            super()
        }

        protected _inted:boolean;
        public init(...anyarg){
            //as constructor for AppProxyer
            this._inted =true;
        }

        protected dispatchDemand(event:string, courier?:any){
            this.emit(event,courier)
        }
    }
}