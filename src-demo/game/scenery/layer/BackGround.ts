/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class BackGround extends SceneryGround {
        private _clouds:BackGroundClouds;
        protected startUp(){
            this._clouds = new BackGroundClouds(0.8);
            this.addChild(this._clouds);
        }

        protected resResetScenery(e:any){
            //TODO:
            this._clouds.eachChilder((child)=>{
                child.x-=e.x;
                //child.x+= this._clouds.opts.startpos;
            })
        }
    }
}