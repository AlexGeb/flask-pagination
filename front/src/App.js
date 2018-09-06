import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
});

class App extends Component {
  state = {
    loading: true,
    error: null,
    users: null,
    page: 1,
    rowsPerPage: 10,
    total: 0
  };

  componentDidMount() {
    this.fetchWithDelay(this.state.page);
  }

  fetchWithDelay = () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    Promise.all([delay(3000), this.fetchUsers()]);
  };

  fetchUsers = () => {
    const { page, rowsPerPage } = this.state;
    return fetch(`http://localhost:5000/users?page=${page}&size=${rowsPerPage}`)
      .then(apiResponse => apiResponse.json())
      .then(paginatedUsers =>
        this.setState({
          loading: false,
          page: paginatedUsers.page,
          total: paginatedUsers.total,
          users: paginatedUsers.items
        })
      )
      .catch(error =>
        this.setState({
          error,
          loading: false
        })
      );
  };

  handleChangePage = (event, page) => {
    this.setState({ loading: true, page: page + 1 }, this.fetchWithDelay);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value }, this.fetchWithDelay);
  };

  render() {
    const { classes } = this.props;
    const { users, page, rowsPerPage, loading, total } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {loading ? (
              <CircularProgress />
            ) : (
              users && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow hover key={user.username}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            )}
            <TablePagination
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
