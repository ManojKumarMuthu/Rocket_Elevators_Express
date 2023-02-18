const express = require('express')
const app = express()

const {validateRequest} = require('./calculation')

require('dotenv').config();
const port = process.env.PORT

app.listen(port, () => {
  console.log(` server listening on port ${port} `)
})

// Hello //

app.get('/hello', (req, res) => {
  console.log(`Server listening on port ${port}`);
  res.send('Hello World!');
});

// Status //

app.get('/status', (req, res) => {
  const { PORT, ENVIRONMENT } = process.env;
  res.send(`Server is running on port ${PORT} in ${ENVIRONMENT} environment`);
});

// Error //

app.get('/error', (req, res) => {
  const errorCode = 500;
  const errorMessage = 'This is a simulated error message.';
  res.status(errorCode).json({ error: errorMessage });
});

// Email-List //

const agents = require('./agents');

app.get('/email-list', (req, res) => {
  const emailList = agents.map(agent => agent.email).join(',');
  res.send(emailList);
});

// Agent ratings // 

app.get('/region-avg', (req, res) => {
  const region = req.query.region.toLowerCase();
  const filteredAgents = agents.filter(agent => agent.region.toLowerCase() === region);

  if (filteredAgents.length === 0) {
    res.status(404).json({ message: 'No agents found in the specified region.' });
  } else {
    const totalRating = filteredAgents.reduce((acc, agent) => acc + parseFloat(agent.rating), 0);
    const totalFee = filteredAgents.reduce((acc, agent) => acc + parseFloat(agent.fee), 0);
    const averageRating = (totalRating / filteredAgents.length).toFixed(2);
    const averageFee = (totalFee / filteredAgents.length).toFixed(2);
    res.json({
      region,
      averageRating,
      averageFee
    });
  }
});

// Residental Calculation //

app.get('/calculate-elevators', (req, res) => {
  const tier = req.query.tier;
  const floors = req.query.floors;
  const app = req.query.appartments;

  if (!tier || !["standard", "premium", "excelium"].includes(tier)) {
    return res.status(400).json({ message: "Invalid tier" });
  }

  if (isNaN(app) || isNaN(floors)) {
    return res.status(400).json({ message: "Apartments and floors must be numbers" });
  }

  const numAptsInt = parseInt(app);
  const numFloorsInt = parseInt(floors);

  if (!Number.isInteger(numAptsInt) || !Number.isInteger(numFloorsInt)) {
    return res.status(400).json({ message: "Apartments and floors must be integers" });
  }

  if (numAptsInt <= 0 || numFloorsInt <= 0) {
    return res.status(400).json({ message: "Apartments and floors must be greater than zero" });
  }

  res.send(validateRequest(tier, numFloorsInt, numAptsInt));
});


// Post request//

app.use(express.json());

app.post('/contact-us', (req, res) => {
  const { first_name, last_name, message } = req.body;
  console.log(`Received a message from ${first_name} ${last_name}: ${message}`);
  res.status(200).send(`Thank you for your message, ${first_name}! We have received it and will get back to you soon.`);
});
