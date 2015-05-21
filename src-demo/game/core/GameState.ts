/**
 * Created by tommyZZM on 2015/5/21.
 */
module game{
    export class GameState extends alcedo.AppSubCore{
        public static HELLO:string = "Hello";
        public static PREPLAY:string = "PrePlay";
        public static PLAYING:string = "Playing";
        public static OVER:string = "Over123";

        private _currstate:string;

        public startUp(){
            this.addCmdHandler(GameState.HELLO,this.cmdHello);
            this.addCmdHandler(GameState.PREPLAY,this.cmdPrePlay);
            this.addCmdHandler(GameState.PLAYING,this.cmdPlaying);
            this.addCmdHandler(GameState.OVER,this.cmdOver);
        }

        private cmdHello(e){
            trace("resHello",e);

            this.dispatchDemand(GameState.HELLO,e);
        }

        private cmdPrePlay(e){

        }

        private cmdPlaying(e){

        }

        private cmdOver(e){

        }

    }
}