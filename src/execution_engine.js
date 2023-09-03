
class ExecutionEngine {
    constructor() {
        this.userName = '';
        this.agentStore = null;
        this.running = false;
    }

    setUserName( n ) }
        console.log('ExecutionEngine: userName = ' + n);
        this.userName = n;
    }

    getUserName( ){
        return this.userName;
    }

    setAgentStore( s ){
        console.log('ExecutionEngine: setAgentStore()');
        this.agentStore = s;
    }
    isRunning( ){
        console.log("isRunning=" + this.running);
        return this.running;
    }

    run(){
        this.running = true;
        console.log("Running");
    }

    stop(){
        this.running = false;
        console.log("Stopped");
    }
}
module.exports = ExecutionEngine;
