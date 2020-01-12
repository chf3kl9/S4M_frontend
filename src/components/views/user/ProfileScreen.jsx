import React, {Component} from "react";
import UserCalls from "../../apicalls/UserCalls";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";


class ProfileScreen extends Component{

    userCalls = new UserCalls();

    constructor(props){
        super(props);
        const {email} = this.props.location;
        if (email !== undefined)
            this.userCalls.getUser(this, email);
        else if (this.props.isSignedIn){
            this.userCalls.getUser(this, this.props.email);
        } else {
            this.props.history.push({
                pathname: "/login"
            })
        }
    }

    state = {
        user: {id: -1, email: "", comments: [], ratings: [], watchedMovies: [], favorites: []}
    };

    toMovieDetails(id){
        this.props.history.push({
            pathname: "/movie",
            genreId: id
        })
    }

    render() {
        return (
            <div>
                <h1>Profile page of '{this.state.user.email}'</h1>
                <div className="row">
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>Favorite movies:</h2>
                        </div>
                        <ul className="list-group">
                            {this.state.user.favorites.map(movie => (
                                <li key={movie.id} className="list-group-item" onClick={() => this.toMovieDetails(movie.id)}>-{movie.title}/></li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>WatchList:</h2>
                        </div>
                        <ul className="list-group">
                            {this.state.user.watchedMovies.map(movie => (
                                <li key={movie.id} className="list-group-item" onClick={() => this.toMovieDetails(movie.id)}>-{movie.title}/></li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-5" style={{ margin: '0 auto' }}>
                        <div>
                            <h2>Rating:</h2>
                        </div>
                        <ul className="list-group">
                            {this.state.user.ratings.map(rating => (
                                <li key={rating.id} className="list-group-item" onClick={() => this.toMovieDetails(rating.ratedMovie.id)}>-{rating.ratedMovie.title}, {rating.value}/10/></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <h2>Comments:</h2>
                    <br/>
                    {this.state.user.comments.map(comment => {
                        return (
                            <Card className="card" onClick={() => this.toMovieDetails(comment.movie.id)}>
                                <CardHeader
                                    title={comment.movie.title}
                                    subheader={comment.date}
                                />
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

export default ProfileScreen;