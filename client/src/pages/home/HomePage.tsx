import React, {ComponentProps, useState} from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Create, ViewList} from "@material-ui/icons";
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
import { history } from '../../helpers/history';
import {NavBar} from "../../components/NavBar";
import pageStyles from '../styles'

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
    title: {
        marginBottom: theme.spacing(2)
    },
    link: {
        color: 'white',
        fontSize: '1.2em',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginRight: theme.spacing(1)
    },
    paperButton: {
        padding: theme.spacing(3),
        fontSize: '1.4em',
        color: 'white',
        cursor: 'pointer'
    },
    paperPrimary: {
      backgroundColor: theme.palette.primary.main
    },
    paperWaring: {
        backgroundColor: theme.palette.warning.main
    },
    paperSuccess: {
        backgroundColor: theme.palette.success.main
    },
    operationIcon: {
        fontSize: '1.4em',
        verticalAlign: 'middle',
        marginRight: theme.spacing(5)
    },

    operationSection: {
        marginTop: theme.spacing(6)
    },
}));

const HomePage = (props: ComponentProps<any>) => {
    const pageClasses = pageStyles();
    const classes = useStyles();
    const { user } = props

    const handleCreateDeposit = () => {
        history.push('/deposits/create')
    }

    const handleViewDeposit = () => {
        history.push('/deposits')
    }

    const handleCreateUser = () => {
        history.push('/users/create')
    }

    const handleViewUser = () => {
        history.push('/users')
    }
    const getUserRoleDescription = (role: string) => {
        const roles: {[key: string]: string} = {
            'ADMIN': 'admin',
            'MANAGER': 'manager',
            'NORMAL': 'guest'
        }
        return roles[role]
    }

    return (
        <>
            <NavBar/>
            <Container fixed className={pageClasses.page}>
                <section>
                    <Typography variant='h3' className={classes.title}>
                        Welcome to Dashboard!
                    </Typography>
                    <Typography variant='h5'>
                        Hey <b>{user.name}!</b> You are {getUserRoleDescription(user.role)}.
                    </Typography>
                </section>
                <section className={classes.operationSection}>
                    <Typography variant='h4'>Deposit</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper onClick={handleCreateDeposit}
                                   className={`${classes.paperButton} ${classes.paperPrimary}`}>
                                <Create className={classes.operationIcon}/>
                                Create Deposit
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper onClick={handleViewDeposit}
                                   className={`${classes.paperButton} ${classes.paperWaring}`}>
                                <ViewList className={classes.operationIcon}/>
                                View Deposits
                            </Paper>
                        </Grid>
                    </Grid>
                </section>

                {
                    (user.role === 'MANAGER' || user.role === 'ADMIN') &&
                    <section className={classes.operationSection}>
                        <Typography variant='h4'>User</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper onClick={handleCreateUser}
                                       className={`${classes.paperButton} ${classes.paperPrimary}`}>
                                    <Create className={classes.operationIcon}/>
                                    Create User
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper onClick={handleViewUser}
                                       className={`${classes.paperButton} ${classes.paperWaring}`}>
                                    <ViewList className={classes.operationIcon}/>
                                    View Users
                                </Paper>
                            </Grid>
                        </Grid>
                    </section>
                }
            </Container>
        </>
    )
}

function mapStateToProps(state: RootState) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage }
