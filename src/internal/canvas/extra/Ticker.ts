/**
 * Created by tommyZZM on 1015/4/11.
 */
module alcedo{
    export module canvas{
        export class Ticker extends AppSubCore{
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
                this._stage.onenterframe(this.update,this)

                this._lostfocustime = 0;
                dom.addEventListener(dom.DomEvents.ON_FOCUS,this.onWindowFocus,this);
                dom.addEventListener(dom.DomEvents.ON_LOST_FOCUS,this.onWindowLostFocus,this);
            }

            private _lostfocustime:number;
            private onWindowFocus(e){
                if(!this._lostfocustime)return;
                this._lostfocustime = e.time - this._lostfocustime;
                //trace("onWindowFocus",this._lostfocustime)
            }

            private onWindowLostFocus(e){
                //trace("onWindowLostFocus")
                this._lostfocustime = e.time;
            }

            private update(e){
                var i,dt = e.dt,
                    _counter:number;
                if(this._lostfocustime>0 && e.dt>this._lostfocustime){//防止失去焦点时dt计算不正确
                    dt = e.dt-this._lostfocustime;//trace("ReFocus",e.dt,this._lostfocustime,dt)
                    this._lostfocustime = 0;
                }
                this._countmicrosecond+=dt;
                this._fps = 1000/dt;

                //TODO:不使用for循环,改成50毫秒
                _counter = +(this._countmicrosecond/10)^0;
                if(_counter>=1){
                    this._total10microsecond+=_counter;
                    this._stage.emit(Stage.ENTER_MILLSECOND10,{fps:this.fps()
                        ,count:this._total10microsecond,dt:dt,delay:_counter});
                    //trace("10microsecode",_counter)
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