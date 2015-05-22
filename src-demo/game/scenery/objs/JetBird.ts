/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{

    export class JetBird extends Entity{
        public constructor(){
            super(new JetBirdSkin());
            this._body = new sat.Box(new sat.Vector(0,0),this.display.bird.actualWidth()
                ,this.display.bird.actualHeight()).toPolygon();
            trace(this._body,this.display.bird)
            this.debugBody();
        }

        public sync(){
            if(!this._body)return;
            this._body.pos["x"] = this._display.globalx;
            this._body.pos["y"] = this._display.globaly;
            if(this._body instanceof sat.Polygon){
                this._body["offset"].x = -this.display.bird.pivotX*this.display.bird.actualWidth();
                this._body["offset"].y = -this.display.bird.pivotY*this.display.bird.actualHeight();
                this._body.setAngle(this.display.rotation * alcedo.Constant.DEG_TO_RAD);
            }
        }

        private debugBody(){
            if(!alcedo.core(GameCycler).debug)return;
            var debug = new canvas.graphic.Rectangle(this.display["bird"].actualWidth()
                ,this.display["bird"].actualHeight(),"#e74c3c");
            debug.pivotX = debug.pivotY = 0.5;
            debug.alpha = 0.3;
            (<any>this.display).addChild(debug);

            var boxbound:any = new canvas.DisplayGraphic();
            boxbound._graphicfn = (ctx)=>{
                ctx.beginPath();
                for(var i=0;i<this.body.edges.length;i++){
                    var next = i+1;
                    if(next==this.body.edges.length)next =0;
                    drawLineFromTo(ctx,{x:this.body.edges[i].x+this.body.pos.x
                            ,y:this.body.edges[i].y+this.body.pos.y}
                        ,{x:this.body.edges[next].x+this.body.pos.x
                            ,y:this.body.edges[next].y+this.body.pos.y})
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

            //this.display.addEventListener(canvas.DisplayObjectEvent.ON_ADD_TO_STAGE,()=>{
            //    (<any>this.display).root.addChild(boxbound)
            //},this)
        }
    }

    export class JetBirdSkin extends canvas.DisplatObjectContainer{
        public constructor(){
            super();
            this.compose();
        }

        public bird:alcedo.canvas.MovieClip;
        private _smoke:alcedo.canvas.ParticleEmitter;
        private _smokepos:alcedo.canvas.Vector2D;
        private compose(){
            alcedo.core(canvas.MovieClipRepository)
                .praseMovieClipData(alcedo.core(net.AsyncRES).get("smallalcedo_json")
                ,alcedo.core(canvas.TextureRepository).get("smallalcedo_png"));

            this.bird = new alcedo.canvas.MovieClip(alcedo.core(canvas.MovieClipRepository).get("smallalcedo"));
            this.bird.pivotX = 0.5;
            this.bird.pivotY = 0.5;
            this.bird.scaleALL(0.5);

            this.pivotX = 0.5;
            this.pivotY = 0.5;

            this._smoke =  new alcedo.canvas.ParticleEmitter({spread:6,max:60,rate:20});
            this._smoke.play();

            this._smokepos = new alcedo.canvas.Vector2D(-0.5,-0.5);

            var pos:any = this.bird.localToGlobal(this.bird.actualBound().width*this._smokepos.x+this.bird.pivotOffsetX
                ,this.bird.actualBound().height*this._smokepos.y+this.bird.pivotOffsetY);//
            this._smoke.x = pos.x;
            this._smoke.y = pos.y;

            this.addChild(this._smoke);
            this.addChild(this.bird);
        }
    }
}