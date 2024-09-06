const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 2000;

// Use the secret from Kong JWT credential
const KONG_SECRET = 'bXIwS0dOMkF1d0ZKaEV2bzJyY0ZEZHhKbVlSYkZGSXVoZk5OOGUyZk9tdGJseDhON3ZTb1NsNU1rYWdj'; // Should be stored in environment variables for security

// Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Simulated user database
const users = [
  {
    id: '81314787-537b-474f-999a-9152c9703bbb',
    username: 'systemadmin',
    password: 'password1', // Passwords should be hashed in a real application
    role: 'Administrator',
    email: 'system@system.co',
    fullname: 'System',
    lastLogin: '2024-09-04T12:34:56Z' // ISO format for the last login date
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

  // Find user by username and password (Simulated check)
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).send('Username or password is incorrect');
  }

  // Generate JWT token with user details
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      iss: "I4FqavtAgcDN7W277nPgFpmdO0iMHYId", // Issuer
      sub: user.id.toString(), // Subject (user ID as string)
      aud: "http://localhost:5500", // Audience
      iat: Math.floor(Date.now() / 1000), // Issued at time
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time (1 hour)
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": user.id.toString() // Name Identifier claim with user ID as string
    },
    KONG_SECRET // Sign with secret key
  );

  res.json({ token, role: user.role, id:user.id });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
