import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';
import { useEffect, useState } from 'react';

const BookingCard = ({ data, onClickDetail }) => {

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (data?.status) {
            switch (data?.status) {
                case 'WAITING':
                    setStatus({
                        text: <FormattedMessage id='status_waiting' />,
                        color: 'yellow',
                    });
                    break;
                case 'FAILED':
                    setStatus({
                        text: <FormattedMessage id='status_failed' />,
                        color: 'red',
                    });
                    break;
                case 'BOOKED':
                    setStatus({
                        text: <FormattedMessage id='status_success' />,
                        color: 'green',
                    });
                    break;
            }
        }
    }, [data]);

    return (
        <div className={classes.bookingCard} onClick={() => onClickDetail(data?.id)}>
            <img className={classes.cardImage} src={data?.imageUrl} alt="Img Failed" />
            <div className={classes.cardContent}>
                <h4 className={classes.bookCode}>{data?.bookingCode}</h4>
                <h4 className={classes.title}>{data?.title}</h4>
                <h5 className={classes.variant}><FormattedMessage id='bookings_variant' />: {data?.variant}</h5>
                <div className={classes.statusContainer} data-item={status?.color}>
                    <h5 className=''>{status?.text}</h5>
                </div>
            </div>
        </div>
    );
}

BookingCard.propTypes = {
    data: PropTypes.object.isRequired,
    onClickDetail: PropTypes.func.isRequired,
}

export default BookingCard;