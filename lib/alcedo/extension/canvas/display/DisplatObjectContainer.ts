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

            public _transform(){
                super._transform();
                this.eachChilder((child)=>{
                    child._transform();
                })
            }

            public _draw(renderer:CanvasRenderer){
                this.eachChilder((child)=>{
                    child._draw(renderer);
                })
            }

            addChild(child:DisplayObject){
                child.removeFromParent();
                this._children.push(child);
                (<any>child)._setParent(this);

            }

            removeChild(child:DisplayObject){
                var i = this._children.indexOf(child);
                if(i>=0){
                    this._children.splice(i,1);
                    (<any>child)._setParent(null);
                }
            }

            removeChildren(){
                this._children = [];
            }

            eachChilder(fn:(child)=>void){
                for(var i=0;i<this._children.length;i++){
                    fn.call(this,this._children[i]);
                }
            }

            protected _setRoot(){
                super._setRoot();
                this.eachChilder((child)=>{
                    if(child instanceof DisplatObjectContainer){
                        child._setRoot();
                    }else{
                        child._root = this._root;
                    }
                })
            }

            public isInViewPort():boolean{
                return true;
                //nothing
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