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
  const orderFormsDefault = {
    phone: '',
    address: '',
  };

  const [orderForm, setOrderForm] = useState(orderFormsDefault);

  const dataOnChange = (data) => {
    setOrderForm((prevVal) => {
      dispatch(setUserInputs({ ...inputtedData, ...{ ...prevVal, ...data } }));

      return { ...prevVal, ...data };
    });
  };

  useEffect(() => {
    if (inputtedData?.orderForm) {
      setOrderForm(inputtedData?.orderForm);
    }
  }, []);

  return (
    <div className={classes.componentContainer}>
      <h2 className={classes.title}>{productData?.title}</h2>
      <h4 className={classes.pageTitle}>
        <FormattedMessage id="payment_prct_detail_page_title" />
      </h4>
      <div className={classes.formInputs}>
        <label className={classes.label} htmlFor="phone">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          className={classes.input}
          value={orderForm?.phone}
          onChange={(e) => dataOnChange({ phone: e.target.value })}
        />
        <label className={classes.label} htmlFor="address">
          Alamat
        </label>
        <textarea
          id="address"
          type="text"
          className={classes.input}
          data-type="area"
          value={orderForm?.address}
          onChange={(e) => dataOnChange({ address: e.target.value })}
        />
      </div>
      <div className={classes.footer}>
        <h4 className={classes.footerTitle}>
          <FormattedMessage id="payment_total" />
        </h4>
        <div className={classes.priceContainer}>
          <LocalOfferIcon className={classes.icon} />
          <p className={classes.priceValue}>Rp. {numberWithPeriods(inputtedData?.totalPayment)}</p>
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
