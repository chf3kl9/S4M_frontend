import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import ApiCommunication from "../../apicalls/ApiCommunication";

const styles = theme => ({
});

class GenreDetailScreen extends Component {

    constructor(props){
        super(props);

        if (this.props.isSignedIn){
        const {genreId} = this.props.location;
        if (genreId !== undefined)
            ApiCommunication.graphQLRequest("query", "genre", "id name movies{id title}", [
                {name: "id", type: "Int", value:genreId}
                ]).then(response => {this.setState({genre: response.data.data.genre}, this.genreReturned)});
        else
            this.props.history.push({
                pathname: "/editGenre"
            })
        } else {
            this.props.history.push("/login");
        }
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
                {this.props.isAdmin && (
                    <>
                        <Button variant="contained" className={classes.button}
                                onClick={() => this.editGenre()}>
                            Edit
                        </Button>
                        <br/><br/>
                    </>
                )}
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