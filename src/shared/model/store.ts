import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {HackerNewsApi} from "../api";
import {storyReducer} from "./slices";

const rootReducer = combineReducers({
    storyReducer,
    [HackerNewsApi.reducerPath]: HackerNewsApi.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(HackerNewsApi.middleware)
    });
};

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']