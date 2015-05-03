/**
 * Created by tommyZZM on 2015/5/3.
 */
module game {
    export class SceneryGround extends alcedo.canvas.DisplatObjectContainer implements ISceneryLayer {
        public constructor(){
            super();
            this.init();
            alcedo.addDemandListener(GameSceneryControl,CmdCatalog.RESET_SCENERY,this.resReturnPos,this)
        }

        protected init(){

        }

        protected resReturnPos(e:any){

        }
    }
}