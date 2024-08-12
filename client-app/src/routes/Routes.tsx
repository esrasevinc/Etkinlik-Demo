import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Login from "../features/login/Login";
import NotFound from "../layout/NotFound";
import MainContent from "../layout/MainContent";
import Activities from "../features/activities/Activities";
import ActivitiesEdit from "../features/activities/ActivitiesEdit";
import Categories from "../features/activities/categories/Categories";
import CategoriesEdit from "../features/activities/categories/CategoriesEdit";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
       
            path: "",
            element: <MainContent />,
            children: [
              { path: "", element: <Activities /> },
              { path: "etkinlikler", element: <Activities /> },
              { path: "etkinlikler/duzenle", element: <ActivitiesEdit /> },
              { path: "etkinlikler/yeni-ekle", element: <ActivitiesEdit /> },
              {
                path: "etkinlik-turleri",
                element: <Categories />,
              },
              { path: "etkinlik-turleri/duzenle", element: <CategoriesEdit /> },
              { path: "etkinlik-turleri/yeni-ekle", element: <CategoriesEdit /> },
            ],
      },
      { path: "not-found", element: <NotFound /> },
      { path: "/giris", element: <Login /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
