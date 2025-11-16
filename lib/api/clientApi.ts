"use client";

import type { FormValues, Note } from "@/types/note";
import type { RegisterLoginData, User } from "@/types/user";
import { nextServer, type NotesHttpResponse } from "./api";

export const fetchNotes = async (
  topic: string,
  page: number,
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const response = await nextServer.get<NotesHttpResponse>("/notes", {
    params: {
      search: topic,
      perPage: 12,
      tag,
      page,
    },
  });

  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: FormValues): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (
  registerData: RegisterLoginData
): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/register", registerData);
  return data;
};

export const login = async (loginData: RegisterLoginData): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/login", loginData);
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await nextServer.get<User | "">("/auth/session");

  if (res.data && typeof res.data === "object") {
    return res.data as User;
  }
  return null;
};

export const updateProfile = async (
  payload: Pick<User, "username">
): Promise<User> => {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
};

export async function getMe(): Promise<User | null> {
  try {
    const res = await nextServer.get<User | "">("/users/me");

    if (res.data && typeof res.data === "object") {
      return res.data as User;
    }

    return null;
  } catch {
    return null;
  }
}