/**
 * Created by tommyZZM on 2015/5/14.
 */
module example{
    export class HelloP2 extends ExampleCycler{

        private world:p2.World;
        private boxbody:p2.Body;
        private boxskin:alcedo.canvas.graphic.Rectangle;

        //protected size = {
        //    width:480,
        //    height:320
        //};
        //

        protected run(){
            this.world = new p2.World({
                gravity: [0, -98.1]
            });
            // Add a box
            var boxShape = new p2.Rectangle(100,100);
            this.boxbody = new p2.Body({ mass:1, position:[this.stage.width()/2,this.stage.height()/2],angularVelocity:1 });
            this.boxbody.addShape(boxShape);
            this.world.addBody( this.boxbody);
            // Add a plane
            var planeShape = new p2.Plane();
            var planeBody = new p2.Body({position:[this.stage.width()/2,0]});
            planeBody.addShape(planeShape);
            this.world.addBody(planeBody);

            this.boxskin = new alcedo.canvas.graphic.Rectangle(0,0,100,100);
            this.boxskin.pivotX(0.5);this.boxskin.pivotY(0.5);
            this.boxskin.x = this.boxbody.position[0];
            this.boxskin.y = this.boxbody.position[1];
            this.stage.addChild(this.boxskin);

            this.stage.scaleY(-1);
            this.stage.y = this.stage._stageHeight;

            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_FRAME,(e:alcedo.canvas.ITickerEvent)=>{
                this.world.step(1/60);
                this.boxskin.x = this.boxbody.position[0];
                this.boxskin.y = this.boxbody.position[1];
                this.boxskin.rotation = this.boxbody.angle*alcedo.canvas.Constant.RAD_TO_DEG;

                //console.log(this.boxbody.position)
            },this)
        }
    }
}