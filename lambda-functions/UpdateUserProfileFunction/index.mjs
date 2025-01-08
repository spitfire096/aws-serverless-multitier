// UpdateUserProfileFunction/index.mjs
import mysql from 'mysql2/promise';

export const handler = async (event) => {
  let connection;
  try {
    const body = JSON.parse(event.body);
    const { sub, email, name, address, phone } = body;
    if (!sub) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing sub in request body.' }) 
      };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Update user profile fields; only override if new value is provided
    await connection.execute(
      `UPDATE users 
       SET email = COALESCE(?, email), 
           name = COALESCE(?, name),
           address = COALESCE(?, address),
           phone = COALESCE(?, phone),
           updated_at = NOW()
       WHERE cognito_sub = ?`,
      [email, name, address, phone, sub]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile updated successfully.' }),
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error updating profile.' }),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
