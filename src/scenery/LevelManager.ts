/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    /**
     * 游戏关卡,地图管理器...
     */
    export class LevelManager extends alcedo.AppProxyer {
        private static instanceable:boolean = true;

        private _levellayer:alcedo.canvas.DisplatObjectContainer;

        private _levelspool:Array<any>;

        private _lastlevel:Level;
        private _currlevel:Level;
        private _nexlevel:Level;

        private _off:boolean;

        public constructor(){
            super();
            this._levelspool = [];
            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.checkLevels,this);
        }

        public init(mainground:PlayGround){
            this._levellayer = mainground.levellayer;
            var levels = AsyncRES().find(/level_\w+/i);
            if(levels.length>0){
                for(var i=0;i<levels.length;i++){
                    this._levelspool.push(new Level(levels[i]));
                }
            }
        }

        public startLevel(positionx:number){
            this.resetAllLevels();

            this._off = false;

            this._currlevel = this.selectOneLevel();
            this._currlevel.x = positionx+stage.width()/2+100;
            this._currlevel.y = -20;
            this._currlevel.active();
            this._levellayer.addChild(this._currlevel);
            this.createNextLevel();
            trace("startlevel",this._levellayer.children);
        }

        private createNextLevel(){
            this._nexlevel = this.selectOneLevel();
            if(!this._nexlevel)return;
            this._nexlevel.x = this._currlevel.x+this._currlevel.width()+10;
            this._nexlevel.y = Math.randomFrom(-20,-30);
            this._levellayer.addChild(this._nexlevel);
            trace("createNextLevel",this._levelspool);
        }

        private destoryLevel(level:Level){
            this._levellayer.removeChild(level);
            if(this._levelspool.indexOf(level)>=0 || !level)return;
            this._levelspool.push(level);
            trace("destoryLastLevel",this._levelspool)
        }

        private checkLevels(){
            if(this._currlevel && !this._off && He162S.reference){
                //检查当前场景是否已经从视图中离去;
                if(!this._currlevel.isInViewPort()&&this._currlevel.x<He162S.reference.b.x){
                    this._currlevel.disactive();
                    this._lastlevel = this._currlevel;
                    this._currlevel = this._nexlevel;
                    this._currlevel.active();
                    this.createNextLevel();
                }

                if(this._lastlevel &&!this._lastlevel.isInViewPort()&&this._lastlevel.x<stage.viewPort().x){
                    this.destoryLevel(this._lastlevel);
                }
            }
        }

        public turnOffAllLevels(){
            //重置关卡
            this._off = true;
        }

        private resetAllLevels(){
            this.destoryLevel(this._currlevel);
            this.destoryLevel(this._nexlevel);
            this.destoryLevel(this._lastlevel);
        }

        private selectOneLevel():Level{
            //创建关卡
            var result = this._levelspool.randomselect();
            //trace(this._levelspool,result);
            var _index = this._levelspool.indexOf(result);
            this._levelspool.splice(_index,1)
            return result;
        }

    }



    /**
     *
     */
    export interface InLevel{

    }

    export enum LevelObjectType{
        DarkCloud=1,//乌云
        WhiteCloud=2,//白色云彩
        ClourPower=3,//彩色能量
        RainBow=6//彩虹
    }

    export enum LevelShapeType{
        Rect=1,
        Circle=2,
        PointLine=3,
        Uuknow=-1
    }
}