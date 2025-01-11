import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  let connection;

  try {
    console.log("Received event:", JSON.stringify(event));

    // Create a MySQL connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Check for the 'seller_sub' query parameter from the API service request
    const sellerSub = event.queryStringParameters?.seller_sub;

    let query;
    let params = [];

    if (sellerSub) {
      // If seller_sub is provided, join products and users
      // to match the user’s cognito_sub and fetch that user’s products.
      query = `
        SELECT p.*
        FROM products p
        JOIN users u ON p.seller_id = u.id
        WHERE u.cognito_sub = ?
      `;
      params.push(sellerSub);
    } else {
      // Otherwise, fetch all available products
      query = 'SELECT * FROM products WHERE status = "available"';
    }

    const [rows] = await connection.execute(query, params);

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
      body: JSON.stringify({ 
        error: 'Error fetching products.', 
        details: error.message 
      }),
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
