const express = require('express')
const app = express()

require("dotenv").config();
const port = process.env.PORT

app.listen(port, () => {
  console.log(` server listening on port ${port} `)
})


app.get('/hello', (req, res) => {
  console.log(`Server listening on port ${port}`);
  res.send('Hello World!');
});

app.get('/status', (req, res) => {
  const { PORT, ENVIRONMENT } = process.env;
  res.send(`Server is running on port ${PORT} in ${ENVIRONMENT} environment`);
});

app.get('/error', (req, res) => {
  const errorCode = 500;
  const errorMessage = 'This is a simulated error message.';
  res.status(errorCode).json({ error: errorMessage });
});

const agents = require('./agents');

app.get('/email-list', (req, res) => {
  const emailList = agents.map(agent => agent.email).join(',');
  res.send(emailList);
});


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



function validateRequest(req, res, next) {
  const tier = req.query.tier;
  const numApts = req.query.numApts;
  const numFloors = req.query.numFloors;

  if (!tier || !["standard", "premium", "excelium"].includes(tier)) {
    return res.status(400).json({ message: "Invalid tier" });
  }

  if (isNaN(numApts) || isNaN(numFloors)) {
    return res.status(400).json({ message: "Apartments and floors must be numbers" });
  }

  const numAptsInt = parseInt(numApts);
  const numFloorsInt = parseInt(numFloors);

  if (!Number.isInteger(numAptsInt) || !Number.isInteger(numFloorsInt)) {
    return res.status(400).json({ message: "Apartments and floors must be integers" });
  }

  if (numAptsInt <= 0 || numFloorsInt <= 0) {
    return res.status(400).json({ message: "Apartments and floors must be greater than zero" });
  }

  req.numApts = numAptsInt;
  req.numFloors = numFloorsInt;
  req.tier = tier;

  next();
}

app.get('/calculate-elevators', validateRequest, (req, res) => {
  const numApts = req.numApts;
  const numFloors = req.numFloors;
  const tier = req.tier;

  const unitPrices = {
    standard: 8000,
    premium: 12000,
    excelium: 15000,
  };
  const installPercentFees = {
    standard: 10,
    premium: 15,
    excelium: 20,
  };

  let elevatorsRequired;

  if (tier === "standard") {
    elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
  } else if (tier === "premium") {
    elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
  } else if (tier === "excelium") {
    elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
  }

  const elevatorCost = elevatorsRequired * unitPrices[tier];
  const installationFee = elevatorCost * installPercentFees[tier] / 100;
  const totalCost = elevatorCost + installationFee;

  res.json({
    elevatorsRequired,
    elevatorCost,
    installationFee,
    totalCost
  });
});
