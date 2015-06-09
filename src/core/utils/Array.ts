/**
 * Created by tommyZZM on 2015/4/25.
 *
 * Dont Try To Extend any interal Object
 *
 */
//Object.defineProperty(Array.prototype, 'fastRemove', {
//    value: function (index:number) {
//        var result = this[index];
//        if(this.length==1){
//            this.length=0;
//            return result;
//        }
//        this[index] = this.pop();
//        return result;
//    },enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'first', {
//    get : function () {
//        return this[0];
//    },
//    enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'last', {
//    get : function () {
//        return this[this.length-1];
//    },
//    enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'randomselect', {
//    value: function () {
//        if(this.length<1){return;}
//        if(this.length==1){return this[0];}
//        var i = Math.randomFrom(0,this.length)^0;
//        return this[i];
//    },enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'copy', {
//    value: function () {
//        var result = [];
//        for(var i=0;i<this.length;i++){
//            result[i]=this[i];
//        }
//        return result;
//    },enumerable: false
//});
//
//interface Array<T>{
//    prototype;
//
//    /**
//     * 快速移除某个元素，默认会以最后一个元素填充到移除元素的位置，返回移除的元素。
//     * @param index
//     */
//    fastRemove(index:number);
//
//    first:any
//    //最后一个元素
//    last:any
//
//    //随机选取一个元素
//    randomselect();
//
//    //复制一个数组
//    copy():Array<T>;
//}