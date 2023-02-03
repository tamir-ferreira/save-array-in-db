import { QueryResult } from "pg";

interface IMovieRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
  discount?: number | undefined;
  stock?: number | undefined;
}

interface IMovie extends IMovieRequest {
  id: number;
}

type MovieResult = QueryResult<IMovieRequest>;
type Movie = Omit<IMovie, "id">;

type TypesInputCategories =
  | "Drama"
  | "Suspense"
  | "Terror"
  | "Comédia"
  | "Ação"
  | "Aventura";

export { Movie, MovieResult, TypesInputCategories };
