/**
 * Created by tommyZZM on 2015/5/27.
 */
module example {
    export class ColourfulParticleExample extends ExampleCycler {

        private _startcolour:Array<number>;
        private _currcolour:Array<number>;

        public static colour:string = "#40d47e";

        protected run(){

            var v = new alcedo.canvas.Vector2D(0,-5);
            var pe = new alcedo.canvas.ParticleEmitter({initial:v,spread:20,max:30,rate:16,particleClass:Particle});
            pe.x = this.stage.width/2;
            pe.y = this.stage.height/2+50;

            this.stage.addChild(pe);
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));

            this._startcolour = Art.HexToRGB(ColourfulParticleExample.colour);
            this._currcolour = this._startcolour.copy();
            this.targetcolour = this.getTargetColour();

            var step = [];
            step.push(parseInt(<any>((this.targetcolour[0]-this._startcolour[0])/60)));
            step.push(parseInt(<any>((this.targetcolour[1]-this._startcolour[1])/60)));
            step.push(parseInt(<any>((this.targetcolour[2]-this._startcolour[2])/60)));

            trace(this._startcolour,step,this.targetcolour);//TODO:Still Bug here;

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{
                for(var i=0;i<3;i++){
                    if(this._currcolour[i]!=this.targetcolour[i]){
                        this._currcolour[i] += step[i];
                    }else{
                        this._currcolour[i] = this._startcolour[i]
                    }
                }

                ColourfulParticleExample.colour = Art.RGBToHex(this._currcolour);
                //trace(this._currcolour)
            },this)
        }


        private targetcolour:any;
        private getTargetColour(){
            var sort:any,result = [];
            sort = this._startcolour.copy();
            for(var i = 0;i<sort.length;i++){
                var curr = i-1;
                if(curr>2)curr=0;
                if(curr<0)curr=2;
                result.push(sort[curr]);
            }
            return result;
        }
    }

    class Particle extends canvas.Particle{

        protected display(renderer:canvas.CanvasRenderer){
            var context = renderer.context;
            context.beginPath();
            context.arc(0, 0, 6, 0, 2 * Math.PI, false);
            context.fillStyle = this._colour;
            context.fill();
        }

        private _colour:string;
        protected prebron():boolean{
            this._colour = ColourfulParticleExample.colour;
            this.scale.x+=0.05;
            this.scale.y+=0.05;
            if(this.scale.x>1.6){
                this.scale.x = 1.6;
                this.scale.y = 1.6;
                return true;
            }
        }
    }

    enum ColourArea{
        Red=0,
        Green=1,
        Bule=2
    }

    function quickSort(array){
        function sort(prev, numsize){
            var nonius = prev;
            var j = numsize -1;
            var flag = array[prev];
            if ((numsize - prev) > 1) {
                while(nonius < j){
                    for(; nonius < j; j--){
                        if (array[j] < flag) {
                            array[nonius++] = array[j];　//a[i] = a[j]; i += 1;
                            break;
                        };
                    }
                    for( ; nonius < j; nonius++){
                        if (array[nonius] > flag){
                            array[j--] = array[nonius];
                            break;
                        }
                    }
                }
                array[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numsize);
            }
        }
        sort(0, array.length);
        return array;
    }
}