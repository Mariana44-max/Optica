require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const categoryRepository = require('./repositories/categoryRepository');
const productRoutes = require('./routes/productRoutes');

require('./models/Category');
require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));
app.use('/api', productRoutes);

const PORT = process.env.PORT || 4002;

async function start() {
  let retries = 10;
  while (retries) {
    try {
      await sequelize.authenticate();
      break;
    } catch (e) {
      console.log('PostgreSQL no disponible aun, reintentando...', e.message);
      retries -= 1;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  await sequelize.sync({ alter: true });
  await categoryRepository.ensureDefaults();

  app.listen(PORT, () => console.log(`product-service escuchando en puerto ${PORT}`));
}

start().catch((e) => {
  console.error('Error iniciando product-service:', e);
  process.exit(1);
});
