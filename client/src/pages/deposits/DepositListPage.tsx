import React, {ChangeEvent, ComponentProps, useEffect, useState} from 'react';
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
import {NavBar} from "../../components/NavBar";
import depositService from '../../services/deposits.service';
import {
    Button,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@material-ui/core";
import {CloudDownload, Create, Delete, Edit, Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {DepositModel} from "../../models";
import {useHistory} from "react-router";
import {Alert} from "@material-ui/lab";
import pageStyles from '../styles';
import {formatter} from "../../helpers/formatter";

const useStyles = makeStyles((theme) => ({
    searchBar: {
        flexGrow: 1
    },
    searchDate: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 150
    },
    searchAmount: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 50
    },
    searchBarButton: {
        marginRight: theme.spacing(2)
    },
    table: {},
    tableBar: {
        marginBottom: '5px'
    },
    dangerButton: {
        backgroundColor: theme.palette.error.main
    },
    operationCell: {
        whiteSpace: 'nowrap'
    }
}))

const DepositListPage = (props: ComponentProps<any>) => {
    const pageClasses= pageStyles()
    const classes = useStyles()
    const [searchOptions, setSearchOptions] = useState({} as any)
    const [deposits, setDeposits] = useState([] as DepositModel[])
    const [error, setError] = useState('')
    const history = useHistory();

    const handleEdit = (id: string) => {
        history.push(`/deposits/edit/${id}`);
    }

    const handleDelete = async (id: string) => {
        try {
            await depositService.delete(id)
            const index = deposits.findIndex((row) => row.id === id)
            deposits.splice(index, 1)
            setDeposits(deposits.slice())
        } catch(e) {
            setError(e.message)
        }
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const element: HTMLInputElement = e.currentTarget
        setSearchOptions(Object.assign({}, searchOptions, {
            [element.name]: element.value
        }))
    }

    const handleSearch = () => {
        getDeposits(searchOptions)
    }

    const handleCreate = () => {
        history.push(`/deposits/create`);
    }

    const handleDownload = () => {
        history.push(`/deposits/revenue`);
    }

    const getDeposits = async (searchOptions: object): Promise<void> => {
        try {
            const results = await depositService.search(searchOptions)
            setDeposits(results)
        } catch(e) {
            setError(e.message)
        }
    }

    useEffect(() => {
        getDeposits({})
    }, [])

    return (
        <>
            <NavBar/>
            <Container fixed className={pageClasses.page}>
                {error !== '' && <Alert severity='error'>{error}</Alert>}
                <Grid container spacing={3} className={classes.tableBar}>
                    <Grid item className={classes.searchBar}>
                        <TextField label='Start' name='from' type='date' className={classes.searchDate} onChange={handleSearchChange}/>
                        <TextField label='Expire' name='to' type='date' className={classes.searchDate} onChange={handleSearchChange}/>
                        <TextField label='Min' name='min' type='number' className={classes.searchAmount} onChange={handleSearchChange}/>
                        <TextField label='Max' name='max' type='number' className={classes.searchAmount} onChange={handleSearchChange}/>
                        <TextField label='Bank Name' name='bank' type='search' className={classes.searchDate} onChange={handleSearchChange}/>
                        <Button variant='contained' className={classes.searchBarButton} onClick={handleSearch}>
                            <Search/>Search
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' color='primary' className={classes.searchBarButton} onClick={handleCreate}>
                            <Create/>Create
                        </Button>
                        <Button variant='contained' color='primary' className={classes.searchBarButton} onClick={handleDownload}>
                            <CloudDownload/>Revenue Report
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
                                <TableCell>Interest Rate</TableCell>
                                <TableCell>Tax Rate</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deposits.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.bankName}</TableCell>
                                    <TableCell>{row.accountNumber}</TableCell>
                                    <TableCell>{row.initialAmount}</TableCell>
                                    <TableCell>{formatter.formatDate(row.startDate)}</TableCell>
                                    <TableCell>{formatter.formatDate(row.endDate)}</TableCell>
                                    <TableCell>{row.interestPercentage}</TableCell>
                                    <TableCell>{row.taxesPercentage}</TableCell>
                                    <TableCell>{row.user && row.user.name}</TableCell>
                                    <TableCell className={classes.operationCell}>
                                        <Button variant='contained' color='primary' onClick={handleEdit.bind(null, row.id)}>
                                            <Edit/> Edit
                                        </Button>
                                        &nbsp;
                                        <Button variant='contained' color='secondary' onClick={handleDelete.bind(null, row.id)}>
                                            <Delete/> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

const connectedDepositListPage = connect(mapStateToProps)(DepositListPage);
export { connectedDepositListPage as DepositListPage }
