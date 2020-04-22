import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http';
import ErrorModal from '../../components/UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (enteredFilter === inputRef.current.value) {
  //       const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
  //       fetch('https://react-hooks-794aa.firebaseio.com/ingredients.json' + query)
  //         .then(response => response.json())
  //         .then(responseData => {
  //           const loadedIngredients = [];
  //           for (const key in responseData) {
  //             loadedIngredients.push({
  //               id: key,
  //               title: responseData[key].title,
  //               amount: responseData[key].amount
  //             });
  //           }
  //           onLoadIngredients(loadedIngredients);
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //   }, 500);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [enteredFilter, onLoadIngredients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-794aa.firebaseio.com/ingredients.json' + query, 'GET');
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [isLoading, error, data, onLoadIngredients]);

  // when filter the database in firebase, you want to some roles in firebase database. open and put the code
  /* {
    "rules": {
      ".read": true,
        ".write": true,
          "ingredients": {
        ".indexOn": ["title"]
      }
    }
  } */

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
