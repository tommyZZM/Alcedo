//相加
Math.add = function(...nums){
    var result:number = 0;
    for(var i=0;i<nums.length;i++){
        if(Number(nums[i])){
            result+=Number(nums[i])
        }else{
            //warn("add param must be type of number!",nums[i])
        }
    }
    return result;
};

//可能性分布概率池
Math.probabilityPool = function probabilityPool(pool:number[]) {
    if(pool.length == 1){
        pool.push(1-pool[0]);
    }

    var cdf = (<any>this.probabilityPool)._cache.get(pool);
    var y = Math.random();
    for (var x in cdf)
        if (y < cdf[x])
            return Number(x);
    return -1; // should never runs here, assuming last element in cdf is 1
};
/**缓存数组**/(<any>Math.probabilityPool)._cache = {
    pool: {},
    length: 0,
    get: function (array) {
        var cachename = array.join("_");
        if(!this.pool[cachename]){
            if(this.length>100){
                this.length=0;
                this.pool = {};
            }
            this.length++;
            this.pool[cachename] = (<any>Math.probabilityPool)._pdf2cdf(array);
        }
        return this.pool[cachename];
    }
};
/**逆变换取样**/(<any>Math.probabilityPool)._pdf2cdf = function(pdf) {
    var total = 0;
    for (var i = 0; i < pdf.length ; i++){
        total+=<number>pdf[i];
        if(total>1){
            total-=<number>pdf[i];
            //warn('total probability in',pdf," scene",pdf[i],'['+i+'] is > 1');
            pdf.splice(i,pdf.length-i);
            //trace("cuted",pdf,pdf.length-i);
            break;
        }
    }
    if(total<1){
        pdf.push(1);
    }

    var cdf = pdf.slice();
    for (var i = 1; i < cdf.length-1 ; i++){
        cdf[i] += cdf[i - 1];
    }

    // Force set last cdf to 1, preventing floating-point summing error in the loop.
    cdf[cdf.length-1] = 1;
    //trace(pdf,cdf,total)

    return cdf;
};

interface Math{
    add(...nums);
    probabilityPool(pool:number[]);
}