/**
 * Created by tommyZZM on 2015/4/9.
 */
/*
module alcedo{
    /!**
     * objectpool => class [name] if(cyclable) =>{active:[],disactive:[]}
     *!/
    export class AppObjectPool extends AppProxyer{
        private static instanceable = true;

        private _objectpool:any;

        public constructor(){
            super();
            this._objectpool = {active:new Dict(),disactive:new Dict()};
        }

        public new(objclass:any){//,createmethod?:Function
            var results,result:ICycable,name = getClassName(objclass);
            if(name){
                if(!this._objectpool.disactive.get(name))this._objectpool.disactive.set(name,[]);
                if(!this._objectpool.active.get(name))this._objectpool.active.set(name,[]);

                results = this._objectpool.disactive.get(name);
                if(results.length>=1){
                    result = results.splice(0,1);
                    this._objectpool.disactive.set(name,results);
                }else{
                    //if(createmethod){result = createmethod}
                    result = new objclass();
                    if(!result.onCreate&&result.onDestory){
                        warn("AppObjectPool only accept ICycable object");
                        return;
                    }
                }
                this._objectpool.active.get(name).push(result);
                result.onCreate();
                //trace(this._objectpool);
                return result;
            }else{
                return null;
            }
        }

        public destory(obj:ICycable){
            var objindex,name = getClassName(obj);
            if(!this._objectpool.disactive.get(name))return;
            if(!this._objectpool.active.get(name))return;

            var activepool = this._objectpool.active.get(name);
            objindex = activepool.indexOf(obj);
            if(objindex>=0){
                activepool.splice(objindex,1);
                this._objectpool.active.set(name,activepool);
                this._objectpool.disactive.get(name).push(obj);
                obj.onDestory();
                //trace(this._objectpool);
            }
        }
    }
}*/
