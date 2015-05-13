/**
 * Created by tommyZZM on 2015/5/3.
 */
module game {
    export class SceneryGround extends alcedo.canvas.DisplatObjectContainer implements ISceneryLayer {
        public constructor(){
            super();
            this.init();
            alcedo.addDemandListener(GameSceneryControl,CmdCatalog.RESET_SCENERY,this.resResetScenery,this)
        }

        protected init(){

        }

        protected resResetScenery(e:any){

        }
    }
}