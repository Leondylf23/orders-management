import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';
import { selectTicketDetail } from '@pages/TicketDetail/selectors';
import { setUserInputs } from '../actions';
import { selectUserInputData } from '../selectors';

import classes from '../style.module.scss';

const ProductDetailComponent = ({ ticketData, inputtedData }) => {
    const dispatch = useDispatch();

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [variants, setVariants] = useState([]);

    const setVariantData = (data) => {
        setSelectedVariant(data);
    };

    useEffect(() => {
        if(ticketData?.variants) {
            setVariants(JSON.parse(ticketData?.variants));
        }
        if (inputtedData?.variant) {
            setSelectedVariant(inputtedData?.variant);
            setSelectedIndex(inputtedData?.index)
        }
    }, []);
    useEffect(() => {
        dispatch(setUserInputs({ ...inputtedData, variant: selectedVariant, index: selectedIndex, totalPayment: selectedVariant?.price }));
    }, [selectedVariant]);

    return (
        <div className={classes.componentContainer}>
            <h2 className={classes.title}>{ticketData?.title}</h2>
            <h4 className={classes.pageTitle}><FormattedMessage id='payment_prct_detail_page_title' /></h4>
            <div className={classes.variantContainer}>
                {variants.map((variant, index) =>
                    <div className={classes.variant} key={variant?.variantName} onClick={() => {setVariantData(variant); setSelectedIndex(index)}} data-active={index === selectedIndex}>
                        <a>{variant?.variantName}</a>
                    </div>
                )}
            </div>
            <div className={classes.footer}>
                <h4 className={classes.footerTitle}><FormattedMessage id='payment_total' /></h4>
                <div className={classes.priceContainer}>
                    <LocalOfferIcon className={classes.icon} />
                    <p className={classes.priceValue}>Rp. {numberWithPeriods(selectedVariant ? selectedVariant?.price : 0)}</p>
                </div>
            </div>
        </div>
    );
}

ProductDetailComponent.propTypes = {
    ticketData: PropTypes.object,
    inputtedData: PropTypes.object
}

const mapStateToProps = createStructuredSelector({
    ticketData: selectTicketDetail,
    inputtedData: selectUserInputData
});

export default connect(mapStateToProps)(ProductDetailComponent);