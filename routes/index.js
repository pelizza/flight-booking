var express = require('express');
var router = express.Router();

function getAvailableFlightTickets(searchParams) {
  var flightTickets = [{
    from: 'Florianópolis',
    to: 'Chapecó',
    departureDate: new Date(),
    returnDate: new Date(),
    price: 200
  }];
  return flightTickets;
}

router.get('/', function(req, res) {
  res.render('index', { title: 'Agile Airlines - Home' });
});

router.post('/flights', function(req, res) {
  res.render('flight-results', {
    title: 'Agile Airlines - Passagens',
    flightTickets: getAvailableFlightTickets(req.body)
  });
});

module.exports = router;
