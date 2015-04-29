/**
 * Created by tommyZZM on 2015/4/9.
 */
module alcedo {
    export module net {
        export class AsyncRESEvent extends Event{
            public static ASSETS_COMPLETE:string = "AsyncAssetsEvent_LOAD_COMPLETE";
            public static ASSETS_PROGRESSING:string = "AsyncAssetsEvent_LOAD_ASSETS_PROGRESSING";
        }

        export class AsyncRES extends AppProxyer {
            private static instanceable:boolean = true;

            private _repeatkey;
            private _assetspool:Dict;

            public constructor() {
                super();
                this._assetspool = new Dict();
                this._repeatkey = {};
            }

            set(key:any, value:any):any {
                if (this._assetspool.has(key)) {
                    var tmp = this._assetspool.get(key);
                    if (Array.isArray(tmp)) {
                        tmp.push(value);
                        this._assetspool.set(key, tmp);
                    }
                } else {
                    this._assetspool.set(key, [value]);
                }
            }

            get(key:any):any {
                return this._assetspool.get(key);
            }

            get assets():Array<any>{
                return this._assetspool.values;
            }

            get keys():Array<any>{
                return this._assetspool.keys;
            }

        }
        //export var AsyncRES:any = AsyncAssetsRepository;
    }
}