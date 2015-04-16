/**
 * Created by tommyZZM on 2015/4/13.
 */
module alcedo {
    export function px(value:number):string {
        return value.toFixed(1) + "px";
    }

    export function percent(value:number):string {
        return value.toFixed(1) + "%";
    }
}