import mysql from 'mysql2/promise';

export const handler = async (event) => {
  // Define CORS headers to include in all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  let connection;

  try {
    console.log("Received event:", JSON.stringify(event));

    // Handle request body parsing
    let body;
    if (typeof event.body === 'string') {
      try {
        body = JSON.parse(event.body);
      } catch (parseError) {
        throw new Error("Failed to parse JSON body: " + parseError.message);
      }
    } else if (typeof event.body === 'object' && event.body !== null) {
      body = event.body;
    } else {
      throw new Error("Request body is not valid JSON.");
    }

    const { sub, email, name } = body;
    if (!sub || !email || !name) {
      throw new Error("Missing required user fields (sub, email, name).");
    }

    // Create a MySQL connection using mysql2/promise
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,  // default MySQL port
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000  // 5-second timeout
    });

    // Check if user already exists
    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE cognito_sub = ?',
      [sub]
    );

    // Insert new user if not found
    if (!rows.length) {
      await connection.execute(
        `INSERT INTO users (cognito_sub, email, name, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [sub, email, name]
      );
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'User synced successfully.' }),
    };
  } catch (error) {
    console.error('Error syncing user:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error syncing user.', details: error.message }),
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (endError) {
        console.error('Error ending connection:', endError);
      }
    }
  }
};
