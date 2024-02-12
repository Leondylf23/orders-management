import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';
import { selectUserInputData } from '../selectors';
import { setUserInputs } from '../actions';

import classes from '../style.module.scss';
import { selectTicketDetail } from '@pages/TicketDetail/selectors';

const PaymentSumaryComponent = ({ ticketData, inputtedData }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        let totalPayment = inputtedData?.variant?.price;
        const coupons = inputtedData?.coupons;

        if(coupons?.length > 0) {

            coupons.forEach(coupon => {
                totalPayment -= coupon?.priceCut;
            });

        }
        dispatch(setUserInputs({...inputtedData , totalPayment}));
    }, []);
    return (
        <div className={classes.componentContainer}>
            <h2 className={classes.title}><FormattedMessage id='payment_step_4_name' /></h2>
            <h4 className={classes.pageTitleBig}>{ticketData?.title}</h4>
            <div className={classes.sumaryContainer}>
                <div className={classes.data}>
                    <p className={classes.name}><FormattedMessage id='payment_summary_variant' />: {inputtedData?.variant?.variantName}</p>
                    <p className={classes.price}>Rp. {numberWithPeriods(inputtedData?.variant?.price)}</p>
                </div>
                {inputtedData?.coupons?.length > 0 && inputtedData?.coupons?.map((coupon, i) =>
                    <div className={classes.data} key={i}>
                        <p className={classes.name}>{coupon?.name}</p>
                        <p className={classes.price}>- Rp. {numberWithPeriods(coupon?.priceCut)}</p>
                    </div>
                )}
            </div>
            <div className={classes.footer}>
                <h4 className={classes.footerTitle}><FormattedMessage id='payment_summary_total_payment' /></h4>
                <div className={classes.priceContainer}>
                    <LocalOfferIcon className={classes.icon} />
                    <p className={classes.priceValue} data-variant=''>Rp. {numberWithPeriods(inputtedData?.totalPayment)}</p>
                </div>
                    <p className={classes.method}><FormattedMessage id='payment_summary_payment_method' />: <p className={classes.name}><FormattedMessage id={inputtedData?.paymentMethod?.nameIntlId} /></p></p>
            </div>
        </div>
    );
}

PaymentSumaryComponent.propTypes = {
    inputtedData: PropTypes.object,
    ticketData: PropTypes.object
}

const mapStateToProps = createStructuredSelector({
    inputtedData: selectUserInputData,
    ticketData: selectTicketDetail
});

export default connect(mapStateToProps)(PaymentSumaryComponent);