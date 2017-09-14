/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class FileSelector extends EntityWithState{
    constructor(config){
        super(config,"file");
        
        this.checkRequired("label");
        this.checkRequired("field");
        this.checkConfigDefaultValue("required",true);
        
        this.checkConfigDefaultValue("buttonLabel","UPLOAD_BUTTON_LABEL");
        this.checkConfigDefaultValue("placeholderLabel","UPLOAD_PLACEHOLDER_LABEL");
        this.checkConfigDefaultValue("uploadFileLinksDesp","12em");
        
        if (config.uploadUrl===undefined && config.uploadFunction===undefined)
            throw "FileSelector needs a uploadUrl or uploadFunction";
        
        this.checkConfigDefaultValue("uploadUrl",undefined);
        this.checkConfigDefaultValue("uploadResultParse",undefined);
        this.checkConfigDefaultValue("uploadFunction",undefined);
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
        
        return true;
    }
    
    
}