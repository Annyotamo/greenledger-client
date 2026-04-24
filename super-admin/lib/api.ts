import axios from "axios";
import { buildUrl } from "@greenledger/shared";

export const api = axios.create({
  timeout: 30_000,
});

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return buildUrl(normalized);
}

