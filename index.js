const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const corsOptions = {
   origin: '*',
};
const authJwt = require('./helper/jwt');

// routes :
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const usersRouter = require('./routers/users');
const cateogriesRouter = require('./routers/cateogries');
// cors:
app.use(cors(corsOptions));

// connection to dataBase:
mongoose
   .connect(
      'mongodb+srv://khaled:1234567k@cluster0.065235n.mongodb.net/e-shop?retryWrites=true&w=majority'
   )
   .then(() => {
      console.log('connection is good');
   })
   .catch((err) => {
      console.log(err);
   });

// middleware :
app.use(express.json()); // body-parser
app.use(morgan('tiny')); // to watch api requests
app.use('/public/uploads', express.static(__dirname + '/public/uploads')); // to make the images folder public to the user
//app.use(authJwt);

// routers :
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/cateogries', cateogriesRouter);

// server Listening :

app.listen('3000');
