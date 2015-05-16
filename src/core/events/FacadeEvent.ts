/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo {
    export class FacadeEvent extends Event {

        public static UNIQUE:string = 'facadeEvent0811';

        private _core:string;
        private _notify:any;

        public constructor() {
            //:your code here
            super(FacadeEvent.UNIQUE);
        }

        public setNotify(core:any,notify:string, courier?:any){
            this._core = _AppOverCore.getCoreFullName(core);
            this._notify = notify;
            this._courier = courier;
        }

        public get core():string{
            return this._core
        }

        public get notify():string {
            return this._notify;
        }
    }
}