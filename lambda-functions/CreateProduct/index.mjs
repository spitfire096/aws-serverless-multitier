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

    // Parse request body
    let body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { title, description, price, stock, imgUrl, sellerSub } = body;

    if (!title || !description || !price || !stock || !sellerSub) {
      throw new Error("Missing required product fields.");
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Retrieve seller ID based on Cognito sub
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE cognito_sub = ?',
      [sellerSub]
    );

    if (!users.length) {
      throw new Error("Seller not found.");
    }
    const sellerId = users[0].id;

    // Insert new product
    await connection.execute(
      `INSERT INTO products 
        (seller_id, title, description, price, stock, image_url, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'available', NOW(), NOW())`,
      [sellerId, title, description, price, stock, imgUrl]
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Product created successfully.' }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error creating product.', details: error.message }),
    };
  } finally {
    if (connection) {
      try { await connection.end(); } catch (endError) { console.error('Error ending connection:', endError); }
    }
  }
};
