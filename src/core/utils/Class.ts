//Ecmascript Multiplexing OO expand
//function getClassName(obj:any):string{
//    //class?
//    if (obj.prototype) {
//        if (obj.prototype.__class__ && obj.prototype.constructor){
//            return obj.prototype.__class__;
//        }
//    }else if(obj.__proto__){
//        if (obj.__proto__.__class__ && obj.__proto__.constructor){
//            return obj.__proto__.__class__;
//        }
//    }else{
//        //console.warn(obj,'is not a class!');
//        return undefined;
//    }
//}

//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * 获取类名,不包括命名空间
 * @param obj
 * @returns {string}
 */
function getClassName(obj:any):string{
    //class?
    if(obj.prototype && obj.prototype.constructor){
        return obj.prototype.constructor["name"];
    }else if (obj.__proto__ && obj.__proto__.constructor) {
        return obj.__proto__.constructor["name"];
    }else if(obj instanceof Object){
        return "Object";
    }else{
        //console.warn(obj,'is not a class!');
        return undefined;
    }
}


/**
 * 判断类型是否继承?类型
 * @returns {boolean}
 * @param targetClass
 * @param testClass
 */
function isOfClass(targetClass,testClass):boolean{
    if(!targetClass.prototype||!targetClass.prototype.constructor){
        //console.warn("not typescript class");
        return false;
    }

    return (targetClass.prototype.constructor.prototype instanceof testClass)
}
//function isOfClass(target,test):boolean{
//    if(!target||!target.prototype||!target.prototype['__class__'] || !test.prototype['__class__']){
//        console.warn(target,"not typescript class");
//        return false;
//    }
//
//    if(target.prototype['__class__']==test.prototype['__class__']){
//        return true;
//    }else{
//        var flag:number = 0;
//        var protoTest = (target,test)=>{
//            //console.log(target.__class__,test.prototype['__class__'])
//            if(target){
//                if(target.__class__){
//                    if(target.__class__ == test.prototype['__class__']){
//                        return 1;
//                    }else{
//                        return 0;
//                    }
//                }
//                return -1
//            }
//            return -1
//        };
//
//        target = target.prototype.__proto__;
//        while(flag==0){
//            flag = protoTest(target,test);
//            target = target.__proto__;
//        }
//        return flag == 1;
//    }
//}


function expandMethod(method:string|Function,target:Function,thisArg?:any):Function{
    var _method:Function;
    if(typeof method=="string"){
        if(!thisArg || !thisArg['__proto__'][<any>method] || !(thisArg['__proto__'][<any>method] instanceof Function)){return target;}
        _method = thisArg['__proto__'][<any>method];
        target["_origin"] = _method.bind(thisArg);
        thisArg['__proto__'][<any>method] = target;
    }else{
        if(!(<any>method instanceof Function)){return target;}
        _method = <Function>method;
        target["_origin"] = _method.bind(thisArg);
    }
    return target;
}