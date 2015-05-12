/**
 * Created by tommyZZM on 2015/5/4.
 */
module alcedo{
    export module canvas{
        export class TouchEvent extends Event{
            public static TOUCH_BEGIN:string = "canvasTOUCH_BEGIN";
            public static TOUCH_END:string = "canvasTOUCH_END";
            public static TOUCH_TAP:string = "canvasTOUCH_TAP";

            private static touchTargetPool:any;
            public static createSimpleTouchEvent(identifier,x,y){
                if(!this.touchTargetPool)this.touchTargetPool = {};
                var result = this.touchTargetPool[identifier]
                if(!result){
                    result = this.touchTargetPool[identifier]
                        = {
                        indentifier:identifier,
                        x:x,
                        y:y
                    }
                }
                return result;
            }
        }

        export interface ITouchEvent{
            x:number;
            y:number;
            identifier:number
        }
    }
}