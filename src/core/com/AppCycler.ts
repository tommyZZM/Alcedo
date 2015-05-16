/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class AppCycler extends AppSubCore{
        public constructor() {
            super();
            this.addCmdHandler(AppLauncher.START_UP,this.cmdStartup);
            alcedo.launch(this,true);
        }

        protected cmdStartup(...courier){

        }
    }
}