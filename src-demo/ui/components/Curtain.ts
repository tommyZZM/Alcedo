/**
 * Created by tommyZZM on 2015/5/4.
 */
module game{
    export class Curtain{
        private _ele:alcedo.dom.DomElement;

        public constructor(){
            if(Curtain._instance){
                warn("use Curtain.instance replace");
                return;
            }
            this._ele = alcedo.d$.query("#curtain")[0];
            this.lastwidth =this._ele.width();
            this.lastheight =this._ele.height();
            //trace(this.lastwidth,this._ele.width())
            this._ele.css({width:0,height:0});
        }

        public show(callback?:Function,thisObject?:any,param?:Array<any>){
            this._ele.css({width:this.lastwidth ,height:this.lastheight });

            //trace("Curtain show",this.lastwidth,this.lastheight);

            if(!this._ele.hasClass("disactive")){
                if(callback)callback.apply(thisObject,param)
            }else{
                this._ele.then(()=>{
                    this._ele.removeClass("disactive");
                    this._ele.then(()=>{
                        if(callback)callback.apply(thisObject,param)
                    });
                })
            }
        }

        private lastwidth:string;
        private lastheight:string;

        public hide(callback?:Function,thisObject?:any,param?:Array<any>){
            //this._ele.show();
            //trace("Curtain hided");

            this._ele.addClass("disactive");

            this._ele.then(()=>{
                if(this._ele.width()!=="0px"&&this._ele.width()!=="auto"&&this._ele.width()!=="0"){
                    this.lastwidth =this._ele.width();
                    this.lastheight =this._ele.height();
                }
                this._ele.css({width:0,height:0});
                if(callback)callback.apply(thisObject,param)
            })
        }

        private static _instance:Curtain;
        public static get instance():Curtain{
            if(this._instance)return this._instance;

            this._instance=new Curtain();
            return this._instance;
        }
    }
}