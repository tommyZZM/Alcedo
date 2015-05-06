/**
 * Created by tommyZZM on 2015/4/19.
 */
module game{
    export class ScreenControl extends alcedo.AppCmder{

        public constructor(){
            super();
            this.addCmdHandler(CmdCatalog.TO_SCREEN,this.cmdToScreen);
        }

        private cmdToScreen(sceenname,data){
            if(!data)data = {};
            data.screenname = sceenname;
            this.dispatchDemand(CmdCatalog.TO_SCREEN,data);
        }
    }
}