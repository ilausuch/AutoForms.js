/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class Field extends EntityWithState{
    constructor(config){
        super(config,"field");
        
        this.checkRequired("type");
        this.checkRequired("label");
        this.checkRequired("field");
        this.checkConfigDefaultValue("required",true);
        this.checkConfigDefaultValue("verify",undefined);
        
        switch(this.type){
            case "list":
            case "radio":
                this.checkRequired("provider");
                this.checkRequired("labelField");
                this.checkRequired("valueField");
                break;
            case "select":
                this.checkRequired("provider");
                this.checkRequired("labelField");
                break;
        }
    }
    
    setup(context){
        super.setup(context);
        
        this.addState({
            id:"verified",
            initValue:this.verifiedUpdater(),
            updater:function(controller,model){
                return controller.verifiedUpdater();
            }
        });
    }
    
    verifiedUpdater(){
        var result=true;
        var model=this.context.model;
        
        if (!this.isVisible())
            return true;
        
        if (model[this.field]===undefined || model[this.field]===""){
            if (this.required)
                result=false;
        }
        else
            if (this.verify!==undefined && !this.verify(model[this.field])){
                result=!this.required;
            }
        
        return result;
    }
    
    
}