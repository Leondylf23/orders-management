import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';

const OrderingCard = ({ data, onClickDetail, isBusiness }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (data?.status) {
      switch (data?.status) {
        case 'WAITING':
          setStatus({
            text: <FormattedMessage id="status_waiting" />,
            color: 'yellow',
          });
          break;
        case 'FAILED':
          setStatus({
            text: <FormattedMessage id="status_failed" />,
            color: 'red',
          });
          break;
        case 'SUCCESS':
          setStatus({
            text: <FormattedMessage id="status_success" />,
            color: 'green',
          });
          break;
      }
    }
  }, [data]);

  return (
    <div className={classes.orderingCard} onClick={() => onClickDetail(data?.id)}>
      <img className={classes.cardImage} src={data?.imageUrl} alt="Img Failed" />
      <div className={classes.cardContent}>
        <h4 className={classes.orderCode}>{data?.transactionCode}</h4>
        <h4 className={classes.title}>{data?.title}</h4>
        {isBusiness && <p className={classes.customerName}>{data?.customer}</p>}
        <div className={classes.statusContainer} data-item={status?.color}>
          <h5 className="">{status?.text}</h5>
        </div>
      </div>
    </div>
  );
};

OrderingCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClickDetail: PropTypes.func.isRequired,
  isBusiness: PropTypes.bool,
};

export default OrderingCard;
