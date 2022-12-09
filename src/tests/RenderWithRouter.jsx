import { ConnectedRouter, routerMiddleware, connectRouter } from "connected-react-router";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { watchRouter } from "../js/app/sagas";

export const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history, createReducer) => {
    const reducer = createReducer
        ? createReducer(state, history)
        : combineReducers({
              router: connectRouter(history)
          });
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducer, applyMiddleware(sagaMiddleware, routerMiddleware(history)));

    sagaMiddleware.run(watchRouter);

    return store;
};

export const renderWithRouter = (ui, state, history, createReducer) => {
    const wrappedUI = (
        <Provider store={createAppStore(state, history, createReducer)}>
            <ConnectedRouter history={history}> {ui} </ConnectedRouter>
        </Provider>
    );
    renderWithProviders(wrappedUI);
};
