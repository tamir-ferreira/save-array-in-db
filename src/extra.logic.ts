import { Request, Response } from 'express';
import { QueryConfig } from 'pg';
import format from 'pg-format';
import { client } from './database';
import { Movie, MovieResult, TypesInputCategories } from './interfaces';

const createMovieExtra = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { categories, ...moviePayload } = request.body;
  const typeInputs: TypesInputCategories[] = [
    'Aventura',
    'Ação',
    'Comédia',
    'Drama',
    'Suspense',
    'Terror',
  ];
  const errors: string[] = [];

  categories.forEach((key: any): boolean => {
    if (!typeInputs.includes(key)) {
      errors.push(key);
      return false;
    }

    return true;
  });

  if (errors.length !== 0) {
    const message: string = `Invalid 'category' input: ${errors}`;
    return response.status(400).json({ message });
  }

  const queryTemplate: string = `
    INSERT INTO movie_extras (%I,categories)
    VALUES (%L, '{%s}')
    RETURNING *;
  `;

  const queryFormat: string = format(
    queryTemplate,
    Object.keys(moviePayload),
    Object.values(moviePayload),
    Object.values(categories)
  );

  const queryResult: MovieResult = await client.query(queryFormat);
  const movie: Movie = queryResult.rows[0];

  return response.status(201).json(movie);
};

const readMovieExtra = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { category } = request.params;

  const queryTemplate: string = `
    SELECT * FROM movie_extras
    WHERE $1 ILIKE ANY(categories);
  `;

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [category],
  };

  const queryResult: MovieResult = await client.query(queryConfig);
  const filteredMovies: Array<Movie> = queryResult.rows;

  if (filteredMovies.length === 0) {
    return response.status(404).json({ message: 'Category not found!' });
  }

  const result = {
    count: queryResult.rowCount,
    totalPrice: filteredMovies.reduce((a, b) => a + b.price, 0),
    filteredBy: category,
    data: filteredMovies,
  };

  return response.status(200).json(result);
};

export { createMovieExtra, readMovieExtra };
