/**
 * Created by tommyZZM on 2015/4/13.
 */
module alcedo{
    export module dom{
        export class TouchEvent extends Event{
            public static TOUCH_BEGIN = "dom_TOUCH_BEGIN";

            public static TOUCH_END = "dom_TOUCH_END";

            public static TOUCH_TAP = "dom_TOUCH_TAP";
        }

        export class StyleEvent extends Event{
            public static TRAN_SITION_END = "dom_webkitTransitionEnd";
        }
    }
}