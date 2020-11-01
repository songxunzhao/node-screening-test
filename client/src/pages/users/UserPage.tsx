import React, {ComponentProps, useEffect, useState} from 'react'
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {NavBar} from "../../components/NavBar";
import {makeStyles} from "@material-ui/core/styles";
import {Controller, useForm} from "react-hook-form";
import {config} from "../../config";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {usersService} from '../../services'
import {useHistory, useParams} from "react-router";
import {Person} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    inputError: {
        color: theme.palette.error.main
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const UserPage = (props: ComponentProps<any>) => {
    const emailRegex = config.emailRegex
    const classes = useStyles();
    const { register, handleSubmit, control, errors, reset } = useForm();
    const params = useParams<{id?: string}>();
    const {id: userId} = params
    const history = useHistory();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: any) => {
        try {
            if(userId !== undefined) {
                await usersService.update(userId, data);
            } else {
                await usersService.create(data);
            }
            history.push('/users')
        } catch(e) {
            setError(e.message)
        }
    }

    useEffect(() => {
        const getUser = async (id: string) => {
            setLoading(true)
            try {
                const userObject = await usersService.get(id) as {[key: string]: any}
                reset(userObject)
            } catch(e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        if(userId) {
            getUser(userId)
        }

    }, [reset, userId])
    return (
        <>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {loading ? <div>Loading...</div> :
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <Person/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            User Information
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        variant="outlined"
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        autoFocus
                                        inputRef={register({required: true, minLength: 4})}
                                    />
                                    <div className={classes.inputError}>
                                        {errors.name && "Please type in valid name"}
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        inputRef={register({pattern: emailRegex})}
                                    />
                                    <div className={classes.inputError}>
                                        {errors.email && "Please type in valid email"}
                                    </div>
                                </Grid>
                                {!userId && <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        inputRef={register({required: true, minLength: 6})}
                                    />
                                    <div className={classes.inputError}>
                                        {errors.email && "Please type in valid password"}
                                    </div>
                                </Grid>
                                }

                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel>Role</InputLabel>
                                        <Controller
                                            control={control}
                                            name='role'
                                            rules={{required: true}}
                                            error={errors.role && true}
                                            defaultValue={''}
                                            as={
                                                <Select
                                                    name="role">
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    <MenuItem value='NORMAL'>Normal</MenuItem>
                                                    <MenuItem value='MANAGER'>Manager</MenuItem>
                                                    <MenuItem value='ADMIN'>Admin</MenuItem>
                                                </Select>
                                            }>

                                        </Controller>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Save
                            </Button>
                        </form>
                    </div>
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

const connectedUserPage = connect(mapStateToProps)(UserPage);
export { connectedUserPage as UserPage }
