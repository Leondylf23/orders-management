import PropTypes from 'prop-types';

const BlankLayout = ({ children }) => {
    return(
        <div>
            {children}
        </div>
    );
};

BlankLayout.propTypes = {
    children: PropTypes.element.isRequired
};

export default BlankLayout;