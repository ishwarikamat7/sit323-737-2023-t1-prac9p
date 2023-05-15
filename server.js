const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

//const mongoURI = 'mongodb+srv://ishwarikmt7:2Lv2s38ukehP6Azf@sit737.vqrimax.mongodb.net/';
const mongoURI = process.env.MONGO_URI;
const dbName = 'task9P';
const collectionName = 'task9P';
app.use(express.json());
// Create a reusable function to connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return collection;
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas', err);
    throw err;
  }
}

app.get('/', async (req, res) => {
    res.send("Hello, this is task 9.1P")
  });

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

app.get('/api/tasks', async (req, res) => {
  try {
    const collection = await connectToMongo();
    const tasks = await collection.find().toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/addTasks', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const newTask = req.body;
  
      // Insert the new task into the collection
      const result = await collection.insertOne(newTask);
  
      res.status(201).json({ message: 'Task added successfully', taskId: result.insertedId });
    } catch (err) {
        console.error('Error adding task', err);
        res.status(500).json({ error: 'Failed to add task' });
    }
  });

  app.put('/api/updateTasks/:id', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const taskId = req.params.id;
      const updatedTask = req.body;
  
      // Update the task in the collection
      const result = await collection.updateOne({ _id: new ObjectId(taskId) }, { $set: updatedTask });
  
      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.json({ message: 'Task updated successfully' });
      }
    } catch (err) {
      console.error('Error updating task', err);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  app.delete('/api/deleteTasks/:id', async (req, res) => {
    try {
      const collection = await connectToMongo();
      const taskId = req.params.id;
  
      // Delete the task with the given ID
      const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
  
      if (result.deletedCount === 0) {
        // No task was deleted
        res.status(404).json({ error: `Task with ID ${taskId} not found` });
      } else {
        res.json({ message: 'Task deleted successfully' });
      }
    } catch (err) {
      console.error('Error deleting task', err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
