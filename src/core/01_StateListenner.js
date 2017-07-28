/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class StateListenner{
    constructor(config,controller){
        this.config=config;
        
        if (config===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required config");
        
        if (config.entityId===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required entityId",{
                theConfig:config});
        
        if (config.stateId===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required stateId",{
                theConfig:config});
        
        if (config.callback===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required callback",{
                theConfig:config});
        
        this.entityId=config.entityId;
        this.stateId=config.stateId;
        this.callback=config.callback;
        this.controller=controller;
    }
    
    notify(data){
        this.callback(this.controller, data)
    }
}
