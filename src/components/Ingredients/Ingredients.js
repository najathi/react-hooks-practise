import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = props => {

  const [userIngredients, setUserIngredients] = useState([]);

  /* useEffect(() => {
    fetch('https://react-hooks-794aa.firebaseio.com/ingredients.json')
      .then(
        response => {
          return response.json();
        })
      .then(responseData => {
        console.log(responseData);
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []); */

  // when we use the useEffect...
  // 1. if you did not put  or omit the any dependency array it will run every render cycle. it works like componentDidUpdate(). 
  // 2. if you put an empty array like [] this, it runs inly once (after the first render). it works like componentDidMount().abs
  // 3. if you put any dependencies  like [something1, something2]. it works like  shouldComponentUpdate().

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-794aa.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(
        response => {
          return response.json();
        })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, [setUserIngredients]);

  const removeIngredientHandler = id => {
    const filterArray = userIngredients.filter(ingredient => ingredient.id !== id);
    setUserIngredients(filterArray);
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => { }} />
      </section>
    </div>
  );
}

export default Ingredients;
