/**
 * Created by tommyZZM on 2015/4/9.
 */
module alcedo{
    export function checkNormalType(data){
        return (typeof data == "string" || typeof data == "number")
    }

    var _r2value:RegExp = /(\w*)^((\d|\.)+)(\w*)$/i;
    export function toValue(str:string):number{
        //trace("toValue",_r2value.exec(str),str)
        var _str, _rstr = _r2value.exec(str);
        if(_rstr){
            _str = Number(_rstr[2]);
        }
        if(!_str){_str=0}
        return _str;
    }

    /**
     * TryCatch����
     * @param fn
     * @param onerror
     * @param thisObject
     */
    export function tryExecute(fn:Function,onerror?:Function,thisObject?:any){
        try{
            thisObject?fn.apply(thisObject):fn();
        }catch(e){
            thisObject?onerror.apply(thisObject,e):onerror(e);
        }
    }
}
