import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Activities from "../features/activities/Activities";
import ActivitiesEdit from "../features/activities/ActivitiesAdd";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {},
      { path: "etkinlikler", element: <Activities /> },
      { path: "etkinlikler/yeni-ekle", element: <ActivitiesEdit /> },

    ],
  },
];

export const router = createBrowserRouter(routes);