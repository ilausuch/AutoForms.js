/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class Container extends EntityWithState{
    constructor(config,type){
        super(config,type);
    }
    
    setup(context,parentController){
        super.setup(context,parentController);
        
        this.checkRequired("content");
        
        var $this=this;
        
        this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });
        
        this.addInternalStateListenner(function(entity, newState, oldState){
            $this.updateState();
        });
        
        //Setup all content controllers
        this.content.forEach(function(subController){
            subController.setup(context);
        });
    }
    
    verifiedUpdater(model){
        var result=true;
        
        if (!this.isVisible())
            return true;
        
        this.content.forEach(function(subController){
            try{
                result = result && subController.getStateValue("verified");
            }catch(e){
                //DO Nothing
            }
        });
        
        
        
        return result;
    }
    
}