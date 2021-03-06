/**
 * Created by tommyZZM on 2015/4/9.
 */
module alcedo {
    export module canvas {
        export class TextureRepository extends AppSubCore {
            private static instanceable:boolean = true;

            public static ASSETS_COMPLETE:string = "TextureRepository_LOAD_COMPLETE";
            public static ASSETS_PROGRESSING:string = "TextureRepository_LOAD_ASSETS_PROGRESSING";

            private _repeatkey;
            private _texurespool:Dict;

            public constructor(){
                super();
                this._texurespool = new Dict();
                this._repeatkey = {};
            }

            set(key:string,value:Texture){
                this._texurespool.set(key,value);
            }

            get(key:string): Texture{
                //trace(a$.proxy(net.AsyncRES))
                if(!this._texurespool.has(key)){
                    if(core(net.AsyncRES).get(key) && core(net.AsyncRES).get(key)[0] instanceof HTMLImageElement){
                        var img = core(net.AsyncRES).get(key)[0];
                        var texture = new Texture(img);
                        this._texurespool.set(key,texture);
                    }
                }
                return this._texurespool.get(key);
            }

            find(reg:RegExp):Array<any>{
                var i,keys = core(net.AsyncRES).keys,
                    result = [];
                for(i=0;i<keys.length;i++){
                    if(reg.test(keys[i])){
                        if(this.get(keys[i]))result.push(this.get(keys[i]))
                    }
                }
                return result;
            }
        }
        //export var TextureRES:any = TextureRepository;
    }
}