const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = 3000;


// Configure CORS
app.use(cors({
    origin: '*', // Allow specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const products = [
  { id: 1, name: 'Sendal' },
  { id: 2, name: 'Sepatu' },
  { id: 3, name: 'Baju' },
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const user = products.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Product not found');
  res.json(user);
});

app.post('/api/products', (req, res) => {
  const user = {
    id: products.length + 1,
    name: req.body.name,
  };
  products.push(user);
  res.json(user);
});

// Ubah `app.listen` untuk mendengarkan pada semua alamat IP
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
