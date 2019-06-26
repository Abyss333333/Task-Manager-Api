const express = require('express')
require ('./db/mongoose') // make sure mongoose connects to database
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require ('./routers/user')
const taskRouter = require ('./routers/task')

const app = express()
const port = process.env.PORT


app.use(express.json())// parse incoming JSON to an onject
app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log (`Server is Up and Running on ${port}`)
})

