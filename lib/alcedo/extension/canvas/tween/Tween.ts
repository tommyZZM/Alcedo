/**
 * Created by tommyZZM on 2015/4/15.
 */
module alcedo{
    export module canvas{
        export class Tween extends AppNotifyable{
            public static get(target:any, override:boolean = false):Tween {
                return new Tween(target);
            }

            public static _register(tween:Tween,value:boolean){

            }


            public constructor(target:any){
                super();
            }

            private initialize(target:any, props:any, pluginData:any):void {
                this._target = target;
                this._steps = [];
                Tween._register(this, true);
            }

            private _target:any;
            private _steps:Array<any>;
            private duration:number = 0;

            private _addStep(o):Tween {
                if (o.d > 0) {
                    this._steps.push(o);
                    o.t = this.duration;
                    this.duration += o.d;
                }
                return this;
            }

            public to(props, duration:number, fn:(target)=>void ,ease:Function = undefined):Tween {

                return this;
            }

            public wait(duration:number){

            }
        }
    }
}