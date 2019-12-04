import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import GenreCalls from "../../apicalls/GenreCalls";

const styles = theme => ({ //todo move to other file and import
});

class GenreDetailScreen extends Component {

    constructor(props){
        super(props);

        const {genreId} = this.props.location;
        if (genreId !== undefined)
            this.genreCalls.getGenreById(this, genreId);
        else
            this.props.history.push({
                pathname: "/editGenre"
            })
    }

    genreCalls = new GenreCalls();

    state = {
        genre: {id: -1, name: "", movies: []},
    };

    genreReturned() {
        if (this.state.genre === null) {
            //todo tell user that something went wrong, as the selected genre was not found
            this.props.history.push({
                pathname: "/genres"
            });
        }
    }

    editGenre() {
        if (this.state.genre.id > 0) {
            this.props.history.push({
                pathname: "/editGenre",
                genreId: this.state.genre.id
            })
        } else {
            //todo tell user to wait a bit so that the genre can load
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                Name: {this.state.genre.name}
                <br/><br/>
                <Button variant="contained" className={classes.button}
                    onClick={() => this.editGenre()}>
                    Edit
                </Button>

            </div>
        );
    }
}

export default withRouter(withStyles(styles)(GenreDetailScreen));