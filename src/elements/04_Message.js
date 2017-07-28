/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class Message extends EntityWithState{
    constructor(config){
        super(config,"message");
    }
    
    setup(context){
        super.setup(context);
        
        if (this.$config.messages!==undefined){
            this.setMessages(this.$config.messages);
        }
        else
            if (this.$config.provider!==undefined){
                this.checkRequired("provider");
            }
            else
                throw new Exception("Structure configuration error (Message): messages or provider is required",{
                    theConfig:this.$config});
            
        this.checkConfigDefaultValue("mode","info");
    }
    
    setMessages(messages){
        this.messages=messages;
        this.checkMessageConfiguration();
    }
    
    checkMessageConfiguration(){
        this.messages.forEach(function(message){
            if (message.text===undefined)
                throw new Exception("Structure configuration error (Message): Bad message configuration",{
                    theConfig:config,
                    theMessageConfig:message});
        });
    }
}
