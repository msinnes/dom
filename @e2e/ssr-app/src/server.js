const express = require('express');
const path = require('path');

const indexRoute = require('./router/index');
const contentsRoute = require('./router/contents');
const reduxRoute = require('./router/redux');

const app = express();

app.use('/pages', express.static(path.resolve(__dirname, '../public/pages')));
app.use(contentsRoute.route, contentsRoute.router);
app.use(reduxRoute.route, reduxRoute.router);
app.use(indexRoute.route, indexRoute.router);

app.listen(9000, () => console.log('server started'));
