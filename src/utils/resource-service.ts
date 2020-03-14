import {debug} from './log-utils';

export interface Resource {
  url: string;
  type: 'image' | 'video' | 'audio';
  source?: string;
  title?: string;
  description?: string;
}

export class ResourceService {

  public readonly resources = new Map<string, Resource>();
  public size = this.resources.size;

  public add(resource: Resource) {
    if (resource.url.startsWith(location.origin)) {
      return;
    }
    const key = resource.url;
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
      this.size = this.resources.size;
      debug('RESOURCE', `ADD [${this.resources.size}]\n${key}\n${resource.description}`);
    }
  }

  public remove(key: string) {
    this.resources.delete(key);
    this.size = this.resources.size;
  }

  public getAll() {
    return this.resources.values();
  }
}
