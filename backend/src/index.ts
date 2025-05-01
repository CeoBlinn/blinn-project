import dotenv from 'dotenv';
import { build } from './app';

// Load environment variables
dotenv.config();

// Start the server
const start = async () => {
  try {
    const app = await build({
      logger: true
    });

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(); 