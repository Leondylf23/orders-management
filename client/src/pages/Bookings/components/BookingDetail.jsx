import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useEffect, useState } from 'react';

import { selectBookingDetailData } from '../selectors';
import { numberWithPeriods } from '@utils/allUtils';

import classes from '../style.module.scss';
import { getBookingDetailData, updateBookingStatus } from '../actions';

const BookingDetailComponent = ({ id, bookingData, back, isBusiness }) => {
    const dispatch = useDispatch();

    const [status, setStatus] = useState(null);
    const [isRequireRefresh, setIsRequireRefresh] = useState(false);

    const setStatusView = (statusData) => {
        switch (statusData) {
            case 'WAITING':
                setStatus({
                    text: <FormattedMessage id='status_waiting' />,
                    color: 'yellow',
                    status: statusData
                });
                break;
            case 'FAILED':
                setStatus({
                    text: <FormattedMessage id='status_failed' />,
                    color: 'red',
                    status: statusData
                });
                break;
            case 'BOOKED':
                setStatus({
                    text: <FormattedMessage id='status_success' />,
                    color: 'green',
                    status: statusData
                });
                break;
        }
    }

    const updateStatusBtn = (isSuccess) => {
        dispatch(updateBookingStatus({ id, isSuccess }, () => {
            setStatusView(isSuccess ? 'BOOKED' : 'FAILED');
            setIsRequireRefresh(true);
        }));
    }

    useEffect(() => {
        if (bookingData?.status) {
            setStatusView(bookingData?.status);
        }
    }, [bookingData]);
    useEffect(() => {
        dispatch(getBookingDetailData({ id }, isBusiness));
    }, [id]);

    return (
        <div className={classes.detailContainer}>
            <div className={classes.buttonContainer}>
                <button className={classes.backBtn} onClick={() => back(isRequireRefresh)}><FormattedMessage id='back' /></button>
            </div>
            <h2>{bookingData?.bookingCode}</h2>
            <div className={classes.contentContainer}>
                <div className={classes.leftSide}>
                    <img className={classes.image} src={bookingData?.imageUrl} alt="Img failed!" />
                    <div className={classes.contentDetails}>
                        <div className={classes.detailIconContainer}>
                            <FmdGoodIcon className={classes.icon} />
                            <p className={classes.text}>{bookingData?.location}</p>
                        </div>
                        <div className={classes.detailIconContainer}>
                            <AssignmentIndIcon className={classes.icon} />
                            <p className={classes.text}>{bookingData?.organization}</p>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <h2 className={classes.title}>{bookingData?.title}</h2>
                    <div className={classes.priceContainer}>
                        <LocalOfferIcon className={classes.icon} />
                        <p className={classes.price}>Rp. {numberWithPeriods(parseFloat(bookingData?.variant?.price))}</p>
                    </div>
                    <div className={classes.paymentMethodContainer}>
                        {bookingData?.paymentMethod === 'METHOD_TRANSFER' ? <>
                            {/* <img className={classes.image} src={bookingData?.transferImg ?? ""} alt="Failed to Load!" /> */}
                            <h4 className={classes.text}><FormattedMessage id='payment_payment_transfer' /></h4>
                        </> : <h4 className={classes.text}><FormattedMessage id='payment_payment_onsitepay' /></h4>}
                    </div>
                    <div className={classes.variantContainer}>
                        <div className={classes.variant} data-active='true'>
                            <h4>{bookingData?.variant?.variantName}</h4>
                        </div>
                    </div>
                    <div className={classes.statusContainer} data-item={status?.color}>{status?.text}</div>
                    {(isBusiness && status?.status === 'WAITING') && <div className={classes.statusBtnContainer}>
                        <button className={classes.button} onClick={() => updateStatusBtn(true)}><FormattedMessage id='bookings_update_status_complete' /></button>
                        <button className={classes.button} data-type='red' onClick={() => updateStatusBtn(false)}><FormattedMessage id='bookings_update_status_failed' /></button>
                    </div>}
                    <div className={classes.couponsContainer}>
                        <h3 className={classes.title}><FormattedMessage id='ticket_detail_used_coupons' /></h3>
                        <div className={classes.dataContainer}>
                            {bookingData?.coupons?.length > 0 ?
                                bookingData?.coupons?.map(coupon =>
                                    <div className={classes.data}>
                                        <a className={classes.name}>{coupon?.couponName}</a>
                                        <b className={classes.price}>Rp. {numberWithPeriods(coupon?.couponPrcCut)}</b>
                                    </div>
                                )
                                :
                                <div className={classes.emptyContainer}>
                                    <h4 className={classes.text}><FormattedMessage id='empty_data' /></h4>
                                </div>
                            }
                        </div>
                    </div>
                    <h3 className={classes.descriptionTitle}><FormattedMessage id='ticket_detail_desc' /></h3>
                    <p className={classes.description}>{bookingData?.description}</p>
                </div>
            </div>
        </div>
    );
};

BookingDetailComponent.propTypes = {
    id: PropTypes.string,
    bookingData: PropTypes.object,
    back: PropTypes.func,
    isBusiness: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
    bookingData: selectBookingDetailData
});

export default connect(mapStateToProps)(BookingDetailComponent);