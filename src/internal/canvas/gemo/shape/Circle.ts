/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo {
    export module canvas {
        export class Circle {

            public center:Point2D;

            public radius:number;

            public constructor(center:Point2D,r:number){
                this.center = center;

                this.radius = r;
            }
        }
    }
}