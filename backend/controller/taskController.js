import Task from "../model/taskModel";

export const createTask = async (req, res) => {
    try {
        console.log("Create Task request received:", req.body);
        const { title, description, assignedTo, priority } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newTask = new Task({
            title,
            description,
            assignedTo: assignedTo || [],
            priority: priority || 'Low',
            category: req.body.category || '',
            workspace: req.body.workspace || ''
        });

        await newTask.save();

        console.log("Task created successfully:", newTask._id);

        res.status(201).json({
            message: 'Task created successfully',
            task: newTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        console.log("Get Tasks request received");
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};



export default { createTask, getTasks };