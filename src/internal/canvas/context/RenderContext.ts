/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo{
    export module canvas{
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = <any>window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = <any>window[vendors[i] + 'CancelAnimationFrame'] ||
            window[vendors[i] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }

        export function animationFrame(callback,thisArg){
            window.requestAnimationFrame(callback.bind(thisArg))
        }
    }
}