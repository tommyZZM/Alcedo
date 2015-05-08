/**
 * Created by tommyZZM on 2015/5/8.
 */
module game{
    export class ColourPower implements InLevel{

        private _sourcepointsdata:Array<any>;
        private _pointsdata:Array<alcedo.canvas.Point2D>;
        private _bzcurve:alcedo.canvas.Bezier2D;

        private _powers:Array<LittlePower>;

        public constructor(pointdata){
            this._sourcepointsdata = pointdata;
            this._pointsdata = [];
            this._powers = [];
            this.createAllPowers();
        }

        public eachPower(fn:(power)=>void){
            trace(this._powers);
            for(var i=0;i<this._powers.length;i++){
                fn(this._powers[i]);
            }
        }

        private createAllPowers(){
            for(var i=0;i<this._sourcepointsdata.length;i++){
                this._pointsdata.push(new alcedo.canvas.Point2D(this._sourcepointsdata[i].x,this._sourcepointsdata[i].y));
            }

            this._bzcurve = new alcedo.canvas.Bezier2D(this._sourcepointsdata,
                +(Math.randomFrom(this._sourcepointsdata.length*3-2,this._sourcepointsdata.length*3+2).toFixed(0)));

            this._bzcurve.eachPointsOnCurve((point)=>{
                var power = new LittlePower();
                power.b.x = point.x;
                power.b.y = point.y;

                this._powers.push(power);
            })
        }
    }

    export class LittlePower extends LogicObject{
        public constructor(){
            super();
            this._display = new alcedo.canvas.graphic.Circle(0,0,8,"#f1c40f");
        }
    }
}