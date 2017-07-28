/*
 MIT LICENSE @2017 Ivan Lausuch < ilausuch@gmail.com >
 */


class StateNotifier extends Notifier{
    constructor(context){
        super();
        
        var $notifier=this;
        
        context.watch(context.stateName,function(newState,oldState){
            //console.log("*** updated state",newState);
            //context.callLater(function(){
                $notifier.notify({state:context.scope.state, newState:newState, oldState:oldState});
            //});
            
        });
    }
}


