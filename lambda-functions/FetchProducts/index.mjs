import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Basic query to fetch available products; expand this using query parameters if needed
    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE status = "available"'
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error fetching products.', details: error.message }),
    };
  } finally {
    if (connection) {
      try { await connection.end(); } catch (endError) { console.error('Error ending connection:', endError); }
    }
  }
};
