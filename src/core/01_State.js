/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class State{
    constructor(entity,config){
        this.entity=entity;
        
        if (config.id===undefined)
            throw new AutoFormException("Structure configuration error: state must have id",{
                theConfig:config});
        
        if (config.initValue===undefined)
            throw new AutoFormException("Structure configuration error: state must have an initValue",{
                theConfig:config});
        /*
        if (config.updater===undefined)
            throw new AutoFormException("Structure configuration error: state must define the updater function",{
                theConfig:config});
        */
        
        this.id=config.id;
        this.initialValue=config.initValue;
        this.updater=config.updater;
        
        this.value=this.initialValue;
        
        entity.context.state[this.entity.id][this.id]=this.initialValue;
    }
    
    set(newValue){
        var oldValue=this.value;
        this.value=newValue;
        if (newValue!==oldValue)
            this.entity.context.state[this.entity.id][this.id]=newValue;
    }
    
    update(controller,model){
        try{
            this.set(this.updater(controller,model));
        }catch(e){}
    }
}