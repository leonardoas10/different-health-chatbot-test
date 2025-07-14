//TODO:::

const get = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const post = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response.json();
};

const put = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return response.json();
};

const _delete = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE",
  });
  return response.json();
};

export const HttpService = {
  get,
  post,
  put,
  delete: _delete,
};
