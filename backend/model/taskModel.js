import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    assignedTo: {
        type: [String],
        ref: 'User',
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    category: {
        type: String,
        required: false
    },
    workspace: {
        type: String,
        ref: 'Workspace',
        required: false
    }       
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
