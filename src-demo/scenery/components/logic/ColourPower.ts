/**
 * Created by tommyZZM on 2015/5/8.
 */
module game{
    export class ColourPowerGroup implements InLevel{

        private _sourcepointsdata:Array<any>;
        private _pointsdata:Array<alcedo.canvas.Point2D>;
        private _bzcurve:alcedo.canvas.Bezier2D;

        private _powers:Array<LittlePower>;

        public constructor(pointdata){
            this._sourcepointsdata = pointdata;
            this._pointsdata = [];
            this._powers = [];
        }

        public eachPower(fn:(power)=>void){
            //trace(this._powers);
            for(var i=0;i<this._powers.length;i++){
                fn(this._powers[i]);
            }
        }

        public createPowers(container:alcedo.canvas.DisplatObjectContainer){
            this.createAllPowers();
            this.eachPower((power)=>{
                container.addChild(power.b)
            });
        }

        public destoryPowers(container:alcedo.canvas.DisplatObjectContainer){
            this.eachPower((power)=>{
                LittlePower.distory(power);
                container.removeChild(power.b)
            });
            this._powers = [];
        }

        private createAllPowers(){
            for(var i=0;i<this._sourcepointsdata.length;i++){
                this._pointsdata.push(new alcedo.canvas.Point2D(this._sourcepointsdata[i].x,this._sourcepointsdata[i].y));
            }

            this._bzcurve = new alcedo.canvas.Bezier2D(this._sourcepointsdata,
                +(Math.randomFrom(this._sourcepointsdata.length,this._sourcepointsdata.length+2).toFixed(0)));

            this._bzcurve.eachPointsOnCurve((point)=>{
                var power = LittlePower.new();
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

        /**
         * 对象池
         */
        private _index:number;
        private static _powerspool:Array<LittlePower> = [];
        public static new():LittlePower{
            var p = this._powerspool.pop();
            if(!p){
                p = new LittlePower();
            }
            alcedo.proxy(CollisionManager).registPower(p);
            return p;
        }

        public static distory(p:LittlePower):void{
            if(this._powerspool.indexOf(p)<0){
                this._powerspool.push(p);
                alcedo.proxy(CollisionManager).unregistPower(p);
            }
        }

    }
}