import React, {Component} from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ApiCommunication from "../../apicalls/ApiCommunication";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    link: {
        display: "block",
        padding: 1,
        color: "blue",
        marginLeft:20,
        cursor:"pointer",
    },
    comment:{
        cursor:"pointer",
    }
});

class ProfileScreen extends Component{

    constructor(props){
        super(props);
        this.getUser();
    }

    state = {
        user: {id: -1, email: "", comments: [], ratings: [], watchedMovies: [], favorites: []}
    };

    getUser(){
        const {email} = this.props.location;
        if (this.props.isSignedIn && email !== undefined)
            ApiCommunication.graphQLRequest("query", "user",
                "id email comments {id text movie {id title}} ratings {id value ratedMovie {id title}} watchedMovies{id title} favorites{id title}",[
                    {name: "email", type: "String", value: email}
                ])
                .then(response => {this.setState({user: response.data.data.user})});
        else if (this.props.isSignedIn){
            ApiCommunication.graphQLRequest("query", "user",
                "id email comments {id text movie {id title}} ratings {id value ratedMovie {id title}} watchedMovies{id title} favorites{id title}",[
                    {name: "email", type: "String", value: this.props.email}
                ])
                .then(response => {this.setState({user: response.data.data.user})});
        } else {
            this.props.history.push({
                pathname: "/login"
            })
        }
    }

    toMovieDetails(id){
        this.props.history.push({
            pathname: "/movie",
            movieId: id
        })
    }

    deleteComment(id){
        ApiCommunication.graphQLRequest("mutation", "deleteCommentById", null, [
            {name:"id", type:"Int", value:id},
            {name:"email", type:"String", value:this.props.email},
        ]).then(response => {
            console.log(response);
            this.getUser();
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <h1>Profile page of '{this.state.user.email}'</h1>
                <div className="row">
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>Favorite movies:</h2>
                        </div>
                        <ul className={classes.link}>
                            {this.state.user.favorites.map(movie => (
                                <li key={movie.id} onClick={() => this.toMovieDetails(movie.id)}>{movie.title}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>WatchList:</h2>
                        </div>
                        <ul className={classes.link}>
                            {this.state.user.watchedMovies.map(movie => (
                                <li key={movie.id} onClick={() => this.toMovieDetails(movie.id)}>{movie.title}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>Rating:</h2>
                        </div>
                        <ul className={classes.link}>
                            {this.state.user.ratings.map(rating => (
                                <Box key={rating.id} component="fieldset" mb={3} borderColor="transparent"
                                     onClick={() => this.toMovieDetails(rating.ratedMovie.id)}>
                                    <Typography component="legend">{rating.ratedMovie.title}</Typography>
                                    <Rating name="read-only" value={rating.value} max={10} readOnly />
                                </Box>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <h2>Comments:</h2>
                    {this.state.user.comments.map(comment => {
                        return (
                            <Card key={comment.id} className="card" style={{maxWidth:'25%', marginTop: 10, cursor:"pointer"}}>
                                {(this.props.isAdmin || this.state.user.email === this.props.email) ? (
                                    <CardHeader
                                        title={
                                            <div onClick={() => this.toMovieDetails(comment.movie.id)}>{comment.movie.title}</div>
                                        }
                                        subheader={comment.date}
                                        action={
                                            <IconButton onClick={() => this.deleteComment(comment.id)}>
                                                <DeleteTwoToneIcon />
                                            </IconButton>
                                        }
                                    />
                                ) : (
                                    <CardHeader
                                        title={
                                            <div onClick={() => this.toMovieDetails(comment.movie.id)}>{comment.movie.title}</div>
                                        }
                                        subheader={comment.date}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {comment.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )})}
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(ProfileScreen));