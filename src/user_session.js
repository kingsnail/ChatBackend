
class UserSession {
    constructor(userId) {
        this.userId = userId;
    }

    /*
     * Return the stored user id.
     */
    getUserId( ){
        return this.userId;
    }
    
    /*
     * Set the user id.
     */
    setUserId( u ){
        this.userId = u;
    }

}

module.exports = UserSession;
