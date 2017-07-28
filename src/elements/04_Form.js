/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class Form extends EntityWithState{
    constructor(config){
        super(config,"form");
        this.checkRequired("fields");
    }
    
    setup(context){
        super.setup(context);
        
        this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });
        
        
    }
    
    verifiedUpdater(model){
        var result=true;
        
        this.fields.forEach(function(field){
            if (model[field.field]===undefined || model[field.field]===""){
                if (field.required)
                    result=false;
            }
            else
                if (field.verify!==undefined && !field.verify(model[field.field])){
                    result=!field.required;
                }
            
        });
        
        return result;
    }
    
    
}