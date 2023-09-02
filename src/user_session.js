
class UserSession {
    constructor(userId) {
        this.userId = userId;
        this.userName = "";
        this.apiKeyToUse = "";
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
    /*
     * Return the stored user name.
     */
    getUserName( ){
        return this.userName;
    }
    
    /*
     * Set the user id.
     */
    setUserName( u ){
        this.userName = u;
    }

    setApiKeyToUse( k ) {
        this.apiKeyToUse = k;
    }
    
    getApiKeyToUse(){
        return this.apiKeyToUse;
    }
}

module.exports = UserSession;
