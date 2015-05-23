/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{

    export class JetBird extends Entity{

        private _bodybox:sat.Box;

        public constructor(){
            super(new JetBirdSkin());
            this._bodybox = new sat.Box(new sat.Vector(0,0),(this.display.width-42)*this.display.scaleX
                ,this.display.height*this.display.scaleY);
            this._body = this._bodybox.toPolygon();

            this.debugBody();
        }

        private debugBody(){
            if(!alcedo.core(GameCycler).debug)return;
            var debug = new canvas.graphic.Rectangle(this._bodybox.w/this.display.scaleX
                ,this._bodybox.h/this.display.scaleY,"#e74c3c");
            //debug.pivotX = debug.pivotY = 0.5;
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
            //this.bird.pivotX = 0.5;
            //this.bird.pivotY = 0.5;

            this.pivotX = 0.5;
            this.pivotY = 0.5;
            this.scaleALL(0.5);

            this.width = this.bird.width;
            this.height = this.bird.height;

            trace(this.bird.width,this.bird.height);

            this._smoke =  new alcedo.canvas.ParticleEmitter({spread:6,max:60,rate:20});
            this._smoke.play();

            this._smokepos = new alcedo.canvas.Vector2D(0.2,0.16);

            var pos:any = this.bird.localToGlobal(this.width*this._smokepos.x
                ,this.height*this._smokepos.y);//
            this._smoke.x = pos.x;
            this._smoke.y = pos.y;

            this.addChild(this._smoke);
            this.addChild(this.bird);
        }
    }
}