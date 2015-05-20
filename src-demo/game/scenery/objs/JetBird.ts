/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{
    export class JetBird extends canvas.DisplatObjectContainer{
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