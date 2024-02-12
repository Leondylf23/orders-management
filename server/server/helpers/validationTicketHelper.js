const Joi = require('joi');
const Boom = require('boom');

const allTicketQueryValidation = (data) => {
  const schema = Joi.object({
    ticketName: Joi.string().optional().description('Title ticket search'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const ticketFormValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required().description('Title ticket'),
    location: Joi.string().min(2).max(255).required().description('Location of ticket'),
    description: Joi.string().min(5).max(500).required().description('Ticket description'),
    variants: Joi.string().required().description('Ticket variants in json')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const bookingRequestValidation = (data) => {
  const schema = Joi.object({
    data: Joi.string().required().description('Encrypted data payment required')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const bookingDataFormValidation = (data) => {
  const schema = Joi.object({
    ticketId: Joi.number().required().description('Ticket id is required!'),
    variant: Joi.object({
      variantName: Joi.string().required().description('Variant name is required!'),
      price: Joi.number().min(5000).max(5000000).required().description('Price is required!')
    }).required().description('Variant is required!'),
    paymentMethod: Joi.string().required().description('Payment method is required!'),
    totalPayment: Joi.number().required().description('Total payment is required!'),
    coupons: Joi.array().optional().items(Joi.number().description('Coupon data must be number!')).required().description('Coupons is required!')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest('Form data not matched!');
  }
};

const couponDataFormValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().description('Name of coupon'),
    priceCut: Joi.number().min(5000).max(200000).precision(2).required().description('Price cut of coupon, should be minimum of 5000 and maximum of 200000')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editTicketFormValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of ticket'),
    title: Joi.string().min(5).max(255).required().description('Title ticket'),
    location: Joi.string().min(2).max(255).required().description('Location of ticket'),
    description: Joi.string().min(5).max(500).required().description('Ticket description'),
    variants: Joi.string().required().description('Ticket variants in json')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editBookingStatusValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of booking'),
    isSuccess: Joi.boolean().required().description('Must provide success value!')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id must be number'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  allTicketQueryValidation,
  
  ticketFormValidation,
  bookingRequestValidation,
  bookingDataFormValidation,
  couponDataFormValidation,

  editTicketFormValidation,
  editBookingStatusValidation,

  idValidation
};
