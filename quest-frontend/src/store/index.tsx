import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import gameReducer from "./reducers";
import watcherSagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({reducer: gameReducer, middleware: [sagaMiddleware]});

sagaMiddleware.run(watcherSagas);


export default store;