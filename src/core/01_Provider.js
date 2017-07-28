/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class Provider{
    constructor(context, updateFunction, conditions, model){
        this.context=context;
        
        if (typeof updateFunction !== "function")
            throw new AutoFormException("Provider requires a valid function",{theFunction:updateFunction});
        
        this.updateFunction=updateFunction;
        this.conditions=conditions;
        if (model!==undefined)
            this.model=model;
        else
            this.model=context.model;
        
        this.promise=new ilPromise();
        this.$conditionValues={};
        
        var provider=this;
        context.modelNotifier.addListenner(function(data){
            provider.getPromise();
        });
        
        this.firstUpdate=true;
        
    }
    
    getPromise(){
        var context=this.context;
        
        if (this.firstUpdate || this.conditionsHasChanged()){
            var $this=this;
            $this.updateFunction({
                    promise:$this.promise,
                    model:$this.model,
                    empty:context.emptyArray,
                    clear:function(){
                        this.promise.data=$this.empty;
                        context.apply();  
                    },
                    ready:function(data){
                        this.promise.ready(data);
                        context.apply();
                    },
                    cancel:function(){
                        this.promise.ready($this.empty);
                        context.apply();
                    }
                });
            
            this.firstUpdate=false;
        }
        
        return this.promise;
    }
    
    conditionsHasChanged(){
        var context=this.context;
        var hasChanged=false;
        
        if (this.conditions!==undefined)
            this.conditions.forEach(function(cond){
                if (this.$conditionValues[cond]===undefined || this.$conditionValues[cond]!==this.model[cond]){
                    hasChanged=true;
                    this.$conditionValues[cond]=this.model[cond];
                }
            },this);
        
        return hasChanged;
    }
}