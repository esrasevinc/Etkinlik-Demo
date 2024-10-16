import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Login from "../features/login/Login";
import RequireAuth from "./RequireAuth";
import NotFound from "../layout/NotFound";
import MainContent from "../layout/MainContent";
import Activities from "../features/activities/Activities";
import ActivitiesEdit from "../features/activities/ActivitiesEdit";
import Users from "../features/users/Users";
import UsersEdit from "../features/users/UsersEdit";
import RequireAdmin from "./RequireAdmin";
import Categories from "../features/categories/Categories";
import CategoriesEdit from "../features/categories/CategoriesEdit";
import Places from "../features/places/Places";
import PlacesEdit from "../features/places/PlacesEdit";
import EventHalls from "../features/event-halls/EventHalls";
import EventHallsEdit from "../features/event-halls/EventHallsEdit";
import Design from "../features/event-hall-designs/Design";
import EventHallsDesign from "../features/event-hall-designs/EventHallsList";
import Tickets from "../features/tickets/Tickets";
import CreateTicket from "../features/tickets/CreateTicket";
import CreateReport from "../features/reports/CreateReport";


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
              { path: "salon-tasarimlari", element: <EventHallsDesign /> },
              { path: "salon-tasarimlari/tasarla", element: <Design /> },
              { path: "biletler", element: <Tickets /> },
              { path: "biletler/duzenle", element: <CreateTicket /> },
              { path: "bilet-olustur", element: <CreateTicket /> },
              { path: "rapor-olustur", element: <CreateReport /> },
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