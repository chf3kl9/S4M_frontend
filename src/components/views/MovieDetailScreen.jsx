import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MovieCalls from "../MovieCalls";

const styles = theme => ({ //todo move to other file and import
});

class MovieDetailScreen extends Component {

    constructor(props){
        super(props);

        const {movieId} = this.props.location;
        if (movieId !== undefined)
            this.movieCalls.getMovieById(this, movieId);
    }

    movieCalls = new MovieCalls();

    state = {
        movie: {id: -1, title: "", description: "", link: ""},
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    movieReturned() {
        if (this.state.movie === null) {
            this.props.history.push({
                pathname: "/movies"
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                Id: {this.state.movie.id}
                <br/><br/>
                Title: {this.state.movie.title}
                <br/><br/>
                Description: {this.state.movie.description}
                <br/><br/>
                Link: {this.state.movie.link}
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MovieDetailScreen));