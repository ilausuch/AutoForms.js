/* global config */
AutoForm={
    emptyArray:[],

    verifiers:{
        email:function(value){
            return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(""+value);
        },
        noEmpty:function(value){
            return (""+value).length > 0;
        },
        verified:function(value){
            return true;
        },
        natural:function(value){
            return /^\d+$/.test(""+value);
        }
    }
};

class AutoFormContext{
    constructor(config){
        this.scope=config.scope;
        this.callLater=config.callLater;
        this.id="autoFormContext_"+Math.round(Math.random()*100000);
        
        var $this=this;
        
        //Force to model change event
        this.apply=function(){
            try {
                if(!$this.scope.$$phase) {
                    $this.scope.$apply();
                }
            } catch(e){}
        };
        
        this.watch=function(expr,callback){
            $this.scope.$watch(expr,callback,true);
        };
        
        
        this.equals=function(obj1,obj2){
            return angular.equals(obj1,obj2);//angular.toJson(obj1)===angular.toJson(obj2);
        };
        
        //Entry registry
        this.entityRegistry=new EntityRegistry(this);
        
        //Model
        this.modelName=this.id+"_model";
        this.scope[this.modelName]=config.model;
        this.model=config.model;
        this.model.__status={};
        this.modelNotifier=new ModelNotifier(this);
        
        //State
        this.stateName=this.id+"_state";
        this.state={};
        this.scope[this.stateName]=this.state;
        this.stateNotifier=new StateNotifier(this);
        this.setstate=function(controllerId,stateId,value){
            this.entityRegistry.get(controllerId).setState(stateId,value);
            
        }
        
        //Static data
        this.data={};
        
    }
};

