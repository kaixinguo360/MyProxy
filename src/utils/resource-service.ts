import {debug} from './log-utils';
import {savePage, saveResource, saveResources} from './node-uitl';
import {ProxyService} from './proxy-service';

export interface Resource {
  url: string;
  type: 'image' | 'video' | 'audio';
  source?: string;
  title?: string;
  description?: string;

  hide?: boolean;
  selected?: boolean;
}

export class ResourceService {

  private readonly proxyService: ProxyService;

  public readonly resources = new Map<string, Resource>();
  public size = 0;
  public selected = 0;
  
  constructor(proxyService: ProxyService) {
    this.proxyService = proxyService;
  }

  public add(resource: Resource) {
    if (resource.url.startsWith(location.origin)) {
      return;
    }
    const key = this.proxyService.direct(resource.url);
    const old = this.resources.get(key);
    if (old) {
      if (resource.title && resource.title !== old.title) {
        old.title = resource.title;
        debug('RESOURCE', `UPDATE [${this.resources.size}] title\n${key}\n${resource.title}`);
      }
      if (resource.description && resource.description !== old.description) {
        old.description = resource.description;
        debug('RESOURCE', `UPDATE [${this.resources.size}] description\n${key}\n${resource.description}`);
      }
    } else {
      this.resources.set(key, resource);
      this.update();
      debug('RESOURCE', `ADD [${this.resources.size}]\n${key}\n${resource.description}`);
    }
  }
  public hide(key: string) {
    const resource = this.resources.get(key);
    if (resource) {
      resource.hide = true;
      this.update();
    }
  }

  public select(key: string) {
    const resource = this.resources.get(key);
    if (resource) {
      resource.selected = !resource.selected;
      this.update();
    }
  }
  public selectAll() {
    const allSelected = this.size === this.selected;
    this.getAll().forEach(r => {
      r.selected = !allSelected;
    });
    this.update();
  }

  public getAll() {
    return Array.from(this.resources.values()).filter(r => !r.hide);
  }
  public getAllSelected() {
    return this.getAll().filter(r => r.selected);
  }

  private update() {
    this.size = this.getAll().length;
    this.selected = this.getAllSelected().length;
  }
  
  public save() {
    const selected = this.getAllSelected();
    if (selected.length === 0) {
      savePage();
    } else if (selected.length === 1) {
      saveResource(selected[0]);
    } else {
      saveResources(selected);
    }
  }
}
