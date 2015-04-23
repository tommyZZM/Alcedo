/**
 * Created by tommyZZM on 2015/4/22.
 */
module alcedo {
    export module canvas {
        export class MovieClipRepository extends AppProxyer {
            private instanceable:boolean = true;

            private _movieclipdataspool:Dict;

            public constructor(){
                super();
                this._movieclipdataspool = new Dict();
            }

            /**
             * 解析MovieClipData并存入仓库
             * @param dataset
             * @param sheet
             */
            public praseMovieClipData(dataset?:any, sheettexture:Texture){
                if(!dataset.mc)return;//invalid foramt

                if(dataset.res && sheettexture){//
                    var _tmpsheetdata = this.praseSheetData(dataset.res,new SpriteSheet(sheettexture))
                }

                for(var name in dataset.mc){
                    if(typeof name == "string"){
                        var moveclip:MovieClipData,frames = [],
                            moveclipdata = dataset.mc[name];
                        if(!this._movieclipdataspool.has(name) && Array.isArray(moveclipdata.frames)) {
                            moveclip = new MovieClipData(name);
                            for(var i=0;i<moveclipdata.frames.length;i++){
                                frames.push(_tmpsheetdata.get(moveclipdata.frames[i].res))
                            }
                            moveclip._importFrames(frames);
                            this._movieclipdataspool.set(name, moveclip)
                        }else{

                        }
                    }
                }
            }

            /**
             * 解析雪碧图(egret)
             * @param sheetdataset
             * @param sheet
             */
            private praseSheetData(sheetdataset?:any,sheet?:SpriteSheet):any{
                var texture,texturedata,name,
                    sheetdata = new Dict();
                for(name in sheetdataset){
                    if(typeof name == "string"){
                        texturedata = sheetdataset[name];
                        texture = sheet.createTexture(texturedata.x, texturedata.y, texturedata.w, texturedata.h);
                        sheetdata.set(name,texture)
                    }
                }
                return sheetdata;
            }
        }

        export class MovieClipData extends AppObject{
            private _name:string;

            private _frames:Array<Texture>;

            private _framescount:number;

            constructor(name:string){
                super();
                this._name = name;
            }

            public _importFrames(frames:Array<Texture>){

            }


        }
    }
}