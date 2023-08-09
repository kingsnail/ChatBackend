// Parent class for generic agent type
class Agent {
    constructor(name) {
        this.name = name;
    }

    setInput(i) { 
        console.log('Input is ${i}.);  
    }
  
    execute() {
        console.log(`${this.name} makes a noise.`);
    }

    subscribe(cb) {
        console.log('Subscribe');
    }
}
