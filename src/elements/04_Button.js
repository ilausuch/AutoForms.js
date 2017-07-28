/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class Button extends EntityWithState{
    constructor(config){
        super(config,"button");
        
        this.checkRequired("title");
        this.checkRequired("onClick");
     
    }
    
    setup(context){
        super.setup(context);
        
    }
    
    $onClick(){
        var controller=this;
        this.onClick({controller:controller, context:controller.context, model:controller.context.model});
    }
}