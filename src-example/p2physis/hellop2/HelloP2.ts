/**
 * Created by tommyZZM on 2015/5/14.
 */
module example{
    export class HelloP2 extends ExampleCycler{

        private world:p2.World;
        private boxbody:p2.Body;
        private boxskin:alcedo.canvas.graphic.Rectangle;

        private circlebody:p2.Body;
        private circleskin:alcedo.canvas.graphic.Circle;

        //protected size = {
        //    width:480,
        //    height:320
        //};
        //

        protected run(){
            this.world = new p2.World({
                gravity: [0, -98.1]
            });

            // Add a plane
            var planeShape = new p2.Plane();
            var planeBody = new p2.Body({position:[0,0]});
            planeBody.addShape(planeShape);
            this.world.addBody(planeBody);

            // Add a box
            var boxShape = new p2.Rectangle(100,100);
            this.boxbody = new p2.Body({ mass:1, position:[this.stage.stageWidth/2+Math.randomFrom(-20,20),this.stage.stageHeight-100],angularVelocity:1 });
            this.boxbody.addShape(boxShape);
            this.world.addBody( this.boxbody);
            this.boxskin = new alcedo.canvas.graphic.Rectangle(0,0,100,100);
            this.boxskin.pivotX = 0.5;this.boxskin.pivotY = 0.5;
            this.boxskin.x = this.boxbody.position[0];
            this.boxskin.y = this.boxbody.position[1];
            this.stage.addChild(this.boxskin);

            // Add a circle
            var r = +Math.randomFrom(25,60)
            var circleshape = new p2.Circle(r);
            this.circlebody = new p2.Body({ mass:1, position:[this.stage.stageWidth/2+Math.randomFrom(-50,50),this.stage.stageHeight/2],angularVelocity:1 });
            this.circlebody.addShape(circleshape);
            this.world.addBody( this.circlebody);
            this.circleskin = new alcedo.canvas.graphic.Circle(0,0,r);
            this.circleskin.pivotX = 0.5;this.circleskin.pivotY = 0.5;
            this.circleskin.x = this.circleskin.position[0];
            this.circleskin.y = this.circleskin.position[1];
            this.stage.addChild(this.circleskin);

            this.stage.scaleY = -1;
            this.stage.y = this.stage.stageHeight;

            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_FRAME,(e:alcedo.canvas.ITickerEvent)=>{
                this.world.step(1/60);
                this.boxskin.x = this.boxbody.position[0];
                this.boxskin.y = this.boxbody.position[1];
                this.boxskin.rotation = this.boxbody.angle*alcedo.canvas.Constant.RAD_TO_DEG;

                this.circleskin.x = this.circlebody.position[0];
                this.circleskin.y = this.circlebody.position[1];
                this.circleskin.rotation = this.circlebody.angle*alcedo.canvas.Constant.RAD_TO_DEG;

                //console.log(this.boxbody.position)
            },this)
        }
    }
}