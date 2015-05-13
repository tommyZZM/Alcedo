/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo{
    //canvas 心跳控制器
    export module dom{
        var _log_code = {};
        _log_code["dom"+1001] = "DomManager是内部使用的单例,无需在外部实例化,请使用d$访问"

        export function log_code(code:number):string{
            return _log_code["dom"+code];
        }
    }
}