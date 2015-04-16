/**
 * Created by tommyZZM on 2015/4/16.
 */
module game{
    export class GameUIComponent {
        protected _com:alcedo.dom.DomElement;
        protected _texture:alcedo.canvas.Texture;

        public constructor(ele:alcedo.dom.DomElement, texture:alcedo.canvas.Texture) {
            this._com = ele;
            this._texture = texture;
            if(!this._texture){
                return;
            }

            this._com.css({
                background: "url("+this._texture.sourceUrl+")",
                "background-size": "cover",
                "-webkit-background-size": "cover"
            });
            //this._com.transition = 300;

            this.width = texture._sourceWidth;
        }

        public fitsize:boolean = true;

        /**
         * width
         */
        public _width:number;
        public set width(width:number){
            this._width = width;
            this._com.css({width: this._width + "px"});
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
            this._com.css({height: this._height + "px"});
            if(this.fitsize){
                this.fitsize = false;
                this.width = this._height * this._texture._sourceW2H;
                this.fitsize = true;
            }
        }

        public get height(){
            return this._height;
        }

        /**
         * index
         */
        public set index(index:number){
            this._com.css({"z-index":index})
        }

        /**
         * ele
         */
        public get e(){
            return this._com;
        }
    }
}