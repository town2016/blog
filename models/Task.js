const mongoose = require('mongoose')
const taskSchema = require('../schemas/task')
const Task = mongoose.model('Task', taskSchema)
module.exports = Task
