/**
 * Created by tommyZZM on 2015/5/8.
 */
module game{
    export class ColourPower implements InLevel{

        private _sourcepointsdata:Array<any>;
        private _pointsdata:Array<alcedo.canvas.Point2D>;
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
            for(var i=0;i<this._sourcepointsdata.length-1;i++){
                var segment = new alcedo.canvas.Segment2D(this._sourcepointsdata[i],this._sourcepointsdata[i+1])
                this.createLinePowers(segment);
            }
        }

        private createLinePowers(segment:alcedo.canvas.Segment2D){
            //trace(segment)
            var points = this.randomCutSegment(segment,Math.randomFrom(10,12)>>0)
            this._pointsdata = this._pointsdata.concat(points);

            for(var i=0;i<this._pointsdata.length;i++){
                var power = new LittlePower();
                power.b.x = this._pointsdata[i].x;
                power.b.y = this._pointsdata[i].y;

                this._powers.push(power);
            }
            //trace(this._pointsdata)
        }

        private randomCutSegment(segment:alcedo.canvas.Segment2D,cuts:number):alcedo.canvas.Point2D[]{
            var _cuts = cuts++

            var minlength = segment.length/_cuts*0.8;
            var maxlength = segment.length/_cuts;
            var vector = segment.vector;

            var result = [];

            //把一枚线段分段
            var countlength = 0;
            for(var i=0;i<cuts-1;i++){
                var _length = Math.randomFrom(minlength,maxlength);
                countlength += _length;
                vector.length = countlength;
                trace(vector.x,vector.y);
                result.push(segment.begin.clone().add(vector));
            }

            //trace(countlength,segment.length)

            return result;
        }
    }

    export class LittlePower extends LogicObject{
        public constructor(){
            super();
            this._display = new alcedo.canvas.graphic.Circle(0,0,10,"#f1c40f");
        }
    }
}