const express = require('express');
const router = express.Router();
const orderItems = require('../models/orderItem');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

//getting data from dataBase :

router.get('/', async (req, res) => {
   const orderList = await Order.find().populate('user');
   // sorting according to date created
   res.send(orderList);
});
// getting order by id :
router.get('/:id', async (req, res) => {
   const order = await Order.findById(req.params['id'])
      .populate({
         path: 'orderItems',
         populate: { path: 'product', populate: 'category' },
      })
      .populate('user');
   if (!order) res.status(400).send('order is not found');
   res.status(200).send(order);
});
// posting data to database:
router.post('/', async (req, res) => {
   const orderItemIds = Promise.all(
      req.body.orderItems.map(async (orderitem) => {
         let neworderitem = new orderItems({
            quantity: orderitem.quantity,
            product: orderitem.product,
         });
         neworderitem = await neworderitem.save(); // getting ids of order items
         return neworderitem._id;
      })
   );
   const orderItemIdsResolved = await orderItemIds;
   const totalPrices = await Promise.all(
      orderItemIdsResolved.map(async (orderId) => {
         const orderitem = await OrderItem.findById(orderId).populate(
            'product',
            'price' // calculating total price in the backend
         );
         return orderitem.product.price * orderitem.quantity;
      })
   );
   const totalPrice = totalPrices.reduce((a, b) => {
      return a + b;
   }, 0);
   console.log(totalPrices);
   let order = new Order({
      orderItems: orderItemIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      country: req.body.country,
      city: req.body.city,
      phone: req.body.phone,
      zip: req.body.zip,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
      date: req.body.date,
   });
   order = await order.save();
   if (!order) {
      res.status(404).send('order failed');
   } else {
      res.send(order);
   }
});
// updating an existing order:
router.put('/:id', async (req, res) => {
   const order = await Order.findByIdAndUpdate(
      req.params['id'],
      {
         status: req.body.status,
      },
      { new: true }
   );
   if (!order) res.status(400).send('not found');
   res.status(200).send(order);
});
// Deleting an existing order :
router.delete('/:id', (req, res) => {
   Order.findByIdAndRemove(req.params['id'])
      .then(async (order) => {
         await order.orderItems.map(async (orderitem) => {
            await OrderItem.findByIdAndRemove(orderitem);
         });
         if (!order) res.status(400).send('order is not deleted');
         res.status(200).send('order is deleted');
      })
      .catch((err) => {
         res.send('order is not found');
      });
});
// getting orders of a specifc user :
router.get('/get/userorders/:userid', async (req, res) => {
   const orderList = await Order.find({ user: req.params.userid })
      .populate({
         path: 'orderItems',
         populate: 'product',
      })
      .sort('date');
   res.send(orderList);
});

module.exports = router;
