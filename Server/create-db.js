const { Pool } = require('pg');

async function createDatabase() {
  // Connect to default postgres database
  const pool = new Pool({
    user: "postgres",
    password: "Abdulla",
    host: "localhost",
    database: "postgres",
    port: 5432,
  });

  try {
    console.log('Creating swapmart database...');
    
    // Create the database
    await pool.query('CREATE DATABASE swapmart');
    console.log('Database swapmart created successfully!');
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database swapmart already exists!');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    await pool.end();
  }
}

createDatabase()
  .then(() => {
    console.log('Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  }); 