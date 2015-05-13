/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppCycler extends AppCmder{
        public constructor() {
            super();
            AppFacade.instance.app=this;
            //GameFacade.instance['_cmdPostals'].setRoute(notify.CMD.GameReady,this,this.onReady);
            this.addCmdHandler(AppLauncher.START_UP,this.cmdStartup);
            alcedo.launch(true);
        }

        protected cmdStartup(...courier){

        }
    }
}