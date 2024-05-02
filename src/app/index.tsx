import {withProviders} from "./providers";
import {AppRouter} from "./AppRouter.tsx";

const App = () => {
    return (
        <AppRouter/>
    )
}

export default withProviders(App)