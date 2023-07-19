import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const [myData, setMyData] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    axios
      .get("https://www.omdbapi.com/?s=man&apikey=4a3b711b")
      .then((res) => setMyData(res.data.Search || []))
      .catch((error) =>
        console.log("~ file:App.js ~line 15 ~useEffect ~error", error)
      );
  }, [buttonClicked]);

  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  return (
    <Router>
      <div>
        <h1 className='my-heading'>MovieList</h1>
        <Routes>
          <Route path="/" element={<Home myData={myData} />} />
          {myData.map((post) => {
            const { imdbID } = post;
            return (
              <Route
                key={imdbID}
                path={`/movie/${imdbID}`}
                element={<MovieDetails imdbID={imdbID} myData={myData} />}
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

function Home({ myData }) {
  return (
    <div className="grid">
      {myData.map((post) => {
        const { Title, Year, imdbID, Type, Poster } = post;
        return (
          <div className="movie" key={imdbID}>
            <div id="m">
              <Link to={`/movie/${imdbID}`}>
                <img
                  src={Poster}
                  alt="Movie Poster"
                  className="movie-poster"
                />
              </Link>
              <h3>
                <p id="text">{Title}</p>
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MovieDetails({ imdbID, myData }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const movie = myData.find((movie) => movie.imdbID === imdbID);
    setSelectedMovie(movie);
  }, [imdbID, myData]);

  if (!selectedMovie) {
    return <div>Loading...</div>;
  }

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="selected-movie">
      <img src={selectedMovie.Poster} alt="Movie Poster" />
      <h2>Selected Movie: {selectedMovie.Title}</h2>
      <h3><p>Type: {selectedMovie.Type}</p></h3>
      <h3><p>Year: {selectedMovie.Year}</p></h3>
      <h3><p>Id: {selectedMovie.imdbID}</p></h3>
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
}

export default App;
