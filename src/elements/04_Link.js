/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class Link extends Entity{
    constructor(config){
        super(config,"link");
        
        this.checkRequired("link");
        this.checkRequired("label");
    }
    
    setup(context){
        super.setup(context);
    }
}
