const mongoose = require('mongoose');
// MongooseSchema :
const orderScheme = mongoose.Schema({
   orderItems: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'OrderItem',
      },
   ],
   shippingAddress1: {
      type: String,
      required: true,
   },
   shippingAddress2: String,
   country: {
      type: String,
   },
   city: {
      type: String,
      required: true,
   },
   phone: {
      type: Number,
      required: true,
   },
   zip: Number,
   status: String,
   totalPrice: String,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   dateOrdered: {
      type: Date,
      default: Date.now,
   },
});
// Mongoose Model;
const Order = mongoose.model('Order', orderScheme);
// friendly ID:
orderScheme.virtual('id').get(function () {
   return this._id.toHexString();
});
orderScheme.set('toJSON', {
   virtuals: true,
});
// Exporting:
module.exports = Order;
