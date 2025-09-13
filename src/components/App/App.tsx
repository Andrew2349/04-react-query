import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie'
import { fetchMovies } from '../../services/movieService'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import css from "./App.module.css"


function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [query, setQuery] = useState<string>("");
  const[currentPage, setCurrentPage] = useState(1);



  function handleSelectMovie(movie:Movie) {
    setSelectedMovie(movie)
  }

  async function handleSearch(query:string) {
    setQuery(query)
    setCurrentPage(1)
  }

  

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.length > 0
  })
  useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error("No movies found for your request.");
    return
  }
  }, [data]);
  const { results: movies = [], total_pages: totalPages = 0 } = data ?? {};


  return (
    <>
      <SearchBar onSubmit={handleSearch}></SearchBar>
      {isLoading && <Loader></Loader>}
      {isError&&<ErrorMessage></ErrorMessage>}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleSelectMovie}></MovieGrid>}
      { data && <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />}
      {selectedMovie&&<MovieModal movie={selectedMovie} onClose={()=>setSelectedMovie(null)}></MovieModal>}
      <Toaster></Toaster>
    </>
  )
}

export default App
