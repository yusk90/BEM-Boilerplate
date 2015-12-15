export default function (message = 'default') {
    if (NODE_ENV == 'development') {
        console.log(NODE_ENV);
    }
    console.log(`Welcome ${message}`);
}
