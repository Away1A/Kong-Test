const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 7000;
app.use(cors());

// Middleware untuk parsing JSON
app.use(bodyParser.json());

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' },
];

// Route untuk mendapatkan semua pengguna
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route untuk mendapatkan pengguna berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// Route untuk menambahkan pengguna baru
app.post('/api/users', (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(user);
  res.json(user);
});

// Menjalankan server pada port 7000
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
