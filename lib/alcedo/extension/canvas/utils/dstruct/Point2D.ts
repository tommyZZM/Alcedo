/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class Point2D {
            public x:number;

            public y:number;

            public static identity:Point2D = new Point2D();
            public constructor(x:number=0,y:number=0){
                //super();
                this.x = x;
                this.y = y;
            }

            /**
             * 克隆点对象
             */
            public clone():Point2D {
                return new Point2D(this.x, this.y);
            }

            /**
             * 设置X,y
             */
            public reset(x:number=0,y:number=0){
                this.x = x;
                this.y = y;
            }

            /**
             * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
             */
            public equals(target:Point2D):boolean {
                return this.x == target.x && this.y == target.y;
            }
        }
    }
}