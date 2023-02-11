import { Timestamp } from "firebase/firestore";

interface Assignment {
  id: string;
  name: string;
  description: string;
  reward: number;
  created: number;
  due: number;
  assigned: string[];
}

export interface Task extends Assignment {
  completed: string[];
  confirmed: string[];
}

export interface TaskWithStatus extends Task {
  status: string;
}

export interface TaskCompletionTime {
  id: string;
  time: Timestamp;
}

export interface TaskWithCompletionTimes extends Task {
  completionTimes: TaskCompletionTime[];
}

export interface Repeatable extends Assignment {
  maxCompletions: string;
}

export interface RepeatablePlayerCompletions {
  id: string;
  completions: number;
}

export interface RepeatableWithPlayerCompletions extends Repeatable {
  playerCompletions: RepeatablePlayerCompletions[];
}

// export interface RepeatableCompletion

export interface Classroom {
  id: string;
  name: string;
  playerList: string[];
  teacherList: string[];
}

export interface Player {
  id: string;
  name: string;
  role: UserRole;
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

export interface DatabaseInventoryItem {
  item_id: number;
  type: "body" | "hair" | "shirt" | "pants" | "shoes";
  subtype?: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  type: "body" | "hair" | "shirt" | "pants" | "shoes";
  subtype?: string;
  price: number;
  renderStatic: () => JSX.Element;
  renderAnimated: () => JSX.Element;
}

export interface Outfit {
  body: Item;
  hair: Item;
  shirt: Item;
  pants: Item;
  shoes: Item;
}

export type UserRole = "student" | "teacher";

export interface PlayerWithEmail extends Player {
  email: string;
}
