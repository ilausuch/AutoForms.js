/*
MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
*/  

class ModelNotifier extends Notifier{
    constructor(context){
        super();
        
        
        var $notifier=this;
        context.watch(context.modelName,function(newValue,oldValue){
            var changesList=[];
            var changes={};
            
            for (var newIndex in newValue){
                var found=false;
                    
                for (var oldIndex in oldValue){
                    if (oldIndex===newIndex){
                        found=true;
                        
                        try{
                            if (oldValue[oldIndex]===undefined && newValue[newIndex]!==undefined
                                || oldValue[oldIndex]!==undefined && newValue[newIndex]===undefined
                                || !context.equals(oldValue[oldIndex],newValue[newIndex]))
                                    changes[newIndex]=newValue[newIndex];
                        }catch(e){
                            console.log("error en ",newIndex);
                        }
                    }
                }
                
                if (!found)
                    changes[newIndex]=newValue[newIndex];
            }
            
            for (var k in changes)
                changesList.push(k);
                
            
            //console.log("*** updated model",newValue,oldValue,changesList);
            if (changesList.length>0){
                $notifier.notify({
                    model:context.model,
                    changes:changesList,
                    hasChanged:function(field){
                        return this.changes.indexOf(field)>=0;
                    }
                });
                context.apply();
            }
        });
    }
}