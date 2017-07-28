/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */



class EntityRegistry{
    constructor(context){
        this.context=context;
        this.assoc={};
        this.list=[];
    }
    
    register(entity){
        if (this.assoc[entity.id]!==undefined)
            throw new AutoFormException("EntityRegistry: Entity already registered",{
                theId:entity.id,
                theCurrentEntity:this.assoc[entity.id],
                theEntityToRegister:entity});
        
        this.assoc[entity.id]=entity;
        this.list.push(entity);
    }
    
    get(id){
        if (this.assoc[id]===undefined)
            throw new AutoFormException("EntityRegistry: Unkown entity",{
                theId:id});
        
        return this.assoc[id];
    }
}
