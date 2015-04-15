/**
 * Created by tommyZZM on 2015/4/14.
 */
module game{
    export class StartScreen extends GameScreen{
        private _startbtnpos:number;

        private _startbtn:GameButton;
        private _aboutbtn:GameButton;

        protected init() {
            this._startbtn = new GameButton(this.screen.find(".btn.startgame")[0],alcedo.proxy(alcedo.canvas.TextureRepository).get("startbtn"));
            this._startbtn.width = stageSize().height*0.5;

            this._aboutbtn = new GameButton(this.screen.find(".btn.about")[0],alcedo.proxy(alcedo.canvas.TextureRepository).get("aboutbtn"));
            this._aboutbtn.width = stageSize().height*0.3;
        }

        public active(){
            super.active();

            this._startbtnpos = stageSize().height*0.29;

            this._startbtn.e.to({top:alcedo.dom.px(stageSize().height)},1);
            this._aboutbtn.e.to({top:alcedo.dom.px(stageSize().height)},1);
            this._startbtn.e
                .then(()=>{
                this._startbtn.e.to({"margin-top":alcedo.dom.px(this._startbtnpos-10),top:0},300)
                    .then(()=>{
                    this._startbtn.e.to({"margin-top":alcedo.dom.px(this._startbtnpos+10),top:0},300)
                        .then(()=>{
                        this._startbtn.e.to({"margin-top":alcedo.dom.px(this._startbtnpos),top:0},300)
                    });
                    this._aboutbtn.e.to({top:0},300)
                });
            },200);
        }

        public disactive(){
            super.disactive();

        }

        public resize(){
            this._startbtn.width = stageSize().height*0.5;
            this._aboutbtn.width = stageSize().height*0.3;

            this._startbtnpos = stageSize().height*0.29;
            this._startbtn.e.to({"margin-top":alcedo.dom.px(this._startbtnpos),top:0},100)
        }
    }
}