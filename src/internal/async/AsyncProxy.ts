/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module async {
        /**Ajax请求**/
        export function ajax(url:string,
                             args:{async?:boolean;success:Function;error?:Function;method?:string;data?:any;user?:string;password?:string;responseType?:string;courier?:any}, thisArg?:any):void {
            if(args.async==undefined){args.async = true}
            (<AsyncProxy>a$.core(AsyncProxy)).ajax(url,<any>args,thisArg);
        }

        /**异步载入图片**/
        export function asyncImage(url,args:{success:Function;error?:Function;courier?:any},thisArg?:any){
            (<AsyncProxy>a$.core(AsyncProxy)).asyncImage(url,args,thisArg);
        }

        export class AsyncProxy extends AppSubCore{
            public static instanceable:boolean = true;

            public constructor(){
                super();
            }

            private bindcallback(args:any,thisArg?:any){
                if(thisArg){
                    if(args.success)args.success = args.success.bind(thisArg);
                    if(args.error)args.error   = args.error.bind(thisArg);
                }
                return args;
            }

            /**
             * ajax方法
             * @param url
             * @param method
             * @param args
             * @param thisArg
             */
            public ajax(url:string,
                           args:{async:boolean;success:Function;error?:Function;method?:string;data?:any;user?:string;password?:string;responseType?:string;courier?:any},thisArg?:any):void {

                //default value;
                var xhr = this.getXHR();
                args.method = args.method?args.method:"get";
                if(args.responseType==RequestDataType.BINARY){
                    xhr.responseType = RequestDataType.BINARY;
                }
                if(args.responseType == RequestDataType.BINARY){
                    //warn(url,"AjaxResponseType.BINARY require method of post")
                    args.method = "post";
                }
                args = this.bindcallback(args,thisArg);

                if(!checkNormalType(args.data)||args.data){
                    var _datastr = "";
                    for(var i in args.data){
                        if(checkNormalType(args.data[i])){
                            _datastr += "&"+i+"="+args.data[i];
                        }
                    }
                    args.data = _datastr;
                }

                xhr.onreadystatechange = ()=>{
                    // 4 = "finish"
                    if (xhr.readyState == 4){
                        if (xhr.status == 200) {
                            var data = "";
                            switch (args.responseType){
                                default :
                                case RequestDataType.TEXT:{
                                    data = xhr.responseText;
                                    break;
                                }
                                case RequestDataType.JSON:{
                                    //TODO:tryCatch隔离
                                    tryExecute(()=>{
                                        data = JSON.parse(xhr.responseText);
                                    },()=>{
                                        console.warn("data is not a json type",{data:xhr.responseText})
                                    });
                                    break;
                                }
                                case RequestDataType.BINARY:{
                                    data = xhr.response;
                                    break;
                                }
                            }
                            args.success(data,args.courier);
                        }

                        if(xhr.stage>=400){
                            args.error(xhr.status);
                        }
                    }
                };
                xhr.open(args.method, url, args.async, args.user, args.password);
                if (args.method == RequestMethod.GET || !args.data) {
                    xhr.send();
                }
            }

            private getXHR():any {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                } else if(window["ActiveXObject"]){
                    return new ActiveXObject("MSXML2.XMLHTTP");
                } else{
                    console.error("XMLHttpRequest not support on this device!")
                }
            }

            private _asyncimagepool:Dict = new Dict();
            public asyncImage(url:string,args:{success:Function;error?:Function;courier?:any},thisArg?:any){
                args = this.bindcallback(args,thisArg);

                if(!this._asyncimagepool.has(url)){
                    var image = new Image();
                    image.onload = ()=>{
                        this._asyncimagepool.set(url,image);
                        args.success(this._asyncimagepool.get(url),args.courier)
                    };
                    image.onerror = <any>args.error;
                    image.src = url;
                }else{
                    args.success(this._asyncimagepool.get(url),args.courier);
                }
            }
        }
    }
}