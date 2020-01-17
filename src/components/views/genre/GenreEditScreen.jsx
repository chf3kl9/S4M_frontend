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
import ApiCommunication from "../../apicalls/ApiCommunication";

const styles = theme => ({
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
            ApiCommunication.graphQLRequest("query", "genre", "id name", [
                {name: "id", type: "Int", value:genreId}
            ]).then(response => {this.setState({genre: response.data.data.genre}, this.genreReturned)});
    }

    state = {
        genre: {id: -1, name: ""},
        open: false,
    };

    handleChange = event => {
        switch(event.target.name) {
            case "name":
                this.setState({genre: {...this.state.genre, [event.target.name]: event.target.value}});
                break;
            default:
                this.setState({[event.target.name]: event.target.value});
                break;
        }
    };

    genreReturned() {
        if (this.state.genre === null) {
            this.toGenres();
        }
    }

    toGenres(){
        this.props.history.push({
            pathname: "/genres"
        });
    }

    toGenre(id){
        this.props.history.push({
            pathname: "/genre",
            genreId: id
        });
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
        ApiCommunication.graphQLRequest("mutation", "deleteGenreById", null, [
            {name: "id", type: "Int", value:this.state.genre.id}
        ]).then(() => {this.toGenres();});
    }

    discardChanges() {
        if (this.state.genre.id > 0) {
            this.toGenre(this.state.genre.id);
        } else {
            this.toGenres();
        }
    }

    saveGenre() {
        if (this.state.genre.id < 1) {
            ApiCommunication.graphQLRequest("mutation", "createGenre", "id", [
                {name: "name", type: "String", value:this.state.genre.name}
            ]).then(response => {this.toGenre(response.data.data.createGenre.id);});
        } else if (this.state.genre.id > 0) {
            ApiCommunication.graphQLRequest("mutation", "updateGenreById", "id", [
                {name: "id", type: "Int", value: this.state.genre.id},
                {name: "name", type: "String", value:this.state.genre.name}
            ]).then(response => {this.toGenre(response.data.data.updateGenreById.id);});
        }
    }
}

export default withRouter(withStyles(styles)(GenreEditScreen));