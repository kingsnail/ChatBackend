
class AgentStore {
    constructor() {
        this.agentList = {};
    }

    checkAgentExists( agentUUID ){
        return (agentUUID in this.agentList); 
    }

    getAgent( agentUUID ){
         if (checkAgentExists( agentUUID )){
           return this.agentList[agentUUID];
         } else {
           return null;
         }
    }
    
    add( agent ){
        try{
            this.agentList[ agent.getUUID()] = agent;
        }
        catch {
            console.log("ERROR: AgentStore.add() failed.");
        }
    }
}

module.exports = AgentStore;
