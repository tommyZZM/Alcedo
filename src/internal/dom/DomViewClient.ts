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

        var navigator;
        if(!navigator){
            navigator = {userAgent:"commonJS"}
        }
        export var ua = navigator.userAgent.toLowerCase();
        export function device():DeviceType{
            if(/iphone|ipad|ipod/i.test(ua)){
                return DeviceType.IOS;
            }

            if(/android/i.test(ua)){
                return DeviceType.Android;
            }

            if(/windows/i.test(ua)&&/phone/i.test(ua)){
                return DeviceType.WinPhone;
            }

            return DeviceType.PC
        }

        export enum DeviceType{
            Android = 1,
            IOS = 2,
            WinPhone = 3,
            PC = 0,
            Other = -1
        }
    }
}