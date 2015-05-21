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
            trace("cmdHello",e);

            this.dispatchDemand(GameState.HELLO,e);
        }

        private cmdPrePlay(e){
            trace("cmdPreplay");
            this.dispatchDemand(GameState.PREPLAY,e);
        }

        private _isplaying:boolean;
        private cmdPlaying(e){
            this._isplaying = true;
            this.dispatchDemand(GameState.PLAYING,e);
        }

        private cmdOver(e){
            this._isplaying = false;
            trace("cmdOver")
            alcedo.core(GUICycler).toggleToScreen("over");
            this.dispatchDemand(GameState.OVER,e);
        }

        public get isplaying():boolean{
            return this._isplaying;
        }

    }
}