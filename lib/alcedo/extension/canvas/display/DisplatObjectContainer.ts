/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module canvas{
        export class DisplatObjectContainer extends DisplayObject implements IDisplatObjectContainer{
            protected _children:Array<DisplayObject>;

            public constructor(){
                super();
                this._children = [];
            }

            public get children(){
                return this._children
            }

            public _transform(){
                super._transform();
                this.eachChilder((child)=>{
                    child._transform();
                })
            }

            protected _render(renderer:CanvasRenderer){
                this.eachChilder((child)=>{
                    child._render(renderer);
                })
            }

            public addChild(child:DisplayObject){
                var success = this._addChild(child);
                if(!success)return;
                child.emit(DisplayObjectEvent.ON_ADD,{parent:this,index:this._children.length-1});
            }
            private _addChild(child):boolean{
                if(child.parent==this)return false;
                this._children.push(child);
                (<any>child)._setParent(this);
                return true;
            }

            public addChildAt(child:DisplayObject,index:number){
                var success = this._addChild(child);
                if(!success)return;
                this.setChildIndex(child,index);
                child.emit(DisplayObjectEvent.ON_ADD,{parent:this});
            }

            public setChildIndex(child:DisplayObject,index:number){
                var lastIdx = this._children.indexOf(child);
                if (lastIdx < 0) {
                    return;
                }
                //从原来的位置删除
                this._children.splice(lastIdx, 1);
                //放到新的位置
                if (index < 0 || this._children.length <= index) {
                    this._children.push(child);
                }
                else {
                    this._children.splice(index, 0, child);
                }
            }

            public removeChild(child:DisplayObject){
                var i = this._children.indexOf(child);
                if(i>=0){
                    this._children.splice(i,1);
                    (<any>child)._setParent(null);
                    child.emit(DisplayObjectEvent.ON_REMOVE,{parent:this});
                }
            }

            public removeChildren(){
                this.eachChilder((child)=>{
                    child._setParent(null);
                });
                this._children = [];
            }

            public eachChilder(fn:(child)=>void){
                for(var i=0;i<this._children.length;i++){
                    fn.call(this,this._children[i]);
                }
            }

            protected _onAdd(){
                super._onAdd();
                this.eachChilder((child)=>{
                    child._root = this._root;
                    child._onAdd();
                })
            }
        }

        export interface IDisplatObjectContainer{
            //children:Array<DisplayObject>;
            addChild(child:DisplayObject);
            removeChild(child:DisplayObject);
            removeChildren();
            eachChilder(fn:(child)=>{});
        }
    }
}