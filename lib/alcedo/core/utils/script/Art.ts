/**
 * Created by tommyZZM on 2015/4/8.
 */
module Art{
    export function toColorString(value:number):string{
        if(isNaN(value)||value < 0)
            value = 0;
        if(value > 16777215)
            value = 16777215;
        var color:string = value.toString(16).toUpperCase();
        while(color.length<6){
            color = "0"+color;
        }
        return "#"+color;
    }
}