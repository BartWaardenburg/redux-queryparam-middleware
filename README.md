# redux-queryparam-middleware

Simple redux middleware which will store (part of) the payload of specified actions in the url and is able to retrieve an initial state from the url

## Installation

```bash
npm i -S redux-queryparam-middleware
```

## How to use?

### Use middleware

The middleware can be dropped into the redux middleware chain and will store the payload of one or more FSA complient actions in the url query parameters.

```js
  import {applyMiddleware, createStore, compose} from 'redux';
  import createQueryparamMiddleware from 'redux-queryparam-middleware';

  const queryparamMiddleware = createQueryparamMiddleware({
    /** The types of the actions to listen for can be used for multiple **/
    types: ['MAP_MOVED'],
    /** The values to pick from the payload to store in the url. It will default to the entire flattened payload when nothing is specified **/
    include: ['center', 'bounds'],
    /** The specified queryparam values will be removed from the url when an action named in types is fired **/
    omit: ['bounds'],
    /** The transformer is an object which will modify the values of included parts of the payload. **/
    transformer: {
      center: (center) => convertToLatLngString(center),
    }
  });

  let store = createStore(
    rootReducer, // The main reducer
    initialState, // The state to load and prefill the redux store with
    compose(
    applyMiddleware(
      // All middleware
      queryparamMiddleware
    )
  );
```

### Get initial state

Only using the middleware to store the state tree is not that usefull. That's why redux-queryparam-middleware also supports initialising the state from url parameters.

```js
  import {applyMiddleware, createStore, compose} from 'redux';
  import createQueryparamMiddleware, {getQueryparamState} from 'redux-queryparam-middleware';

  const queryparamMiddleware = createStorageMiddleware({
    types: ['MAP_MOVED'],
    include: ['center', 'zoom'],
    omit: ['bounds'],
    transformer: {
      center: (center) => convertToLatLngString(center),
    },
  });

  const initialState = getQueryparamState({
    /** The query params to read from the url and use as part of the initialState **/
    keys: ['center', 'zoom', 'bounds'],
    /** The transformer is an object which will modify the values of specific query  params **/
    transformer: {
      center: (center) => convertToLatLng(center),
      bounds: (bounds) => convertToBounds(bounds),
    },
    /** You need to specify a reducer to add the state to **/
    reducer: 'map',
    /** The state to apply the query params state to **/
    state: initialState,
  });

  let store = createStore(
    rootReducer, // The main reducer
    initialState, // The state to load and prefill the redux store with
    compose(
      applyMiddleware(
        // All middleware
        queryparamMiddleware
      )
    )
  );
```

## Reference

### createQueryparamMiddleware

This middleware for redux will store a slice of the redux state in queryparams

**Parameters**

-   `name`  The identifier to be used to retreive state from session storage
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
    -   `$0.types`   (optional, default `[]`)
    -   `$0.include`   (optional, default `[]`)
    -   `$0.omit`   (optional, default `[]`)
    -   `$0.transformer`   (optional, default `{}`)

Returns **** The final result when all reducers have been run

### getQueryparamState

This will get the current state information from the queryparams

**Parameters**

-   `keys`  The keys to read from the url
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
    -   `$0.keys`   (optional, default `[]`)
    -   `$0.transformer`   (optional, default `{}`)
    -   `$0.reducer`  
    -   `$0.state`  

Returns **** An object containing the needed information in the right format
