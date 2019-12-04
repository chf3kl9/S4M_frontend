import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MovieCalls from "../../apicalls/MovieCalls";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GenreCalls from "../../apicalls/GenreCalls";

const styles = theme => ({ //todo move to other file and import
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    margin: {
        margin: theme.spacing.unit,
        minWidth: 100,
    },
    paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
});

class GenreScreen extends Component {

    constructor(props){
        super(props);
        this.genreCalls.getAllGenres(this);
    }

    genreCalls = new GenreCalls();

    state = {
        sort: "",
        filter: "",
        genres: [],
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Button  variant="contained" color="secondary" className={classes.button} onClick={() => this.refreshList()}>
                    Refresh
                </Button> {/* Refresh button */}
                <FormControl className={classes.margin}>
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
                <FormControl className={classes.margin}>
                    <TextField
                        id="Filter"
                        name="filter"
                        label="Filter"
                        type="filter"
                        margin="normal"
                        onChange={this.handleChange}
                    />
                </FormControl> {/* Filter input field */}

                <Grid container spacing={1}>
                    {this.state.genres
                        .filter(genre => genre.name.toLowerCase().includes(this.state.filter.toLocaleLowerCase()))
                        .sort((a, b) =>{
                            if (this.state.sort === "az")
                                return a.name > b.title;
                            if (this.state.sort === "za")
                                return a.name < b.name;
                            return false;
                        })
                        .map(genre => (
                        <Paper
                            className={classes.paper}
                            key={genre.id}
                            onClick={ (e) => {
                                this.onTileTouch(genre.id)
                            }}>
                            <Grid container wrap="nowrap" spacing={2}>
                                <Grid item xs zeroMinWidth>
                                    <Typography noWrap>{genre.name}</Typography>
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
        this.genreCalls.getAllGenres(this);
    }

    onTileTouch(id) {
        this.props.history.push({
            pathname: "/genre",
            genreId: id,
        });
    }
}

export default withRouter(withStyles(styles)(GenreScreen));