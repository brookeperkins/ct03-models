const express = require('express');
const app = express();
const Cat = require('./models/cats');

app.use(express.json());

app.post('/api/v1/cats', async(req, res, next) => {
  try {
    const createdCat = await Cat.insert(req.body);
    res.send(createdCat);
  } catch(error) {
    next(error);
  }
});

app.delete('/api/v1/cats/:id', async(req, res, next) => {
  try {
    const deletedCat = await Cat.delete(req.params.id);
    res.send(deletedCat);
  } catch(error) {
    next(error);
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
