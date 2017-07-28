/*
    MIT LICENSE @2016 Ivan Lausuch <ilausuch@gmail.com>
*/AutoForm={
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
            return angular.equals(obj1,obj2);
        };

        this.entityRegistry=new EntityRegistry(this);

        this.modelName=this.id+"_model";
        this.scope[this.modelName]=config.model;
        this.model=config.model;
        this.modelNotifier=new ModelNotifier(this);

        this.stateName=this.id+"_state";
        this.state={};
        this.scope[this.stateName]=this.state;
        this.stateNotifier=new StateNotifier(this);

        this.data={};
    }
};




class AutoFormException{
    constructor(text,data){
        this.text=text;
        this.data=data;
    }
}






class Entity{
    constructor(config,type){
        this.$config=config;
        this.$type=type;
        this.$configured=false;

                if (config.context!==undefined)
            this.setup(config.context);
    }

        setup(context){
        if (this.$configured)
            return;

                this.$configured=true;

                this.context=context;

                var config=this.$config;

        if (config.id!==undefined)
            this.id=config.id;
        else
            this.id=this.$type+"_"+Math.random();


        this.context.entityRegistry.register(this);
        this.context.state[this.id]={};

        this.checkConfigDefaultValue("panel",false);

                if (this.panel)
            this.checkRequired("title");

        if (config.onModelChange!==undefined){
            this.onModelChange=config.onModelChange;
            var $this=this;
            this.context.modelNotifier.addListenner(function(data){
                var model=data.model;
                var changes=data.changes;
                var hasChanged=data.hasChanged;
                try{
                    $this.onModelChange({controller:$this, model:model, changes:changes, hasChanged:hasChanged});
                }catch(e){
                    console.log(e);
                }
            });
        }

        if (config.onStateChange!==undefined){
            this.onStateChange=config.onStateChange;
            var $this=this;
            this.context.stateNotifier.addListenner(function(data){
                var oldState=data.oldState;
                var newState=data.newState;
                try{
                    $this.onStateChange({controller:$this, state:newState, oldState:oldState});
                }catch(e){
                    console.log(e);
                }

                            });
        }


                        if (config.enabled!==undefined)
            this.enabled=config.enabled;
        else
            this.enabled=true;


                        if (config.visible!==undefined)
            this.visible=config.visible;
        else
            this.visible=true;

                this.onEvent=config.onEvent;
    }

        addInternalStateListenner(internalStateListenner){
        this.internalStateListenner=internalStateListenner;
        var $this=this;
        this.context.stateNotifier.addListenner(function(data){
            var oldState=data.oldState;
            var newState=data.newState;
            $this.internalStateListenner($this, newState, oldState);
        });
    }

        setProperty(property,value){
        var controller=this;
        controller[property]=value;

              }

        checkRequired(field,message){
        if (this.$config[field]===undefined){
            if (message===undefined)
                message=field+" is required";

                        throw new AutoFormException("Structure configuration error: "+message,{theConfig:this.config});

                    }else
            this[field]=this.$config[field];
    }

        checkConfigDefaultValue(field,defaultValue){
        if (this.$config[field]===undefined){
            this[field]=defaultValue;

                    }else
            this[field]=this.$config[field];
    }

        sendEvent(data){
        if (this.onEvent!==undefined)
            this.context.callAfter(function(){
                this.onEvent({controller:this,data:data});
            });
    }


        }



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


class Provider{
    constructor(context, updateFunction, conditions, model){
        this.context=context;

                if (typeof updateFunction !== "function")
            throw new AutoFormException("Provider requires a valid function",{theFunction:updateFunction});

                this.updateFunction=updateFunction;
        this.conditions=conditions;
        if (model!==undefined)
            this.model=model;
        else
            this.model=context.model;

                this.promise=new ilPromise();
        this.$conditionValues={};

                var provider=this;
        context.modelNotifier.addListenner(function(data){
            provider.getPromise();
        });

                this.firstUpdate=true;

            }

        getPromise(){
        var context=this.context;

                if (this.firstUpdate || this.conditionsHasChanged()){
            var $this=this;
            $this.updateFunction({
                    promise:$this.promise,
                    model:$this.model,
                    empty:context.emptyArray,
                    clear:function(){
                        this.promise.data=$this.empty;
                        context.apply();  
                    },
                    ready:function(data){
                        this.promise.ready(data);
                        context.apply();
                    },
                    cancel:function(){
                        this.promise.ready($this.empty);
                        context.apply();
                    }
                });

                        this.firstUpdate=false;
        }

                return this.promise;
    }

        conditionsHasChanged(){
        var context=this.context;
        var hasChanged=false;

                if (this.conditions!==undefined)
            this.conditions.forEach(function(cond){
                if (this.$conditionValues[cond]===undefined || this.$conditionValues[cond]!==this.model[cond]){
                    hasChanged=true;
                    this.$conditionValues[cond]=this.model[cond];
                }
            },this);

                return hasChanged;
    }
}



class State{
    constructor(entity,config){
        this.entity=entity;

                if (config.id===undefined)
            throw new AutoFormException("Structure configuration error: state must have id",{
                theConfig:config});

                if (config.initValue===undefined)
            throw new AutoFormException("Structure configuration error: state must have an initValue",{
                theConfig:config});

                if (config.updater===undefined)
            throw new AutoFormException("Structure configuration error: state must define the updater function",{
                theConfig:config});


                        this.id=config.id;
        this.initialValue=config.initValue;
        this.updater=config.updater;

                this.value=this.initialValue;

                entity.context.state[this.entity.id][this.id]=this.initialValue;
    }

        set(newValue){
        var oldValue=this.value;
        this.value=newValue;
        if (newValue!==oldValue)
            this.entity.context.state[this.entity.id][this.id]=newValue;
    }

        update(controller,model){
        this.set(this.updater(controller,model));
    }
}



class StateListenner{
    constructor(config,controller){
        this.config=config;

                if (config===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required config");

                if (config.entityId===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required entityId",{
                theConfig:config});

                if (config.stateId===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required stateId",{
                theConfig:config});

                if (config.callback===undefined)
            throw new AutoFormException("Structure configuration error (listenner): required callback",{
                theConfig:config});

                this.entityId=config.entityId;
        this.stateId=config.stateId;
        this.callback=config.callback;
        this.controller=controller;
    }

        notify(data){
        this.callback(this.controller, data)
    }
}




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

class ModelNotifier extends Notifier{
    constructor(context){
        super();


                        var $notifier=this;
        context.watch(context.modelName,function(newValue,oldValue){
            var changesList=[];
            var changes={};

                        for (var newIndex in newValue){
                var found=false;

                                    for (var oldIndex in oldValue){
                    if (oldIndex===newIndex){
                        found=true;

                                                try{
                            if (oldValue[oldIndex]===undefined && newValue[newIndex]!==undefined
                                || oldValue[oldIndex]!==undefined && newValue[newIndex]===undefined
                                || !context.equals(oldValue[oldIndex],newValue[newIndex]))
                                    changes[newIndex]=newValue[newIndex];
                        }catch(e){
                            console.log("error en ",newIndex);
                        }
                    }
                }

                                if (!found)
                    changes[newIndex]=newValue[newIndex];
            }

                        for (var k in changes)
                changesList.push(k);


            if (changesList.length>0){
                $notifier.notify({
                    model:context.model,
                    changes:changesList,
                    hasChanged:function(field){
                        return this.changes.indexOf(field)>=0;
                    }
                });
                context.apply();
            }
        });
    }
}


class ProviderFromStaticData extends Provider{
    constructor(context, data){
        super(context,function(c){
            c.ready(this.data);
        });

                this.data=data;
    }
}


class StateNotifier extends Notifier{
    constructor(context){
        super();

                var $notifier=this;

                context.watch(context.stateName,function(newState,oldState){
                $notifier.notify({state:context.scope.state, newState:newState, oldState:oldState});

                    });
    }
}






class Container extends EntityWithState{
    constructor(config,type){
        super(config,type);
    }

        setup(context){
        super.setup(context);

                this.checkRequired("content");


                        var $this=this;

                this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });

                this.addInternalStateListenner(function(entity, newState, oldState){
            $this.updateState();
        });

        this.content.forEach(function(subController){
            subController.setup(context);
        });
    }

        verifiedUpdater(model){
        var result=true;

                this.content.forEach(function(subController){
            try{
                result = result & subController.getStateValue("verified");
            }catch(e){
            }
        });

                return result;
    }

    }


class Button extends EntityWithState{
    constructor(config){
        super(config,"button");

                this.checkRequired("title");
        this.checkRequired("onClick");

         }

        setup(context){
        super.setup(context);

            }

        onClick(model){
        this.onClick(this,model);
    }
}



class Field extends EntityWithState{
    constructor(config){
        super(config,"field");

                this.checkRequired("type");
        this.checkRequired("label");
        this.checkRequired("field");
        this.checkConfigDefaultValue("required",true);
        this.checkConfigDefaultValue("verify",undefined);

                switch(this.type){
            case "list":
            case "radio":
                this.checkRequired("provider");
                this.checkRequired("labelField");
                this.checkRequired("valueField");
                break;
            case "select":
                this.checkRequired("provider");
                this.checkRequired("labelField");
                break;
        }
    }

        setup(context){
        super.setup(context);

                this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });
    }

        verifiedUpdater(model){
        var result=true;

                if (model[this.field]===undefined || model[this.field]===""){
            if (this.required)
                result=false;
        }
        else
            if (this.verify!==undefined && !this.verify(model[this.field])){
                result=!this.required;
            }

                return result;
    }


        }



class Form extends EntityWithState{
    constructor(config){
        super(config,"form");
        this.checkRequired("fields");
    }

        setup(context){
        super.setup(context);

                this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });


                    }

        verifiedUpdater(model){
        var result=true;

                this.fields.forEach(function(field){
            if (model[field.field]===undefined || model[field.field]===""){
                if (field.required)
                    result=false;
            }
            else
                if (field.verify!==undefined && !field.verify(model[field.field])){
                    result=!field.required;
                }

                    });

                return result;
    }


        }


class Group extends Container{
    constructor(config){
        super(config,"group");
    }

        setup(context){
        super.setup(context);

            }
}


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



class Modal extends Container{
    constructor(config){
        super(config,"modal");
    }

        setup(context){
        super.setup(context);

            }
}



class ModalSelector extends Container{
    constructor(config){
        super(config,"modalSelector");

                this.checkRequired("label");
        this.checkRequired("title");
        this.checkRequired("field");
        this.checkRequired("labelField");
        this.checkConfigDefaultValue("required",true);
        this.checkRequired("onAccept");
    }

        setup(context){
        super.setup(context);

                this.modalVisible=false;

                 this.addState({
            id:"verified",
            initValue:false,
            updater:function(controller,model){
                return controller.verifiedUpdater(model);
            }
        });


                    }

        show(){
        this.modalVisible=Math.random();
    }

        verifiedUpdater(model){
        var result=true;

                if (model[this.field]===undefined || model[this.field]===""){
            if (this.required)
                result=false;
        }

                return result;
    }
}


class Root extends Group{
    constructor(config){
        super(config,"group");
        this.checkRequired("context");
    }

    }