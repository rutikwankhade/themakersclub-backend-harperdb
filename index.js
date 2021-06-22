const express = require('express')
const usersRoute = require('./routes/users');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//define routes
app.route('/api/users').post(usersRoute.createUser);

app.get('/',(req, res)=>res.send('lets start'))

app.listen(PORT, () => {
    console.log('app running')
})