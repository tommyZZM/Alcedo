/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GUICycler extends alcedo.AppSubCore{
        private static instanceable = true;

        public startUp(){
            this.screenDict = new Dict();
            alcedo.core(CurtainManager).startUp();

            this.registScreen("loading",new LoadingScreen());
            this.registScreen("start",new StartScreen());
            this.registScreen("playing",new PlayingScreen());
            this.registScreen("over",new OverScreen());

            this.toggleToScreen("loading");
        }

        private currscreen:GUIScreen;
        public toggleToScreen(name,callback?:Function){
            var screen = this.screenDict.get(name);
            if(!screen){
                warn("screen",name,"not found",screen);
                return;
            }
            if(this.currscreen){
                this.currscreen.hide(()=>{
                    this.currscreen.ele.removeClass("active");
                    screen.ele.addClass("active");
                    screen.show(callback);
                    this.currscreen = screen;
                })
            }else{
                screen.show(callback);
                this.currscreen = screen;
            }
        }

        private screenDict:Dict;
        private registScreen(name:string,screenobj:GUIScreen){
            var screenele = dom.query(".screen."+name)[0];
            if(!screenele || this.screenDict.has(name)){
                warn("fail regist screen",name,screenele)
                return;
            }
            screenobj.ele = screenele;
            this.screenDict.set(name,screenobj);
        }
    }
}