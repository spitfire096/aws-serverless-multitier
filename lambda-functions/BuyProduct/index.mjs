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

    const { productId } = event.pathParameters;
    if (!productId) throw new Error("Missing productId in path.");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    // Retrieve product info
    const [products] = await connection.execute(
      'SELECT stock FROM products WHERE id = ? AND status = "available"',
      [productId]
    );

    if (!products.length) throw new Error("Product not found or not available.");
    const product = products[0];

    if (product.stock <= 0) throw new Error("Product out of stock.");

    // Decrement stock and update status if needed
    const newStock = product.stock - 1;
    const newStatus = newStock === 0 ? 'sold' : 'available';

    await connection.execute(
      'UPDATE products SET stock = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [newStock, newStatus, productId]
    );

    // Optionally insert into purchases table here if you track purchases

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Purchase successful.' }),
    };
  } catch (error) {
    console.error('Error purchasing product:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error purchasing product.', details: error.message }),
    };
  } finally {
    if (connection) {
      try { await connection.end(); } catch (endError) { console.error('Error ending connection:', endError); }
    }
  }
};
