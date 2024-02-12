import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductDetail from './components/ProductDetail';
import AddCoupons from './components/AddCoupons';
import PaymentSelection from './components/PaymentSelection';
import PaymentSumary from './components/PaymentSumary';

import classes from './style.module.scss';
import { selectProductId, selectUserInputData } from './selectors';
import { showPopup } from '@containers/App/actions';
import { sendBookingData, setProductId, setUserInputs } from './actions';
import { selectTicketDetail } from '@pages/TicketDetail/selectors';
import { encryptDataAES } from '@utils/allUtils';

const PaymentPage = ({ inputtedData, productId, productDetail }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const intl = useIntl();
    const { id } = useParams();
    const stepPages = [
        {
            id: 1,
            name: intl.formatMessage({ id: 'payment_step_1_name' }),
            page: <ProductDetail />
        },
        {
            id: 2,
            name: intl.formatMessage({ id: 'payment_step_2_name' }),
            page: <AddCoupons />
        },
        {
            id: 3,
            name: intl.formatMessage({ id: 'payment_step_3_name' }),
            page: <PaymentSelection />
        },
        {
            id: 4,
            name: intl.formatMessage({ id: 'payment_step_4_name' }),
            page: <PaymentSumary />
        },
    ];

    const [stepPage, setStepPage] = useState(null);
    const [step, setStep] = useState(-1);
    const [userInputProgress, setUserInputProgress] = useState(null);

    const setStepPageTab = (data) => {
        if (data?.id > 1 && !(userInputProgress && userInputProgress?.variant)) {
            dispatch(showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_step_1_not_complete' })));
            return;
        }
        if (data?.id > 3 && !(userInputProgress && userInputProgress?.paymentMethod)) {
            dispatch(showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_step_3_not_complete' })));
            return;
        }

        setStep(data?.id);
        setStepPage(data?.page);
    };

    const finish = () => {
        const encryptedData = encryptDataAES(JSON.stringify({
            ...inputtedData,
            ticketId: productId,
            paymentMethod: inputtedData?.paymentMethod?.id,
            coupons: inputtedData?.coupons?.map(coupon => coupon?.id),
            index: undefined
        }));

        dispatch(sendBookingData({data: encryptedData}, () => {
            dispatch(setUserInputs(null));
            dispatch(showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_step_complete' })));
            navigate('/bookings');
        }));
    };

    useEffect(() => {
        setStepPageTab(stepPages[0]);
    }, []);
    useEffect(() => {
        if (!productDetail) {
            navigate(`/ticket/${id}`);
        }
        if (inputtedData) {
            if (productId !== id) {
                dispatch(setUserInputs(null));
                dispatch(setProductId(id));
                return;
            }
            setUserInputProgress(inputtedData);
        }
    }, [inputtedData, productId, productDetail]);

    return (
        <div className={classes.mainContainer}>
            <div className={classes.innerContainer}>
                <div className={classes.leftSide}>
                    {stepPages.map(page =>
                        <div className={classes.stepsIndicators} key={page?.id} data-active={page?.id === step} onClick={() => setStepPageTab(page)}>
                            <div className={classes.stepNumberContainer}>
                                <a className={classes.stepNumber}>{page?.id}</a>
                            </div>
                            <a className={classes.stepTitle}>{page?.name}</a>
                        </div>
                    )}
                </div>
                <div className={classes.rightSide}>
                    {stepPage}
                    <div className={classes.rightSideFooter}>
                        {step > 1 && <button className={classes.prevBtn} onClick={() => setStepPageTab(stepPages[step - 2])}><FormattedMessage id='payment_previous_btn' /></button>}
                        <button className={classes.nextBtn} onClick={() => step === 4 ? finish() : setStepPageTab(stepPages[step])}>{step === 4 ? intl.formatMessage({ id: 'payment_finish_btn' }) : intl.formatMessage({ id: 'payment_next_btn' })}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

PaymentPage.propTypes = {
    inputtedData: PropTypes.object,
    productId: PropTypes.string,
    productDetail: PropTypes.object
}

const mapStateToProps = createStructuredSelector({
    inputtedData: selectUserInputData,
    productId: selectProductId,
    productDetail: selectTicketDetail
});

export default connect(mapStateToProps)(PaymentPage);