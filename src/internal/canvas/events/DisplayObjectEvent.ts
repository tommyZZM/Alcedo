/**
 * Created by tommyZZM on 2015/4/19.
 */
module alcedo{
    export module canvas {
        export class DisplayObjectEvent extends Event {
            public static ON_ADD = "DisplayObjectEventON_ON_ADD";
            public static ON_REMOVE= "DisplayObjectEventON_ON_REMOVE";

            public static ON_ADD_TO_STAGE = "DisplayObjectEventON_ADD_TO_STAGE";
        }
    }
}