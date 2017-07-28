/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class Root extends Group{
    constructor(config){
        super(config,"group");
        this.checkRequired("context");
    }
    
}