import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { List } from '../../../domain/entities';
import { LISTS } from '../local-storage/local-storage.namespace';

type SpecialListUUID = 'today' | 'todo';

@Injectable()
export class ListService {

  private current: List | undefined;
  private lists: List[] = [];

  currentUuid: SpecialListUUID | string = 'today';
  currentUuid$ = new Subject<string>();
  current$ = new Subject<List>();
  lists$ = new Subject<List[]>();

  constructor(
    private store: LocalStorageService
  ) { }

  private broadCast(): void {
    this.lists$.next(this.lists);
    this.current$.next(this.current);
    this.currentUuid$.next(this.currentUuid);
  }

  private persist(): void {
    this.store.set(LISTS, this.lists);
  }

  private getByUuid(uuid: string): List | undefined {
    return this.lists.find(l => l.id === uuid);
  }

  private update(list: List): void {
    const index = this.lists.findIndex(l => l.id === list.id);
    if (index === -1) {
      this.lists.splice(index, 1, list);
      this.persist();
      this.broadCast();
    }
  }

  getCurrentListUuid(): SpecialListUUID | string {
    return this.currentUuid;
  }

  getAll(): void {
    this.lists = this.store.getList(LISTS);
    this.broadCast();
  }

  setCurrentUuid(uuid: string): void {
    this.currentUuid = uuid;
    this.current = this.lists.find(l => l.id === uuid);
    this.broadCast();
  }

  add(title: string): void {
    const newList = new List(title);
    this.lists.push(newList);
    this.currentUuid = newList.id;
    this.current = newList;

    this.broadCast();
    this.persist();
  }

  rename(listUuid: string, title: string): void {
    const list = this.getByUuid(listUuid);
    if (list) {
      list.title = title;
      this.update(list);
    }
  }

  delete(uuid: string): void {
    const i = this.lists.findIndex(l => l.id === uuid);
    if (i !== -1) {
      this.lists.splice(i, 1);
      this.currentUuid = this.lists.length
        ? this.lists[ this.lists.length - 1 ].id
        : this.currentUuid === 'today'
          ? 'today'
          : 'todo';
      this.broadCast();
      this.persist();
    }
  }
}
