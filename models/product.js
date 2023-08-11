const mongoose = require('mongoose');
// mongoose Model :
const productScheme = mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   richDescription: {
      type: String,
      required: true,
      default: '',
   },
   image: String,
   images: [
      {
         type: String,
      },
   ],
   brand: String,
   price: Number,
   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cateogry',
   },
   countInStock: {
      type: Number,
      required: true,
   },
   rating: Number,
   isFeatured: Boolean,
   dateCreated: {
      type: Date,
      default: Date.now,
   },
});
// friendly frontend ID:
productScheme.virtual('id').get(function () {
   return this._id.toHexString();
});
productScheme.set('toJSON', {
   virtuals: true,
});
Product = mongoose.model('Product', productScheme);

module.exports = Product;
