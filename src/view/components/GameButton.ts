/**
 * Created by tommyZZM on 2015/4/13.
 */
module game {
    export class GameButton {
        private _btn:alcedo.dom.DomElement;
        private _texture:alcedo.canvas.Texture;

        public constructor(ele:alcedo.dom.DomElement,texture:alcedo.canvas.Texture){

            this._btn = ele;
            this._texture = texture;

            this._btn.css({
                background: "url("+texture.sourceUrl+")",//"#fff",//"url("+texture.sourceUrl+")",
                "background-size": "cover",
                "-webkit-background-size": "cover"
            });
            this._btn.transition = 300;

            this.width = texture._sourceWidth;
            //this.x = 0;this.y = 0;

            this._btn.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN, ()=> {
                this._btn.scale(0.8, 200);
            }, this);

            this._btn.addEventListener(alcedo.dom.TouchEvent.TOUCH_END, ()=> {
                this._btn.scale(1, 100);
            }, this);
        }

        public fitsize:boolean = true;

        /**
         * width
         */
        public _width:number;
        public set width(width:number){
            this._width = width;
            this._btn.css({width: this._width + "px"});
            if(this.fitsize){
                this.fitsize = false;
                this.height = this._width / this._texture._sourceW2H;
                this.fitsize = true;
            }
        }

        public get width(){
            return this._width;
        }

        /**
         * height
         */
        public _height:number;
        public set height(height:number){
            this._height = height;
            this._btn.css({height: this._height + "px"});
            if(this.fitsize){
                this.fitsize = false;
                this.width = this._height * this._texture._sourceW2H;
                this.fitsize = true;
            }
        }

        public get height(){
            return this._height;
        }

        ///**
        // * x
        // */
        //private _x:number;
        //public set x(x:number){
        //    this._x = x;
        //    this._btn.css({left: alcedo.dom.px(x-this._width)})
        //}
        //public get x(){
        //    this._x = alcedo.toValue(this._btn.abscss().left)+this._width;
        //    return this._x;
        //}
        //
        ///**
        // * y
        // */
        //private _y:number;
        //public set y(y:number){
        //    this._y = y;
        //    this._btn.css({top: alcedo.dom.px(y-this._height)})
        //}
        //public get y(){
        //    this._y = alcedo.toValue(this._btn.abscss().top)+this._height;
        //    return this._y;
        //}

        /**
         * index
         */
        public set index(index:number){
            this._btn.css({"z-index":index})
        }

        /**
         * ele
         */
        public get e(){
            return this._btn;
        }
    }
}