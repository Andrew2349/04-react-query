import axios from "axios";
import type { Movie } from "../types/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;


interface FetchMoviesData{
  results: Movie[]
  total_pages: number
}

export async function fetchMovies(query:string, page:number):Promise<FetchMoviesData> {
    const response = await axios.get<FetchMoviesData>(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US`,{params: {
      query: query,
      page:page
  },
  headers: {
    Authorization: `Bearer ${myKey}`,
  }
    })
    return response.data
}