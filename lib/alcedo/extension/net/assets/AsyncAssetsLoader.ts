/**
 * Created by tommyZZM on 2015/4/9.
 */
module alcedo {
    export module net {
        export class AsyncAssetsLoader extends AppProxyer{
            private static instanceable:boolean = true;

            private _basedir:string;

            private _thread:number = 2;/**最大并发鲜橙树**/
            private _threadCound:number = 0;

            private _assets_pool:Dict;
            private _assets_configs:Dict;

            private _assets_groups:Dict;
            private _assets_groups_waitingload:Array<any>;
            private _assets_groups_loading:Dict;
            private _assets_groups_loaded:Dict;

            public constructor(){
                super();
                this._assets_groups_loading = new Dict();
                this._assets_groups_loaded = new Dict();

                this._assets_pool = new Dict();
                this._assets_groups = new Dict();
                this._assets_configs = new Dict();

                this._assets_groups_waitingload = [];

                this._basedir = window.location.href.replace(/\w+\.(html|htm)$/,"");
            }

            public addConfig(configurl:string){
                if(this._assets_configs.has(configurl)){return;}
                var _configurl = configurl.indexOf("://")<0?(this._basedir+"/"+configurl):configurl;
                this._assets_configs.set(_configurl,{configed:false,refdir:_configurl.replace(/\w+\.json$/,"")});
                ajax(_configurl,{
                    success:(data)=>{
                        var i,_config = JSON.parse(data);
                        this._assets_configs.get(_configurl).configed = true;
                        for(i=0;i<_config.resources.length;i++){
                            this._assets_pool.set(_config.resources[i].name,_config.resources[i]);
                        }
                        for(i=0;i<_config.groups.length;i++){
                            if(!this._assets_groups.has(_config.groups[i].name)){
                                _config.groups[i].loaded = false;
                                _config.groups[i].refdir = _configurl.replace(/\w+\.json$/,"");
                                this._assets_groups.set(_config.groups[i].name,_config.groups[i]);
                            }
                        }
                        this.loadGroup(this._assets_groups_waitingload);
                    }
                })
            }

            public loadGroup(...names){
                var i,j,_names,_name;
                if(Array.isArray(names[0]))names = names[0];
                if(names.length<1)return;
                for(i=0;i<this._assets_configs.size;i++){
                    if(!this._assets_configs.values[i].configed){
                        _names = [];
                        for(j=0;j<names.length;j++){
                            if(this._assets_groups_waitingload.indexOf(names[j])<0){
                                _names.push(names[j]);
                            }
                        }
                        this._assets_groups_waitingload = this._assets_groups_waitingload.concat(_names);
                        return;
                    }
                }
                this._assets_groups_waitingload = [];
                //trace(names,this._assets_groups_waitingload);
                for(i=0;i<names.length;i++){
                    _name = names[i];
                    if(this._assets_groups.has(_name)&&!this._assets_groups_loaded.get(_name)){
                        var assetsobjs = [],
                            assets:any = this._assets_groups.get(_name).keys;
                        assets = assets.split(",");
                        for(j=0;j<assets.length;j++){
                            var assetsobj = this._assets_pool.get(assets[j]);
                            if(assetsobj)assetsobjs.push(assetsobj);
                        }
                        this.loadAssets(assetsobjs,_name,this._assets_groups.get(_name).refdir)
                    }
                }
            }

            /**
             * 资源组
             */
            public loadAssets(assets:Array<any>,groupname:string,basedir:string){
                //console.log(basedir);
                if(assets && Array.isArray(assets)){//加载成功后按照assetsmap逐个加载文件
                    this._assets_groups_loading.set(groupname,0);
                    this._assets_groups_loaded.set(groupname,{length:assets.length,complete:false});

                    //trace(assets)
                    for(var i=0;i<assets.length;i++){
                        var asset = assets[i];
                        var name:string = asset.name;
                        if(a$.proxy(AsyncRES).get(name)){
                            continue;
                        }
                        this.loadAsset(asset,groupname,basedir);
                    }
                }
            }

            private _assets_loading_tasks = [];
            public loadAsset(asset,groupname,basedir){
                if(this._threadCound>=this._thread){
                    this._assets_loading_tasks.push([asset,groupname,basedir]);
                    return;
                }
                this._threadCound++;
                switch (asset.type){
                    default :
                    case DataType.IMAGE:{
                        asyncImage(basedir+"/"+asset.url,{
                            success:(image,courier)=>{
                                a$.proxy(AsyncRES).set(courier.name,image);//{type:asset.type,res:image}
                                this._oneAsssetComplete(groupname);
                            },
                            error:()=>{
                                this._oneAsssetComplete(groupname);
                            },
                            courier:{
                                name:asset.name//防止变量提升,把name存进courier里
                            }
                        },this)}
                        break;
                }
            }

            /**一个资源加载结束**/
            private _oneAsssetComplete(counter){
                var a = this._assets_groups_loading.get(counter)+1;
                this._assets_groups_loading.set(counter,a);
                this._threadCound--;
                //trace(counter,this._assets_loaded.get(counter).length,this._assets_loading.get(counter))
                //trace(this._assets_loading_tasks)
                if(this._assets_loading_tasks.length>0){
                    this._loadNextAssets()
                }
                if(this._assets_groups_loaded.get(counter).length == this._assets_groups_loading.get(counter)){
                    this._assets_groups_loaded.get(counter).complete = true;
                    this._oneAsssetsGroupComplete()
                }
            }

            private _loadNextAssets(){
                var task = this._assets_loading_tasks.shift();
                this.loadAsset(task[0],task[1],task[2])
            }

            /**一个资源组加载完成了**/
            private _oneAsssetsGroupComplete(){
                var loadedgroups = this._assets_groups_loaded.values;
                var flag = true;
                for(var i=0;i<loadedgroups.length;i++){
                    if(loadedgroups[i].complete == false){
                        flag = false;
                        break;
                    }
                }
                if(flag)this.emit(AsyncRES.ASSETS_COMPLETE)
            }
        }
    }
}