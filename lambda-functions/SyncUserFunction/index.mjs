// Import require in an ES module environment
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mysql = require('mysql');

export const handler = async (event) => {
  let connection;
  try {
    console.log("Received event:", JSON.stringify(event));

    // Safely parse request body
    if (!event.body) {
      throw new Error("Request body is undefined or empty.");
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      throw new Error("Failed to parse JSON body: " + parseError.message);
    }

    const { sub, email, name } = body;
    if (!sub || !email || !name) {
      throw new Error("Missing required user fields (sub, email, name).");
    }

    // Create a MySQL connection
    connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Promisified connection methods
    const connectAsync = () =>
      new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.error('Error connecting:', err);
            return reject(err);
          }
          console.log('Connected as id ' + connection.threadId);
          resolve();
        });
      });

    const queryAsync = (query, values) =>
      new Promise((resolve, reject) => {
        connection.query(query, values, (error, results, fields) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

    const endAsync = () =>
      new Promise((resolve, reject) => {
        connection.end((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

    // Connect to the database
    await connectAsync();

    // Check if the user already exists
    const rows = await queryAsync(
      'SELECT id FROM users WHERE cognito_sub = ?',
      [sub]
    );

    if (!rows.length) {
      // Insert new user record if not found
      await queryAsync(
        `INSERT INTO users (cognito_sub, email, name, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [sub, email, name]
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User synced successfully.' }),
    };
  } catch (error) {
    console.error('Error syncing user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error syncing user.', details: error.message }),
    };
  } finally {
    if (connection) {
      try {
        await new Promise((resolve) => connection.end(resolve));
      } catch (endError) {
        console.error('Error ending connection:', endError);
      }
    }
  }
};
