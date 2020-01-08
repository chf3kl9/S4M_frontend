import axios from "axios";

class GenreCalls {

    endpoint = "http://localhost:8090";
    //endpoint = "https://s4m-backend.herokuapp.com";

    getAllGenres(screen) {
        let call = "/genres";
        axios
            .get(this.endpoint + call)
            .then( response => {
                screen.setState({genres: response.data});
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    getGenreById(screen, id) {
        let call = "/genres/"+id;
        axios
            .get(this.endpoint + call)
            .then( response => {
                screen.setState({genre: response.data}, () => screen.genreReturned());
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    createGenre(screen, genre) {
        let call = "/genres";
        axios
            .post(this.endpoint + call, genre)
            .then(response => {
                screen.props.history.push({
                    pathname: "/genres"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    updateGenre(screen, genre) {
        let call = "/genres";
        axios
            .put(this.endpoint + call, genre)
            .then(response => {
                screen.props.history.push({
                    pathname: "/genres"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }

    deleteGenreById(screen, id) {
        let call = "/genres/" + id;
        axios
            .delete(this.endpoint + call)
            .then(response => {
                screen.props.history.push({
                    pathname: "/genres"
                });
            })
            .catch(error => {console.log(error); console.log(error.response)});
    }
}

export default GenreCalls;