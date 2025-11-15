"use client";

import type { FormValues, Note } from "@/types/note";
import type { RegisterLoginData, User } from "@/types/user";
import { nextServer, type NotesHttpResponse } from "./api";
import axios from "axios";

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


interface EditProfile {
  email: string;
  username: string;
}

export const updateMe = async (editUser: EditProfile): Promise<User> => {
  const { data } = await nextServer.patch<User>("/users/me", editUser);
  return data;
};

export async function getMe(): Promise<User | null> {
  const res = await axios.get("/api/users/me");
  return res.data ?? null;
}

export async function getSession(): Promise<{ success: boolean }> {
  const res = await axios.get("/api/auth/session");
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await axios.post("/api/auth/logout");
}

export const updateProfile = updateMe;