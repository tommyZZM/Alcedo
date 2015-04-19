/**
 * Created by tommyZZM on 2015/4/19.
 */
module game{
    export class ScreenControl extends alcedo.AppCmder{

        public constructor(){
            super();
            this.addCmdHandler(CmdCatalog.TO_SCREEN,this.cmdToScreen);
        }

        private cmdToScreen(sceenname){
            this.dispatchDemand(CmdCatalog.TO_SCREEN,sceenname);
        }
    }
}