/**
 * Created by tommyZZM on 2015/4/23.
 */
///<reference path="../ExampleCycler.ts"/>
module demo {
    export class MovieClipExample extends ExampleCycler {
        protected run(){
            MovieClipRepository()
                .praseMovieClipData(AsyncRES().get("smallstarling_json")
                ,TextureRepository().get("smallstarling_png"));

            var mc = new alcedo.canvas.MovieClip(MovieClipRepository().get("smallstarling"));
            mc.play();
            mc.x = stage.width()/2;
            mc.y = stage.height()/2;
            mc.scaleALL(0.5);
            stage.addChild(mc);
        }
    }
}