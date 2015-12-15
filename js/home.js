import welcome from './welcome';

welcome('home!');

document.getElementById('loginButton').addEventListener('click', () => {
    require.ensure([], (require) => {
        let login = require('./login');
        login();
    }, 'auth');
}, false);

exports.welcome = welcome;
