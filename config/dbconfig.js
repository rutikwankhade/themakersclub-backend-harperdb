require('dotenv').config();
const harperive = require('harperive');

const DB_CONFIG = {
    harperHost: process.env.INSTANCE_URL,
    username: process.env.INSTANCE_USERNAME,
    password: process.env.INSTANCE_PASSWORD,
    schema: process.env.INSTANCE_SCHEMA // optional
};

const Client = harperive.Client;
const db = new Client(DB_CONFIG);

module.exports = db;