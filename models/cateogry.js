const mongoose = require('mongoose');
// mongoose Model :
const cateogryScheme = mongoose.Schema({
   name: String,
   color: String,
   icon: String,
   image: String,
});
Cateogry = mongoose.model('Cateogry', cateogryScheme);
cateogryScheme.virtual('id').get(function () {
   return this._id.toHexString();
});
cateogryScheme.set('toJSON', {
   virtuals: true,
});
module.exports = Cateogry;
