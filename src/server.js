const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://bohdanmerkulov:i3Pjqym2sPlD5SA8@cluster0.7v4wg8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const ideaSchema = new mongoose.Schema({
    activity: String,
    type: String,
    when: String
  });
  
  const Idea = mongoose.model('Idea', ideaSchema);
  const CompletedIdea = mongoose.model('CompletedIdea', ideaSchema);
  
  app.get('/ideas', async (req, res) => {
    const ideas = await Idea.find();
    const completedIdeas = await CompletedIdea.find();
    res.json({ ideas, completedIdeas });
  });
  
  app.post('/ideas', async (req, res) => {
    const { ideas, completedIdeas } = req.body;
  
    await Idea.deleteMany();
    await CompletedIdea.deleteMany();
  
    await Idea.insertMany(ideas);
    await CompletedIdea.insertMany(completedIdeas);
  
    res.json({ message: 'Ideas and completed challenges saved' });
  });
  
  app.delete('/ideas', async (req, res) => {
    await Idea.deleteMany();
    await CompletedIdea.deleteMany();
    res.json({ message: 'All ideas and completed challenges deleted' });
  });
  
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
