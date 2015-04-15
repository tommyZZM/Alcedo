/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo {
    export module canvas {
        export class Segment2D{
            /**
             *
             * 创建一个 canvas.Segment2D (二维线段) 对象
             * @param begin Point2D(x,y)
             * @param end Point2D(x,y)
             */
            public begin:Point2D;
            public end:Point2D;

            public static identity:Segment2D = new Segment2D(Point2D.identity,Point2D.identity);
            public constructor(begin:Point2D,end:Point2D){
                this.begin = begin;
                this.end   = end;
            }

            /**
             * 转换成二维向量
             */
            public toVector2D(){

            }
        }
    }
}