const mongoose = require('mongoose');
// mongoose Model :
const userScheme = mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   passwordHash: {
      type: String,
      required: true,
   },
   phone: {
      type: Number,
      required: true,
   },
   street: {
      type: String,
      default: '',
   },
   apartment: {
      type: String,
      default: '',
   },
   city: {
      type: String,
      default: '',
   },
   zip: {
      type: String,
      default: '',
   },
   country: {
      type: String,
      default: '',
   },

   isAdmin: {
      type: Boolean,
      default: false,
   },
});
// friendly frontend ID :
userScheme.virtual('id').get(function () {
   return this._id.toHexString();
});
userScheme.set('toJSON', {
   virtuals: true,
});

User = mongoose.model('User', userScheme);
module.exports = User;
