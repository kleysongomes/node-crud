const db = require('../database');

const UserModel = {
    create: async ({ email, password}) => {
        const query = `
            INSERT INTO users (email, password) 
            VALUES ($1, $2) 
            RETURNING id, email, created_at
        `;

        const params = [email, password];
        const result = await db.query(query, params);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const params = [email];
        const result = await db.query(query, params);
        return result.rows[0];
    }
};

module.exports = UserModel;