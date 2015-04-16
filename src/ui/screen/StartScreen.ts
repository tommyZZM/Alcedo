/**
 * Created by tommyZZM on 2015/4/14.
 */
module game{
    export class StartScreen extends GameScreen{
        private _startbtnpos:number;

        private _title:GameUIComponent;
        private _startbtn:GameButton;
        private _aboutbtn:GameButton;

        protected init() {
            //this.screen.hide();
            this._title = new GameUIComponent(this.screen.find(".title")[0],alcedo.proxy(TextureRepository).get("title"));
            this._title.e.css({"margin-top":alcedo.px(-this._title.height)});
            this._title.e.show();

            this._startbtn = new GameButton(this.screen.find(".btn.startgame")[0],
                alcedo.proxy(TextureRepository).get("startbtn"));

            this._aboutbtn = new GameButton(this.screen.find(".btn.about")[0],
                alcedo.proxy(TextureRepository).get("aboutbtn"));
            this._startbtn.e.css({top:alcedo.px(stageSize().height)}).hide();
            this._aboutbtn.e.css({top:alcedo.px(stageSize().height)}).hide();

            this.resize();
        }

        public active(){
            super.active();

            //TODO:why?where? why need then
            this._title.e.then(()=>{
                this._title.e.to({"margin-top":alcedo.px(stageSize().height*0.08)},360).then(()=>{
                    this._startbtn.e.show().to({"margin-top":alcedo.px(-10),top:0},360)
                        .then(()=>{
                            this._startbtn.e.to({"margin-top":alcedo.px(10),top:0},320)
                                .then(()=>{
                                    this._startbtn.e.to({"margin-top":0,top:0},300)
                                });
                            this._aboutbtn.e.show().to({top:0},320)
                        });
                })
            },200);
            //return;
        }

        public disactive(){
            super.disactive();

        }

        public resize(){
            this._title.width = stageSize().height*0.9;
            this._startbtn.width = stageSize().height*0.5;
            this._aboutbtn.width = stageSize().height*0.3;

            //this._title.e.to({"margin-top":alcedo.px(stageSize().height*0.08)},100);
            
            this._startbtnpos = stageSize().height*0.29;
            //this._startbtn.e.to({"margin-top":alcedo.px(this._startbtnpos),top:0},100)
        }
    }
}