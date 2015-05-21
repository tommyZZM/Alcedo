/**
 * Created by tommyZZM on 2015/5/21.
 */
module game {
    /**
     * 描述关卡的类
     */
    export class Level extends alcedo.canvas.DisplatObjectContainer {
        private _levelconfig:any;

        public constructor(levelconfig){
            super();
            if(!levelconfig)warn("level config invaild");
            this._levelconfig = levelconfig;
        }
    }
}