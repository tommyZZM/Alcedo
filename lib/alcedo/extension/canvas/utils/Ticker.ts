/**
 * Created by tommyZZM on 1015/4/11.
 */
module alcedo{
    export module canvas{
        export class Ticker extends AppProxyer{
            private _stage:Stage;

            private _fps:number = 0;

            private _total10microsecond:number = 0;
            private _totalsecond:number = 0;

            private _countmicrosecond:number = 0;
            private _count10microsecond:number = 0;
            private _last10microsecond:number = 0;

            public constructor(stage:Stage){
                super();

                this._stage = stage;
                this._stage.enterframe(this.update,this)
            }

            private update(e){
                var i,dt = e.dt,
                    _counter:number;
                this._countmicrosecond+=dt;
                this._fps = 1000/dt;

                //TODO:不使用for循环,改成50毫秒
                _counter = +(this._countmicrosecond/10)^0;
                if(_counter>=1){
                    this._total10microsecond+=_counter;
                    this._stage.emit(Stage.ENTER_MILLSECOND10,{fps:this.fps()
                        ,count:this._total10microsecond,dt:dt,delay:_counter});
                    this._countmicrosecond = 0;
                }

                this._count10microsecond+=(this._total10microsecond-this._last10microsecond);
                _counter = +(this._count10microsecond/100)^0;
                if(_counter>=1){
                    this._stage.emit(Stage.ENTER_SECOND,{fps:this.fps(),count:this._totalsecond,dt:dt,delay:_counter});
                    this._count10microsecond = 0;
                }
                
                this._last10microsecond = this._total10microsecond;
            }

            private fps():number{
                return +this._fps.toFixed(0)
            }
        }

        export interface ITickerEvent{
            fps:number;
            count:number;
            dt:number;
            delay:number;
        }
    }
}