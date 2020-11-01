import React, {ComponentProps, useEffect, useState} from 'react';
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {Alert, Autocomplete} from "@material-ui/lab";
import { UserModel } from "../../models";
import {useHistory, useParams} from "react-router";
import depositsService from '../../services/deposits.service'
import usersService from '../../services/users.service'
import {Controller, useForm} from "react-hook-form";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {AttachMoney} from "@material-ui/icons";
import {formatter} from "../../helpers";
import {NavBar} from "../../components/NavBar";
import {DepositModel} from "../../models";

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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const DepositPage = (props: ComponentProps<any>) => {
    const classes = useStyles();

    const params = useParams<{id?: string}>();
    const {id: depositId} = params
    const { user } = props
    const [users, setUsers] = useState([] as UserModel[])
    const [error, setError] = useState('')
    const { register, control, handleSubmit, reset } = useForm();
    const history = useHistory();
    const [loading, setLoading] = useState(false)

    const getDeposit = async (id: string): Promise<DepositModel> => {
        const depositObject = await depositsService.get(id)
        const deposit = Object.assign({}, depositObject, {
            startDate: formatter.formatDate(depositObject.startDate),
            endDate: formatter.formatDate(depositObject.endDate),
        }) as any
        return deposit
    }

    const getUsers = async () => {
        try {
            return await usersService.getAll()
        } catch(e) {
            setError(e.message)
        }
    }

    const onSubmit = async (data: any) => {
        if(data.user) {
            data.userId = data.user.id
        }

        try {
            if(depositId !== undefined) {
                await depositsService.update(depositId, data);
            } else {
                await depositsService.create(data);
            }
            history.push('/deposits')
        } catch(e) {
            setError(e.message)
        }
    }

    const initialize = async () => {
        setLoading(true)

        try {
            let users = null;

            if(user.role === 'ADMIN') {
                users = await getUsers()
                if(users) {
                    setUsers(users)
                }
            }
            if(depositId) {
                const deposit = await getDeposit(depositId)
                if(users) {
                    deposit.user = users.find((user) => user.id === deposit.userId)
                }
                reset(deposit as {[key:string]: any})
            }
        } catch(e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        initialize()
    }, [])


    return (
        <>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {loading ? <div>Loading...</div> :
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AttachMoney/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Deposit information
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {error !== '' && <Alert severity='error'>{error}</Alert>}
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="Bank Name"
                                    name="bankName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="bankName"
                                    label="Bank Name"
                                    autoFocus
                                    inputRef={register({ required: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="accountNumber"
                                    label="Account Number"
                                    name="accountNumber"
                                    autoComplete="Account Number"
                                    inputRef={register({ required: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="initialAmount"
                                    label="Initial Amount"
                                    type="number"
                                    inputProps = {{step: 0.01}}
                                    id="initialAmount"
                                    autoComplete="Initial Amount"
                                    inputRef={register({ required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="startDate"
                                    label="Start Date"
                                    type="date"
                                    id="startDate"
                                    inputRef={register({ required: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="endDate"
                                    label="End Date"
                                    type="date"
                                    id="endDate"
                                    inputRef={register({ required: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="interestPercentage"
                                    label="Interest Percentage"
                                    type="number"
                                    id="interestPercentage"
                                    autoComplete="Interest Rate"
                                    inputRef={register({ required: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="taxesPercentage"
                                    label="Tax Percentage"
                                    type="number"
                                    id="taxesPercentage"
                                    autoComplete="Tax Rate"
                                    inputRef={register({ required: true, min: 0 })}
                                />
                            </Grid>
                            {
                                user.role === 'ADMIN' &&
                                <Grid item xs={12}>
                                    <Controller
                                        render={(props) => (<Autocomplete
                                                id="combo-box-demo"
                                                {...props}
                                                options={users}
                                                fullWidth
                                                getOptionLabel={(option: UserModel) => option.name ?? ''}
                                                onChange={(_, data) => props.onChange(data)}
                                                style={{ width: 300 }}
                                                renderInput={
                                                    (params) =>
                                                        <TextField {...params} label="User" variant="outlined" />
                                                }
                                            />)}
                                        name='user'
                                        control={control}
                                        defaultValue={null}
                                        rules={{required: 'Required field'}}>
                                    </Controller>
                                </Grid>
                            }

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {depositId ? 'Save' : 'Create'}
                        </Button>
                    </form>
                </div>}
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

const connectedDepositPage = connect(mapStateToProps)(DepositPage);
export { connectedDepositPage as DepositPage }
