const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3200;

// Configure CORS
app.use(cors({
    origin: '*', // Allow specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Categories data
const categories = [
  { id: 1, name: 'Footwear' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Accessories' },
];

// Categories endpoints
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/categories/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).send('Category not found');
  res.json(category);
});

app.post('/api/categories', (req, res) => {
  const category = {
    id: categories.length + 1,
    name: req.body.name,
  };
  categories.push(category);
  res.json(category);
});

// Ubah `app.listen` untuk mendengarkan pada semua alamat IP
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
