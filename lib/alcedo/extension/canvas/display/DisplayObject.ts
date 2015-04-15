/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class DisplayObject extends EventDispatcher{
            /**位置**/
            protected _position:Point2D;

            /**描点**/
            protected _pivot:Vector2D;

            /**缩放**/
            protected _scale:Vector2D;

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
            protected _worldalpha:number;
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
                this._pivot = new Vector2D(0,0);
                this._scale = new Vector2D(1,1);

                this._worldtransform = new Matrix2D();
                this._staticboundingbox = new Rectangle()
            }

            public get x(){return this._position.x}
            public set x(x:number){
                this._position.x = x;
                this._staticboundingbox.x =x-this.pivotOffsetX;
            }
            public get y(){return this._position.y}
            public set y(y:number){
                this._position.y = y;
                this._staticboundingbox.y =y-this.pivotOffsetY;
            }

            public get width(){return this._staticboundingbox.width}
            public set width(width:number){
                this._staticboundingbox.width =width
            }
            public get height(){return this._staticboundingbox.height}
            public set height(height:number){
                this._staticboundingbox.height =height
            }

            public set pivotX(x:number){
                this._pivot.x =x;
            }

            public set pivotY(y:number){
                this._pivot.y =y;
            }

            public get pivotOffsetX(){
                return this._pivot.x*this._staticboundingbox.width;
            }

            public get pivotOffsetY(){
                return this._pivot.y*this._staticboundingbox.height;
            }

            public scale(ax:number,y?:number){
                if(!y){
                    this._scale.x = ax;
                    this._scale.y = ax;
                }else{
                    this._scale.x = ax;
                    this._scale.y = y;
                }
            }

            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            public _transform(){
                var pt = this.parent?this.parent.worldtransform:Matrix2D.identity;
                var wt = this._worldtransform;

                wt.identity();
                wt.identityMatrix(pt);
                wt = this._getMatrix(wt);

                this._worldtransform = wt;
                this._worldalpha = this._alpha*(this.parent?this.parent.worldalpha:1);
            }

            /**
             * 碰撞检测,可以被重写
             * @private
             */
            public hitPointTest(point:Point2D):boolean{
                return this._staticboundingbox.contains(point)
            }

            public hitDisplayObjectTest(toHit:DisplayObject):boolean{
                return this._staticboundingbox.hitRectangelTest(toHit.staticBound)
            }

            /**
             * [只读]获得现实对象当前的静态包围盒
             * @returns {Rectangle}
             */
            public get staticBound():Rectangle{
                return Rectangle.identity.resetAs(this._staticboundingbox);
            }


            /**
             * 显示列表
             */
            /**父节点**/
            private _parent:DisplatObjectContainer = null;
            public get parent():DisplatObjectContainer{
                return this._parent;
            }

            private _setParent(parent:DisplatObjectContainer){
                this._parent = parent;
            }

            public removeFromParent(){
                if(this._parent)this._parent.removeChild(this)
            }

            /**
             * 每帧渲染
             * @private
             */
            public _draw(renderer:CanvasRenderer){
                //needs to be override;
            }

            protected _refresh(){

            }

            protected _createBitmapCache(){

            }

            protected _offset():any{
                var o = this;

                var offsetx = o._pivot.x * o._staticboundingbox.width;
                var offsety = o._pivot.y * o._staticboundingbox.height;

                var result = Point2D.identity;
                result.x = offsetx;
                result.y = offsety;

                return result;
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