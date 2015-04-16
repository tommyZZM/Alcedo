/**
 * Created by tommyZZM on 2015/4/16.
 */
module alcedo{
    export module canvas{
        export class Tweens extends AppProxyer{

            private _stage:Stage;
            private _inited:boolean;
            private _tweens:Array<Tween> = [];

            public init(stage:Stage):Tweens{
                this._stage = stage;
                return this
            }

            public from(target:any,override:boolean = true):Tween {
                var tween = new Tween();
                if(override){
                    this.removeTweens(target)
                }
                (<any>tween).initialize(target,this);
                return tween;
            }

            public removeTweens(target:any):void {
                if (!target.tween_count) {
                    return;
                }
                var tweens:Tween[] = this._tweens;
                for (var i = tweens.length - 1; i >= 0; i--) {
                    trace("removeTweens try",tweens[i].target == target)
                    if (tweens[i].target == target) {
                        tweens[i].setPaused(true);
                        tweens.splice(i, 1);
                    }
                }
                target.tween_count = 0;
            }

            public _register(tween:Tween,value:boolean){
                var target:any = tween["_target"];
                var tweens:Tween[] = this._tweens;
                if (value) {
                    if (target) {
                        target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                    }
                    tweens.push(tween);
                    if (!this._inited) {
                        this._stage.addEventListener(Stage.ENTER_FRAME,this.tick, this);
                        this._inited = true;
                    }
                } else {
                    if (target) {
                        target.tween_count--;
                    }
                    var i = tweens.length;
                    while (i--) {
                        if (tweens[i] == tween) {
                            tweens.splice(i, 1);
                            return;
                        }
                    }
                }
            }

            private tick(e):void {
                var tweens:Tween[] = this._tweens.concat();
                for (var i = tweens.length - 1; i >= 0; i--) {
                    var tween:Tween = tweens[i];
                    if (tween["_paused"]) {
                        continue;
                    }
                    tween.tick(e.dt);
                }
            }
        }
    }
}