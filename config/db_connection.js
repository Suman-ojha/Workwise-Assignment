const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(DB_NAME, USER, PASSWORD, {
    host: HOST,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true, // Force SSL
            rejectUnauthorized: false // Allow self-signed certificates
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
// postgresql://prod_user:j7HUSyR8HNRMAzaYLcKYYIQXj9ElPEEc@dpg-ctonrci3esus73dbm1eg-a.singapore-postgres.render.com/project_prod_db

// const { Sequelize } = require('sequelize');

// // Use the provided URL for the connection
// const DATABASE_URL = 'postgresql://prod_user:j7HUSyR8HNRMAzaYLcKYYIQXj9ElPEEc@dpg-ctonrci3esus73dbm1eg-a.singapore-postgres.render.com/project_prod_db';

// const sequelize = new Sequelize(DATABASE_URL, {
//     dialect: 'postgres', // Specify the dialect explicitly
//     logging: false,      // Disable logging (optional)
//     dialectOptions: {
//         ssl: {
//             require: true, // Force SSL
//             rejectUnauthorized: false // Allow self-signed certificates
//         }
//     },
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

// module.exports = sequelize;
