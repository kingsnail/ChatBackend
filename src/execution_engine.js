
class ExecutionEngine {
    constructor() {
        this.userName = '';
        this.agentStore = null;
        this.running = false;
    }

    setUserName( n ) }
        this.userName = n;
    }

    getUserName( ){
        return this.userName;
    }

    setAgentStore( s ){
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
