import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DiscountIcon from '@mui/icons-material/Discount';

import classes from '../style.module.scss';
import { numberWithPeriods } from '@utils/allUtils';

const CouponsCard = ({ data, onDelete }) => {

    return (
        <div className={classes.couponsCardContainer}>
            <div className={classes.topContainer}>
                <p className={classes.name}>{data?.name}</p>
                <button className={classes.delBtn} data-type='red' onClick={() => onDelete(data?.id)}>
                    <a>X</a>
                </button>
            </div>
            <div className={classes.contentContainer}>
                <DiscountIcon />
                <p className={classes.number}>Rp. {numberWithPeriods(data?.priceCut)}</p>
            </div>
        </div>
    );
};

CouponsCard.propTypes = {
    couponDatas: PropTypes.object
}

export default CouponsCard;