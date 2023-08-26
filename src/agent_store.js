const Agent = require('./agent');

class AgentStore {
    constructor() {
        this.agentList = [];
    }

    checkAgentExists( agentUUID ){
    
    }

    getAgent( agentUUID ){
         if (checkAgentExists( agentUUID ){
           return this.agentList[agentUUID];
         } else {
           return null;
         }
    }

module.exports = AgentStore;
