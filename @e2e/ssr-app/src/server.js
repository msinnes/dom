const express = require('express');
const path = require('path');

const indexRoute = require('./router/index');
const contentsRoute = require('./router/contents');
const fetchRoute = require('./router/fetch');
const reduxRoute = require('./router/redux');
const subroutedRoute = require('./router/subrouted');
const timersRoute = require('./router/timers');

const app = express();

app.use('/pages', express.static(path.resolve(__dirname, '../public/pages')));
app.use(contentsRoute.route, contentsRoute.router);
app.use(fetchRoute.route, fetchRoute.router);
app.use(reduxRoute.route, reduxRoute.router);
app.use(subroutedRoute.route, subroutedRoute.router);
app.use(timersRoute.route, timersRoute.router);
app.use(indexRoute.route, indexRoute.router);

app.listen(8080, () => console.log('server started'));
