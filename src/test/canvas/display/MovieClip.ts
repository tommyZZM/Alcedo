/**
 * Created by tommyZZM on 2015/4/22.
 */
module alcedo{
    export module canvas{
        export class MovieClip extends DisplayObject{

            private _moveclipdata:MovieClipData;

            private _isPlaying:boolean;
            private _frameRate:number;

            private _playTimes:number;

            public constructor(movieclipdata:MovieClipData){
                super();
                this._moveclipdata = movieclipdata;

                this._nextframeindex = 0;
                this._currframeindex = 1;
                this._totalframescount = movieclipdata.getFrames().length;

                this._frameRate = movieclipdata.getFrameRate();

                this._countdt = 1000/this._frameRate;
                this._passtime = 0;
                this._lasttime = 0;

                this.width = this._moveclipdata.width;
                this.height=this._moveclipdata.height;

                this.gotoAndStop(1);
            }

            public _draw(renderer:CanvasRenderer){
                this._texture_to_render = this._currframe;

                //console.log(this._position)
                var texture = this._texture_to_render;

                if (texture && texture.bitmapData && this._alpha>0 && this._visible){
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);

                    var offsetX = texture._offsetX-this._moveclipdata.left;
                    var offsetY = texture._offsetY-this._moveclipdata.top;
                    var destW:number = Math.round(texture._sourceWidth);
                    var destH:number = Math.round(texture._sourceHeight);

                    renderer.context.drawImage(<any>texture.bitmapData
                        ,texture._sourceX,texture._sourceY
                        ,texture._sourceWidth,texture._sourceHeight
                        ,offsetX,offsetY
                        ,destW,destH)
                }
            }

            protected _onAdd(){
                super._onAdd();
                this.setPlayState(this._playstatetmp);//防止在add到stage之前执行playstate;
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                var result = (<Stage>this._root).viewPort.hitRectangelTest(this.actualBound());

                return result;
            }

            /**
             * MovieClip API
             */

            public play(playtimes:number=0){
                this._playtotag = -1;
                this._isPlaying=true;
                this.setPlayTimes(playtimes);
                this.setPlayState(true)
            }

            public stop(){
                this._playtotag = -1;
                this._isPlaying=false;
                this.setPlayState(false)
            }

            //TODO:supprot label
            public gotoAndPlay(frame: number|string, playTimes:number = 0): void{
                this.play(playTimes);
                this.gotoFrame(+frame)
            }

            public gotoAndStop(frame: number|string): void {
                this.stop();
                this.gotoFrame(+frame)
            }

            //alcedo extend
            private _playtotag:number;

            public playToAndStop(frame:number, playtimes:number = 0){
                this._playtotag = this.selectFrame(frame);
                this.setPlayTimes(playtimes);
                this.setPlayState(true)
            }

            public stopAt(frame:number){
                this._playtotag = this.selectFrame(frame);
            }

            private setPlayTimes(value:number){
                if(value===0)value=-1;
                if(value < 0 || value >= 1){
                    this._playTimes = value < 0 ? -1 : Math.floor(value);
                    //trace(this._playTimes);
                }
            }

            private gotoFrame(index:number){
                var _index = this.selectFrame(index);
                if(this._nextframeindex===_index){
                    return;
                }
                this._nextframeindex = _index;
                this._updateCurrFrame();
            }

            private selectFrame(index:number):number{
                var result = index;
                if(result>this._totalframescount){
                    result = this._totalframescount
                }else if(result<1 || !result){
                    result = 1;
                }

                return result
            }

            /**
             * Movie interal
             */
            private _countdt:number;
            private _passtime:number;
            private _lasttime:number;

            private _nextframeindex:number;
            private _currframeindex:number;
            private _totalframescount:number;

            private _currframe:Texture;//当前贴图

            private _frameRateControl(e:ITickerEvent){
                var countdt = this._countdt,
                    currtime = this._passtime+e.dt;
                    this._passtime = currtime % countdt;

                var delay = currtime/countdt;

                if(delay<1){
                    return;
                }

                delay = delay^0;
                this._nextframeindex+=delay;
                if(this._nextframeindex > this._totalframescount){
                    this._playTimes--;
                    if(this._playtotag<1){
                        if(this._playTimes==-2){
                            this._playTimes++;
                            this._nextframeindex = 1;
                        }else if(this._playTimes>0){
                            this._nextframeindex = 1;
                        }else{
                            this._nextframeindex = this._totalframescount;
                            this.stop();
                        }
                    }else{
                        this._nextframeindex = 1;
                    }
                }

                if (this._playtotag >= 1) {
                    //trace(this._playTimes)
                    if (this._playTimes <= 0) {
                        if (this._nextframeindex == this._playtotag) {
                            this.stop();
                            this._playtotag = -1;
                        }
                    }
                }

                this._updateCurrFrame();
            }
            private _updateCurrFrame(){
                this._currframeindex = this._nextframeindex;

                var currframe = this._currframeindex-1;

                this._currframe = this._moveclipdata.getFrame(currframe);
            }

            private _playstate:boolean;
            private _playstatetmp:boolean;
            private setPlayState(value:boolean){
                if(this._playstate == value) {
                    return;
                }

                if(!this.isAddtoStage()){
                    this._playstatetmp = value;
                    //trace("'[dev]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if(value){
                    this._stage.addEventListener(Stage.ENTER_MILLSECOND10,this._frameRateControl, this,Number.NEGATIVE_INFINITY);
                }else{
                    this._stage.removeEventListener(Stage.ENTER_MILLSECOND10,this._frameRateControl, this);
                }
            }


        }
    }
}