/**
 * Created by tommyZZM on 2015/4/23.
 */
///<reference path="../ExampleCycler.ts"/>
module example {
    export class MovieClipExample extends ExampleCycler {
        protected run(){
            alcedo.core(alcedo.net.AsyncAssetsLoader)
                .addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE,this.onAssetsLoad,this);
            alcedo.core(alcedo.net.AsyncAssetsLoader).addConfig("resource/resource.json");
            alcedo.core(alcedo.net.AsyncAssetsLoader).loadGroup("preload")
        }

        private onAssetsLoad(){
            alcedo.core(canvas.MovieClipRepository)
                .praseMovieClipData(alcedo.core(alcedo.net.AsyncRES).get("smallstarling_json")
                ,alcedo.core(canvas.TextureRepository).get("smallstarling_png"));

            var mc = new alcedo.canvas.MovieClip(alcedo.core(canvas.MovieClipRepository).get("smallstarling"));
            mc.play();
            //mc.playToAndStop(1,1);
            mc.x = this.stage.width/2;
            mc.y = this.stage.height/2;
            mc.pivotX=0.6;
            mc.pivotY=0.8;
            mc.scaleALL(0.5);
            this.stage.addChild(mc);

            this.stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10, ()=> {
                mc.rotation++;
            }, this);
        }
    }
}