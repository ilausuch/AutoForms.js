/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class Entity{
    constructor(config,type){
        this.$config=config;
        this.$type=type;
        this.$configured=false;
        
        if (config.context!==undefined)
            this.setup(config.context);
    }
    
    setup(context,parentController){
        this.$parent=parentController;
        
        if (this.$configured)
            return;
        
        this.$configured=true;
        
        this.context=context;
        
        var config=this.$config;
        
        //Get ID
        if (config.id!==undefined)
            this.id=config.id;
        else
            this.id=this.$type+"_"+Math.random();
            
        
        //Initial configuration on registries
        this.context.entityRegistry.register(this);
        this.context.state[this.id]={};
        
        //If is pannel
        this.checkConfigDefaultValue("panel",false);
        
        if (this.panel)
            this.checkRequired("title");
        
        //Model listenner
        if (config.onModelChange!==undefined){
            this.onModelChange=config.onModelChange;
            var $this=this;
            this.context.modelNotifier.addListenner(function(data){
                var model=data.model;
                var changes=data.changes;
                var hasChanged=data.hasChanged;
                try{
                    $this.onModelChange({controller:$this, model:model, changes:changes, hasChanged:hasChanged});
                }catch(e){
                    console.log(e);
                }
            });
        }
        
        //State listenner
        if (config.onStateChange!==undefined){
            this.onStateChange=config.onStateChange;
            var $this=this;
            this.context.stateNotifier.addListenner(function(data){
                var oldState=data.oldState;
                var newState=data.newState;
                try{
                    $this.onStateChange({controller:$this, state:newState, oldState:oldState});
                }catch(e){
                    console.log(e);
                }
                
            });
        }
        
        
        if (config.enabled!==undefined)
            this.enabled=config.enabled;
        else
            this.enabled=true;
        
        
        if (config.visible!==undefined)
            this.visible=config.visible;
        else
            this.visible=true;
        
        this.onEvent=config.onEvent;
    }
    
    addInternalStateListenner(internalStateListenner){
        this.internalStateListenner=internalStateListenner;
        var $this=this;
        this.context.stateNotifier.addListenner(function(data){
            var oldState=data.oldState;
            var newState=data.newState;
            $this.internalStateListenner($this, newState, oldState);
        });
    }
    
    setProperty(property,value){
        var controller=this;
        controller[property]=value;
          
    }
    
    checkRequired(field,message){
        if (this.$config[field]===undefined){
            if (message===undefined)
                message=field+" is required";
            
            throw new AutoFormException("Structure configuration error: "+message,{theConfig:this.config});
            
        }else
            this[field]=this.$config[field];
    }
    
    checkConfigDefaultValue(field,defaultValue){
        if (this.$config[field]===undefined){
            this[field]=defaultValue;
            
        }else
            this[field]=this.$config[field];
    }
    
    sendEvent(data){
        if (this.onEvent!==undefined)
            this.context.callAfter(function(){
                this.onEvent({controller:this,data:data});
            });
    }
    
    isVisible(){
        return this.visible && (this.$parent===undefined || this.$parent.isVisible());
    }
    
    
}