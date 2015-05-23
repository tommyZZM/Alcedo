/**
 * Created by tommyZZM on 2015/5/16.
 */
module example {
    export class HelloWorld extends ExampleCycler {

        protected run(){
            var v = new alcedo.canvas.Vector2D(0,-5);
            var pe = new alcedo.canvas.ParticleEmitter({initial:v,spread:20,max:30,rate:16});

            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));

            var a = new alcedo.canvas.DisplatObjectContainer();
            a.addChild(pe);
            this.stage.addChild(a);
            a.x = this.stage.width/2;
            a.y = this.stage.height/2;

            var sp:any = new canvas.graphic.Circle(this.stage.width>>1,this.stage.height>>1);
            sp.radius = 10;
            //a.addChild(sp);
            a.scaleALL(0.5)

            pe.rotation = 10;
            trace(pe);

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{
                //trace(a.worldtransform)
            },this)

            return;

            var sp:any = new canvas.graphic.Circle(this.stage.width>>1,this.stage.height>>1);
            sp.radius = 10;
            this.stage.addChild(sp);
            sp.acceleration = new canvas.Vector2D();
            sp.velocity = new canvas.Vector2D(1,1);

            trace(sp.force);

            var locuspoint = [];

            var locus:canvas.DisplayGraphic = new canvas.DisplayGraphic();
            locus._graphicfn = (context)=>{
                for(var i=0;i<locuspoint.length;i++){
                    context.beginPath();
                    context.fillStyle = "#ea6153";
                    context.arc(locuspoint[i].x, locuspoint[i].y, 1, 0, 2 * Math.PI, false);
                    context.closePath();
                    context.fill();
                }
            };
            this.stage.addChild(locus);

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{
                sp.force = sp.velocity.normalize().clone();
                sp.force.length = applyCircularForce(5,5);

                sp.acceleration = sp.force;// /m(1)

                sp.velocity.x+=sp.acceleration.x;
                sp.velocity.y+=sp.acceleration.y;

                sp.x+=sp.velocity.x;
                sp.y+=sp.velocity.y;

                sp.velocity.length =  5*alcedo.Constant.DEG_TO_RAD*5;

                if(locuspoint.length<100){
                    locuspoint.push({x:sp.x,y:sp.y});
                }

                //trace(sp.velocity.length)

                //trace(sp.x,sp.y);

            },this);

            var applyCircularForce = function(deg:number,r:number){
                var _deg =deg*alcedo.Constant.DEG_TO_RAD;
                return _deg*_deg*r;
            }
        }
    }
}