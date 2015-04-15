/**
 * Created by tommyZZM on 2015/4/3.
 */
module alcedo{
    export class EventDispatcher extends AppNotifyable{

        protected _eventTarget:any;

        protected _eventsMap:Dict;

        public constructor() {
            super();
            this._eventTarget = this;
            this._eventsMap = new Dict();
        }

        public addEventListener(event:string, listener:Function, thisObject:any,priority?:number):void{
            this.registNotify(this._eventsMap,event,listener,thisObject,null,priority);
        }

        public removeEventListener(event:string, listener:Function, thisObject:any):void{
            this.unregistNotify(this._eventsMap,event,listener,thisObject);
        }

        public dispatchEvent(event:Event):any{
            this.notify(this._eventsMap,event.type,[event])
        }

        public emit(event:string, data:any=undefined):any{
            this.notify(this._eventsMap,event,[data])
        }
    }
}