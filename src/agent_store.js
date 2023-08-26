
class AgentStore {
    constructor() {
        this.agentList = {};
    }

    /*
     * Check that an agent is present in the Agent Store.
     */
    checkAgentExists( agentUUID ){
        return (agentUUID in this.agentList); 
    }

    /*
     * Return the agent with the corresponding UUID. Returns null if the agent does not exist.
     */
    getAgent( agentUUID ){
         if (this.checkAgentExists( agentUUID )){
           return this.agentList[agentUUID];
         } else {
           return null;
         }
    }

    /*
     * Add a new agent to the store. If it is already in the store the 
     * previous entry will be overwritten.
     */
    add( agent ){
        try{
            this.agentList[ agent.getUUID()] = agent;
        }
        catch {
            console.log("ERROR: AgentStore.add() failed.");
        }
    }
    
    /*
     * Delete the entire contents of the agent store.
     */
    empty(){
        this.agentList = {};
    }
}

module.exports = AgentStore;
