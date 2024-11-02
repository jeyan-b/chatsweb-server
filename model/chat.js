const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CSchema= new Schema(
    {
        chatName: { type: String, trim: true},
        isGroupChat: { type: Boolean, trim: false},
        users: [{
            type: String
            }],
        latestMessage: {
            type: String
        },
        groupAdmin: {
            type: String

        }

    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('chat', CSchema, 'chats');

module.exports = Chat;
