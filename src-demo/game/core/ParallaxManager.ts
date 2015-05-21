/**
 * Created by tommyZZM on 2015/5/19.
 */
module game{
    export class IParalaxReference{
        deltaX
    }

    export class ParallaxManager extends alcedo.AppSubCore{
        private static instanceable = true;

        private CHECK_DELAY:number = 20;
        private _checkdelay:number = 0;
        public startUp(){
            if(!stage){warn(this.className,"startup fail")}
            this._parallaxscenery = new Dict();
            this._checkdelay = this.CHECK_DELAY;
            stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,this.update,this,-9);

            alcedo.addDemandListener(GameState,GameState.PREPLAY,this.resetPosToZero,this,2);
            alcedo.addDemandListener(GameState,GameState.HELLO,this.resetPosToZero,this,2);
        }

        private _ref:Entity;
        public referenceObject(ref:Entity){
            this._ref = ref;
        }

        private resetPosToZero(){
            //把布景重置
            var parallaxs:any = this._parallaxscenery.values;
            for(var i=0;i<parallaxs.length;i++) {
                var parallax = parallaxs[i];
                var child = parallax.container.children[0];
                parallax.container.x = 0;
                parallax.container.removeChildren();
                if(child){
                    child.x = 0;
                    parallax.container.addChild(child);
                }
            }
        }

        private update(e){
            //trace(alcedo.core(CameraManager).dx);
            var parallaxs:any = this._parallaxscenery.values;
            if(parallaxs.length===0 || !this._ref){
                return;
            }

            //检查视差布景体是否已经离开场景

            for(var i=0;i<parallaxs.length;i++){
                var parallax = parallaxs[i];
                //trace(this._ref.velocity.x);
                parallax.container.x += (this._ref.velocity.x * parallax.depth * e.delay);
                var children = parallax.container.children.copy();
                var lastchild = children.last;

                for(var j=0;j<children.length-1;j++){
                    var child:any = children[j];
                    if((!child.isInViewPort())&&((child.globalx)<(stage.viewPort.x-child.actualWidth()))){
                        parallax.pool.push(child);
                        child.removeFromParent();
                        //trace("remove");
                    }
                    //trace(parallax.container.x+child.x,stage.viewPort.x-120)
                }
                //检查并创建新的视差布景(每200毫秒检查一次)
                //trace(i,parallax,this._checkdelay,this.CHECK_DELAY,this._checkdelay===this.CHECK_DELAY);
                if(this._checkdelay===this.CHECK_DELAY){
                    parallax.container.y = stage.height-parallax.offsety;
                    //trace(parallax.container.y)
                    children = parallax.container.children.copy();
                    if(children.length<parallax.maxcount){
                        for(var k = 0;k<(parallax.maxcount-children.length);k++){
                            var child:any;
                            if(parallax.pool.length>0 && parallax.pool.last instanceof canvas.Sprite){
                                child = parallax.pool.pop();
                                child.texture = parallax.textures.randomselect();
                            }else{
                                child = new canvas.Sprite(parallax.textures.randomselect());
                            }
                            //对象池

                            if(parallax.container.children.length>0){
                                lastchild = parallax.container.children.last;
                            }

                            if(lastchild){
                                child.x = lastchild.x+lastchild.actualBound().width;
                                //trace("other",child.x,lastchild.x,lastchild.actualBound().width)
                            }else{
                                child.x = parallax.beginx;//TODO:第一个物体起始点
                                //trace(child.x);
                                //trace("first",child.x,parallax.beginx,stage.viewPort.x, parallax.beginx || stage.viewPort.x)
                            }
                            child.y=0;
                            child.pivotX = 0;child.pivotY =1;

                            child.scaleToWidth(stage.stageWidth*parallax.widthprecent);
                            parallax.container.addChild(child);
                        }
                    }
                }

                //trace(parallax.container.x,He162S.reference.b.x,alcedo.core(CameraManager).dx,He162S.reference.velocity.x);
            }

            this._checkdelay++;
            if(this._checkdelay>this.CHECK_DELAY){
                this._checkdelay = 0;
            }
        }

        public _parallaxscenery:Dict;
        public addParallaxSceneryAt(ground:SceneryGround,textures:Array<any>|canvas.Texture
            ,opts:{name:string;depth:number;beginx?:number;offsety?:number;widthprecent?:number;alpha?:number;maxcount?:number}):canvas.DisplatObjectContainer{
            if(this._parallaxscenery.has(opts.name)){
                warn(opts.name,"already be taken... moreinfo",opts)
            }

            var _textures = textures;
            if(textures instanceof canvas.Texture){
                _textures = [textures];
            }
            //创建一个视差布景对象
            var parallax:IParallaxObject = {
                textures:_textures,//贴图
                depth:1/opts.depth,//深度参数(视差偏移量)
                beginx:opts.beginx?opts.beginx:0,//开始的x值
                offsety:opts.offsety||0,//
                widthprecent:opts.widthprecent||1,//宽度(相对于stage的百分百)
                alpha:opts.alpha||1,//alpha值
                maxcount:opts.maxcount||6,
                container:new canvas.DisplatObjectContainer(),
                pool:[]
            };

            parallax.container.y = stage.height-parallax.offsety;

            ground.addChild(parallax.container);
            this._parallaxscenery.set(opts.name,parallax)
            return parallax.container;
        }
    }

    export interface IParallaxObject{
        beginx:number;
        offsety:number;
        depth:number;
        widthprecent:number
        maxcount:number;
        container:canvas.DisplatObjectContainer
    }
}