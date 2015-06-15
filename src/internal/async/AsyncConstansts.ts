/**
 * Created by tommyZZM on 2015/6/15.
 */
module alcedo{
    export module async{
        export class RequestMethod {
            public static GET:string = "get";
            public static POST:string = "post";
        }

        export class RequestDataType {
            /**
             * 指定以原始二进制数据形式接收下载的数据。
             */
            public static BINARY:string = "binary";

            /**
             * 指定以文本形式接收已下载的数据。
             */
            public static TEXT:string = "text";
            /**
             * 指定以JSON形式接收已下载的数据。
             */
            public static JSON:string = "json";
        }
    }
}