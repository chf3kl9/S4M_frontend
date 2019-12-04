import axios from "axios";

class MovieCalls {

    endpoint = "http://localhost:8090";
    //endpoint = "https://s4m-backend.herokuapp.com";

    getAllMovies(screen) {
        let call = "/movies";
        axios
            .get(this.endpoint + call)
            .then( response => {
                console.log("Yay, success!");
                console.log(response.data);
                screen.setState({movies: response.data});
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    getMovieById(screen, id) {
        let call = "/movies/"+id;
        axios
            .get(this.endpoint + call)
            .then( response => {
                screen.setState({movie: response.data}, () => screen.movieReturned());
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    createMovie(screen, movie) {
        let call = "/movies";
        console.log(movie);
        axios
            .post(this.endpoint + call, movie)
            .then(response => {
                screen.props.history.push({
                    pathname: "/movies"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    updateMovie(screen, movie) {
        let call = "/movies";
        console.log(movie);
        axios
            .put(this.endpoint + call, movie)
            .then(response => {
                screen.props.history.push({
                    pathname: "/movies"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    deleteMovieById(screen, id) {
        let call = "/movies/" + id;
        axios
            .delete(this.endpoint + call)
            .then(response => {
                screen.props.history.push({
                    pathname: "/movies"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }
}

export default MovieCalls;