const Joi = require('joi');
const Boom = require('boom');

const allProductQueryValidation = (data) => {
  const schema = Joi.object({
    productName: Joi.string().optional().description('Title product search'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const productFormValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required().description('Title product'),
    description: Joi.string().min(5).max(500).required().description('Product description'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const orderRequestValidation = (data) => {
  const schema = Joi.object({
    data: Joi.string().required().description('Encrypted data payment required')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const orderDataFormValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.number().required().description('Product id is required!'),
    variant: Joi.object({
      variantName: Joi.string().required().description('Variant name is required!'),
      price: Joi.number().min(5000).max(5000000).required().description('Price is required!')
    }).required().description('Variant is required!'),
    paymentMethod: Joi.string().required().description('Payment method is required!'),
    totalPayment: Joi.number().required().description('Total payment is required!'),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest('Form data not matched!');
  }
};

const editProductFormValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of product'),
    title: Joi.string().min(5).max(255).required().description('Title product'),
    location: Joi.string().min(2).max(255).required().description('Location of product'),
    description: Joi.string().min(5).max(500).required().description('Product description'),
    variants: Joi.string().required().description('Product variants in json')
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editOrderStatusValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().description('Id of order'),
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
  allProductQueryValidation,
  
  productFormValidation,
  orderRequestValidation,
  orderDataFormValidation,

  editProductFormValidation,
  editOrderStatusValidation,

  idValidation
};
