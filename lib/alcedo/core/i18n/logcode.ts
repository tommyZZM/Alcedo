/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo{
    export module core{
        export var _log_code = {};
        _log_code["apcore"+1001] = "AppFacade是框架内部使用的单例,不允许在外部实例化,请使用a$访问";
        _log_code["apcore"+1002] = "AppLauncher是框架内部使用的单例,不允许在外部实例化"

        export function log_code(code:number):string{
            return _log_code["apcore"+code];
        }
    }
}