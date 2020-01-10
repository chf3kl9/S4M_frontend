import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MovieCalls from "../../apicalls/MovieCalls";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Input from "@material-ui/core/Input";
import GenreCalls from "../../apicalls/GenreCalls";

const styles = theme => ({ //todo move to other file and import
    img: {
        display: 'block',
        maxWidth: '25%',
        maxHeight: '25%',
    },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class MovieEditScreen extends Component {

    constructor(props){
        super(props);

        const {movieId} = this.props.location;
        if (movieId !== undefined)
            this.movieCalls.getMovieById(this, movieId);
        this.genreCalls.getAllGenres(this);
    }

    genreCalls = new GenreCalls();
    movieCalls = new MovieCalls();

    state = {
        movie: {id: -1, title: "", description: "", link: "", genres: [], imageURL:""},
        genres: [],
        open: false,
    };

    handleChange = event => {
        let tempMovie = this.state.movie;
        switch(event.target.name) {
            case "title":
                tempMovie.title = event.target.value;
                break;
            case "link":
                tempMovie.link = event.target.value;
                break;
            case "description":
                tempMovie.description = event.target.value;
                break;
            case "selectedGenres":
                tempMovie.genres = event.target.value;
                break;
            case "imageURL":
                tempMovie.imageURL = event.target.value;
                break;
            default:
                this.setState({[event.target.name]: event.target.value});
                break;
        }
        this.setState({movie: tempMovie});
    };

    movieReturned() {
        if (this.state.movie === null) {
            //todo tell user that something went wrong, as the selected movie was not found
            this.props.history.push({
                pathname: "/movies"
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.saveMovie()} >
                    Save Changes
                </Button> {/* Save Movie button */}
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    onClick={() => this.discardChanges()}>
                    Discard changes
                </Button> {/* Discard changes button */}
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.toggleDelete(true)}>
                    Delete Movie
                </Button> {/* Delete Movie button */}

                <Dialog
                    open={this.state.open}
                    onClose={() => this.toggleDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete this Movie?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this movie? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.toggleDelete(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.deleteMovie()} color="primary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog> {/* Delete Confirmation Dialog/Popup */}
                <br/><br/>
                <img className={classes.img} alt="complex" src={this.state.movie.imageURL}  />
                <br/><br/>
                <TextField
                    id="standard"
                    name="imageURL"
                    label="ImageURL"
                    value={this.state.movie.imageURL}
                    onChange={this.handleChange}
                    className={classes.textField}
                    margin="normal"
                /> {/* Image TextField */}
                <br/>

                <TextField
                    id="standard"
                    name="title"
                    label="Title"
                    value={this.state.movie.title}
                    onChange={this.handleChange}
                    className={classes.textField}
                    margin="normal"
                /> {/* Title TextField */}
                <br/>
                <TextField
                    id="standard"
                    name="link"
                    label="Movie Link"
                    value={this.state.movie.link}
                    onChange={this.handleChange}
                    className={classes.textField}
                    margin="normal"
                /> {/* Movie Link TextField */}
                <br/>
                <TextField
                    id="standard-multiline-flexible"
                    name="description"
                    label="Description"
                    multiline
                    rows="6"
                    value={this.state.movie.description}
                    onChange={this.handleChange}
                    className={classes.multiTextField}
                    margin="normal"
                /> {/* Description multi line TextField */}
                <br/>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                    <Select
                        multiple
                        value={this.state.movie.genres}
                        onChange={this.handleChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => selected.map(x => x.name).join(', ')}
                        MenuProps={MenuProps}
                        inputProps={{
                            name: "selectedGenres",
                            id: "genres-simple",
                        }}
                    >
                        {this.state.genres.map(genre => (
                            <MenuItem key={genre.id} value={genre}>
                                <Checkbox checked={this.state.movie.genres.map(genre => genre.id).indexOf(genre.id) > -1} />
                                <ListItemText primary={genre.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> {/* Genres multi checkbox select */}
            </div>
        );
    }

    toggleDelete(open) {
        this.setState({open: open});
    }

    deleteMovie() {
        this.movieCalls.deleteMovieById(this, this.state.movie.id);
    }

    discardChanges() {
        if (this.state.movie.id > 0) {
            this.props.history.push({
                pathname: "/movie",
                movieId: this.state.movie.id,
            });
        } else {
            this.props.history.push({
                pathname: "/movies",
            })
        }
    }

    saveMovie() {
        if (this.state.movie.id < 1) {
            this.movieCalls.createMovie(this, this.state.movie);
        } else if (this.state.movie.id > 0) {
            this.movieCalls.updateMovie(this, this.state.movie);
        }
    }
}

export default withRouter(withStyles(styles)(MovieEditScreen));