import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import TicketCard from '@components/TicketCard';
import { selectTicketData } from './selectors';
import { getUserDataDecrypt } from '@utils/allUtils';
import { getMyTicketsData, getTicketsData } from './actions';

import clasess from './style.module.scss';
import { selectUserData } from '@containers/Client/selectors';

const Home = ({ tickets, userData }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const getTicketFromApi = () => {
    const user = getUserDataDecrypt(userData);

    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyTicketsData({...(search !== '' && { ticketName: search })}));
    } else {
      setIsBusiness(false);
      dispatch(getTicketsData({...(search !== '' && { ticketName: search })}));
    }
  };

  useEffect(() => {
    if (tickets) {
      setData(tickets);
    }
  }, [tickets]);
  useEffect(() => {
    getTicketFromApi();
  }, [userData]);
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    setTimerId(setTimeout(() => {
      getTicketFromApi();
      setTimerId(null);
    }, 500));
  }, [search]);

  return (
    <div className={clasess.mainContainer}>
      <h1 className={clasess.title}><FormattedMessage id='home_title' /></h1>
      {isBusiness && <div className={clasess.createBtnContainer}>
        <button className={clasess.button} onClick={() => navigate('/ticketcreation')}><FormattedMessage id='home_create_new' /></button>
      </div>}
      <div className={clasess.searchContainer}>
        <h4 className={clasess.title}><FormattedMessage id='home_title' /></h4>
        <input type="text" className={clasess.input} placeholder={intl.formatMessage({ id: 'home_search_placeholder' })} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className={clasess.dataContainer}>
        {data.length > 0 ? <div className={clasess.dataGrid}>
          <div className={clasess.innerDataGrid}>
            {data.map(ticket =>
              <TicketCard data={ticket} isBusiness={isBusiness} key={ticket?.id} />
            )}
          </div>
        </div> : <div className={clasess.empty}>
          <h3><FormattedMessage id='empty_data' /></h3>
        </div>}
      </div>
    </div>
  );
};

Home.propTypes = {
  userData: PropTypes.string,
  tickets: PropTypes.array
}

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
  tickets: selectTicketData
});

export default connect(mapStateToProps)(Home);
