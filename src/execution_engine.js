class ExecutionEngine {
    constructor(userId) {
        this.userId = userId;
        this.running = false;
    }

    /*
     * Return the stored user id.
     */
    getUserId( ){
        return this.userId;
    }
    
    /*
     * Return the stored user name.
     */
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
