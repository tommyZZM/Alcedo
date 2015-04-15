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

            private _total100microsecond:number = 0;
            private _totalsecond:number = 0;

            private _countmicrosecond:number = 0;
            private _count100microsecond:number = 0;
            private _last100microsecond:number = 0;

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
                var dt = nowTime-this._lastTime,
                    i,_counter:number = 0;
                this._countmicrosecond+=dt;

                _counter = +(this._countmicrosecond/100)^0;
                for(i=0;i<_counter;i++){
                    this._total100microsecond++;
                    this._stage.emit(Stage.ENTER_100MILLSECOND,{fps:this.fps(),count:this._total100microsecond});
                    if(i>=(_counter-1)){
                        this._countmicrosecond = 0;
                    }
                }

                this._count100microsecond+=(this._total100microsecond-this._last100microsecond);
                _counter = +(this._count100microsecond/10)^0;
                for(i=0;i<_counter;i++){
                    this._totalsecond++;
                    this._stage.emit(Stage.ENTER_SECOND,{fps:this.fps(),count:this._totalsecond});
                    if(i>=(_counter-1)){
                        this._count100microsecond = 0;
                    }
                }

                this._fps = 1000/dt;
                this._lastTime = nowTime;
                this._last100microsecond = this._total100microsecond;
            }

            private fps():number{
                return +this._fps.toFixed(0)
            }
        }
    }
}