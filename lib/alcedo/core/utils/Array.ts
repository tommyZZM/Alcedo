/**
 * Created by tommyZZM on 2015/4/25.
 */
Object.defineProperty(Array.prototype, 'fastRemove', {
    value: function (index:number) {
        var result = this[index];
        if(this.length==1){
            this.length=0;
            return result;
        }
        this[index] = this.pop();
        return result;
    },enumerable: false
});

Object.defineProperty(Array.prototype, 'last', {
    get : function () {
        return this[this.length-1];
    },
    enumerable: false
});

interface Array<T>{
    prototype;

    /**
     * 快速移除某个元素，默认会以最后一个元素填充到移除元素的位置，返回移除的元素。
     * @param index
     */
    fastRemove(index:number);

    last:any
}