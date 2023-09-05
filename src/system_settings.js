
class SystemSettings {
    constructor() {
    this.data = this.load();
    }
  
    load(){
        return {};
    }

    save (){

    }

    getSettings(){
        return this.data;
    }

    getSettingsAsJson(){
        return JSON.stringify(this.data);
    }

    updateSetting( k, v ) {
        this.data[k] = v;
    }
  
}

module.exports = SystemSettings;
