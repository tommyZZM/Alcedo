/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export class Constant {

        public static PI:number = 3.14;
        /**
         * @property {Number} PI_2
         */
        public static PI_2:number = Math.PI * 2;

        /**
         * @property {Number} RAD_TO_DEG
         */
        public static RAD_TO_DEG:number = 180 / Math.PI;

        /**
         * @property {Number} DEG_TO_RAD
         */
        public static DEG_TO_RAD:number = Math.PI / 180;

        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        public static sin(value:number):number {
            var result = 0;
            if (value % (Constant.PI_2*Constant.RAD_TO_DEG)) {
                result = Math.sin(value)
            } else {
                result = 0;
            }
            return result;
        }

        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        public static cos(value:number):number {
            var result = 0;
            if (value % (Constant.PI_2*Constant.RAD_TO_DEG)) {
                result = Math.cos(value)
            } else {
                result = 1;
            }
            return Math.cos(value);
        }
    }
}