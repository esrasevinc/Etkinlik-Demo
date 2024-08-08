import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Activities from "../features/activities/Activities";
import ActivitiesEdit from "../features/activities/ActivitiesEdit";
import NotFound from "../layout/NotFound";
import CategoriesEdit from "../features/activities/categories/CategoriesEdit";
import Categories from "../features/activities/categories/Categories";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      //{ path: "", element: <Activities /> },
      { path: "etkinlikler", element: <Activities /> },
      { path: "etkinlikler/yeni-ekle", element: <ActivitiesEdit /> },
      { path: "etkinlikler/duzenle", element: <ActivitiesEdit /> },
      { path: "etkinlik-turleri", element: <Categories /> },
      { path: "etkinlik-turleri/yeni-ekle", element: <CategoriesEdit /> },
      { path: "etkinlik-turleri/duzenle", element: <CategoriesEdit /> },
      { path: "not-found", element: <NotFound /> },
      //{ path: "*", element: <Navigate replace to='/not-found' /> },
    ]
  },
];

export const router = createBrowserRouter(routes);