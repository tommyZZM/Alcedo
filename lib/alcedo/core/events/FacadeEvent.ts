/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo {
    export class FacadeEvent extends Event {

        public static UNIQUE:string = 'facadeEvent0811';

        private _com:string;
        private _notify:any;

        public constructor() {
            //:your code here
            super(FacadeEvent.UNIQUE);
        }

        public setNotify(com:any,notify:string, courier?:any){
            this._com = getClassName(com);
            this._notify = notify;
            this._courier = courier;
        }

        public get com():string{
            return this._com
        }

        public get notify():string {
            return this._notify;
        }
    }
}