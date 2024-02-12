import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { numberWithPeriods } from '@utils/allUtils';
import { selectMyTicketData } from './selectors';
import { showPopup } from '@containers/App/actions';
import { createNewTicket, deleteTicket, getMyTicketDetail, updateTicket } from './actions';
import NoImage from '../../static/images/no_image.png';

import classes from './style.module.scss';

const TicketCreation = ({ ticketDetail }) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const defaultVariant = { variantName: '', price: 1 };
    const { id } = useParams();

    const [formData, setFormData] = useState({});
    const [variantInput, setVariantInput] = useState(defaultVariant);
    const [imageData, setImageData] = useState(null);

    const setNewImage = (e) => {
        const imageFile = e.target.files[0];

        setImageData(imageFile);
    };

    const removeImage = () => {
        setImageData(null);
    };

    const addNewVariant = () => {
        if (variantInput?.variantName === '' || variantInput?.price === 0) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_variant_empty_validation' })));
            return;
        }
        if (variantInput?.price < 5000 || variantInput?.price > 5000000) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_variant_price_validation' })));
            return;
        }

        const variants = formData?.variants ?? [];
        variants.push(variantInput);

        setFormData(prevVal => ({ ...prevVal, variants }));
        setVariantInput(defaultVariant);
    }

    const removeVariant = (index) => {
        setFormData(prevVal => ({
            ...prevVal,
            variants: prevVal.variants.filter((_, i) => i !== index)
        }));
    };

    const saveBtn = () => {
        if (!(formData?.title?.length > 5 && formData?.title?.length <= 255)) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_title_validation' })));
            return;
        } else if (!(formData?.location?.length > 2 && formData?.location?.length <= 255)) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_location_validation' })));
            return;
        } else if (!(formData?.description?.length > 5 && formData?.description?.length <= 500)) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_description_validation' })));
            return;
        } else if (!(formData?.variants?.length > 0)) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_variant_validation' })));
            return;
        } else if (!(imageData || formData?.imageUrl)) {
            dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_image_validation' })));
            return;
        }

        const form = new FormData();
        if (id) form.append('id', id);
        form.append('title', formData?.title);
        form.append('location', formData?.location);
        form.append('description', formData?.description);
        form.append('variants', JSON.stringify(formData?.variants));
        if (imageData) form.append('imageData', imageData);

        if (id) {
            dispatch(updateTicket(form, () => {
                setImageData(null);
                dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_save_success' })));
            }));
        } else {
            dispatch(createNewTicket(form, (id) => {
                navigate(`/ticketcreation/${id}`);
                dispatch(showPopup(intl.formatMessage({ id: 'ticket_creation_title' }), intl.formatMessage({ id: 'ticket_creation_save_success' })));
            }));
        }

    };

    const deleteBtn = () => {
        dispatch(deleteTicket(({ id }), () => {
            navigate('/');
        }));
    };

    useEffect(() => {
        if (id) {
            dispatch(getMyTicketDetail({ id }, () => {
                navigate('/');
            }));
        }
    }, []);
    useEffect(() => {
        if (ticketDetail && id) {
            const convertObj = {
                ...ticketDetail,
                variants: JSON.parse(ticketDetail?.variants)
            }
            setFormData(convertObj);
        }
    }, [ticketDetail])

    return (
        <div className={classes.mainContainer}>
            <div className={classes.topContentContainer}>
                <div className={classes.leftContent}>
                    <img className={classes.image} src={imageData ? URL.createObjectURL(imageData) : (formData?.imageUrl ?? NoImage)} alt="Img failed!" />
                    <div className={classes.contentDetails}>
                        {imageData ?
                            <button className={classes.deleteBtn} data-type='red' onClick={() => removeImage()}><FormattedMessage id='ticket_creation_rmv_img_btn' /></button>
                            :
                            <>
                                <label htmlFor='imageInput' className={classes.fileInput}><FormattedMessage id='ticket_creation_chg_img_btn' /></label>
                                <input hidden id='imageInput' type="file" accept='image/*' onChange={setNewImage} />
                            </>
                        }
                    </div>
                </div>
                <div className={classes.rightContent}>
                    <label className={classes.label} htmlFor='title'><FormattedMessage id='ticket_creation_title_label' /></label>
                    <input className={classes.input} id='title' type="text" value={formData?.title} onChange={(e) => setFormData(prevVal => ({ ...prevVal, title: e.target.value }))} />
                    <label className={classes.label} htmlFor='location'><FormattedMessage id='ticket_creation_location_label' /></label>
                    <input className={classes.input} id='location' type="text" value={formData?.location} onChange={(e) => setFormData(prevVal => ({ ...prevVal, location: e.target.value }))} />
                    <label className={classes.label} htmlFor='variants'><FormattedMessage id='ticket_creation_variant_label' /></label>
                    <div className={classes.variantInputs}>
                        <div className={classes.variantDatas}>
                            {formData?.variants?.length > 0 ? formData?.variants?.map((variant, index) =>
                                <div className={classes.data} key={index}>
                                    <p className={classes.name}>{variant?.variantName}</p>
                                    <p className={classes.price}>Rp. {numberWithPeriods(variant?.price)}</p>
                                    <div className={classes.delBtn} data-type='red' onClick={() => removeVariant(index)}>
                                        <a>X</a>
                                    </div>
                                </div>
                            ) :
                                <div className={classes.emptyContainer}>
                                    <p><FormattedMessage id='empty_data' /></p>
                                </div>
                            }
                        </div>
                        <div className={classes.inputs}>
                            <div className={classes.inputData}>
                                <label className={classes.label} htmlFor='variantName'><FormattedMessage id='ticket_creation_name_label' /></label>
                                <input className={classes.input} type="text" id='variantName' value={variantInput?.variantName} onChange={(e) => setVariantInput(prevVal => ({ ...prevVal, variantName: e.target.value }))} />
                            </div>
                            <div className={classes.inputData}>
                                <label className={classes.label} htmlFor='variantPrice'><FormattedMessage id='ticket_creation_price_label' /></label>
                                <input className={classes.input} type="number" min={1} id='variantPrice' value={variantInput?.price} onChange={(e) => setVariantInput(prevVal => ({ ...prevVal, price: e.target.value }))} />
                            </div>
                        </div>
                        <button className={classes.addBtn} onClick={addNewVariant}><FormattedMessage id='ticket_creation_add_btn' /></button>
                    </div>
                    <label className={classes.label} htmlFor='desc'><FormattedMessage id='ticket_creation_desc_label' /></label>
                    <textarea className={classes.input} id='desc' type="text" data-type='area' value={formData?.description} onChange={(e) => setFormData(prevVal => ({ ...prevVal, description: e.target.value }))} />
                    <div className={classes.footerButtons}>
                        <button className={classes.button} onClick={saveBtn}><FormattedMessage id='ticket_creation_save_btn' /></button>
                        {id && <button className={classes.button} data-type='red' onClick={deleteBtn}><FormattedMessage id='ticket_creation_delete_btn' /></button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

TicketCreation.propTypes = {
    ticketDetail: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
    ticketDetail: selectMyTicketData
});

export default connect(mapStateToProps)(TicketCreation);