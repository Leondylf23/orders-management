import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import { Button } from '@mui/material';
import BestSellerCard from '@components/BestSellerCard';

import ProductCard from '@components/ProductCard';
import { getUserDataDecrypt } from '@utils/allUtils';
import { selectUserData } from '@containers/Client/selectors';

import { getBestSeller, getMyProductsData, getProductsData } from './actions';
import { selectBestData, selectProductData } from './selectors';
import clasess from './style.module.scss';

const Home = ({ products, userData, best }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);

  const getProductFromApi = () => {
    const user = getUserDataDecrypt(userData);
    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyProductsData());
    } else {
      setIsBusiness(false);
      dispatch(getProductsData());
    }
  };

  const getProductSearch = () => {
    const user = getUserDataDecrypt(userData);
    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyProductsData({ ...(search !== '' && { productName: search }) }));
    } else {
      setIsBusiness(false);
      dispatch(getProductsData({ ...(search !== '' && { productName: search }) }));
    }
    setSearch('');
  };

  useEffect(() => {
    if (products) {
      setData(products);
    }
  }, [products]);

  useEffect(() => {
    dispatch(getBestSeller());
    getProductFromApi();
  }, [userData]);

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
        <div className={clasess.debounce}>
          <input
            type="text"
            className={clasess.input}
            value={search}
            placeholder={intl.formatMessage({ id: 'home_search_placeholder' })}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={data.length ? getProductSearch : getProductFromApi} variant="contained">
            {data.length !== 0 ? <SearchIcon /> : <YoutubeSearchedForIcon />}
          </Button>
        </div>
      </div>
      {best.length !== 0 && (
        <>
          <h3 className={clasess.title}>
            <FormattedMessage id="home_best" />
          </h3>
          <div className={clasess.bestSeller}>
            {best.map((item, idx) => (
              <BestSellerCard key={idx} data={item} />
            ))}
          </div>
        </>
      )}
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
            <div onClick={getProductFromApi}>
              <FormattedMessage id="back" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Home.propTypes = {
  userData: PropTypes.string,
  products: PropTypes.array,
  best: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
  products: selectProductData,
  best: selectBestData,
});

export default connect(mapStateToProps)(Home);
