import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MovieCalls from "../../apicalls/MovieCalls";
import Button from "@material-ui/core/Button";

const styles = theme => ({ //todo move to other file and import
});

class MovieDetailScreen extends Component {

    constructor(props){
        super(props);

        const {movieId} = this.props.location;
        if (movieId !== undefined)
            this.movieCalls.getMovieById(this, movieId);
        else
            this.props.history.push({
                pathname: "/editMovie"
            })
    }

    movieCalls = new MovieCalls();

    state = {
        movie: {id: -1, title: "", description: "", link: "", genres: []},
    };

    movieReturned() {
        if (this.state.movie === null) {
            //todo tell user that something went wrong, as the selected movie was not found
            this.props.history.push({
                pathname: "/movies"
            });
        }
    }

    editMovie() {
        if (this.state.movie.id > 0) {
            this.props.history.push({
                pathname: "/editMovie",
                movieId: this.state.movie.id
            })
        } else {
            //todo tell user to wait a bit so that the movie can load
        }
    }

    toGenreDetails(id){
        this.props.history.push({
            pathname: "/genre",
            genreId: id
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                Title: {this.state.movie.title}
                <br/><br/>
                Description: {this.state.movie.description}
                <br/><br/>
                Link: {this.state.movie.link}
                <br/><br/>
                Genres:
                <br/>
                <ul>
                {this.state.movie.genres.map(genre => {
                    return <li key={genre.id} onClick={() => this.toGenreDetails(genre.id)}>{genre.name}</li>
                })}
                </ul>

                <Button variant="contained" className={classes.button}
                    onClick={() => this.editMovie()}>
                    Edit
                </Button>

            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MovieDetailScreen));