/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class ModalSelector extends Container{
    constructor(config){
        super(config,"modalSelector");
        
        this.checkRequired("label");
        this.checkRequired("title");
        this.checkRequired("field");
        this.checkRequired("labelField");
        this.checkConfigDefaultValue("required",true);
        this.checkRequired("onAccept");
    }
    
    setup(context){
        super.setup(context);
        
        this.modalVisible=false;
         
        this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });
        
        
    }
    
    show(){
        this.modalVisible=Math.random();
    }
    
    verifiedUpdater(model){
        var result=true;
        
        if (model[this.field]===undefined || model[this.field]===""){
            if (this.required)
                result=false;
        }
        
        return result;
    }
}