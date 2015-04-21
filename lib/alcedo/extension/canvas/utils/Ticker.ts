/**
 * Created by tommyZZM on 2015/4/11.
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

                _counter = +(this._countmicrosecond/10)^0;
                if(_counter>=1){
                    this._total10microsecond+=_counter;
                    if(_counter>1){
                        trace("too slow",_counter)
                        for(i=0;i<_counter;i++){
                            this._stage.emit(Stage.ENTER_MILLSECOND10,{fps:this.fps()
                                ,count:this._total10microsecond,dt:dt,delay:i});
                        }
                    }else{
                        this._stage.emit(Stage.ENTER_MILLSECOND10,{fps:this.fps(),count:this._total10microsecond,dt:dt,currdelay:1,delay:1});
                    }
                    this._countmicrosecond = 0;
                }

                this._count10microsecond+=(this._total10microsecond-this._last10microsecond);
                _counter = +(this._count10microsecond/100)^0;
                if(_counter>=1){
                    this._totalsecond+=_counter;
                    if(_counter>1){
                        for(i=0;i<_counter;i++){
                            this._stage.emit(Stage.ENTER_SECOND,{fps:this.fps(),count:this._totalsecond,dt:dt,delay:_counter});
                        }
                    }else{

                        this._stage.emit(Stage.ENTER_SECOND,{fps:this.fps(),count:this._totalsecond,dt:dt,delay:1});
                    }
                    this._count10microsecond = 0;
                }

                this._fps = 1000/dt;
                this._last10microsecond = this._total10microsecond;
            }

            private fps():number{
                return +this._fps.toFixed(0)
            }
        }
    }
}