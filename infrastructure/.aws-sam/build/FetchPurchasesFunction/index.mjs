// lambda-functions/FetchPurchasesFunction/index.mjs
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

    if (event.httpMethod && event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Query params for userSub
    const queryParams = event.queryStringParameters || {};
    const userSub = queryParams.userSub;
    if (!userSub) {
      throw new Error("Missing userSub in query parameters.");
    }

    // Connect to DB
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Step 1: Look up the user ID from the `users` table
    const [userRows] = await connection.execute(
      `SELECT id FROM users WHERE cognito_sub = ?`,
      [userSub]
    );
    if (userRows.length === 0) {
      throw new Error(`User with sub "${userSub}" not found.`);
    }

    const buyerId = userRows[0].id;

    // Step 2: Fetch all purchases for this buyer_id
    const [purchases] = await connection.execute(
      `SELECT p.*, pr.title, pr.description, pr.status
         FROM purchases p
         JOIN products pr ON p.product_id = pr.id
        WHERE p.buyer_id = ?
        ORDER BY p.purchased_at DESC`,
      [buyerId]
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(purchases)
    };

  } catch (error) {
    console.error('Error fetching purchases:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Error fetching purchases.',
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
