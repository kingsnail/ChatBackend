
class UserSession {
    constructor(userId) {
        this.userId = userId;
    }

    /*
     * Return the agent with the corresponding UUID. Returns null if the agent does not exist.
     */
    getUserId( ){
        return this.userId;
    }

}

module.exports = UserSession;
