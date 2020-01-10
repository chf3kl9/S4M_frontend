import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import GenreCalls from "../../apicalls/GenreCalls";

const styles = theme => ({ //todo move to other file and import
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

class GenreEditScreen extends Component {

    constructor(props){
        super(props);

        const {genreId} = this.props.location;
        if (genreId !== undefined)
            this.genreCalls.getGenreById(this, genreId);
    }

    genreCalls = new GenreCalls();

    state = {
        genre: {id: -1, name: ""},
        movies: [],
        open: false,
    };

    handleChange = event => {
        let tempGenre = this.state.genre;
        switch(event.target.name) {
            case "name":
                tempGenre.name = event.target.value;
                break;
            default:
                this.setState({[event.target.name]: event.target.value});
                break;
        }
        this.setState({genre: tempGenre});
    };

    genreReturned() {
        if (this.state.genre === null) {
            //todo tell user that something went wrong, as the selected genre was not found
            this.props.history.push({
                pathname: "/genres"
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
                    onClick={() => this.saveGenre()} >
                    Save Changes
                </Button> {/* Save Genre button */}
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
                    Delete Genre
                </Button> {/* Delete Genre button */}

                <Dialog
                    open={this.state.open}
                    onClose={() => this.toggleDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete this Genre?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this genre? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.toggleDelete(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.deleteGenre()} color="primary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog> {/* Delete Confirmation Dialog/Popup */}
                <br/><br/>

                <TextField
                    id="standard"
                    name="name"
                    label="Name"
                    value={this.state.genre.name}
                    onChange={this.handleChange}
                    className={classes.textField}
                    margin="normal"
                /> {/* name TextField */}
            </div>
        );
    }

    toggleDelete(open) {
        this.setState({open: open});
    }

    deleteGenre() {
        this.genreCalls.deleteGenreById(this, this.state.genre.id);
    }

    discardChanges() {
        if (this.state.genre.id > 0) {
            this.props.history.push({
                pathname: "/genre",
                genreId: this.state.genre.id,
            });
        } else {
            this.props.history.push({
                pathname: "/genres",
            })
        }
    }

    saveGenre() {
        if (this.state.genre.id < 1) {
            this.genreCalls.createGenre(this, this.state.genre);
        } else if (this.state.genre.id > 0) {
            this.genreCalls.updateGenre(this, this.state.genre);
        }
    }
}

export default withRouter(withStyles(styles)(GenreEditScreen));