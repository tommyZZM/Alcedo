/**
 * Created by tommyZZM on 2015/5/25.
 */
module example{
    export import dom = alcedo.dom;

    export class HelloPixi extends alcedo.AppCycler{

        private stage:alcedo.Stage;

        protected cmdStartup(){

            this.stage = new alcedo.Stage(dom.query("#helloworld")[0],320,480,{
                orient:true,
                backgroundColor:"0xecf0f1",
                profiler:true
            });

            this.stage.addEventListener(alcedo.Stage.ENTER_SECOND,()=>{
                //trace("hi");
            },this);

            alcedo.dom.resize(this.onResize,this);
        }

        private onResize(){
            var _domwidth = alcedo.dom.width();
            var _domheight = alcedo.dom.height();

            this.stage.canvas.css({width:_domwidth+"px",height:_domheight+"px"});
            this.stage.resizeContext();
            if(this.stage.orientchanged){
                this.stage.canvas.css({width:_domheight+"px",height:_domwidth+"px"});
                this.stage.warpper.css({
                    width:_domheight+"px",
                    height:_domwidth+"px"
                });
                this.stage.warpper.css({left:((_domwidth-_domheight)/2).toFixed(0)+"px"});
                this.stage.warpper.css({top:((_domheight-_domwidth)/2).toFixed(0)+"px"});
                this.stage.warpper.css_transform_rotate(-90)
            }else{
                this.stage.warpper.css({width:_domwidth+"px",height:_domheight+"px"});
                this.stage.warpper.css({top:"0px",left:"0px"});
                this.stage.warpper.css_transform_rotate(0)
            }
        }
    }
}