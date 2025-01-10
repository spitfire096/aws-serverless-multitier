import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  let connection;

  try {
    // For demonstration, assume buyerSub is passed as a query parameter.
    // In a real scenario, extract user info from the token.
    const buyerSub = event.queryStringParameters?.buyerSub;
    if (!buyerSub) throw new Error("Missing buyerSub parameter.");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Retrieve buyer ID from users table
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE cognito_sub = ?',
      [buyerSub]
    );

    if (!users.length) throw new Error("User not found.");
    const buyerId = users[0].id;

    // Fetch purchases for this buyer
    const [rows] = await connection.execute(
      `SELECT p.*, pu.purchased_at 
       FROM purchases pu 
       JOIN products p ON pu.product_id = p.id 
       WHERE pu.buyer_id = ?`,
      [buyerId]
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error fetching purchases.', details: error.message }),
    };
  } finally {
    if (connection) {
      try { await connection.end(); } catch (endError) { console.error('Error ending connection:', endError); }
    }
  }
};
