// lambda-functions/BuyProductFunction/index.mjs
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

    if (event.httpMethod && event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    // Parse JSON body
    let body;
    if (typeof event.body === 'string') {
      try {
        body = JSON.parse(event.body);
      } catch (parseError) {
        throw new Error("Failed to parse JSON body: " + parseError.message);
      }
    } else if (event.body && typeof event.body === 'object') {
      body = event.body;
    } else {
      throw new Error("Request body is not valid JSON.");
    }

    const { productId, userSub } = body;
    if (!productId || !userSub) {
      throw new Error("Missing required fields: productId or userSub");
    }

    // Connect to your MySQL DB
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Step 1: Look up the user in `users` table by cognito_sub
    const [userRows] = await connection.execute(
      `SELECT id FROM users WHERE cognito_sub = ?`,
      [userSub]
    );
    if (userRows.length === 0) {
      throw new Error(`User with sub "${userSub}" not found.`);
    }

    const buyerId = userRows[0].id;

    // Step 2: Check product availability
    const [productRows] = await connection.execute(
      'SELECT status FROM products WHERE id = ?',
      [productId]
    );
    if (productRows.length === 0) {
      throw new Error(`Product with id "${productId}" not found.`);
    }
    if (productRows[0].status !== 'available') {
      throw new Error("Product is not available.");
    }

    // Step 3: Mark product as sold
    await connection.execute(
      `UPDATE products
       SET status = 'sold', updated_at = NOW()
       WHERE id = ?`,
      [productId]
    );

    // Step 4: Insert purchase
    await connection.execute(
      `INSERT INTO purchases (product_id, buyer_id, purchased_at)
       VALUES (?, ?, NOW())`,
      [productId, buyerId]
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Product purchased successfully.' })
    };

  } catch (error) {
    console.error('Error buying product:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Error buying product.',
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
