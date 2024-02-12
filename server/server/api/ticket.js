const Router = require('express').Router();
const Boom = require('boom');

const ValidationTicket = require('../helpers/validationTicketHelper');
const TicketHelper = require('../helpers/ticketHelper');
const GeneralHelper = require('../helpers/generalHelper');
const AuthMiddleware = require('../middlewares/authMiddleware');
const MulterMiddleware = require('../middlewares/multerMiddleware');
const UtilsHelper = require('../helpers/utilsHelper');

const fileName = 'server/api/ticket.js';

// PRIVATE FUCNTIONS

// ROUTE FUNCTIONS
const allBookings = async (request, reply) => {
    try {
        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'customer')) throw Boom.unauthorized('User role not allowed!');

        const response = await TicketHelper.getAllBooking(userData?.userId, false);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Bookings API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const getBookingDetail = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.query);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'customer')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.query;
        const response = await TicketHelper.getBookingDetailWithId(formData);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Booking Detail API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allBusinessBookings = async (request, reply) => {
    try {
        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const response = await TicketHelper.getAllBooking(userData?.userId, true);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Bookings API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const getBusinessBookingDetail = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.query);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.query;
        const response = await TicketHelper.getBookingDetailWithId(formData);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Booking Detail API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};


const allCoupons = async (request, reply) => {
    try {
        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const response = await TicketHelper.getAllCoupons(userData?.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Coupons API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allCouponsByTicketId = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.query);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'customer')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.query;
        const response = await TicketHelper.getAllCouponsByTicketId(formData, userData?.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Coupons by Ticket Id API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allTickets = async (request, reply) => {
    try {
        ValidationTicket.allTicketQueryValidation(request.query);
        const response = await TicketHelper.getAllTickets(request.query);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All Ticket API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const ticketDetail = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.query);

        const formData = request.query;
        const response = await TicketHelper.getTicketDetail(formData, null, false);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Ticket Detail API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const allMyTickets = async (request, reply) => {
    try {
        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.query;
        const response = await TicketHelper.getAllTickets(userData?.userId);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'All My Ticket API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const myTicketDetail = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.query);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.query;
        const response = await TicketHelper.getTicketDetail(formData, userData?.userId, true);

        return reply.send({
            message: 'success',
            data: response
        });
    } catch (err) {
        console.log([fileName, 'My Ticket Detail API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createTicket = async (request, reply) => {
    try {
        ValidationTicket.ticketFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const imageFile = request?.files?.imageData;
        if (!imageFile) throw Boom.badRequest('Image file required!');

        const formData = request.body;
        const response = await TicketHelper.addTicket({ ...formData, imageData: imageFile[0] }, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Create Ticket API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createBooking = async (request, reply) => {
    try {
        ValidationTicket.bookingRequestValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'customer')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.body;

        let decryptData = null;
        try {
            decryptData = {...JSON.parse(UtilsHelper.decryptData(formData?.data))}
        } catch (error) {
            throw Boom.badRequest('Data decryption failed!');
        }

        ValidationTicket.bookingDataFormValidation(decryptData);

        const response = await TicketHelper.addBooking(decryptData, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Create Booking API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const createCoupon = async (request, reply) => {
    try {
        ValidationTicket.couponDataFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.body;
        const response = await TicketHelper.addCoupon(formData, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Create Coupon API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const editTicket = async (request, reply) => {
    try {
        ValidationTicket.editTicketFormValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const imageFile = request?.files?.imageData;

        const formData = request.body;
        const response = await TicketHelper.editTicketData({...formData, imageData: imageFile ? imageFile[0] : null}, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Edit Ticket Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const updateBookingStatus = async (request, reply) => {
    try {
        ValidationTicket.editBookingStatusValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.body;
        const response = await TicketHelper.updateStatusBooking(formData, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Delete Ticket Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteTicket = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.body;
        const response = await TicketHelper.deleteTicket(formData, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Delete Ticket Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const deleteCoupon = async (request, reply) => {
    try {
        ValidationTicket.idValidation(request.body);

        const userData = GeneralHelper.getUserData(request);
        if (!(userData?.role === 'business')) throw Boom.unauthorized('User role not allowed!');

        const formData = request.body;
        const response = await TicketHelper.deleteCoupons(formData, userData?.userId);

        return reply.send({
            message: "success",
            data: response
        });
    } catch (err) {
        console.log([fileName, 'Delete Coupon Data API', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

// Public Routes
Router.get('/ticket', allTickets);
Router.get('/ticket/detail', ticketDetail);


// Customer Role Only Routes
Router.get('/booking', AuthMiddleware.validateToken, allBookings);
Router.get('/booking/detail', AuthMiddleware.validateToken, getBookingDetail);
Router.get('/coupon/byticket', AuthMiddleware.validateToken, allCouponsByTicketId);

Router.post('/booking/create', AuthMiddleware.validateToken, createBooking);


// Business Role Only Routes
Router.get('/booking/business', AuthMiddleware.validateToken, allBusinessBookings);
Router.get('/booking/business/detail', AuthMiddleware.validateToken, getBusinessBookingDetail);
Router.get('/coupon', AuthMiddleware.validateToken, allCoupons);
Router.get('/ticket/mytickets', AuthMiddleware.validateToken, allMyTickets);
Router.get('/ticket/mytickets/detail', AuthMiddleware.validateToken, myTicketDetail);

Router.post('/coupon/create', AuthMiddleware.validateToken, createCoupon);

Router.put('/ticket/create', AuthMiddleware.validateToken, MulterMiddleware.fields([{ name: 'imageData', maxCount: 1 }]), createTicket);

Router.patch('/ticket/edit', AuthMiddleware.validateToken, MulterMiddleware.fields([{ name: 'imageData', maxCount: 1 }]), editTicket);
Router.patch('/booking/status/update', AuthMiddleware.validateToken, updateBookingStatus);

Router.delete('/ticket/delete', AuthMiddleware.validateToken, deleteTicket);
Router.delete('/coupon/delete', AuthMiddleware.validateToken, deleteCoupon);

module.exports = Router;
