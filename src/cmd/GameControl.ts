/**
 * Created by tommyZZM on 2015/5/4.
 */
module game{
    export class GameControl extends alcedo.AppCmder{
        public constructor(){
            super();

            this.addCmdHandler(CmdCatalog.CTR_FLY_BEGIN,this.cmdFlyBegin);
            this.addCmdHandler(CmdCatalog.CTR_FLY_RELEASE,this.cmdFlyRelease);
        }

        private cmdFlyBegin(){
            this.dispatchDemand(CmdCatalog.CTR_FLY_BEGIN)
        }

        private cmdFlyRelease(){
            this.dispatchDemand(CmdCatalog.CTR_FLY_RELEASE)
        }
    }
}