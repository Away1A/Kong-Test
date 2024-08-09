const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 2000;

// Use the secret from Kong JWT credential
const KONG_SECRET = 'example-secret';

// Configure CORS
app.use(cors({
    origin: '*', // Allow specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const users = [
  {
    id: 1,
    username: 'user1',
    password: 'password1',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user2',
    password: 'password2',
    role: 'user',
  },
  {
    id: 3,
    username: 'user3',
    password: 'password3',
    role: 'user',
  },
];

// Endpoint for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).send('Username or password is incorrect');
  }

  // Generate token with issuer claim (iss) set to the Kong key
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role, // Include role in token
      iss: 'edi',
    },
    KONG_SECRET, // Sign with the secret known to Kong
    { expiresIn: '1h' }
  );

  res.json({ token, role: user.role }); // Send role in response
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
