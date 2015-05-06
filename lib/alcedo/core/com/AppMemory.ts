/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppMemory{
        private _memorypool:Dict;

        public constructor(){
            this._memorypool = new Dict();
        }

        public active(memory:any){
            if(!isOfClass(memory,AppMemoryUnit))return;

            if(!this._memorypool.has(getClassName(memory))){
                this._memorypool.set(getClassName(memory),memory)
            }else{
                warn(getClassName(memory),"already active",this._memorypool.get(getClassName(memory)));
            }
        }

        public memory(memory:any):any{
            var m = this._memorypool.get(getClassName(memory));
            if(!m){
                warn("Memory NOT FOUND!");
            }
            return m;
        }

        public reset(memory:any):any{
            var m:AppMemoryUnit = this._memorypool.get(getClassName(memory));
            m.reset();
        }

        private static _instance:AppMemory;
        public static get instance():AppMemory{
            if (this._instance == null) {
                this._instance = new AppMemory();
            }
            return this._instance;
        }
    }

    export class AppMemoryUnit {
        init(...arg){}
        reset(){}
    }
}