// src/utils/api.js
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/v1";

function getKey() {
  return localStorage.getItem("cg_api_key") || "";
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const key = getKey();
  if (key) headers["x-api-key"] = key;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  delete: (path)        => request("DELETE", path),

  // auth
  register: (name, email) => request("POST", "/auth/register", { name, email }),
  recover:  (email)       => request("POST", "/auth/recover",  { email }),
  revoke:   (email)       => request("POST", "/auth/revoke",   { email }),

  // sessions
  createSession:  (body)  => request("POST",   "/session/create", body),
  getSession:     (id)    => request("GET",    `/session/${id}`),
  deleteSession:  (id)    => request("DELETE", `/session/${id}`),

  // preferences
  submitPrefs: (id, body) => request("POST", `/session/${id}/preferences`, body),

  // consensus
  resolve: (id, options)  => request("POST", `/session/${id}/resolve`, { options }),
  getResult:(id)          => request("GET",  `/session/${id}/result`),
  quick:   (body)         => request("POST", "/quick", body),
};
