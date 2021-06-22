const db = require('../config/dbconfig');


exports.createUser = (request, response) => {
    db.insert(
        {
            table: 'users',
            records: [
                {
                    username: request.body.userName,
                    email: request.body.email,
                    password: request.body.password,

                }
            ]
        },
        (err, res) => {
            if (err) response.status(500).json(err);

            response.status(res.statusCode).json(res.data);
        }
    );

} 