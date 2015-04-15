/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo{
    export module dom{
        export function width():number{
            var result;
            if (document.documentElement.clientWidth)
            {
                result= document.documentElement.clientWidth;
            }else{
                result= window.innerWidth;
            }

            return result;
        }

        export function height():number{
            var result;
            if (document.documentElement.clientHeight) {
                result= document.documentElement.clientHeight;
            }else{
                result= window.innerHeight;
            }

            return result;
        }

        export function w2h():number{
            return width()/height();
        }
    }
}