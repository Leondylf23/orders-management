import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';
import { selectCouponsData, selectProductId, selectUserInputData } from '../selectors';

import classes from '../style.module.scss';
import { getCouponsData, setCouponsData, setUserInputs } from '../actions';
import { showPopup } from '@containers/App/actions';

const AddCouponsComponent = ({ inputtedData, couponsData, productId }) => {
    const dispatch = useDispatch();
    const intl = useIntl();

    const [basePrice, setBasePrice] = useState(0);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [totalPriceCut, setTotalPriceCut] = useState(0);

    const addCoupon = (coupon) => {
        const find = selectedCoupons.find(cpn => cpn?.id === coupon?.id);
        let priceCutData = totalPriceCut;

        if(find) {
            priceCutData -= coupon?.priceCut;
            setSelectedCoupons(prevVal => prevVal.filter(cpn => cpn?.id !== coupon?.id));
        } else {
            priceCutData += coupon?.priceCut;
            if((basePrice - priceCutData) < 0) {
                dispatch(showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_add_cpn_page_prc_cut_validation' })));
                return;
            }
            setSelectedCoupons(prevVal => [...prevVal, coupon]);
        }
        setTotalPriceCut(priceCutData);
    };

    const checkIsActive = (id) => {
        return selectedCoupons.findIndex(coupon => coupon?.id === id) !== -1;
    }

    useEffect(() => {
        let totalPayment = inputtedData?.variant?.price;
        if(selectedCoupons?.length > 0) {
            selectedCoupons.forEach(coupon => {
                totalPayment -= coupon?.priceCut;
            });
        }
        dispatch(setUserInputs({...inputtedData, coupons: selectedCoupons, totalPayment}));
    }, [selectedCoupons]);
    useEffect(() => {
        dispatch(setCouponsData([]));
        dispatch(getCouponsData({id: productId}));
        const basePriceData = inputtedData?.variant?.price;

        if(basePriceData) setBasePrice(basePriceData);
        if(inputtedData?.coupons) {
            const coupons = inputtedData?.coupons;
            let totalPriceCutTemp = 0;

            coupons.forEach(coupon => {
                const priceCut = coupon?.priceCut;
                totalPriceCutTemp += priceCut;
            });

            if((basePriceData - totalPriceCutTemp) < 0) {
                dispatch(showPopup(intl.formatMessage({ id: 'payment_title' }), intl.formatMessage({ id: 'payment_add_cpn_page_prc_cut_validation' })));
                dispatch(setUserInputs({...inputtedData, coupons: [], totalPayment: basePriceData}));
                return;
            }

            setTotalPriceCut(totalPriceCutTemp);
            setSelectedCoupons(coupons)
        };
    }, []);

    return (
        <div className={classes.componentContainer}>
            <h2 className={classes.title}><FormattedMessage id='payment_step_2_name' /></h2>
            <h4 className={classes.pageTitle}><FormattedMessage id='payment_add_cpn_page_title' /></h4>
            <div className={classes.couponsContainer}>
                {couponsData.map(coupon =>
                    <div className={classes.coupon} key={coupon?.id} onClick={() => addCoupon(coupon)} data-active={checkIsActive(coupon?.id)}>
                        <p className={classes.name}>{coupon?.name}</p>
                        <p className={classes.price}>Rp. {numberWithPeriods(coupon?.priceCut)}</p>
                    </div>
                )}
            </div>
            <div className={classes.footer}>
                <h4 className={classes.footerTitle}><FormattedMessage id={totalPriceCut > 0 ? 'payment_add_cpn_page_prc_cut' : 'payment_add_cpn_page_prc_cut_none'} /></h4>
                <div className={classes.priceContainer}>
                    <LocalOfferIcon className={classes.icon} />
                    <p className={classes.priceValue} data-variant={totalPriceCut > 0 ? 'cut' : ''}>Rp. {numberWithPeriods(basePrice)}</p>
                    {totalPriceCut > 0 && <p className={classes.priceValueCut} data-active='true'>Rp. {numberWithPeriods(basePrice - totalPriceCut)}</p>}
                </div>
            </div>
        </div>
    );
}

AddCouponsComponent.propTypes = {
    inputtedData: PropTypes.object,
    couponsData: PropTypes.array,
    productId: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
    inputtedData: selectUserInputData,
    couponsData: selectCouponsData,
    productId: selectProductId
});

export default connect(mapStateToProps)(AddCouponsComponent);