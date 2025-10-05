import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    image: String,

    bio: {
        type: String,
        required: true
    },
    threads: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
        }
    ],
    onboarded: {
        type: Boolean,
        required: false
    },
    communities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    likes: [{
        type: String,
        required: true
    }]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User