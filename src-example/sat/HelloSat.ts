/**
 * Created by tommyZZM on 2015/5/19.
 */
module example {
    var CircleR = 20;

    export class HelloSat extends ExampleCycler {
        private circle:alcedo.canvas.graphic.Circle;
        private circlebody:SAT.Circle;

        private box:alcedo.canvas.graphic.Rectangle;
        private boxbody:SAT.Box;

        private resoponse:SAT.Response;

        protected run(){
            window.onkeydown = this.keyconrol.bind(this);

            this.resoponse = new SAT.Response();

            this.circle = new alcedo.canvas.graphic.Circle(0,0,CircleR);
            this.circle.pivotX = 0.5;this.circle.pivotY = 0.5;
            this.circle.x = this.stage.width>>1;
            this.circle.y = this.stage.height>>1;
            this.circlebody = new SAT.Circle(new SAT.Vector(this.circle.x,this.circle.y),this.circle.radius);

            var boxw = Math.randomFrom(60,120);
            var boxh = Math.randomFrom(60,120);

            this.box = new alcedo.canvas.graphic.Rectangle(0,0,boxw,boxh);
            this.box.pivotX = 0.5;this.circle.pivotY = 0.5;
            this.box.x = Math.randomFrom(120,this.stage.width-120);
            this.box.y = Math.randomFrom(120,this.stage.height-120);
            this.boxbody = new SAT.Box(new SAT.Vector(this.box.x-this.box.pivotOffsetX, this.box.y-this.box.pivotOffsetY),this.box.width,this.box.height);

            this.stage.addChild(this.box);
            this.stage.addChild(this.circle);

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{
                this.circlebody.pos.x = this.circle.x;
                this.circlebody.pos.y = this.circle.y;
                this.resoponse.clear();
                if(SAT.testCirclePolygon(this.circlebody,this.boxbody.toPolygon(),this.resoponse)){
                    //trace(this.resoponse,this.resoponse.bInA,this.resoponse.aInB)
                    if(this.resoponse.aInB){
                        this.circle.fillcolour = "#e98b39";
                    }else{
                        this.circle.fillcolour = "#2ecc71";
                    }
                }else{
                    this.circle.fillcolour = "#000000";
                }
            },this)
        }

        private keyconrol(e){
            switch (e.keyCode) {
                case 38:
                {//↑
                    this.circle.y--;
                    break;
                }
                case 40:
                {//↓
                    this.circle.y++;
                    break;
                }
                case 37:
                {//←
                    this.circle.x--;
                    break;
                }
                case 39:
                {//→
                    this.circle.x++;
                    break;
                }
                default :
                {
                    break;
                }
            }
        }
    }
}