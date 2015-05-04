/**
 * Created by tommyZZM on 2015/4/13.
 */
module alcedo{
    export module dom{
        export class DomEvents extends Event{
            public static ON_FOCUS:string = "dom_ON_FOCUS";
            public static ON_LOST_FOCUS:string = "dom_ON_LOST_FOCUS";
        }

        export class StyleEvent extends Event{
            public static TRAN_SITION_END = "dom_webkitTransitionEnd";
        }
    }
}