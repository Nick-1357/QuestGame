import {configureStore, applyMiddleware, getDefaultMiddleware} from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import gameReducer from "./reducers";
import watchersSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({reducer: gameReducer, middleware: [sagaMiddleware]});

sagaMiddleware.run(watchersSaga);


export default store;