import {Provider} from "react-redux";
import React from "react";
import {setupStore} from "../../shared/model/store.ts";

export const reduxProvider = (component: () => React.ReactNode) => () => (
    <Provider store={setupStore()}>
        {component()}
    </Provider>
)