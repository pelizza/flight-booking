var express = require('express');
var flash = require('connect-flash');
var router = express.Router();
var util = require('util');
var _ = require('underscore');
var FlightTicketSearcher = require('../model/flightTicketSearcher');

router.get('/', function (req, res) {
  var errors = req.flash('errors');
  var values = req.flash('values');
  res.render('index', {
    title: 'Agile Airlines - Home',
    errors: errors && errors.length && errors[0],
    values: values && values.length && values[0]
  });
});

router.post('/flights', function (req, res) {
  var flightTicketSearcher = new FlightTicketSearcher();

  var errors = flightTicketSearcher.validateFields(req.body);
  if (errors && errors.length) {
    req.flash('errors', _(errors).indexBy('field'));
    req.flash('values', req.body);
    res.redirect('/');
    return;
  }

  res.render('flight-results', {
    title: 'Agile Airlines - Passagens',
    flightTickets: flightTicketSearcher.getAvailableFlightTickets(req.body)
  });
});

module.exports = router;
