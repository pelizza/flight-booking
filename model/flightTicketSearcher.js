var _ = require('underscore');
var moment = require('moment');

const TICKET_BASE_PRICE = 200;
const TICKET_BASE_PRICE_CHILDREN = 100;
const DISCOUNT_FACTOR_3_MONTHS = 10;
const DISCOUNT_FACTOR_6_MONTHS = 20;
const DISCOUNT_FACTOR_QUANTITY = 2;
const COVERED_CITIES = ['Florianópolis', 'Curitiba', 'Porto Alegre', 'Rio de Janeiro', 'São Paulo', 'Belo Horizonte', 'Vitória'];

function FlightTicketSearcher() {
}

FlightTicketSearcher.prototype = {
  constructor: FlightTicketSearcher,

  getAvailableFlightTickets: function (searchParams) {
    if(searchParams.quantity > 10) return [];
    return [
      this._createFlightTicket(searchParams.adults, searchParams.children, searchParams.from, searchParams.to, searchParams.departureDate),
      this._createFlightTicket(searchParams.adults, searchParams.children, searchParams.to, searchParams.from, searchParams.returnDate)
    ];
  },

  validateFields: function (searchParams) {
    var errors = [];
    this._validateCity(errors, searchParams.from, 'from');
    this._validateCity(errors, searchParams.to, 'to', searchParams.from);
    this._validateDate(errors, searchParams.departureDate, 'departureDate');
    this._validateDate(errors, searchParams.returnDate, 'returnDate', this._parseDate(searchParams.departureDate));
    return errors;
  },

  _createFlightTicket: function(adults, children, from, to, date) {
    adults = parseInt(adults);
    children = parseInt(children);
    var quantity = adults + children;
    var totalPrice = TICKET_BASE_PRICE * adults + TICKET_BASE_PRICE_CHILDREN * children;
    var discount = (quantity - 1) * DISCOUNT_FACTOR_QUANTITY;
    var parsedDate = this._parseDate(date);

    if(this._getTodayWithoutHours().add(6, 'months').isSameOrBefore(parsedDate)) {
      discount += DISCOUNT_FACTOR_6_MONTHS;
    } else if(this._getTodayWithoutHours().add(3, 'months').isSameOrBefore(parsedDate)) {
      discount += DISCOUNT_FACTOR_3_MONTHS;
    }

    var finalPrice = totalPrice - (totalPrice * (discount/100));
    return {
      from: from,
      to: to,
      date: date,
      time: '14:00',
      adults: adults,
      children: children,
      price: finalPrice
    };
  },

  _validateCity: function (errors, city, fieldName, rejectedCity) {
    if (!city || city === '') errors.push({field: fieldName, message: 'Campo obrigatório.'});
    else if (!_(COVERED_CITIES).contains(city)) {
      errors.push({
        field: fieldName,
        message: 'Somente capitais da região Sul e Sudeste do Brasil são atendidas pela companhia aérea.'
      });
    } else if (city === rejectedCity) {
      errors.push({
        field: fieldName,
        message: 'A cidade de destino deve ser diferente da cidade de origem.'
      });
    }
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
        errors.push({field: fieldName, message: 'A data de volta deve ser maior do que a data de ida.'});
        return errors;
      }
    } else {
      var today = this._getTodayWithoutHours();
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
  },

  _getTodayWithoutHours: function() {
    return moment().hours(0).minutes(0).seconds(0).milliseconds(0);
  }
};

module.exports = FlightTicketSearcher;