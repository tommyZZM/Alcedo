/**
 * Created by tommyZZM on 2015/4/21.
 */
module game {
    /**
     * 镜头控制器
     */
    export class CameraManager extends alcedo.AppProxyer {
        private static instanceable:boolean = true;

        private _camera:alcedo.canvas.Camera2D;

        private _lookat:alcedo.canvas.Ixy;

        public init(camera:alcedo.canvas.Camera2D){
            this._camera = camera;
            //this._lookat = new alcedo.canvas.Point2D(stage.width()/2,stage.height()/2);

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this,Number.NEGATIVE_INFINITY)
        }

        public lookAt(target:alcedo.canvas.DisplayObject){
            this._lookat = <any>target;
        }

        private onEachTime(){
            if(this._lookat){
                this.updateCamera();
                this.limitTation();
            }
        }

        /**更新镜头**/ //TODO:镜头缓动;
        private updateCamera(){
            stage.camera().zoomTo(this._lookat.x,this._lookat.y,1,0.3,0.5);
        }

        private limitTation(){
            var viewfinder = this._camera.viewfinder();
            if(this._camera.viewfinder().height>stage.height()){
                this._camera.focal = 1;
            }
            if(viewfinder.bottom>stage.height()){
                this._camera.y = stage.height()-(viewfinder.height*(1-this._camera.yawY))
            }else if(viewfinder.y<=0){
                this._camera.focal = stage.height()/(stage.height()-viewfinder.y)
                //trace(this._camera.focal);
                if(this._camera.focal>2.3)this._camera.focal=2.3;
                //this._camera.y = viewfinder.height*this._camera.yawY
                //trace(this._camera.y,this._camera.yawY)
            }
        }
    }
}