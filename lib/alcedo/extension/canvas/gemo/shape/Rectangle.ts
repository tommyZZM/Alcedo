/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class Rectangle {

            public static _identity:Rectangle = new Rectangle();
            public static identity(rect_or_x:number|Rectangle = 0, y:number = 0, width:number = 0, height:number = 0){
                if(typeof rect_or_x == "number"){
                    return Rectangle._identity.reset(<number>rect_or_x,y,width,height)
                }else{
                    return Rectangle._identity.resetAs(<Rectangle>rect_or_x)
                }
            }
            constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
                //super();
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }

            /**
             * 矩形左上角的 x 坐标。
             */
            public x:number;
            /**
             * 矩形左上角的 y 坐标。
             */
            public y:number;
            /**
             * 矩形的宽度（以像素为单位）。
             */
            public width:number;
            /**
             * 矩形的高度（以像素为单位）。
             */
            public height:number;

            /**
             * x 和 width 属性的和。
             */
            public get right():number {
                return this.x + this.width;
            }

            public set right(value:number) {
                this.width = value - this.x;
            }

            /**
             * y 和 height 属性的和。
             */
            public get bottom():number {
                return this.y + this.height;
            }

            public set bottom(value:number) {
                this.height = value - this.y;
            }

            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            public reset(x:number = 0, y:number = 0, width:number = 0, height:number = 0):Rectangle {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                return this;
            }

            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            public resetAs(rectangle:Rectangle):Rectangle {
                this.x = rectangle.x;
                this.y = rectangle.y;
                this.width = rectangle.width;
                this.height = rectangle.height;
                return this;
            }

            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
             */
            public contains(point:Point2D):boolean {
                var result:boolean = (this.x < point.x
                && this.x + this.width > point.x
                && this.y < point.y
                && this.y + this.height > point.y);

                return result;
            }

            /**
             * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
             */
            public hitRectangelTest(toHit:Rectangle):boolean {
                return Math.max(this.x, toHit.x) <= Math.min(this.right, toHit.right)
                    && Math.max(this.y, toHit.y) <= Math.min(this.bottom, toHit.bottom);
            }

            /**
             * 克隆矩形对象
             */
            public clone():Rectangle {
                return new Rectangle(this.x, this.y, this.width, this.height);
            }


        }
    }
}