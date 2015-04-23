/**
 * Created by tommyZZM on 2015/4/22.
 */
module alcedo {
    export module canvas {
        export class MovieClipRepository extends AppProxyer {
            private static instanceable:boolean = true;

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
            public praseMovieClipData(dataset:any, sheettexture:Texture){
                var _dataset = dataset;
                if(Array.isArray(_dataset)){
                    _dataset = _dataset[0]
                }
                if(!_dataset.mc){
                    trace("praseMovieClipData dataset format invalid!!!",_dataset)
                    return;
                }//invalid foramt

                if(_dataset.res && sheettexture){//
                    var _tmpsheetdata = this.praseSheetData(_dataset.res,new SpriteSheet(sheettexture))
                }

                for(var name in _dataset.mc){
                    if(typeof name == "string"){
                        var moveclip:MovieClipData,frames = [],
                            moveclipdata = _dataset.mc[name];
                        if(!this._movieclipdataspool.has(name) && Array.isArray(moveclipdata.frames)) {
                            moveclip = new MovieClipData(name);
                            for(var i=0;i<moveclipdata.frames.length;i++){
                                var texture = _tmpsheetdata.get(moveclipdata.frames[i].res);
                                texture._offsetX = moveclipdata.frames[i].x||0;
                                texture._offsetY = moveclipdata.frames[i].y||0;
                                frames.push(texture)
                            }
                            if(frames.length>0)moveclip._importFrames(frames,moveclipdata.frameRate);
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

            public get(name:string):MovieClipData{
                return this._movieclipdataspool.get(name);
            }
        }

        export class MovieClipData extends AppObject{
            private _name:string;

            private _framerate:number;

            private _frames:Array<Texture>;

            private _framescount:number;

            constructor(name:string){
                super();
                this._name = name;
            }

            public _importFrames(frames:Array<Texture>,frameRate:number){
                this._frames = frames;
                this._framerate = frameRate;
                this._framescount = frames.length;
            }

            public getFrames():Array<Texture>{
                return this._frames;
            }

            public getFrame(index:number):Texture{
                return this._frames[index];
            }

            public getFrameRate(){
                return this._framerate
            }


        }
    }
}