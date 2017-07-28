/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class EntityWithState extends Entity{
    constructor(config,type){
        super(config,type);        
    }
    
    setup(context){
        super.setup(context);
        
        this.stateAssoc={};
        this.stateList=[];
        
        if (this.$config.state!==undefined){
            if (!Array.isArray(this.$config.state))
                throw new AutoFormException("Structure configuration error: state must be an array of strings",{
                    theConfig:this.$config,
                    theType:this.$type});
        
            this.$config.state.forEach(function(itemConfig){
                this.addState(itemConfig);
            },this);
        }
        
    }
    
    addState(itemConfig){
        var state=new State(this,itemConfig);
        this.stateList.push(state);
        this.stateAssoc[state.id]=state;
    }
    
    updateState(model){
        if (model===undefined)
            model=this.context.model;
        
        this.stateList.forEach(function(state){
            state.update(this,model);
        },this);
    }
    
    getStateValue(id){
        if (this.stateAssoc[id]===undefined)
            throw new AutoFormException("EntityWithState: State doesn't exist",{
                 theEntity:this,
                 theStateId:id});
         
        return this.stateAssoc[id].value;
    }
    
}