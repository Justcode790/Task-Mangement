import { StrictMode } from 'react'
import ReactDOM,{ createRoot } from 'react-dom/client'
import App from './App'
import { UserProvider } from "./context/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
  </UserProvider>
);