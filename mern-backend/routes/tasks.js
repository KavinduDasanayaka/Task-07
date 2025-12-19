const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.send(tasks);
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).send();
    res.send('Task deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;