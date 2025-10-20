const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const { initDb } = require('./db');
const { router: authRouter } = require('./routes/auth');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const generatorRouter = require('./routes/generator');
const shipmentsRouter = require('./routes/shipments');
const vehiclesRouter = require('./routes/vehicles');
const tiresRouter = require('./routes/tires');
const maintenancesRouter = require('./routes/maintenances');
const invoicesRouter = require('./routes/invoices');
const receivablesRouter = require('./routes/receivables');
const payablesRouter = require('./routes/payables');
const alertsRouter = require('./routes/alerts');
const checklistRouter = require('./routes/checklist');
const inventoryRouter = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3001; // evita conflito com Next dev em 3000

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error('Not allowed by CORS'));
        },
      }
    : {};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// uploads estáticos
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ping
app.get('/ping', (req, res) => res.json({ message: 'pong' }));

// raiz padronizada
app.get('/', (req, res) => {
  res.json({
    name: 'OptiLog Backend',
    version: process.env.npm_package_version || 'dev',
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// health padronizado
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  res.json({ status: 'ok', uptime, memory });
});

// upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
  const filename = path.basename(req.file.filename);
  res.json({ filename, url: `/uploads/${filename}` });
});

// rotas
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/gerar-endpoint', generatorRouter);
app.use('/shipments', shipmentsRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/tires', tiresRouter);
app.use('/maintenances', maintenancesRouter);
app.use('/invoices', invoicesRouter);
app.use('/receivables', receivablesRouter);
app.use('/payables', payablesRouter);
app.use('/alerts', alertsRouter);
app.use('/checklist', checklistRouter);
app.use('/inventory', inventoryRouter);

// iniciar DB e servidor
initDb(() => {
  app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
});
