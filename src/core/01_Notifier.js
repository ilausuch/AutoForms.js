/*
MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
*/

class Notifier{
    constructor(){
        this.registry=[];
    }
    
    addListenner(listennerFnc){
        this.registry.push(listennerFnc);
    }
    
    notify(data){
        this.registry.forEach(function(listennerFnc){
            listennerFnc(data);
        });
    }
}