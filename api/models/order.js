const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: String, require: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Product', productSchema);