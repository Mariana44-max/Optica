require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const roleRepository = require('./repositories/roleRepository');
const authRoutes = require('./routes/authRoutes');

require('./models/Role');
require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4001;

async function start() {
  let retries = 10;
  while (retries) {
    try {
      await sequelize.authenticate();
      break;
    } catch (e) {
      console.log('MySQL no disponible aun, reintentando...', e.message);
      retries -= 1;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  await sequelize.sync({ alter: true });
  await roleRepository.ensureDefaults();

  app.listen(PORT, () => console.log(`auth-service escuchando en puerto ${PORT}`));
}

start().catch((e) => {
  console.error('Error iniciando auth-service:', e);
  process.exit(1);
});
