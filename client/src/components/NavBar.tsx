import React, {ComponentProps, useState} from 'react'
import {AppBar, Button, IconButton, Menu, MenuItem, Toolbar} from "@material-ui/core";
import {AccountCircle, Dashboard} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {history} from "../helpers/history";
import {makeStyles} from "@material-ui/core/styles";
import {RootState} from "../store/reducers";
import {connect} from "react-redux";
import {userActions} from "../store/actions/user.action";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    nav: {
        flexGrow: 1,
    },
    link: {
        color: 'white',
        fontSize: '1.2em',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginRight: theme.spacing(3)
    }
}));


const NavBar = (props: ComponentProps<any>) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null as any);
    const { user } = props
    const open = Boolean(anchorEl);

    const handleDashboard = () => {
        history.push('/')
    }

    const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        const { dispatch } = props;
        history.push('/')
        dispatch(userActions.logout())
    };

    return (
        <>
        {user &&
        <AppBar position='static'>
            <Toolbar>
                <IconButton onClick={handleDashboard} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <Dashboard />
                </IconButton>
                <div className={classes.nav}>
                    { user.role === 'ADMIN' &&
                    <Link className={classes.link} to="/users">
                        Users
                    </Link>
                    }

                    <Link className={classes.link} to="/deposits">
                        Deposits
                    </Link>
                </div>

                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
        }
        </>
    )
}

function mapStateToProps(state: RootState) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedHomePage = connect(mapStateToProps)(NavBar);
export { connectedHomePage as NavBar }
