import React, {ChangeEvent, useState} from 'react'
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
import {ComponentProps} from "react";
import {NavBar} from "../../components/NavBar";
import {
    Button,
    Container,
    Grid,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Search} from "@material-ui/icons";
import {formatter} from "../../helpers";
import {makeStyles} from "@material-ui/core/styles";
import pageStyles from "../styles";
import {RevenueModel} from "../../models";
import depositService from "../../services/deposits.service";

const useStyles = makeStyles((theme) => ({
    fillAvailable: {
        flexGrow: 1
    },
    searchDate: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 150
    },
    searchBarButton: {
    },
    table: {},
    topTableBar: {
        marginBottom: theme.spacing(1)
    },
    gainCell: {
        color: theme.palette.success.main
    },
    lossCell: {
        color: theme.palette.error.main
    },
    textRight: {
        textAlign: 'right'
    },
    bottomTableBar: {
        marginTop: theme.spacing(2)
    }
}))

const RevenuePage = (props: ComponentProps<any>) => {
    const pageClasses = pageStyles()
    const classes = useStyles()
    const [error, setError] = useState('')
    const [revenues, setRevenues] = useState([] as RevenueModel[])
    const [period, setPeriod] = useState(
        {
            from: formatter.formatDate(new Date()),
            to: formatter.formatDate(new Date())
        } as any
    )
    const getRevenues = async (period: {from: string, to: string}) => {
        try {
            const results = await depositService.revenue(period)
            setRevenues(results)
        } catch(e) {
            setError(e.message)
        }
    }

    const handlePeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const element: HTMLInputElement = e.currentTarget
        setPeriod(Object.assign({}, period, {
            [element.name]: element.value
        }))
    }

    const handleView = () => {
        getRevenues(period)
    }

    const sumChanges = (revenues: RevenueModel[]): number => {
        return revenues.reduce((acc, revenue) => acc + revenue.change, 0)
    }

    return (
        <>
            <NavBar/>
            <Container fixed className={pageClasses.page}>
                {error !== '' && <Alert severity='error'>{error}</Alert>}
                <Grid container spacing={3} className={classes.topTableBar}>
                    <Grid item className={classes.fillAvailable}>
                        <TextField label='Start' name='from' type='date' className={classes.searchDate} value={period.from} onChange={handlePeriodChange}/>
                        <TextField label='Expire' name='to' type='date' className={classes.searchDate} value={period.to} onChange={handlePeriodChange}/>
                        <Button variant='contained' className={classes.searchBarButton} onClick={handleView}>
                            <Search/>View
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size='small' aria-label='Deposit Table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Bank Name</TableCell>
                                <TableCell>Account Number</TableCell>
                                <TableCell>Initial Amount</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>Expire</TableCell>
                                <TableCell>Interest Percentage</TableCell>
                                <TableCell>Tax Percentage</TableCell>
                                <TableCell>Gain/Loss</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {revenues.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.bankName}</TableCell>
                                    <TableCell>{row.accountNumber}</TableCell>
                                    <TableCell>{row.initialAmount}</TableCell>
                                    <TableCell>{formatter.formatDate(row.startDate)}</TableCell>
                                    <TableCell>{formatter.formatDate(row.endDate)}</TableCell>
                                    <TableCell>{row.interestPercentage}</TableCell>
                                    <TableCell>{row.taxesPercentage}</TableCell>
                                    <TableCell className={row.change > 0 ? classes.gainCell: classes.lossCell}>
                                        {formatter.formatNumber(row.change)}
                                    </TableCell>
                                    <TableCell>{row.user && row.user.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container className={classes.bottomTableBar}>
                    <Grid xs={12} item className={classes.textRight}>
                        Total: {formatter.formatNumber(sumChanges(revenues))}
                    </Grid>
                </Grid>
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

const connectedRevenuePage = connect(mapStateToProps)(RevenuePage);
export { connectedRevenuePage as RevenuePage }
