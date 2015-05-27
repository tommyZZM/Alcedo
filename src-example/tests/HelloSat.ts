/**
 * Created by tommyZZM on 2015/5/19.
 */
module example {
    var CircleR = 20;

    export class HelloSat extends ExampleCycler {
        private circle:alcedo.canvas.graphic.Circle;
        private circlebody:SAT.Circle;

        private box:alcedo.canvas.graphic.Rectangle;
        private boxbody:SAT.Polygon;

        private resoponse:SAT.Response;

        protected run(){
            window.onkeydown = this.keyconrol.bind(this);

            this.resoponse = new SAT.Response();

            this.circle = new alcedo.canvas.graphic.Circle(CircleR);
            this.circle.pivotX = 0.5;this.circle.pivotY = 0.5;
            this.circle.x = this.stage.width>>1;
            this.circle.y = this.stage.height>>1;
            this.circlebody = new SAT.Circle(new SAT.Vector(this.circle.x,this.circle.y),this.circle.radius);

            var boxw = Math.randomFrom(60,120);
            var boxh = Math.randomFrom(60,120);
            var rotate = Math.randomFrom(0,360);

            this.box = new alcedo.canvas.graphic.Rectangle(boxw,boxh);
            this.box.pivotX = 0.5;this.box.pivotY = 0.5;
            this.box.x = Math.randomFrom(120,this.stage.width-120);
            this.box.y = Math.randomFrom(120,this.stage.height-120);
            this.box.rotation = rotate;
            var box = new SAT.Box(new SAT.Vector(this.box.x, this.box.y),this.box.width,this.box.height);
            this.boxbody = box.toPolygon();
            this.boxbody.offset.x = -this.box.pivotOffsetX;
            this.boxbody.offset.y = -this.box.pivotOffsetY;
            this.boxbody.setAngle(rotate * alcedo.Constant.DEG_TO_RAD);

            trace(this.boxbody,this.boxbody.edges[0].x,this.box.actualLeftTop())
            trace(this.circlebody);

            var boxbound:any = new canvas.DisplayGraphic();
            boxbound._graphicfn = (ctx)=>{
                ctx.beginPath();
                for(var i=0;i<this.boxbody.edges.length;i++){
                    var next = i+1;
                    if(next==this.boxbody.edges.length)next =0;
                    drawLineFromTo(ctx,{x:this.boxbody.edges[i].x+this.boxbody.pos.x
                        ,y:this.boxbody.edges[i].y+this.boxbody.pos.y}
                        ,{x:this.boxbody.edges[next].x+this.boxbody.pos.x
                        ,y:this.boxbody.edges[next].y+this.boxbody.pos.y})
                }

                ctx.stroke();
                ctx.lineWidth=1;
                ctx.strokeStyle='#8e44ad';
            };
            boxbound.alpha=0.66;
            function drawLineFromTo(ctx,point:canvas.Ixy,point2:canvas.Ixy){
                ctx.moveTo(point.x,point.y);
                ctx.lineTo(point2.x,point2.y);
            }
            this.stage.addChild(boxbound)

            this.stage.addChild(this.box);
            this.stage.addChild(this.circle);

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{

                this.box.rotation++;
                this.boxbody.setAngle(this.box.rotation * alcedo.Constant.DEG_TO_RAD);

                this.circlebody.pos.x = this.circle.x;
                this.circlebody.pos.y = this.circle.y;
                this.resoponse.clear();
                if(SAT.testCirclePolygon(this.circlebody,this.boxbody,this.resoponse)){
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