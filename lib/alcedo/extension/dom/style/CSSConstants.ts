/**
 * Created by tommyZZM on 2015/4/13.
 */
module alcedo {
    export module dom {
        export function px(value:number):string {
            return value + "px";
        }

        export function percent(value:number):string {
            return value + "%";
        }
    }
}