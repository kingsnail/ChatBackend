
class ExecutionEngine {
    constructor() {
        this.userName = '';
        this.agentStore = null;
        this.running = false;
        this.interval = null;
    }

    setUserName( n ) {
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

    scheduler(){
        console.log("Scheduler...");
        const agents = getAgentIndex()
        const arr = [1, 2, 3, 8, 7];
        agents.forEach(agent => {
            this.agentStore.getAgent(agent).execute();
            console.log("..Exec: " + agent);
        });
    }

    run(){
        this.running = true;
        console.log("Running");
        this.interval = setInterval(this.scheduler.bind(this), 5000);
    }

    stop(){
        this.running = false;
        console.log("Stopped");
        if (this.interval) {
            clearInterval(this.interval);
            console.log('Scheduler stopped.');
        }
    }
}
module.exports = ExecutionEngine;
