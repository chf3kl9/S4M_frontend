import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MovieCalls from "../../apicalls/MovieCalls";
import Button from "@material-ui/core/Button";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";

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
        movie: {id: -1, title: "", description: "", link: "", genres: [], comments:[], ratings:[]},
        rating: {totalRating: 0, ratingCount: 0}
    };

    movieReturned() {
        if (this.state.movie === null) {
            //todo tell user that something went wrong, as the selected movie was not found
            this.props.history.push({
                pathname: "/movies"
            });
        } else {
            let totalRating = 0.0;
            let count = 0;
            this.state.movie.ratings.map(rating => {
                totalRating += rating.value;
                count++;
                });
            this.setState({rating: {totalRating: totalRating / count, ratingCount: count}});
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
                <br/><br/>
                Rating: {this.state.rating.totalRating}/10 (by {this.state.rating.ratingCount} users)]
                <br/><br/>
                Comments:
                <br/>
                    {this.state.movie.comments.map(comment => {
                        return (
                            <Card className={classes.card}>
                                <CardHeader
                                    title={"comment.user.email"}
                                    subheader={"comment.date"}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {"comment.text"}
                                    </Typography>
                                </CardContent>
                            </Card>
                            )})}
                <Button variant="contained" className={classes.button}
                    onClick={() => this.editMovie()}>
                    Edit
                </Button>

            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MovieDetailScreen));