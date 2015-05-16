/**
 * Created by tommyZZM on 2015/4/9.
 */
/*
module alcedo{
    /!**
     * 异步流程控制,beta版
     *!/
    export class AsyncQuener extends AppObject implements ICycable{

        private _querycount:Array<number>;
        private _query:Array<Array<any>>;

        public constructor(){
            super()
        }

        private finishmark = "_____finish";
        private prepush(fns:any){
            var fnarr=[],fn:Function,_fn:Function;
            var index = this._query.length;

            for(var i in fns){
                fn = fns[i];
                //console.log(fn);
                if(fn instanceof Function){
                    _fn = expandMethod(fn,()=>{
                        arguments.callee["_origin"]();
                        this.check2next(arguments.callee["_index"])
                    });
                    _fn["_index"] = index;
                    fns[i] = _fn;
                    fnarr.push(_fn);
                }
            }
            this.push(fnarr);
        }

        private push(fnarr:Array<Function>){
            this._querycount.push(fnarr.length);
            this._query.push(fnarr);
        }

        private check2next(index:number){
            if(this._querycount[index]){
                this._querycount[index]--;
                if(this._querycount[index]==0){
                    if(this._query[index+1]){
                        var length = this._query[index+1].length;
                        for(var i=0;i<length;i++){
                            var fn = this._query[index+1][i];
                            fn();
                        }
                    }else{
                        this.end()
                    }
                }
            }else{
                this.end()
            }
        }

        public static begin(fns:any):AsyncQuener{
            var quener:AsyncQuener = <any>((<AppObjectPool>proxy(AppObjectPool)).new(AsyncQuener));
            quener.prepush(fns);
            return quener;
        }

        public then(fns:Array<Function>|Function){
            if(fns instanceof Function){fns = <any>[fns]}
            this.prepush(fns);
            return this;
        }

        private end(){
            (<AppObjectPool>proxy(AppObjectPool)).destory(this)
        }

        public onCreate(){
            this._query = [];
            this._querycount = [];
        }
        public onDestory(){
            this._query = [];
            this._querycount = [];
        }
    }
}*/
