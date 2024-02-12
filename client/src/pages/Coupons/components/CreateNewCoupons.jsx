import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DiscountIcon from '@mui/icons-material/Discount';

import classes from '../style.module.scss';
import { createNewCoupon } from '../actions';
import { showPopup } from '@containers/App/actions';

const CreateNewCoupon = ({ onClose }) => {
    const dispatch = useDispatch();
    const intl = useIntl();

    const [name, setName] = useState('');
    const [priceCut, setPriceCut] = useState(1);

    const saveCouponData = () => {
        if(name.length < 5 || name.length > 255) {
            dispatch(showPopup(intl.formatMessage({id: 'coupons_create_new'}), intl.formatMessage({id: 'coupons_name_validation'})));
            return;
        } else if (priceCut < 5000 || priceCut > 200000) {
            dispatch(showPopup(intl.formatMessage({id: 'coupons_price_cut'}), intl.formatMessage({id: 'coupons_price_cut_validation'})));
            return;
        }

        dispatch(createNewCoupon({name, priceCut}, () => {
            onClose(true);
        }))
    };

    return (
        <div className={classes.createNewContainer}>
            <div className={classes.topContainer}>
                <h3 className={classes.title}><FormattedMessage id='coupons_create_new' /></h3>
                <button className={classes.delBtn} data-type='red' onClick={() => onClose(false)}>
                    <a>X</a>
                </button>
            </div>
            <label htmlFor='name' className={classes.label}><FormattedMessage id='coupons_name' /></label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} id='name' className={classes.input}/>
            <label htmlFor='priceCut' className={classes.label}><FormattedMessage id='coupons_price_cut' /></label>
            <input type='number' min={1} value={priceCut} onChange={(e) => setPriceCut(e.target.value)} id='priceCut' className={classes.input}/>
            <button className={classes.button} onClick={saveCouponData}><FormattedMessage id='coupons_create' /></button>
        </div>
    );
};

CreateNewCoupon.propTypes = {
    couponDatas: PropTypes.object
}

export default CreateNewCoupon;