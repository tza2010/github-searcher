import { Provider } from "react-redux";
import "./App.css";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import Routes from "./Routes";
import GlobalStyles from "./GlobalStyles";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalStyles />
        <Routes />
      </PersistGate>
    </Provider>
  );
}

export default App;
