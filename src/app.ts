import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';  
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
const SQLiteStore = require('connect-sqlite3')(session);
import ejs from 'ejs';
import path from 'path';
import authRoutes from './routes/auth-routes';
import bookRoutes from './routes/book-routes';

const app = express();  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', 1);
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'))

app.use(bookRoutes);
app.use(authRoutes);

app.listen(3000, ()=>{
    console.log("Server started at port 3000");
 });

