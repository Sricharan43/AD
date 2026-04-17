const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// SQLite Database Connection
const dbPath = path.resolve(__dirname, '../cinelytics.sqlite');
const db = new Database(dbPath, { verbose: console.log });
console.log(`✅ SQLite Database connected at: ${dbPath}`);

// Export db for routes
app.set('db', db);

// Routes mapping
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/actors', require('./routes/actors'));
app.use('/api/directors', require('./routes/directors'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
