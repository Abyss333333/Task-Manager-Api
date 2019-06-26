const mongoose = require('mongoose')
const validator = require ('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({ 
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        trim:true,
        lowercase:true,
        required: true,
        unique:true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw Error ("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        validate (value) {
            if (value < 0) {
                throw new Error('Age Must be Positive')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password cannot contain "password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps:true

})

// Virtual Property, a relationship between 2 properties
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner' 
})



// authorizing tokens
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token =  jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error ('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch){
        throw new Error ('Unable to Log in')
    }

    return user
}


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar 

    return userObject
}

// hash plain text password before saving MIddleware
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }


    next() // end the function
})

//Delete User Taks when user is removed  IMIddleware

userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model (('User'), userSchema)

module.exports = User

// const me = new User ({
//     name: ' Paz',
//     age: 24,
//     email: 'PAZ@gmail.com',
//     password: 'abyss2232'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch ((error) =>{
//     console.log('Error', error)
// })