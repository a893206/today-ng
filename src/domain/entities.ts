import { generateUUID } from '../utils/uuid';

export class Todo {
  id: string;
  title: string;
  createdAt: number | undefined;
  listUUID: string | undefined;
  desc: string | undefined;
  completedFlag: boolean;
  completedAt: number | undefined;
  dueAt: number | undefined;
  planAt: number | undefined;
  notifyMe = false;

  constructor(title: string, listUUID?: string) {
    this.id = generateUUID();
    this.title = title;
    this.listUUID = listUUID || undefined;
    this.completedFlag = false;
  }
}

export class List {
  id: string;
  title: string;
  createdAt: number | undefined;

  constructor(title: string) {
    this.id = generateUUID();
    this.title = title;
  }
}
