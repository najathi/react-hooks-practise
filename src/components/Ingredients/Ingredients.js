import React, {
  // useState,
  useEffect,
  useCallback,
  useReducer
} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

// useReducer - alternative to useState
const ingredientReducer = (currentIngredients, action) => {
  // ingredient currently store by react
  // action will be coming important for update state. (action is a updating things)

  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }

}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null, loading: false };
    default:
      throw new Error('should not be reached!')
  }
}

const Ingredients = props => {

  /* In Redux section we have already discuss about that reducer that function that take some inputs and turns some output in the end. Whilst the concept of reducer function is similar, useReducer() has absolutely Bo Connection to the Redux library. */

  // When working with useReducer(), React will re-render the component whenever your reducer the new state.

  // utilize the useReducer
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  console.log('httpState: ', httpState);

  //  using useState
  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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
      .catch(error=>{
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

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients })
    // }, [setUserIngredients]);
  }, []);

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-794aa.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(
        response => {
          // setIsLoading(false);
          dispatchHttp({ type: 'RESPONSE' });
          return response.json();
        })
      .then(responseData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        // console.log('responseData.name', responseData.name);
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } });
      })
      .catch(error => {
        // setIsLoading(false);
        // console.log(error);
        // setError(error.message);
        dispatchHttp({ type: 'ERROR', errorMessage: error.message });
      });
  }

  const removeIngredientHandler = ingredientId => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-794aa.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
        dispatch({ type: 'DELETE', id: ingredientId })
      })
      .catch(error => {
        // setIsLoading(false);
        // console.log(error);
        // setError(error.message);
        dispatchHttp({ type: 'ERROR', errorDate: error.message });
      });
  }

  const clearError = () => {
    // setError(null);
    // setIsLoading(false);
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
