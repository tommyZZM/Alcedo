/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo{
    export module canvas{
        export class Ticker extends AppObject{
            private _stage:Stage;

            private _fps:number = 0;
            private _startTime:number = 0;
            private _lastTime:number = 0;

            private _totalmicrosecond:number = 0;
            private _totalsecond:number = 0;

            private _countmillisecond:number = 0;
            private _countsecond:number = 0;

            public constructor(stage:Stage){
                super();

                this._startTime = Date.now();
                this._stage = stage;
                this._stage.enterframe(this.update,this)
            }

            private _nowTime(){
                return Date.now()-this._startTime;
            }

            private update(){
                var nowTime:number = this._nowTime();
                var dt = nowTime-this._lastTime;
                this._countsecond+=dt;
                this._countmillisecond+=dt;

                for(var i:number=0;i<(+(this._countmillisecond/100)^0);i++){
                    this._totalmicrosecond++;
                    this._stage.emit(Stage.ENTER_100MILLSECOND,{fps:this.fps(),count:this._totalmicrosecond});
                    if(i>=(+(this._countmillisecond/100)^0)-1){
                        this._countmillisecond = 0;
                    }
                }

                for(var i:number=0;i<(+(this._countsecond/1000)^0);i++){
                    this._totalsecond++;
                    this._stage.emit(Stage.ENTER_SECOND,{fps:this.fps(),count:this._totalsecond});
                    if(i>=(+(this._countsecond/1000)^0)-1){
                        this._countsecond = 0;
                    }
                }

                this._fps = 1000/dt;
                this._lastTime = nowTime;
            }

            private fps():number{
                return +this._fps.toFixed(0)
            }
        }
    }
}