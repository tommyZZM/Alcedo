/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppObject {
        public constructor(){
            this._classname = getClassName(this);
            this._aperureHashIndex = AppObject.hashCount++;
        }
        /**
         * 哈希计数
         */
        private static hashCount:number = 1;

        private _aperureHashIndex:number;

        public get hashIndex():number {
            return this._aperureHashIndex;
        }

        private _classname:string;

        public get className():string{
            return this._classname;
        }
    }
}