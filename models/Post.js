const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    firstname: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId
            },
            firstname: {
                type: String
            },
            avatar: {
                type: String
            },
            text: {
                type: String,
                required: true
            },
            likes: [
                {
                    user: {
                        type: Schema.Types.ObjectId
                    }
                }
            ],
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('post', PostSchema);
