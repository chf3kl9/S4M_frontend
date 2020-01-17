import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import ApiCommunication from "../../apicalls/ApiCommunication";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = theme => ({
    img: {
        display: 'block',
        maxWidth: '25%',
        maxHeight: '25%',
    },
    card: {
        maxWidth: '300'
    }
});

class MovieDetailScreen extends Component {

    constructor(props){
        super(props);

        if (this.props.isSignedIn) {
            const {movieId} = this.props.location;
            if (movieId !== undefined)
                this.getMovie(movieId);
            else
                this.props.history.push({
                    pathname: "/editMovie"
                })
        } else {
            this.props.history.push("/login");
        }
    }

    state = {
        movie: {id: -1, title: "", description: "", link: "", genres: [], comments:[], ratings:[]},
        rating: {totalRating: 0, ratingCount: 0},
        comment: "",
        inFavorites: false,
        inWatchList: false,
        userRating: 0
    };

    movieReturned() {
        if (this.state.movie === null) {
            this.props.history.push({
                pathname: "/movies"
            });
        } else {
            let totalRating = 0;
            let count = 0;
            this.state.movie.ratings.forEach(rating => {
                totalRating += rating.value;
                count++;
                });
            if (count > 0)
                totalRating = (totalRating / count);

            this.setState({rating: {totalRating: totalRating, ratingCount: count}});
        }
    }

    editMovie() {
        if (this.state.movie.id > 0) {
            this.props.history.push({
                pathname: "/editMovie",
                movieId: this.state.movie.id
            })
        }
    }

    getMovie(id){
        ApiCommunication.graphQLRequest("query", "movie",
            "id title description link imageURL genres{id name} ratings{value user{email}} comments{id user{email} text}", [
            {name: "id", type: "Int", value: id}
        ]).then(response => {
            let index = response.data.data.movie.ratings.findIndex(r => r.user.email === this.props.email);
            let userRating = 0;
            if (index > -1)
                userRating = response.data.data.movie.ratings[index].value;
            this.setState({movie: response.data.data.movie, userRating: userRating}, () => this.movieReturned())
        });
        ApiCommunication.graphQLRequest("query", "user",
            "favorites{id} watchedMovies{id}", [
                {name: "email", type: "String", value: this.props.email}]
        ).then(response => {
            this.setState({
                inFavorites: response.data.data.user.favorites.find(f => f.id === id) !== undefined,
                inWatchList: response.data.data.user.watchedMovies.find(m => m.id === id) !== undefined
            });
        });
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleBoolChange = name => event => {
        let call = "";
        let bool = event.target.checked;
        if (name === "inFavorites") {
            if (!bool) {
                call = "removeMovieFromFavorites";
            } else {
                call = "addMovieToFavorites";
            }
        } else if (name === "inWatchList") {
            if(!bool) {
                call = "removeMovieFromWatchlist";
            } else {
                call = "addMovieToWatchlist";
            }
        }
        ApiCommunication.graphQLRequest("mutation", call, null, [
            {name: "email", type: "String", value: this.props.email},
            {name: "movieId", type: "Int", value: this.state.movie.id}
        ]).then(() => {
            this.setState({[name]: bool})
        });
    };

    handleRatingChange(newValue) {
        ApiCommunication.graphQLRequest("mutation", "rateMovie", null, [
            {name: "email", type: "String", value: this.props.email},
            {name: "movieId", type: "Int", value: this.state.movie.id},
            {name: "rating", type:"Int", value: newValue}
        ]).then(() =>{
            this.getMovie(this.state.movie.id);
        });
    }

    placeComment(){
        ApiCommunication.graphQLRequest("mutation", "placeComment", null, [
            {name: "email", type: "String", value: this.props.email},
            {name: "movieId", type: "Int", value: this.state.movie.id},
            {name: "text", type: "String", value: this.state.comment}
        ]).then(() => {this.getMovie(this.state.movie.id)});
    }

    toGenreDetails(id){
        this.props.history.push({
            pathname: "/genre",
            genreId: id
        })
    }

    toProfile(email){
        this.props.history.push({
            pathname: "/profile",
            email: email
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button variant="contained" className={classes.button}
                        onClick={() => this.editMovie()}>
                    Edit
                </Button>
                <img className={classes.img} alt="complex" src={this.state.movie.imageURL} />
                <br/><br/>
                Title: {this.state.movie.title}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.inFavorites}
                            onChange={this.handleBoolChange("inFavorites")}
                            value="inFavorites"
                            color="primary"
                        />
                    }
                    label="In Favorites"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.inWatchList}
                            onChange={this.handleBoolChange("inWatchList")}
                            value="inWatchList"
                            color="primary"
                        />
                    }
                    label="In Watchlist"
                />
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
                <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Your rating</Typography>
                    <Rating
                        onChange={(event, newValue) => this.handleRatingChange(newValue)}
                        name="simple-controlled"
                        value={this.state.userRating}
                        max={10}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    />
                </Box>

                <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Movie Rating by {this.state.rating.ratingCount} users:</Typography>
                    <Rating name="read-only" value={this.state.rating.totalRating} max={10} readOnly />
                </Box>
                Comments:
                <br/>
                    {this.state.movie.comments.map(comment => {
                        return (
                            <Card key={comment.id} style={{maxWidth:'25%', marginTop: 10}} onClick={() => this.toProfile(comment.user.email)}>
                                <CardHeader
                                    title={comment.user.email}
                                    subtitle={comment.date}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {comment.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                            )})}
                <br/>
                <TextField
                    id="standard-multiline-flexible"
                    name="comment"
                    label="Write comment"
                    multiline
                    rows="6"
                    value={this.state.comment}
                    onChange={this.handleChange}
                    className={classes.multiTextField}
                    margin="normal"
                />
                <br/>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.placeComment()} >
                    Place comment
                </Button>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MovieDetailScreen));