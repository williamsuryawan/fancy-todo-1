require('dotenv').config()
const express = require('express')
const cors = require ('cors')
const mongoose = require ('mongoose')

// const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const todoRouter = require('./routes/todos')
const projectRouter = require('./routes/projects')
const port = process.env.port || 3000

const app = express()
app.use(cors())
mongoose.connect(`mongodb+srv://${process.env.name}:${process.env.password}@cluster0-dlbfv.mongodb.net/fancytodor?retryWrites=true`, {useNewUrlParser: true})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/todos', todoRouter)
app.use('/projects', projectRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app;