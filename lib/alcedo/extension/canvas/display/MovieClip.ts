/**
 * Created by tommyZZM on 2015/4/22.
 */
module alcedo{
    export module canvas{
        export class MovieClip extends DisplayObject{

            private _moveclipdata:MovieClipData;

            public constructor(movieclipdata:MovieClipData){
                super();
                this._moveclipdata = movieclipdata;

                this._nextframeindex = 0;
                this._currframeindex = 0;
                this._totalframescount = movieclipdata.getFrames().length;

                this._countdt = 1000/movieclipdata.getFrameRate();
                this._passtime = 0;
                this._lasttime = 0;
            }

            public _draw(renderer:CanvasRenderer){
                this._texture_to_render = this._currframe;

                //console.log(this._position)
                var texture = this._texture_to_render;

                if (texture && texture.bitmapData && this._alpha>0 && this._visible){
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);

                    var destW:number = Math.round(texture._sourceWidth);
                    var destH:number = Math.round(texture._sourceHeight);

                    renderer.context.drawImage(<any>texture.bitmapData
                        ,texture._sourceX,texture._sourceY
                        ,texture._sourceWidth,texture._sourceHeight
                        ,texture._offsetX,texture._offsetY
                        ,destW,destH)
                }
            }

            protected _setRoot(){
                super._setRoot();
                //trace("_setRoot",this.isAddtoStage(),this._playstatetmp);
                this.setPlayState(this._playstatetmp);
            }

            public play(){
                this.setPlayState(true)
            }

            public stop(){
                this.setPlayState(false)
            }


            private _countdt:number;
            private _passtime:number;
            private _lasttime:number;

            private _nextframeindex:number;
            private _currframeindex:number;
            private _totalframescount:number;

            private _currframe:Texture;
            private _frameRateControl(e:ITickerEvent){
                var countdt = this._countdt,
                    currtime = this._passtime+e.dt;
                    this._passtime = currtime % countdt;


                var delay = currtime/countdt;

                if(delay<1){
                    return;
                }

                while(delay >= 1) {
                    delay--;
                    this._nextframeindex++;
                    if(this._nextframeindex > this._totalframescount){
                        this._nextframeindex = 1;
                    }
                }

                this._updateCurrFrame();
            }
            private _updateCurrFrame(){
                this._currframeindex = this._nextframeindex;

                var currframe = this._currframeindex-1;

                this._currframe = this._moveclipdata.getFrame(currframe);

                //trace(currframe)
                //if(currframe===0)
                //    trace(this._currframe._sourceX
                //        ,this._currframe._sourceY,this._currframe._sourceWidth,this._currframe._sourceHeight)
            }

            private _playstate:boolean;
            private _playstatetmp:boolean;
            private setPlayState(value:boolean){
                if(this._playstate == value) {
                    return;
                }

                if(!this.isAddtoStage()){
                    this._playstatetmp = value;
                    trace("!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if(value){
                    this._root.addEventListener(Stage.ENTER_MILLSECOND10,this._frameRateControl, this);
                }else{
                    this._root.removeEventListener(Stage.ENTER_MILLSECOND10,this._frameRateControl, this);
                }
            }
        }
    }
}