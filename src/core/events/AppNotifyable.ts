/**
 * Created by tommyZZM on 2015/4/4.
 */
module alcedo {
    export class AppNotifyable{

        public static registNotify(notifymap:Dict,name:string,callback:Function,thisObject:any,param?:Array<any>,priority?:number){//,reserve?:any
            if(!notifymap.has(name))notifymap.set(name,[]);
            var map = notifymap.get(name);

            var length = map.length;
            var insertIndex:number = -1;

            if(priority===undefined)priority=0;
            for (var i:number = 0; i < length; i++) {
                var bin:any = map[i];
                if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                    return false;//防止重复插入
                }
                if (bin && insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }

            var bin:any = {callback:callback,thisObject:thisObject,param:param?param:[],priority:priority};
            if (insertIndex != -1) {
                map.splice(insertIndex, 0, bin);
            }
            else {
                map.push(bin);
            }
            notifymap.set(name,map);
        }

        public static unregistNotify(notifymap:Dict,name:string,callback:Function,thisObject:any){
            if(!notifymap.has(name))return;
            var map = notifymap.get(name);
            if(map){
                //var length = map.length;
                for(var i in map){
                    var bin = map[i];
                    if(bin&&bin.callback===callback && bin.thisObject===thisObject){
                        map.splice(i, 1);
                    }
                }
                notifymap.set(name,map);
            }
        }

        public static notify(notifymap:Dict, name:string,param?:Array<any>):boolean{
            var map = notifymap.get(name);
            if(map){
                this.notifyArray(map,param);
                return true;
            }else{
                return false;
            }
        }

        public static notifyArray(arr:Array<{callback:Function;thisObject:any;param:Array<any>}>,param?:Array<any>){
            var length = arr.length;
            for(var i=0;i<length;i++){
                var bin = arr[i];
                if(bin&&bin.callback){
                    if(!param)param=[];
                    if(bin.param)param = bin.param.concat(param);
                    bin.callback.apply(bin.thisObject,param)
                }
            }
        }
    }
}