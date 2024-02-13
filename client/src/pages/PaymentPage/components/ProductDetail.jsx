import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { numberWithPeriods } from '@utils/allUtils';
import { selectProductDetail } from '@pages/ProductDetail/selectors';
import { setUserInputs } from '../actions';
import { selectUserInputData } from '../selectors';

import classes from '../style.module.scss';

const ProductDetailComponent = ({ productData, inputtedData }) => {
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [variants, setVariants] = useState([]);

  const setVariantData = (data) => {
    setSelectedVariant(data);
  };

  useEffect(() => {
    if (productData?.variants) {
      setVariants(JSON.parse(productData?.variants));
    }
    if (inputtedData?.variant) {
      setSelectedVariant(inputtedData?.variant);
      setSelectedIndex(inputtedData?.index);
    }
  }, [inputtedData?.index, inputtedData?.variant, productData?.variants]);
  useEffect(() => {
    dispatch(
      setUserInputs({
        ...inputtedData,
        index: selectedIndex,
        totalPayment: selectedVariant?.price,
      })
    );
  }, [dispatch, inputtedData, selectedIndex, selectedVariant]);

  return (
    <div className={classes.componentContainer}>
      <h2 className={classes.title}>{productData?.title}</h2>
      <h4 className={classes.pageTitle}>
        <FormattedMessage id="payment_prct_detail_page_title" />
      </h4>
      <div className={classes.variantContainer}>
        {variants.map((variant, index) => (
          <div
            className={classes.variant}
            key={variant?.variantName}
            onClick={() => {
              setVariantData(variant);
              setSelectedIndex(index);
            }}
            data-active={index === selectedIndex}
          >
            <p>{variant?.variantName}</p>
          </div>
        ))}
      </div>
      <div className={classes.footer}>
        <h4 className={classes.footerTitle}>
          <FormattedMessage id="payment_total" />
        </h4>
        <div className={classes.priceContainer}>
          <LocalOfferIcon className={classes.icon} />
          <p className={classes.priceValue}>Rp. {numberWithPeriods(selectedVariant ? selectedVariant?.price : 0)}</p>
        </div>
      </div>
    </div>
  );
};

ProductDetailComponent.propTypes = {
  productData: PropTypes.object,
  inputtedData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  productData: selectProductDetail,
  inputtedData: selectUserInputData,
});

export default connect(mapStateToProps)(ProductDetailComponent);
