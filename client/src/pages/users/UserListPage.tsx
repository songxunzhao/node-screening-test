import React, {useEffect, useState} from 'react';
import {RootState} from "../../store/reducers";
import {connect} from "react-redux";
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
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Create, Delete, Edit} from "@material-ui/icons";
import usersService from "../../services/users.service";
import { UserModel } from "../../models";
import pageStyles from "../styles";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) => ({
    searchBar: {
        flexGrow: 1
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

const UserListPage = function () {
    const pageClasses= pageStyles()
    const classes = useStyles()
    const [users, setUsers] = useState([] as UserModel[])
    const [error, setError] = useState('')
    const history = useHistory();

    const handleEdit = (id: string) => {
        history.push(`/users/edit/${id}`);
    }

    const handleDelete = async (id: string) => {
        try {
            await usersService.delete(id)
            const index = users.findIndex((row) => row.id === id)
            users.splice(index, 1)
            setUsers(users.slice())
        } catch(e) {
            setError(e.message)
        }
    }

    const handleCreate = () => {
        history.push(`/users/create`);
    }

    const getUsers = async (): Promise<void> => {
        try {
            const results = await usersService.getAll()
            setUsers(results)
        } catch(e) {
            setError(e.message)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <NavBar/>
            <Container fixed className={pageClasses.page}>
                {error !== '' && <Alert severity='error'>{error}</Alert>}
                <Grid container spacing={3} className={classes.tableBar}>
                    <Grid item className={classes.searchBar}>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' color='primary' onClick={handleCreate}>
                            <Create/>Create
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size='small' aria-label='Deposit Table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell className={classes.operationCell}>
                                        <Button variant='contained' color='primary' onClick={
                                            () => row.id && handleEdit(row.id)}>
                                            <Edit/> Edit
                                        </Button>
                                        &nbsp;
                                        <Button variant='contained' color='secondary' onClick={
                                            () => row.id && handleDelete(row.id)}>
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
    );
}


function mapStateToProps(state: RootState) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedUserPage = connect(mapStateToProps)(UserListPage);
export { connectedUserPage as UserListPage }
