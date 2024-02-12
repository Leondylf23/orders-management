import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropType from "prop-types";
import Typography from '@mui/material/Typography';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import BallotIcon from '@mui/icons-material/Ballot';

import { setLogin, setToken, setUserData } from "@containers/Client/actions";

import classes from "./style.module.scss";

function DropDownMenu({ isOpen, anchorEl, onClose, labeledMenu, isBusiness }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    function menuItemAction(id) {
        switch (id) {
            case 0:
                navigate("/profile");
                onClose();
                break;
            case 1:
                navigate("/bookings");
                onClose();
                break;
            case 2:
                navigate("/coupons");
                onClose();
                break;
            case 3:
                // navigate("/newjourney");
                dispatch(setLogin(false));
                dispatch(setUserData(null));
                dispatch(setToken(null));
                onClose();
                break;
        }
    }

    return (
        <div data-testid='nav-dropdown'>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={isOpen}
                onClose={onClose}
                MenuListProps={{
                    'aria-labelledby': labeledMenu,
                }}
            >
                <MenuItem onClick={() => menuItemAction(0)}>
                    <Person2OutlinedIcon className={classes.iconProfile} />
                    <Typography variant="body2"><FormattedMessage id="nav_profile" /></Typography>
                </MenuItem>
                <MenuItem onClick={() => menuItemAction(1)}>
                    <BallotIcon className={classes.iconBookings} />
                    <Typography variant="body2"><FormattedMessage id="nav_bookings" /></Typography>
                </MenuItem>
                {isBusiness && <MenuItem onClick={() => menuItemAction(2)}>
                    <DiscountIcon className={classes.iconDiscount} />
                    <Typography variant="body2"><FormattedMessage id="nav_coupons" /></Typography>
                </MenuItem>}
                <div className={classes.divider}></div>
                <MenuItem onClick={() => menuItemAction(3)}>
                    <LogoutIcon className={classes.iconLogout} />
                    <Typography variant="body2"><FormattedMessage id="nav_logout" /></Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}

DropDownMenu.propType = {
    isOpen: PropType.bool.isRequired,
    onClose: PropType.func.isRequired,
    labeledMenu: PropType.string.isRequired,
    anchorEl: PropType.element.isRequired,
    isBusiness: PropType.bool
}

export default DropDownMenu;