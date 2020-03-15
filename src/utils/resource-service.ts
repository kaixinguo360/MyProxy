import {debug} from './log-utils';
import {direct} from './url-utils';

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

  public readonly resources = new Map<string, Resource>();
  public size = 0;

  public add(resource: Resource) {
    if (resource.url.startsWith(location.origin)) {
      return;
    }
    const key = direct(resource.url);
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
      this.updateSize();
      debug('RESOURCE', `ADD [${this.resources.size}]\n${key}\n${resource.description}`);
    }
  }

  public hide(key: string) {
    const resource = this.resources.get(key);
    if (resource) {
      resource.hide = true;
      this.updateSize();
    }
  }

  public getAll() {
    return Array.from(this.resources.values()).filter(r => !r.hide);
  }
  
  private updateSize() {
    this.size = this.getAll().length;
  }
}
