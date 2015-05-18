/**
 * Created by tommyZZM on 2015/4/4.
 */
//var ap:any = aperture;
module alcedo{
    export class AppLauncher{
        public static START_UP:string = "AppLauncher.START_UP";

        private _launched:boolean;

        public constructor(debug:boolean){

            if (AppLauncher._instance) {
                return;
            }

            isdebug = debug;
            debuginit();
            info("%cAlcedo","color:#1ac2ff;font-weight:bold;",
                "A Simple TypeScript HTML5 Game FrameWork!");
            info("gitHub:",'https://github.com/tommyZZM/Alcedo');
            info("If you are a non-employee who has discovered this facility amid the ruins of civilization.\n"+
            "Welcome! And remember: Testing is the future, and the future starts with you.");
            a$ =  alcedo["@AppOverCore"].instance;
        }

        public launch(app:AppCycler,courier?){
            if(this._launched)return;
            this._launched = true;
            a$.dispatchCmd(app,AppLauncher.START_UP,courier)
        }

        //instance mode
        private static _instance:AppLauncher;
        public static instance(debug?:boolean):AppLauncher{
            if (this._instance == null) {
                this._instance = new AppLauncher(debug);
            }
            //if(this._instance['_game'] && this._instance['_display']){this._instance['_isinit'] = true;}
            return this._instance;
        }
    }

    export function launch(app:AppCycler,debug?:boolean,courier?){
        AppLauncher.instance(debug).launch(app,courier)
    }
}

function trace(...msg){}
function warn(...msg){}
function info(...msg){}
function error(...msg){}

module alcedo{
    export function debuginit(){
        if(isdebug){
            window["log"] = console.log.bind(console);
            window["trace"] = console.log.bind(console);
            window["debug"] = console.debug.bind(console);
            window["warn"] = console.warn.bind(console);
            window["info"] = console.info.bind(console);
            window["error"] = console.error.bind(console);
        }
    }
}