var _ = require('underscore');
var moment = require('moment');

function FlightTicketSearcher() {
  this._validCities = ['Florianópolis', 'Curitiba', 'Porto Alegre', 'Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Vitória'];
}

FlightTicketSearcher.prototype = {
  constructor: FlightTicketSearcher,

  getAvailableFlightTickets: function (searchParams) {
    var flightTickets = [{
      from: searchParams.from,
      to: searchParams.to,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      price: 200 * parseInt(searchParams.quantity)
    }];
    return flightTickets;
  },

  validateFields: function (searchParams) {
    var errors = [];

    this._validateCity(errors, searchParams.from, 'from');
    this._validateCity(errors, searchParams.to, 'to');
    this._validateDate(errors, searchParams.departureDate, 'departureDate');
    this._validateDate(errors, searchParams.returnDate, 'returnDate', this._parseDate(searchParams.departureDate));

    return errors;
  },

  _validateCity: function (errors, city, fieldName) {
    if (!city || city === '') errors.push({field: fieldName, message: 'Campo obrigatório.'});
    else if (!_(this._validCities).contains(city)) errors.push({
      field: fieldName,
      message: 'Somente capitais da região Sul e Sudeste do Brasil são atendidas pela companhia aérea.'
    });
    return errors;
  },

  _validateDate: function (errors, date, fieldName, relativeDate) {
    if (!date || date === '') {
      errors.push({field: fieldName, message: 'Campo obrigatório.'});
      return;
    }

    var parsedDate = this._parseDate(date);
    if (!parsedDate) {
      errors.push({field: fieldName, message: 'A data deve estar no formato dd/mm/aaaa. Ex.: 30/10/2016'});
      return errors;
    }
    if (!parsedDate.isValid()) {
      errors.push({field: fieldName, message: 'Data inexistente.'});
      return errors;
    }
    if (relativeDate) {
      if (relativeDate.isValid() && parsedDate.isBefore(relativeDate)) {
        errors.push({field: fieldName, message: 'A data deve ser maior que a primeira data informada.'});
        return errors;
      }
    } else {
      var today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
      if (parsedDate.isSameOrBefore(today)) {
        errors.push({field: fieldName, message: 'A data deve posterior ao dia de hoje.'});
        return errors;
      }
    }
    return errors;
  },

  _parseDate: function (date) {
    if (!date || date === '') return null;
    var parsedDate = /(\d\d)\/(\d\d)\/(\d\d\d\d)/g.exec(date);
    if (!parsedDate) return null;
    return moment(date, 'DD/MM/YYYY');
  }
};

module.exports = FlightTicketSearcher;