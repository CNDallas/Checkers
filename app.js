import express from 'express';
import logger from 'morgan'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

export default app;

//TODO WILL HANDLE ROUTING AND DYNAMIC PAGE CREATION AKA MIDDLEWARE STUFF