/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class DisplayObject extends EventDispatcher implements IDisplayObject{

            protected static ON_UPDATE_BOUND:string = "DisplayObject_ON_UPDATE_BOUND";

            //public debug:boolean;

            /**位置**/
            protected _position:Point2D;
            public get position():Point2D{
                return this._position;
            }

            /**描点**/
            protected _pivot:Vector2D;

            /**缩放**/
            protected _scale:Vector2D;
            public get scale():Vector2D{
                return this._scale
            }
            protected _worldscale:Vector2D;

            /**矩阵变换**/
            protected _worldtransform:Matrix2D;
            public get worldtransform():Matrix2D{
                return this._worldtransform;
            }

            /**旋转**/
            protected _rotation:number = 0;
            public get rotation():number{
                return this._rotation;
            }
            public set rotation(angle:number){
                this._rotation = angle;
            }

            protected _visible:boolean = true;
            public get visible():boolean{
                return this._visible;
            }
            public set visible(boo:boolean){
                this._visible = boo;
            }

            protected _alpha:number = 1;
            protected _worldalpha:number = 1;
            public set alpha(alpha:number){
                this._alpha = alpha;
            }
            public get alpha():number{
                return this._alpha;
            }
            public get worldalpha():number{
                return this._worldalpha;
            }

            protected _staticboundingbox:Rectangle;//静态包围盒(不参与旋转)

            protected _dirty:boolean = false;

            protected _texture_to_render:any;//当前显示对象渲染的纹理

            protected _cacheAsBitmap:boolean = false;

            /**
             * 显示对象
             */
            public constructor(){
                super();
                this._position = new Point2D(0,0);
                this._globalposition = new Point2D();
                this._pivot = new Vector2D(0,0);
                this._scale = new Vector2D(1,1);
                this._worldscale = this._scale.clone();

                this._worldtransform = new Matrix2D();
                this._staticboundingbox = new Rectangle()
            }

            public get x(){return this._position.x}
            public set x(px:number){
                if(isNaN(px)){
                    //warn("nan",px);
                    return;
                }
                this._position.x = px;
                this._staticboundingbox.x =px-this.pivotOffsetY;
                this.updateBound(px)
            }
            public get y(){return this._position.y}
            public set y(px:number){
                if(isNaN(px))return;
                var _px = px;
                this._position.y = _px;
                this._staticboundingbox.y =_px-this.pivotOffsetY;
                this.updateBound(null,_px);
            }

            //待测试.可能有BUg
            private _globalposition:Point2D;
            public get globalx():number{
                this._updateGlobalPosition();
                return this._globalposition.x;
            }
            public get globaly():number{
                this._updateGlobalPosition();
                return this._globalposition.y;
            }
            private _updateGlobalPosition(){
                if(this._parent){
                    this._parent.localToGlobal(this._position.x, this._position.y, this._globalposition);
                }else{
                    this._globalposition.reset(this._position.x, this._position.y)
                }
            }

            public set width(px:number){
                if(isNaN(px))return;
                this.updateBound(null,null,px);
                this._staticboundingbox.width =px;
            }
            public get width(){
                return this._staticboundingbox.width;
            }

            public set height(px:number){
                if(isNaN(px))return;
                this.updateBound(null,null,null,px);
                this._staticboundingbox.height =px;
            }
            public get height(){
                return this._staticboundingbox.height;
            }

            private updateBound(x?,y?,width?,height?){
                if(typeof x == "number")this._staticboundingbox.x =x-this.pivotOffsetX;
                if(typeof y == "number")this._staticboundingbox.y =y-this.pivotOffsetY;
                if(typeof width == "number")this._staticboundingbox.width =width;
                if(typeof height =="number")this._staticboundingbox.height =height;
                //this.emit(DisplayObject.ON_UPDATE_BOUND,{x:x,y:y,width:width,height:height});
            }

            public get pivotX(){
                return this._pivot.x;
            }
            public set pivotX(value:number){
                this._pivot.x =value;
                this.updateBound(this.x);
            }
            public get pivotOffsetX(){
                return this._pivot.x*this._staticboundingbox.width;
            }
            public set pivotOffsetX(px:number){
                this.pivotX = px/this._staticboundingbox.width;
            }

            public get pivotY(){
                return this._pivot.y;
            }
            public set pivotY(value:number){
                this._pivot.y =value;
                this.updateBound(null,this.y);
            }
            public get pivotOffsetY(){
                return this._pivot.y*this._staticboundingbox.height;
            }
            public set pivotOffsetY(px:number){
                this.pivotY = px/this._staticboundingbox.height;
            }
            public scaleToWidth(width:number){
                var _scale = width/this._staticboundingbox.width;
                this.scaleALL(_scale);
            }
            public scaleToHeight(height:number){
                var _scale = height/this._staticboundingbox.height;
                this.scaleALL(_scale);
            }

            public scaleALL(value:number){
                this.scaleX = value;
                this.scaleY = value;
            }

            public get scaleX():number{
                return this._scale.x;
            }
            public set scaleX(value:number){
                this._scale.x = value;
            }

            public get scaleY():number{
                return this._scale.y;
            }
            public set scaleY(value:number){
                this._scale.y = value;
            }

            /**
             * 碰撞检测,可以被重写
             * @private
             */
            //public hitPointTest(point:Point2D):boolean{
            //    return this._staticboundingbox.contains(point)
            //}
            //
            //public hitDisplayObjectTest(toHit:DisplayObject):boolean{
            //    return this._staticboundingbox.hitRectangelTest(toHit.staticBound)
            //}

            /**
             * [只读]获得现实对象当前的静态包围盒
             * @returns {Rectangle}
             */
            public boundBox():Rectangle{
                return this._staticboundingbox.clone();
            }

            public isInViewPort():boolean{
                if(!this.isAddtoStage()){return false;}

                return (<Stage>this._root).viewPort.hitRectangelTest(this.boundBox());
            }

            /**
             * OverRide position method
             * 主要更新了可视包围盒，TODO:有Bug,待优化
             */
            protected _actualboundingbox:Rectangle = new Rectangle();
            public actualBound():Rectangle{
                //计算最大包围盒
                var _pointlefttop = this.actualLeftTop();
                var _pointrighttop = this.actualRightTop();
                var _pointrightbottom =this.actualRightBottom();
                var _pointleftbottom = this.actualLeftBottom();

                Rectangle.rectangleFromFourPoint(_pointlefttop,_pointrighttop,_pointrightbottom,_pointleftbottom,this._actualboundingbox);
                //
                //trace(this._actualboundingbox);
                return this._actualboundingbox;
            }

            public actualLeftTop():Point2D{
                return this.localToGlobal(0,0)
            }

            public actualRightTop():Point2D{
                return this.localToGlobal(this._staticboundingbox.width,0);
            }

            public actualRightBottom():Point2D{
                return this.localToGlobal(this._staticboundingbox.width
                    ,this._staticboundingbox.height);
            }

            public actualLeftBottom():Point2D{
                return this.localToGlobal(0,this._staticboundingbox.height);
            }

            public actualWidth():number{
                return this._actualboundingbox.width;
            }

            public actualHeight():number{
                return this._actualboundingbox.height;
            }

            /**
             * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
             * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
             * @method canvas.DisplayObject#localToGlobal
             * @param x {number} 本地x坐标
             * @param y {number} 本地y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于舞台的坐标的 Point 对象。
             */
            public localToGlobal(x:number = 0, y:number = 0, resultPoint?):Point2D {
                var mtx = this._getConcatenatedMatrix();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            }

            /**
             * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
             * @method canvas.DisplayObject#globalToLocal
             * @param x {number} 全局x坐标
             * @param y {number} 全局y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于显示对象的坐标的 Point2D 对象。
             */
            public globalToLocal(x:number = 0, y:number = 0, resultPoint?:Point2D):Point2D {
                var mtx = this._getConcatenatedMatrix();
                mtx.invert();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            }

            private static identityMatrixForGetConcatenated = new Matrix2D();

            protected _getConcatenatedMatrix():Matrix2D {
                //todo:----------------------------
                var matrix:Matrix2D = DisplayObject.identityMatrixForGetConcatenated.identity();
                var o = this;
                while (o != null && !(o instanceof Stage)) {
                    if (o._pivot.x != 0 || o._pivot.y != 0) {
                        var bounds = this.boundBox();
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0,
                            bounds.width * o._pivot.x, bounds.height * o._pivot.y);
                    }
                    else {
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0, o.pivotOffsetX, o.pivotOffsetY);
                    }
                    o = o._parent;
                }
                return matrix;
            }


            /**
             * 显示列表
             */
            /**父节点**/
            protected _parent:DisplatObjectContainer = null;
            public get parent():DisplatObjectContainer{
                return this._parent;
            }

            protected _setParent(parent:DisplatObjectContainer){
                if(this._parent === parent)return;
                this.removeFromParent();
                this._parent = parent;
                if(!this._parent){
                    this._root = null;
                    return;
                }
                //trace(getClassName(this),"_setParent",this._parent._root, this._root);
                var parent = this._parent;
                var _root = parent;
                while(_root._parent){
                    if(_root._parent===_root){
                        throw new Error("_root._parent===_root")
                    }
                    _root = _root._parent;
                    //trace(getClassName(this),_root,getClassName(_root))
                }
                this._root = _root;
                this._onAdd();
            }

            protected _stage:Stage;
            protected _onAdd(){
                //this.emit(DisplayObjectEvent.ON_ADD);
                if(this.isAddtoStage()){
                    this.emit(DisplayObjectEvent.ON_ADD_TO_STAGE);
                    this._stage = <any>this._root;
                }
            }

            public removeFromParent(){
                if(this._parent)this._parent.removeChild(this)
            }

            protected _root:DisplatObjectContainer = null;
            public get root():DisplatObjectContainer{
                return this._root;
            }

            public isAddtoStage():boolean{
                return this._root instanceof Stage;
            }

            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            //private _transformMatrix:Matrix2D = new Matrix2D();
            public _transform(){
                var flag = !!this._parent,
                    pt = Matrix2D.identity;

                if(flag)pt = this._parent._worldtransform;

                this._worldtransform.identityMatrix(pt);
                this._worldtransform = this._getMatrix(this._worldtransform);

                this._worldalpha = flag?(this._alpha*this._parent._worldalpha):this._alpha;

                this._worldscale.resetAs(this._scale);//shax
                if(flag)this._worldscale.multiply(this._parent._worldscale);
            }

            /**
             * 每帧渲染
             * @private
             */
            protected _render(renderer:CanvasRenderer){
                //处理其他通用的渲染步骤（滤镜，遮罩等）
                renderer.context.globalAlpha = this._worldalpha;
                renderer.setTransform(this._worldtransform);
                this._draw(renderer);
            }

            public _draw(renderer:CanvasRenderer){
                //绘制
                //needs to be override or extend;
            }

            protected _refreshBitmapCache(){

            }

            protected _createBitmapCache(){

            }

            protected _offset():any{
                var o = this;

                var offsetx = o._pivot.x * o._staticboundingbox.width;
                var offsety = o._pivot.y * o._staticboundingbox.height;

                return  Point2D.identity(offsetx,offsety);
                //return Point(0,0);
            }

            protected _getMatrix(matrix:Matrix2D):Matrix2D{
                var _matrix = matrix;
                if(!_matrix){
                    _matrix = Matrix2D.identity
                }

                var offsetPoint = this._offset();

                _matrix.appendTransform(this._position.x, this._position.y, this._scale.x, this._scale.y, this._rotation,
                    0, 0, offsetPoint.x, offsetPoint.y);

                return _matrix;
            }
        }
    }
}