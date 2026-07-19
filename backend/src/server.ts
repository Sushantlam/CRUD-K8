import 'dotenv/config';
import app from './app';
import connectDB from './config/db';

const PORT = Number(process.env.PORT) || 5000;

void connectDB();

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
