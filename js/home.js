import welcome from './welcome';

welcome('home!');

document.getElementById('loginButton').addEventListener('click', () => {
    require.ensure([], (require) => {
        let login = require('./login');
        login();
    }, 'auth');
}, false);

class MyPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

let myClass = new MyPoint(10, 10);
console.log(myClass);

exports.welcome = welcome;
