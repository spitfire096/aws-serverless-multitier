// FetchUserProfileFunction/index.js
import mysql from 'mysql2/promise';

export const handler = async (event) => {
  let connection;
  try {
    const { sub } = event.queryStringParameters || {};
    if (!sub) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing sub parameter.' }) 
      };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE cognito_sub = ?',
      [sub]
    );

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found.' }),
      };
    }

    // Return the first matching user record
    return {
      statusCode: 200,
      body: JSON.stringify(rows[0]),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching profile.' }),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
