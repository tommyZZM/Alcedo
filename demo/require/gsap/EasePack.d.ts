/**
 * Created by tommyZZM on 2015/5/18.
 */
declare module Bounce{
    export var BounceOut;
    export var BounceIn;
    export var BounceInOut;
}

declare var Elastic:EaseObject;
declare var Back:EaseObject;

declare class EaseObject{
    easeIn:Ease;
    easeOut:Ease;
    easeInOut:Ease;
}

declare class Ease{
    constructor(func?: Function, extraParams?: any[], type?: number, power?: number);

    /** Translates the tween's progress ratio into the corresponding ease ratio. */
    getRatio(p: number): number;

    public config(...param):any;
}
