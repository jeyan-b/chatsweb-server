const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CSchema= new Schema({
    sender: {
        type: String,
        required: [true, 'sender field required']
    },
    chat: {
        type: String,
        required: [true, 'chat field required']
    },
    content: {
        type: String,
        required: [true, 'content field required'],
    },
    
},{
    timestamps: true,
});

const Message = mongoose.model('message', CSchema, 'messages');

module.exports = Message;