import axios from "axios";

class MovieCalls {
    endpoint = "localhost:8094";

    getAllMovies(screen) {
        let call = "/movies";
        axios
            .get(this.endpoint + call)
            .then( response => {
                screen.setState({movies: response.data});
                console.log("Yay, success!");
                console.log(response.data);
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    getMovieById(screen, id) {
        let call = "/movies/"+id;
        axios
            .get(this.endpoint + call)
            .then( response => {
                screen.setState({movie: response.data});
                console.log("Yay, success!");
                console.log(response.data);
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    createMovie(screen, movie) {
        let call = "/movies";
        axios
            .post(this.endpoint + call, movie)
            .then(response => {
                //todo transition to all movies
                console.log("Yay, success!");
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    updateMovie(screen, movie) {
        let call = "/movies";
        axios
            .put(this.endpoint + call, movie)
            .then(response => {
                //todo transition to all movies
                console.log("Yay, success!");
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    deleteMovieById(screen, id) {
        let call = "movies/" + id;
        axios
            .delete(this.endpoint + call)
            .then(response => {
                //todo transition to all movies
                console.log("Yay, success!");
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }
}

export default MovieCalls;