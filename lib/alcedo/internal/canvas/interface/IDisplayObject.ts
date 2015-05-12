/**
 * Created by tommyZZM on 2015/4/25.
 */
module alcedo{
    export module canvas{
        export interface IDisplayObject{
            position;
            scale;
            rotation;
            _transform();//对象的矩阵变换
            _draw(renderer:CanvasRenderer|any);//对象的显示
        }
    }
}