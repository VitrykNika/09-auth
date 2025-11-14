import axios from "axios";
import type { Note } from "../../types/note";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}
export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});

export interface CheckSession {
  success: boolean;
}