/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module encrypt{
        export class SimpleEncode{
            public static encode(str):Array<number> {
                var byteArray:any = new Uint8Array(str.length * 3);

                var offset = 0;
                for (var i = 0; i < str.length; i++) {
                    var charCode = str.charCodeAt(i);
                    var codes:any;
                    if (charCode <= 0x7f) {
                        codes = [charCode];
                    } else if (charCode <= 0x7ff) {
                        codes = [0xc0 | (charCode >> 10), 0x80 | (charCode & 0x3f)];
                    } else {
                        codes = [0xe0 | (charCode >> 20), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
                    }
                    for (var j = 0; j < codes.length; j++) {
                        byteArray[offset] = codes[j];
                        ++offset;
                    }
                }
                var result:any = [];
                for(var i=0;i<byteArray.length;i++){
                    result.push(byteArray[i])
                }
                for(var i=result.length-1;i>0;i--){
                    if(result[i]==0){result.splice(i,1)}
                }
                return result;
            }
            public static decode(_bytes:Array<number>):string{
                //array => unit8array
                for(var i=_bytes.length-1;i>0;i--){
                    if(_bytes[i]==0){_bytes.splice(i,1)}
                }
                var bytes = new Uint8Array(_bytes);

                var array = [];
                var offset = 0;
                var charCode = 0;
                var end = bytes.length;
                while (offset < end) {
                    if (bytes[offset] < 128) {
                        charCode = bytes[offset];
                        offset += 1;
                    } else if (bytes[offset] < 224) {
                        charCode = ((bytes[offset] & 0x3f) << 10) + (bytes[offset + 1] & 0x3f);
                        offset += 2;
                    } else {
                        charCode = ((bytes[offset] & 0x0f) << 20) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                        offset += 3;
                    }
                    array.push(charCode);
                }
                var result = String.fromCharCode.apply(null, array);
                result.replace(" ","");
                return result;
            }
        }

        function copyArray(dest, doffset, src, soffset, length) {
            if ('function' === typeof src.copy) {
                // Buffer
                src.copy(dest, doffset, soffset, soffset + length);
            } else {
                // Uint8Array //←干丫的
                for (var index = 0; index < length; index++) {
                    dest[doffset++] = src[soffset++];
                }
            }
        }
    }
}