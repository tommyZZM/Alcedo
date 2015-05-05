/**
 * Created by tommyZZM on 2015/4/23.
 */
///<reference path="../ExampleCycler.ts"/>
module demo {
    export class MovieClipExample extends ExampleCycler {
        protected run(){
            MovieClipRepository()
                .praseMovieClipData(AsyncRES().get("smallalcedo_json")
                ,TextureRepository().get("smallalcedo_png"));

            var mc = new alcedo.canvas.MovieClip(MovieClipRepository().get("smallalcedo"));
            mc.play();
            //mc.playToAndStop(1,1);
            mc.x = stage.width()/2;
            mc.y = stage.height()/2;
            mc.pivotX(0.5);
            mc.pivotY(0.5);
            //mc.scaleALL(0.5);
            stage.addChild(mc);

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, ()=> {
                mc.rotation++;
            }, this)

            trace(mc)
        }
    }
}