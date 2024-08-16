import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Login from "../features/login/Login";
import RequireAuth from "./RequireAuth";
import NotFound from "../layout/NotFound";
import MainContent from "../layout/MainContent";
import Activities from "../features/activities/Activities";
import ActivitiesEdit from "../features/activities/ActivitiesEdit";
import Categories from "../features/activities/categories/Categories";
import CategoriesEdit from "../features/activities/categories/CategoriesEdit";
import Places from "../features/activities/places/Places";
import PlacesEdit from "../features/activities/places/PlacesEdit";
import Users from "../features/users/Users";
import UsersEdit from "../features/users/UsersEdit";
import RequireAdmin from "./RequireAdmin";
import EventHalls from "../features/activities/event-halls/EventHalls";
import EventHallsEdit from "../features/activities/event-halls/EventHallsEdit";


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "",
            element: <MainContent />,
            children: [
              { path: "", element: <Activities /> },
              { path: "etkinlikler", element: <Activities /> },
              { path: "etkinlikler/duzenle", element: <ActivitiesEdit /> },
              { path: "etkinlikler/yeni-ekle", element: <ActivitiesEdit /> },
              { path: "etkinlik-turleri", element: <Categories /> },
              { path: "etkinlik-turleri/duzenle", element: <CategoriesEdit /> },
              { path: "etkinlik-turleri/yeni-ekle", element: <CategoriesEdit /> },
              { path: "gosteri-merkezleri", element: <Places /> },
              { path: "gosteri-merkezleri/duzenle", element: <PlacesEdit /> },
              { path: "gosteri-merkezleri/yeni-ekle", element: <PlacesEdit /> },
              { path: "salonlar", element: <EventHalls /> },
              { path: "salonlar/duzenle", element: <EventHallsEdit /> },
              { path: "salonlar/yeni-ekle", element: <EventHallsEdit /> },
              { path: "kullanicilar", element: <RequireAdmin> <Users /> </RequireAdmin> },
              { path: "kullanicilar/yeni-ekle", element: <RequireAdmin> <UsersEdit /> </RequireAdmin> },
              { path: "kullanicilar/duzenle", element: <RequireAdmin> <UsersEdit /> </RequireAdmin> }
            ],
          },
        ],
      },
      { path: "not-found", element: <NotFound /> },
      { path: "/giris", element: <Login /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);