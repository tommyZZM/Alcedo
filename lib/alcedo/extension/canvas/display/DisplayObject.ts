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
                this.updateBound(x)
            }
            public get y(){return this._position.y}
            public set y(y:number){
                this._position.y = y;
                this._staticboundingbox.y =y-this.pivotOffsetY();
                this.updateBound(null,y);
            }

            public width(width?:number):any{
                if(!width)return this._staticboundingbox.width;
                this.updateBound(null,null,width);

                this._staticboundingbox.width =width;
                return this;
            }

            public height(height?:number):any{
                if(!height)return this._staticboundingbox.height;
                this.updateBound(null,null,null,height);
                return this;
            }

            protected updateBound(x?,y?,width?,height?){
                if(typeof x == "number")this._staticboundingbox.x =x-this.pivotOffsetX();
                if(typeof y == "number")this._staticboundingbox.y =y-this.pivotOffsetY();
                if(typeof width == "number")this._staticboundingbox.width =width;
                if(typeof height =="number")this._staticboundingbox.height =height;
            }

            public pivotX(x?:number){
                if(x===undefined)return this._pivot.x;
                this._pivot.x =x;
                this.updateBound(this.x);
            }

            public pivotY(y?:number){
                if(y===undefined)return this._pivot.y;
                this._pivot.y =y;
                this.updateBound(null,this.y);
            }

            public pivotOffsetX(offsetx?:number){
                if(offsetx===undefined)return this._pivot.x*this._staticboundingbox.width;
                this.pivotX(offsetx/this._staticboundingbox.width);
            }

            public pivotOffsetY(offsety?:number){
                if(offsety===undefined)return this._pivot.y*this._staticboundingbox.height;
                this.pivotY(offsety/this._staticboundingbox.height);
            }

            public scale(ax:number,y?:number){
                if(!y){
                    if(ax==1){return;}
                    this.scaleX(ax);
                    this.scaleY(ax);
                }else{
                    this.scaleX(ax);
                    this.scaleY(y);
                }
            }

            public scaleToWidth(width:number){
                var _scale = width/this._staticboundingbox.width;
                this.scale(_scale);
            }

            public scaleToHeight(height:number){
                var _scale = height/this._staticboundingbox.height;
                this.scale(_scale);
            }

            public scaleX(scalex?:number){
                if(!scalex)return this._scale.x;
                this._scale.x = scalex;
            }

            public scaleY(scaley?:number){
                if(!scaley)return this._scale.y;
                this._scale.y = scaley;
            }

            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            public _transform(){
                var flag = !!this._parent,
                    pt = Matrix2D.identity,
                    wt = this._worldtransform;

                if(flag)pt = this._parent["_worldtransform"];

                wt.identityMatrix(pt);
                this._getMatrix(wt);

                //this._worldtransform = wt;
                this._worldalpha = flag?(this._alpha*this._parent["_worldalpha"]):this._alpha;
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
            public get boundBox():Rectangle{
                return this._staticboundingbox.clone();
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
                this.removeFromParent();
                this._parent = parent;
                if(!this._parent){
                    this._root = null;
                    return;
                }
                if(!this._parent._root|| (this._parent._root && this._root && this._parent._root.hashIndex != this._root.hashIndex)){
                    this._setRoot();
                }
            }

            protected _setRoot(){
                var parent = this._parent;
                if(!parent)return;
                var _root = parent;
                if(_root._parent){
                    while(_root._parent){
                        _root = parent._parent;
                    }
                }
                this._root = _root;

                if(this.isAddtoStage()){
                    this.emit(DisplayObjectEvent.ON_ADD_TO_STAGE);
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