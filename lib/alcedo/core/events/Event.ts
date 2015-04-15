/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class Event extends AppObject{
        protected _type:string;
        protected _courier:any;

        public constructor(_type:string,courier?:Array<any>){
            super();
            this._type = _type;
            this._courier = courier;
        }

        public get type():string{
            return this._type;
        }

        public get courier():string{
            return this._courier;
        }
    }
}