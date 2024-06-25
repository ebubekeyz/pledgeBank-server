require('dotenv').config();
require('express-async-errors');

const connectDB = require('./db/connect');

const express = require('express');
const app = express();

const path = require('path');

const authRouter = require('./routes/authRouter');
const withdrawRouter = require('./routes/withdrawRouter');

const notificationRouter = require('./routes/notificationRouter');
const addFundRouter = require('./routes/addFundRouter');
const accountRouter = require('./routes/accountRouter');

const uploadRouter = require('./routes/uploadRouter');
const fileUpload = require('express-fileupload');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');

let originUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5173'
    : 'https://pledge-bank.com';

// let originUrl =
//   process.env.NODE_ENV !== 'production'
//     ? 'http://localhost:5173'
//     : 'https://pledgebank.netlify.app';

app.use(
  cors({
    origin: originUrl,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(xss());

app.use(fileUpload());

app.use(express.static('./public'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/withdraw', withdrawRouter);
app.use('/api/addFund', addFundRouter);

app.use('/api/upload', uploadRouter);
app.use('/api/account', accountRouter);
app.use('/api/notification', notificationRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 7000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};

start();
