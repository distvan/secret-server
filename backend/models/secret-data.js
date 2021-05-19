const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SecretDataModelSchema = new Schema({
    _id: Object,
    hash_value: String,
    view_count: Number,
    created_at: Date,
    expires_at: Date
});
const SecretDataModel = mongoose.model('SecretDataModel', SecretDataModelSchema)

module.exports = SecretDataModel;