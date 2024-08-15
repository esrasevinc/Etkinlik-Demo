import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";
import { store, StoreContext } from "./stores/store";
import { router } from "./routes/Routes";
import { AuthProvider } from "./components/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
  </AuthProvider>
);