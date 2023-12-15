const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// SQL Server configuration
const config = {
  user: 'DESKTOP-N22LJMC/ACER',
  password: '0000',
  server: '(localdb)\\local',
  database: 'product',
  options: {
    encrypt: true
  }
};
console.log("run ....")
// Registration route
app.post('api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await mssql.connect(config);

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO TableRegister (username, password)
      VALUES (@username, @hashedPassword)
    `;

    const request = pool.request();
    request.input('username', mssql.VarChar, username);
    request.input('hashedPassword', mssql.VarChar, hashedPassword);

    await request.query(query);

    // Introduce a 1-second delay using setTimeout and await
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
