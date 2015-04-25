/**
 * Created by tommyZZM on 2015/4/25.
 */
Object.defineProperty(Array.prototype, 'fastRemove', {
    value: function (index:number) {
        var __arr:any = this;
        var result = __arr[index];
        __arr[index] = __arr.pop();
        if(index==0) {this.length = 0;}
        return result;
    },enumerable: false
});

interface Array<T>{
    prototype;

    /**
     * 快速移除某个元素，默认会以最后一个元素填充到移除元素的位置，返回移除的元素。
     * @param index
     */
    fastRemove(index:number);
}