// requiring packages
const express = require('express');
const dotenv = require('dotenv');

// bringinng in config folder
dotenv.config({ path: './config/config.env' });

// connecting to mongodb
const myDataBase = require('./config/db');
myDataBase();

//initing app
const app = express();

// parsing the body
app.use(express.json());

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/users/login', require('./routes/loginRoute'));
const PORT = process.env.PORT;

//listenning to port
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
