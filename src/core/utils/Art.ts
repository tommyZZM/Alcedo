/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module art{
        export function HexToColorString(value:number):string{
            if(isNaN(value)||value < 0)
                value = 0;
            if(value > 16777215)
                value = 16777215;
            var color:string = value.toString(16).toUpperCase();
            while(color.length<6){
                color = "0"+color;
            }
            return "#"+color;
        }

        var _rcolourhex:RegExp = /(0x|#)?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i;
        export function StringToColorHex(value:string):number{
            var _result:any = _rcolourhex.exec(value+"");
            if(_result && _result[2] && _result[3] && _result[4]){
                _result = "0x"+_result[2]+_result[3]+_result[4]
            }

            return +_result;
            //return "#"+color;
        }

        export function HexToRGB(value:number|string):Array<number>{
            var _result:any = _rcolourhex.exec(value+"");
            _result = [
                parseInt( _result[ 2 ], 16 ),
                parseInt( _result[ 3 ], 16 ),
                parseInt( _result[ 4 ], 16 )
            ];

            return _result;
        }

        export function RGBToHex(r:number|Array<any>,g?:number,b?:number){
            var _r=r,_g=g,_b=b;
            if(Array.isArray(r)){
                _r = r[0];
                _g = r[1];
                _b = r[2];
            }
            return "#"+_r.toString(16)+_g.toString(16)+_b.toString(16)
        }
    }
}