const _ = require('lodash');
const Boom = require('boom');
const { like } = require('sequelize/lib/operators');

const db = require('../../models');
const GeneralHelper = require('./generalHelper');
const cloudinary = require('../services/cloudinary');
const { encryptData, generateRandomString } = require('./utilsHelper');

// PRIVATE FUNCTIONS

// TICKET HELPERS FUNCTIONS
const getAllBooking = async (userId, isBusiness) => {
    try {
        const data = await db.booking.findAll({
            include: [
                {
                    association: 'ticket',
                    required: true,
                    attributes: ['title', 'imageUrl'],
                    where: { ...(isBusiness && { isActive: true, }) },
                },
            ],
            where: {
                isActive: true,
                ...(isBusiness ? { businessUserId: userId } : { createdBy: userId })
            },
            attributes: ['id', 'bookingCode', 'status', 'variant']
        });

        const remapData = data?.map(booking => ({
            ...booking?.dataValues,
            ...booking?.ticket?.dataValues,
            variant: booking?.dataValues?.variant?.variantName,
            ticket: undefined
        }));

        return Promise.resolve(remapData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getBookingDetailWithId = async (dataObject) => {
    try {
        const { id } = dataObject;
        const data = await db.booking.findOne({
            include: [
                {
                    association: 'ticket',
                    required: true,
                    attributes: ['title', 'imageUrl', 'location', 'description'],
                    include: [
                        {
                            association: 'user',
                            required: true,
                            attributes: ['fullname'],
                        },
                    ]
                },
                {
                    association: 'couponConnectors',
                    required: false,
                    attributes: ['id'],
                    include: [
                        {
                            association: 'coupon',
                            required: true,
                            attributes: ['couponName', 'couponPrcCut'],
                        },
                    ]
                },
            ],
            attributes: ['bookingCode', 'status', 'variant', 'paymentMethod'],
            where: { id, isActive: true },
        });

        if (_.isEmpty(data)) throw Boom.notFound('Booking detail is not found!');

        const remapData = {
            ...data?.dataValues,
            ...data?.ticket?.dataValues,
            organization: data?.ticket?.user?.dataValues?.fullname,
            coupons: data?.couponConnectors?.map(couponData => couponData?.coupon?.dataValues),
            ticket: undefined,
            couponConnectors: undefined
        }

        return Promise.resolve(remapData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllTickets = async (dataObject, userId) => {
    const { ticketName } = dataObject;

    try {
        const data = await db.ticket.findAll({
            include: [
                {
                    association: 'user',
                    required: true,
                    where: { isActive: true },
                    attributes: [['fullname', 'organization']]
                },
            ],
            where: {
                isActive: true,
                ...(userId && { createdBy: userId }),
                ...(ticketName && { title: { [like]: `%${ticketName}%` } })
            },
            attributes: ['id', 'imageUrl', 'location', 'title', 'price', 'variants']
        });

        const remapData = data?.map(ticket => {
            const ticketValues = ticket?.dataValues;
            const variantsObj = JSON.parse(ticketValues?.variants);

            return ({
                organization: ticket?.user?.dataValues?.organization,
                ...ticketValues,
                variants: variantsObj.map(variant => variant?.variantName),
                user: undefined
            });
        });

        return Promise.resolve(remapData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getTicketDetail = async (dataObject, userId, isBusiness) => {
    try {
        const { id } = dataObject;

        const data = await db.ticket.findOne({
            ...(!isBusiness && {
                include: [
                    {
                        association: 'user',
                        required: true,
                        where: { isActive: true },
                        attributes: [['fullname', 'organization']]
                    },
                ],
            }),
            where: {
                isActive: true,
                id
            },
            attributes: { exclude: ['id', 'isActive', 'createdAt', 'updatedAt'] }
        });

        if (_.isEmpty(data)) throw Boom.notFound('Ticket detail is not found!');

        const remapData = {
            ...data?.dataValues,
            createdBy: undefined,
            ...(!isBusiness && { organization: data?.user?.dataValues?.organization })
        }

        if (isBusiness && data?.dataValues?.createdBy !== userId) throw Boom.badRequest('Cannot access other user data!');

        return Promise.resolve(remapData);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllCoupons = async (userId) => {
    try {
        const data = await db.coupon.findAll({
            where: {
                isActive: true,
                createdBy: userId
            },
            attributes: [['couponName', 'name'], ['couponPrcCut', 'priceCut'], 'id']
        });

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const getAllCouponsByTicketId = async (dataObject, userId) => {
    const { id } = dataObject;

    try {
        const data = await db.ticket.findOne({
            include: [
                {
                    association: 'coupons',
                    required: false,
                    where: { isActive: true },
                    attributes: ['id', ['couponName', 'name'], ['couponPrcCut', 'priceCut']],
                    include: [
                        {
                            association: 'couponConnectors',
                            required: false,
                            where: { isActive: true, createdBy: userId },
                        }
                    ]
                },
            ],
            where: {
                isActive: true,
                id
            },
        });

        let couponList = data?.coupons?.map(coupon => ({
            ...coupon?.dataValues,
            priceCut: encryptData(coupon?.dataValues?.priceCut)
        })) ?? [];
        couponList = couponList?.filter(coupon => coupon?.couponConnectors?.length === 0);
        couponList?.map(coupon => ({
            ...coupon,
            couponConnector: undefined
        }));

        return Promise.resolve(couponList);
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addTicket = async (dataObject, userId) => {
    try {
        const { title, location, variants, description, imageData } = dataObject;

        const imageResult = await cloudinary.uploadToCloudinary(imageData, 'image');
        if (!imageResult) throw Boom.internal('Cloudinary failed to upload image!');

        console.log(imageResult);

        let firstVariantPrice = 0;
        try {
            firstVariantPrice = JSON.parse(variants)[0]?.price;
        } catch (error) {
            throw Boom.badRequest('Invalid JSON in variant!');
        }

        const data = await db.ticket.create({ title, price: firstVariantPrice, location, variants, description, imageUrl: imageResult.url, createdBy: userId });

        if (!data) throw Boom.internal('Create ticket failed!');

        const remapData = {
            ...data?.dataValues,
            createdBy: undefined,
            createdAt: undefined,
            isActive: undefined,
            id: undefined,
        }

        return Promise.resolve({
            createdId: data?.id,
            createdData: remapData
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addBooking = async (dataObject, userId) => {
    try {
        const { ticketId, variant, paymentMethod, totalPayment, coupons } = dataObject;

        const checkTicketId = await db.ticket.findOne({
            where: { id: ticketId, isActive: true }
        });
        if (_.isEmpty(checkTicketId)) throw Boom.notFound("Ticket not found from this id!");

        const dateNow = new Date().toISOString().slice(0, 10);
        const transactionId = `TRX/${dateNow}/${generateRandomString(5)}`;

        const result = await db.sequelize.transaction(async () => {
            const createdBooking = await db.booking.create({
                ticketId,
                variant,
                paymentMethod,
                totalPayment,
                createdBy: userId,
                businessUserId: checkTicketId?.dataValues?.createdBy,
                bookingCode: transactionId
            });
            if (!createdBooking?.id) throw new Error('Booking not created!');

            const bookingId = createdBooking?.id;

            for (let index = 0; index < coupons.length; index++) {
                const coupon = coupons[index];

                const createdTickets = await db.couponConnector.create({ bookingId, couponId: coupon, createdBy: userId, ticketId });
                if (!createdTickets?.id) throw new Error('Connector not created!');
            }

            return bookingId;
        });

        return Promise.resolve({
            createdId: result,
        });
    } catch (err) {
        console.log(err)
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const addCoupon = async (dataObject, userId) => {
    try {
        const { name, priceCut } = dataObject;

        const data = await db.coupon.create({ couponName: name, couponPrcCut: priceCut, createdBy: userId });

        if (!data) throw Boom.internal('Create coupon data failed!');

        return Promise.resolve({
            createdId: data?.id,
            createdData: data
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const editTicketData = async (dataObject, userId) => {
    try {
        const { id, title, location, variants, description, imageData } = dataObject;

        const data = await db.ticket.findOne({
            where: { id, isActive: true }
        });
        if (_.isEmpty(data)) throw Boom.notFound('Ticket not found!');

        const userIdCheck = data?.dataValues?.createdBy;
        if (userIdCheck !== userId) throw Boom.unauthorized('Your user account does not allowed to modify other user data!');

        let imageResult = null;
        if (imageData) {
            imageResult = await cloudinary.uploadToCloudinary(imageData, 'image');
            if (!imageResult) throw Boom.internal('Cloudinary optional upload failed!');
        }

        let firstVariantPrice = 0;
        try {
            firstVariantPrice = JSON.parse(variants)[0]?.price;
        } catch (error) {
            throw Boom.badRequest('Invalid JSON in variant!');
        }

        await data.update({ title, price: firstVariantPrice, location, variants, description, ...(imageResult && { imageUrl: imageResult?.url }) });

        const remapData = {
            ...data?.dataValues,
            createdBy: undefined,
            createdAt: undefined,
            isActive: undefined,
            id: undefined,
        }

        return Promise.resolve({
            updatedId: data?.id,
            updatedData: remapData
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const updateStatusBooking = async (dataObject, userId) => {
    try {
        const { id, isSuccess } = dataObject;

        const data = await db.booking.findOne({
            where: { id, isActive: true, status: 'WAITING' }
        });
        if (_.isEmpty(data)) throw Boom.notFound('Booking not found!');

        const userIdCheck = data?.dataValues?.businessUserId;
        if (userIdCheck !== userId) throw Boom.unauthorized('Your user account does not allowed to modify other user data!');

        await data.update({ status: isSuccess ? 'BOOKED' : 'FAILED' });

        return Promise.resolve({
            updatedId: data?.id,
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const deleteTicket = async (dataObject, userId) => {
    try {
        const { id } = dataObject;

        const data = await db.ticket.findOne({
            where: { id, isActive: true }
        });
        if (_.isEmpty(data)) throw Boom.notFound('Ticket not found!');

        const userIdCheck = data?.dataValues?.createdBy;
        if (userIdCheck !== userId) throw Boom.unauthorized('Your user account does not allowed to modify other user data!');

        await data.update({ isActive: false });

        return Promise.resolve({
            deletedId: data?.id,
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

const deleteCoupons = async (dataObject, userId) => {
    try {
        const { id } = dataObject;

        const data = await db.coupon.findOne({
            where: { id, isActive: true }
        });
        if (_.isEmpty(data)) throw Boom.notFound('Coupon not found!');

        const userIdCheck = data?.dataValues?.createdBy;
        if (userIdCheck !== userId) throw Boom.unauthorized('Your user account does not allowed to modify other user data!');

        await data.update({ isActive: false });

        return Promise.resolve({
            deletedId: data?.id,
        });
    } catch (err) {
        return Promise.reject(GeneralHelper.errorResponse(err));
    }
};

module.exports = {
    getAllBooking,
    getBookingDetailWithId,
    getAllCoupons,
    getAllCouponsByTicketId,
    getAllTickets,
    getTicketDetail,

    addBooking,
    addCoupon,
    addTicket,

    editTicketData,
    updateStatusBooking,

    deleteTicket,
    deleteCoupons,
}
