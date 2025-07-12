const express = require('express');
const eventsRoutes = require('./routes/events');
const timelineRoutes = require('./routes/timeline');


const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/events', eventsRoutes);
app.use('/api/timeline', timelineRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
