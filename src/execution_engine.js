
class ExecutionEngine {
    constructor() {
        this.userName = '';
        this.agentStore = null;
        this.running = false;
        this.interval = null;
    }

    setUserName( n ) {
        console.log('ExecutionEngine: setUserName(' + n + ')');
        this.userName = n;
    }

    getUserName( ){
        console.log('ExecutionEnginer: getUserName() = ' + this.userName );
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
        const agents = this.agentStore.getAgentIndex()
        agents.forEach(agent => {
            console.log("..Exec: " + this.agentStore.getAgent(agent).getName());
            this.agentStore.getAgent(agent).execute();
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
    reset(){
        console.log("Reset");
        const agents = this.agentStore.getAgentIndex()
        agents.forEach(agent => {
            console.log("..Reset: " + agent);
            this.agentStore.getAgent(agent).reset();
        });
    }
}
module.exports = ExecutionEngine;
