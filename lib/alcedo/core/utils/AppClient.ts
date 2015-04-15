/**
 * Created by tommyZZM on 2015/4/5.
 */
module alcedo{
    export module currclient{
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