import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { Category } from '../models/category';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { router } from '../routes/Routes';
import { message } from 'antd';
import { Place } from '../models/place';
import { EventHall } from '../models/eventHall';
import { Ticket } from '../models/ticket';
import { Customer } from '../models/customer';
import { TicketSeat } from '../models/ticketSeat';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// const sleep = (delay: number) => {
//   return new Promise((resolve) => {
//       setTimeout(resolve, delay);
//   })
// }

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    //await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config, headers } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (config.method === "get" && Object.prototype.hasOwnProperty.call(data.errors, "id")) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          message.error(data);
        }
        break;
      case 401:
        if (
          status === 401 &&
          headers["www-authenticate"]?.startsWith('Bearer error="invalid_token')
        ) {
          // store.userStore.logout();
          message.error("Oturumun süresi doldu - tekrar giriş yapın.");
        }
        break;
      case 403:
        message.error("Yasaklı");
        break;
      case 404:
        router.navigate("/not-found");
        break;
    //   case 500:
    //     store.commonStore.setServerError(data);
    //     router.navigate("/server-error");
    //     break;
    }
    return Promise.reject(error);
  }
);

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>(`/activities`),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>(`/activities`, activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const Categories = {
    list: () => requests.get<Category[]>("/categories"),
    details: (id: string) => requests.get<Category>(`/categories/${id}`),
    create: (category: Category) => requests.post<Category>("/categories", category),
    update: (category: Category) => requests.put<void>(`/categories/${category.id}`, category),
    delete: (id: string) => requests.del<void>(`/categories/${id}`)
}

const Places = {
  list: () => requests.get<Place[]>("/places"),
  details: (id: string) => requests.get<Place>(`/places/${id}`),
  create: (place: Place) => requests.post<Place>("/places", place),
  update: (place: Place) => requests.put<void>(`/places/${place.id}`, place),
  delete: (id: string) => requests.del<void>(`/places/${id}`)
}

const EventHalls = {
  list: () => requests.get<EventHall[]>("/eventhalls"),
  details: (id: string) => requests.get<EventHall>(`/eventhalls/${id}`),
  create: (eventHall: EventHall) => requests.post<EventHall>("/eventhalls", eventHall),
  update: (eventHall: EventHall) => requests.put<void>(`/eventhalls/${eventHall.id}`, eventHall),
  delete: (id: string) => requests.del<void>(`/eventhalls/${id}`),
  listByPlaceId: (placeId: string) => requests.get<EventHall[]>(`/eventhalls/by-place/${placeId}`)
}

const Account = {
    current: () => requests.get<User>("/account"),
    login: (user: UserFormValues) => requests.post<User>("/account/login", user),
    refreshToken: () => requests.post<User>("/account/refreshToken", {}),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
  };

const Users = {
    list: () => requests.get<User[]>("/users"),
    details: (id: string) => requests.get<User>(`/users/${id}`),
    update: (user: User) => requests.put<void>(`/users/${user.id}`, user),
    delete: (id: string) => requests.del<void>(`/users/${id}`)
  }

  const Tickets = {
    listByActivity: (activityId: string) => requests.get<Ticket[]>(`/tickets?activityId=${activityId}`),
    listAll: () => requests.get<Ticket[]>(`/tickets/all`),
    details: (id: string) => requests.get<Ticket>(`/tickets/${id}`),
    buyTicket: (ticket: Ticket) => requests.post<Ticket>('/tickets', ticket),
    update: (ticket: Ticket) => requests.put<void>(`/tickets/${ticket.id}`, ticket),
    delete: (id: string) => requests.del<void>(`/tickets/${id}`)
  }

  const Customers = {
    create: (customer: Customer) => requests.post<Customer>('/customers', customer)
  }

  const TicketSeats = {
    create: (ticketSeat: TicketSeat) => requests.post<TicketSeat>('/ticketseats', ticketSeat),
    listByActivityId: (activityId: string) => requests.get<TicketSeat[]>(`/ticketseats/activity/${activityId}`),
    update: (ticketSeat: TicketSeat) => requests.put<void>(`/ticketseats/${ticketSeat.id}`, ticketSeat),
  }


const agent = {
    Activities,
    Categories,
    Places,
    EventHalls,
    Account,
    Users,
    Tickets,
    Customers,
    TicketSeats
}

export default agent;