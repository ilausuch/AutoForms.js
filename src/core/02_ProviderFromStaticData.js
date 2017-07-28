/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class ProviderFromStaticData extends Provider{
    constructor(context, data){
        super(context,function(c){
            c.ready(this.data);
        });
        
        this.data=data;
    }
}