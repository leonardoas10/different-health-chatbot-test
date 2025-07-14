import { AuthService } from './Auth.service';

const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

const get = async (url: string) => {
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return response.json();
};

const post = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
};

const put = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return response.json();
};

const _delete = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return response.json();
};

export const HttpService = {
  get,
  post,
  put,
  delete: _delete,
};