import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import ApiCommunication from "../../apicalls/ApiCommunication";

const styles = theme => ({ //todo move to other file and import
});

class GenreDetailScreen extends Component {

    constructor(props){
        super(props);

        const {genreId} = this.props.location;
        if (genreId !== undefined)
            ApiCommunication.graphQLRequest("query", "genre", "id name movies{id title}", [
                {name: "id", type: "Int", value:genreId}
                ]).then(response => {this.setState({genre: response.data.data.genre}, this.genreReturned)});
        else
            this.props.history.push({
                pathname: "/editGenre"
            })
    }

    state = {
        genre: {id: -1, name: "", movies: []},
    };

    genreReturned() {
        if (this.state.genre === null) {
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

    toMovieDetails(id){
        this.props.history.push({
            pathname: "/movie",
            movieId: id
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button variant="contained" className={classes.button}
                        onClick={() => this.editGenre()}>
                    Edit
                </Button>
                Name: {this.state.genre.name}
                <br/><br/>
                Movies with this genre:
                <br/>
                <div className="list-group">
                    {this.state.genre.movies.map(movie => {
                        return <div className="list-group-item" key={movie.id} onClick={() => this.toMovieDetails(movie.id)}>{movie.title}</div>
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(GenreDetailScreen));