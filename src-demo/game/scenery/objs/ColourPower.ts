/**
 * Created by tommyZZM on 2015/5/23.
 */
module game {
    export class ColourPower extends Entity {
        public velocitystatic = true;

        public constructor(){
            super();
            this._display = new canvas.graphic.Circle(10,"#e67e22");
        }

        public set fillColour(c:string){
            (<canvas.graphic.Circle>this._display).fillcolour = c;
        }
    }
}