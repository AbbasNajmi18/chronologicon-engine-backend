const express = require('express');
const eventsRoutes = require('./routes/events');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/events', eventsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
