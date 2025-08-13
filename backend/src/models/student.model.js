const db = require('../database');

const StudentModel = {
    
    getAll: async ({ page, limit, search }) => {
        const offset = (page - 1) * limit;
        let params = [];
        let placeholderIndex = 1;
        let query = `
            SELECT *, COUNT(*) OVER() AS total_count 
            FROM students
        `;

        if (search) {
            query += ` WHERE (name ILIKE $${placeholderIndex} OR ra::text ILIKE $${placeholderIndex} OR cpf::text ILIKE $${placeholderIndex})`;
            params.push(`%${search}%`);
            placeholderIndex++;
        }

        query += ` ORDER BY name LIMIT $${placeholderIndex} OFFSET $${placeholderIndex + 1}`;
        params.push(limit, offset);
        
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return { students: [], total: 0 };
        }
        
        const total = parseInt(result.rows[0].total_count, 10);
        const students = result.rows.map(student => {
            const { total_count, ...rest } = student;
            return rest;
        });
        return { students, total };
    },
    
    getByRa: async (ra) => {
        const query = 'SELECT * FROM students WHERE ra = $1';
        const params = [ra];
        const result = await db.query(query, params);
        return result.rows[0];
    },

    create: async (studentData) => {
        const columns = Object.keys(studentData).join(', ');
        const placeholders = Object.keys(studentData).map((_, i) => `$${i + 1}`).join(', ');
        const params = Object.values(studentData);

        const query = `
            INSERT INTO students (${columns}) 
            VALUES (${placeholders}) 
            RETURNING *
        `;

        const result = await db.query(query, params);
        return result.rows[0];
    },

    update: async ({ ra, name, email }) => {
        const dataToUpdate = { name, email };
        
        const setClause = Object.keys(dataToUpdate)
            .map((key, i) => `"${key}" = $${i + 1}`)
            .join(', ');

        const params = [...Object.values(dataToUpdate), ra];
        const raPlaceholder = `$${params.length}`;

        const query = `
            UPDATE students 
            SET ${setClause} 
            WHERE ra = ${raPlaceholder} 
            RETURNING *
        `;
        
        const result = await db.query(query, params);
        return result.rows[0];
    },

    delete: async (ra) => {
        const query = 'DELETE FROM students WHERE ra = $1';
        const params = [ra];
        await db.query(query, params);
    },
};

module.exports = StudentModel;