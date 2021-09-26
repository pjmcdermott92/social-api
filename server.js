const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
require('./config/db')();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/posts/comment', require('./routes/api/comments'));

app.listen(PORT, () => console.log(`Server running on Port ${PORT}...`));
