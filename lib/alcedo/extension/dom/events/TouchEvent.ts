/**
 * Created by tommyZZM on 2015/5/4.
 */
module alcedo{
    export module dom{
        export class TouchEvent extends Event{
            public static TOUCH_BEGIN = "dom_touchbegin";
            public static TOUCH_END = "dom_touchend";
            public static TOUCH_TAP = "dom_touchtap";
        }
    }
}