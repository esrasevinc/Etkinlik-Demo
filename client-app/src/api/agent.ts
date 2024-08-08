import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { Category } from '../models/category';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.response.use(async response => {
    try {
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error)
    }
})

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
    delete: (id: string) => requests.del<void>(`/categories/${id}`),
  };

const agent = {
    Activities,
    Categories
}

export default agent;