const express = require('express')
const cors = require('cors');


const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());



app.use(express.json());

//define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => res.send('lets start'))

app.listen(PORT, () => {
    console.log('app running')
})