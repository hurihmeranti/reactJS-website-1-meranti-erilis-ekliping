// ini untuk connection menggunakan postgresql
const {Pool} = require('pg');

const dbPool = new Pool ({
    database : 'heartbeart-meranti',
    port : 5432,
    user : 'admin',
    password : 'admin12',
});

    module.exports = dbPool;
