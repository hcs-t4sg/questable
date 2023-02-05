export interface Task {
  id: string;
  name: string;
  description: string;
  reward: number;
  created: number;
  due: number;
  assigned: string[];
  completed: string[];
  confirmed: string[];
}

export interface Repeatable {
  id: string;
  name: string;
  description: string;
  reward: number;
  created: number;
  due: number;
  assigned: string[];
  maxCompletions: string;
}

export interface Classroom {
  id: string;
  name: string;
  playerList: string[];
  teacherList: string[];
}

export interface Player {
  id: string;
  name: string;
  role: string;
  money: number;
  avatar: number;
  ava_body?: number;
  ava_hair?: number;
  ava_shirt?: number;
  ava_pants?: number;
  ava_shoes?: number;
  ava_accessories?: number;
  ava_hair_subtype?: string;
}

export interface Item {
  id: number;
  name: string;
  type: string;
  subtype?: string;
  price: number;
}

export type UserRole = "student" | "teacher";
