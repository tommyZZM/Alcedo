/**
 * Created by tommyZZM on 2015/4/15.
 */
module alcedo{
    export module canvas{
        export class Tween extends EventDispatcher{

            private _tweenManager:Tweens;

            private _paused:boolean;
            private _loop:boolean;
            private _passive:boolean = false;

            private _target:any;
            private _steps:Array<any>;
            private _actions:Array<any>;
            private duration:number = 0;

            private _curQueueProps;
            private _initQueueProps;

            private position:number = null;
            private _prevPosition:number = 0;
            private _stepPosition:number = 0;
            private _prevPos:number = -1;

            public constructor(){
                super();
            }

            public get target():any{
                return this._target;
            }

            /**
             * 初始化
             * @param target
             */
            private initialize(target:any,tweenmanager:Tweens):void {
                this._target = target;
                this._curQueueProps = {};
                this._initQueueProps = {};
                this._steps = [];
                this._actions = [];

                this._tweenManager = tweenmanager;
                this._tweenManager._register(this,true)
            }

            /**
             * 添加Step
             * @param o
             * @returns {alcedo.canvas.Tween}
             * @private
             */
            private _addStep(o):Tween {
                if (o.d > 0) {
                    this._steps.push(o);
                    o.t = this.duration;
                    this.duration += o.d;
                }
                return this;
            }

            public to(props, duration:number, fn?:(target)=>void ,ease?:Function):Tween {
                if (isNaN(duration) || duration < 0) {
                    duration = 0;
                }
                return this._addStep({d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease,
                    p1: this._cloneProps(this._appendQueueProps(props)),fn:fn});
            }

            private _appendQueueProps(o):any {
                var oldValue, injectProps;
                for (var n in o) {
                    if (this._initQueueProps[n] === undefined) {
                        oldValue = this._target[n];
                        this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                    } else {
                        oldValue = this._curQueueProps[n];
                    }
                }

                for (var n in o) {
                    oldValue = this._curQueueProps[n];
                    this._curQueueProps[n] = o[n];
                }
                if (injectProps) {
                    this._appendQueueProps(injectProps);
                }
                return this._curQueueProps;
            }

            public wait(duration:number){
                if (!(duration > 0)) {
                    return this;
                }
                var o = this._cloneProps(this._curQueueProps);
                return this._addStep({d: duration, p0: o, p1: o, v: false});
            }

            public tick(delta:number):void {
                //trace(delta)
                if (this._paused) {
                    return;
                }
                this.setPosition(this._prevPosition + delta);
            }

            private setPosition(value:number, actionsMode:number = 1):boolean {
                if (value < 0) {
                    value = 0;
                }

                //正常化位置
                var t:number = value;
                var end:boolean = false;
                if (t >= this.duration) {
                    if (this._loop) {
                        t = t % this.duration;
                    }
                    else {
                        t = this.duration;
                        end = true;
                    }
                }
                if (t == this._prevPos) {
                    return end;
                }


                var prevPos = this._prevPos;
                this.position = this._prevPos = t;
                this._prevPosition = value;

                if (this._target) {
                    if (end) {
                        //结束
                        this._updateTargetProps(null, 1);
                    } else if (this._steps.length > 0) {
                        // 找到新的tween
                        for (var i = 0, l = this._steps.length; i < l; i++) {
                            if (this._steps[i].t > t) {
                                break;
                            }
                        }
                        var step = this._steps[i - 1];
                        this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                    }
                }

                //执行actions
                if (actionsMode != 0 && this._actions.length > 0) {
                    if (actionsMode == 1 && t < prevPos) {
                        if (prevPos != this.duration) {
                            this._runActions(prevPos, this.duration);
                        }
                        this._runActions(0, t, true);
                    } else {
                        this._runActions(prevPos, t);
                    }
                }

                if (end) {
                    this.setPaused(true);
                }

                //this.dispatchEventWith("change");
                return end;
            }

            private _updateTargetProps(step:any, ratio:number) {
                var p0, p1, v, v0, v1, arr;
                if (!step && ratio == 1) {
                    this._passive = false;
                    p0 = p1 = this._curQueueProps;
                } else {
                    this._passive = !!step.v;
                    //不更新props.
                    if (this._passive) {
                        return;
                    }
                    //使用ease
                    if (step.e) {
                        ratio = step.e(ratio, 0, 1, 1);
                    }
                    p0 = step.p0;
                    p1 = step.p1;

                    //todo:callback
                    if(step.fn && step.fn instanceof Function)step.fn(this._target);
                }

                for (var n in this._initQueueProps) {
                    if ((v0 = p0[n]) == null) {
                        p0[n] = v0 = this._initQueueProps[n];
                    }
                    if ((v1 = p1[n]) == null) {
                        p1[n] = v1 = v0;
                    }
                    if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof(v0) != "number")) {
                        v = ratio == 1 ? v1 : v0;
                    } else {
                        v = v0 + (v1 - v0) * ratio;
                    }

                    var ignore = false;
                    //if (arr = Tween._plugins[n]) {
                    //    for (var i = 0, l = arr.length; i < l; i++) {
                    //        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                    //        if (v2 == Tween.IGNORE) {
                    //            ignore = true;
                    //        }
                    //        else {
                    //            v = v2;
                    //        }
                    //    }
                    //}
                    if (!ignore) {
                        this._target[n] = v;
                    }
                }


            }

            private _runActions(startPos:number, endPos:number, includeStart:boolean = false) {
                var sPos:number = startPos;
                var ePos:number = endPos;
                var i:number = -1;
                var j:number = this._actions.length;
                var k:number = 1;
                if (startPos > endPos) {
                    //把所有的倒置
                    sPos = endPos;
                    ePos = startPos;
                    i = j;
                    j = k = -1;
                }
                while ((i += k) != j) {
                    var action = this._actions[i];
                    var pos = action.t;
                    if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                        action.f.apply(action.o, action.p);
                    }
                }
            }

            private _cloneProps(props):any {
                var o = {};
                for (var n in props) {
                    o[n] = props[n];
                }
                return o;
            }

            /**
             * 设置是否暂停
             * @method egret.Tween#setPaused
             * @param value {boolean} 是否暂停
             * @returns Tween对象本身
             */
            public setPaused(value:boolean):Tween {
                this._paused = value;
                this._tweenManager._register(this, !value);
                return this;
            }
        }
    }
}