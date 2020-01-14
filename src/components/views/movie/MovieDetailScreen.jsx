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

const styles = theme => ({ //todo move to other file and import
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

        const {movieId} = this.props.location;
        if (movieId !== undefined)
            this.getMovie(movieId);
        else
            this.props.history.push({
                pathname: "/editMovie"
            })
    }

    state = {
        movie: {id: -1, title: "", description: "", link: "", genres: [], comments:[], ratings:[]},
        rating: {totalRating: 0, ratingCount: 0},
        comment: "",
    };

    movieReturned() {
        if (this.state.movie === null) {
            this.props.history.push({
                pathname: "/movies"
            });
        } else {
            let totalRating = 0.0;
            let count = 0;
            this.state.movie.ratings.forEach(rating => {
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

    getMovie(id){
        ApiCommunication.graphQLRequest("query", "movie",
            "id title description link imageURL genres{id name} ratings{value} comments{id user{email} text}", [
            {name: "id", type: "Int", value: id}
        ]).then(response => {this.setState({movie: response.data.data.movie}, () => this.movieReturned())});
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

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
            genreId: email
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