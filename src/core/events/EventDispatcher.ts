/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class EventDispatcher extends AppObject{

        protected _eventsMap:Dict;

        public constructor() {
            super();
            this._eventsMap = new Dict();
        }

        public addEventListener(event:string, listener:Function, thisObject:any,priority?:number):void{
            AppNotifyable.registNotify(this._eventsMap,event,listener,thisObject,null,priority);
        }

        public clearEventListener(event:string){
            this._eventsMap.set(event,[]);
        }

        public removeEventListener(event:string, listener:Function, thisObject:any):void{
            AppNotifyable.unregistNotify(this._eventsMap,event,listener,thisObject);
        }

        public dispatchEvent(event:Event):any{
            AppNotifyable.notify(this._eventsMap,event.type,[event])
        }

        public emit(event:string, data:any=undefined):any{
            AppNotifyable.notify(this._eventsMap,event,[data])
        }
    }
}