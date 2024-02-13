import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProductCard from '@components/ProductCard';
import { getUserDataDecrypt } from '@utils/allUtils';
import { selectUserData } from '@containers/Client/selectors';
import { getMyProductsData, getProductsData } from './actions';

import { selectProductData } from './selectors';
import clasess from './style.module.scss';

const Home = ({ products, userData }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const getProductFromApi = () => {
    const user = getUserDataDecrypt(userData);

    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyProductsData({ ...(search !== '' && { productName: search }) }));
    } else {
      setIsBusiness(false);
      dispatch(getProductsData({ ...(search !== '' && { productName: search }) }));
    }
  };

  useEffect(() => {
    if (products) {
      setData(products);
    }
  }, [products]);
  useEffect(() => {
    getProductFromApi();
  }, [userData]);
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    setTimerId(
      setTimeout(() => {
        getProductFromApi();
        setTimerId(null);
      }, 500)
    );
  }, [search]);

  console.log(data);

  return (
    <div className={clasess.mainContainer}>
      <h1 className={clasess.title}>
        <FormattedMessage id="home_title" />
      </h1>
      {isBusiness && (
        <div className={clasess.createBtnContainer}>
          <button type="button" className={clasess.button} onClick={() => navigate('/product-creation')}>
            <FormattedMessage id="home_create_new" />
          </button>
        </div>
      )}
      <div className={clasess.searchContainer}>
        <h4 className={clasess.title}>
          <FormattedMessage id="home_title" />
        </h4>
        <input
          type="text"
          className={clasess.input}
          placeholder={intl.formatMessage({ id: 'home_search_placeholder' })}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={clasess.dataContainer}>
        {data.length > 0 ? (
          <div className={clasess.dataGrid}>
            <div className={clasess.innerDataGrid}>
              {data.map((product) => (
                <ProductCard data={product} isBusiness={isBusiness} key={product?.id} />
              ))}
            </div>
          </div>
        ) : (
          <div className={clasess.empty}>
            <h3>
              <FormattedMessage id="empty_data" />
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

Home.propTypes = {
  userData: PropTypes.string,
  products: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
  products: selectProductData,
});

export default connect(mapStateToProps)(Home);
