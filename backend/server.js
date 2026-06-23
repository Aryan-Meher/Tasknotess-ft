const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const logger = require('./utils/logger');

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});