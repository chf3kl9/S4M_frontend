import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ApiCommunication from "../../apicalls/ApiCommunication";

const styles = theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    margin: {
        margin: theme.spacing(1),
        minWidth: 100,
    },
    paper: {
        width: 300,
        margin: "2px",
        padding: theme.spacing(2),
        cursor:"pointer"
    },
    img: {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    sort: {
        marginTop: "26px",
        minWidth: 100,
    },
    filter: {
        marginTop: "10px",
        minWidth:100,
    },
    button: {
        marginTop: "40px",
        minWidth: 100,
    },
});

class MovieScreen extends Component {

    constructor(props){
        super(props);
        if (this.props.isSignedIn) {
            this.refreshList();
        } else {
            this.props.history.push("/login");
        }
    }

    state = {
        sort: "",
        filter: "",
        movies: [],
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    createMovie(){
        this.props.history.push("/editMovie");
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <FormControl className={classes.sort}>
                    <InputLabel htmlFor="sort">Sort</InputLabel>
                    <Select
                        value={this.state.sort}
                        onChange={this.handleChange}
                        inputProps={{
                            name: "sort",
                            id: "sort-simple",
                        }}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="az">A-Z</MenuItem>
                        <MenuItem value="za">Z-A</MenuItem>
                    </Select>
                </FormControl> {/* Sorting selector */}
                <FormControl className={classes.filter}>
                    <TextField
                        id="Filter"
                        name="filter"
                        label="Filter"
                        type="filter"
                        margin="normal"
                        onChange={this.handleChange}
                    />
                </FormControl> {/* Filter input field */}
                {this.props.isAdmin && (
                    <>
                        <Button variant="contained" color="secondary" className={classes.button}
                                onClick={() => this.createMovie()}>
                            Create new Movie
                        </Button>
                        <br/><br/>
                    </>
                )}

                <Grid container spacing={1}>
                    {this.state.movies
                        .filter(movie => movie.title.toLowerCase().includes(this.state.filter.toLocaleLowerCase()))
                        .sort((a, b) =>{
                            if (this.state.sort === "az")
                                return a.title > b.title;
                            if (this.state.sort === "za")
                                return a.title < b.title;
                            return false;
                        })
                        .map(movie => (
                        <Paper
                            className={classes.paper}
                            key={movie.id}
                            onClick={ (e) => {
                                this.onTileTouch(movie.id)
                            }}>
                            <Grid container wrap="nowrap" spacing={2}>
                                <Grid item xs zeroMinWidth>
                                    <img className={classes.img} alt="image not found" src={movie.imageURL} />
                                    <Typography noWrap>{movie.title}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        )
                    )}
                </Grid>
            </div>
        );
    }

    refreshList() {
        ApiCommunication.graphQLRequest("query", "movies", "id title imageURL", null)
            .then(response => {this.setState({movies: response.data.data.movies})});
    }

    onTileTouch(id) {
        this.props.history.push({
            pathname: "/movie",
            movieId: id,
        });
    }
}

export default withRouter(withStyles(styles)(MovieScreen));