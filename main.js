const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const IndexRouter = require('./routers/indexRouter');
const UsersRouter = require('./routers/usersRouter');
const PixelsRouter = require('./routers/pixelsRouter');
const path = require('path')

//Application init
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server: server});
const port = 3000;
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Make 'public' directory's content available to .ejs files
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
app.set('trust proxy', 1);

app.use(session({
    secret: 'Bakugan: Młodzi Wojownicy',
    saveUninitialized: true,
    resave: false
}));

app.use(express.json());

app.use('/', IndexRouter);
app.use('/u', UsersRouter);
app.use('/pixel', PixelsRouter(wss));

server.listen(port, '0.0.0.0', () => {
    console.log(`Multi Canvas set on port ${port}`);
});