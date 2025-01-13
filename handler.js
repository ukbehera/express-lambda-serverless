const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { pool } = require('./helper/dbConfig');
const { logger } = require('./helper/logger');



// Create an Express app
const app = express();
app.use(express.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Create Item (POST)
module.exports.createItem = async (event, context) => {
  const { name, description } = JSON.parse(event.body);
  const query = 'INSERT INTO items(name, description) VALUES($1, $2) RETURNING *';
  const values = [name, description];

  try {
    const result = await pool.query(query, values);
    logger.info('Item created', { item: result.rows[0] });
    return {
      statusCode: 201,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    logger.error('Error creating item', { error: err.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Get Item (GET)
module.exports.getItem = async (event, context) => {
  const { id } = event.pathParameters;
  const query = 'SELECT * FROM items WHERE id = $1';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    logger.info('Item retrieved', { item: result.rows[0] });
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    logger.error('Error getting item', { error: err.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Update Item (PUT)
module.exports.updateItem = async (event, context) => {
  const { id } = event.pathParameters;
  const { name, description } = JSON.parse(event.body);
  const query = 'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *';
  const values = [name, description, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    logger.error('Error updating item', { error: err.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Delete Item (DELETE)
module.exports.deleteItem = async (event, context) => {
  const { id } = event.pathParameters;
  const query = 'DELETE FROM items WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted' }),
    };
  } catch (err) {
    logger.error('Error deleting item', { error: err.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Create the Lambda handler using aws-serverless-express
const server = awsServerlessExpress.createServer(app);

module.exports.api = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
