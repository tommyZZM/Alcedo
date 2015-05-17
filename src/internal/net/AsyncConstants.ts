/**
 * Created by tommyZZM on 2015/4/9.
 */
module alcedo{
    export module net{
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

        export class DataType{
            public static TEXT:string = "text";
            public static JSON:string = "json";
            public static IMAGE:string = "image";
            public static SOUND:string = "sound";
            public static SCRIPT:string = "script";
        }
    }
}