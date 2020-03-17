import {direct, isProxied, proxy} from '../utils/url-utils';
import {debug, log} from '../utils/log-utils';
import {ResourceService} from '../utils/resource-service';

export class DomHook {

  private readonly resourceService: ResourceService;
  private readonly href: string;
  private bypassElements: Element[] = [];

  // ----- Init ----- //
  constructor(resourceService: ResourceService, href: string) {
    this.resourceService = resourceService;
    this.href = href;

    // Add Mutation Observer
    const observer = new MutationObserver(mutations => {
      for(let mutation of mutations) {
        switch (mutation.type) {
          case "attributes":
            this.attributesMutationHandler(mutation); break;
          case "childList":
            Array.from(mutation.addedNodes).forEach(node => this.childNodeHandler(node)); break;
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['src', 'href', 'action'],
      childList: true,
      subtree: true
    });

    // Log
    log('DOM_HOOK', 'INIT');
  }

  // ----- Mutation Handlers ----- //
  private attributesMutationHandler(mutation: MutationRecord) {
    const node = mutation.target;
    const attribute = mutation.attributeName;
    if (!(node instanceof HTMLElement)) {
      throw new Error('Node is not a HTMLElement');
    }
    if (!attribute) {
      throw new Error(`Attribute name is null.`);
    }
    if (this.isBypassElement(node)) {
      return;
    }
    this.detectResource(node);
    this.proxyNode(node, attribute);
  }
  private childNodeHandler(node: Node) {
    if (!(node instanceof HTMLElement && node.tagName)) {
      return;
    }
    if (this.isBypassElement(node)) {
      return;
    }
    this.detectResource(node);
    switch (node.tagName) {
      case 'IMG':
        this.proxyNode(node, 'src'); break;
      case 'A':
        this.proxyNode(node, 'href'); break;
      case 'FORM':
        this.proxyNode(node, 'action'); break;
    }
    node.childNodes.forEach(node => this.childNodeHandler(node));
  }

  // ----- Resource Detectors ----- //
  private detectResource(node: HTMLElement) {
    switch (node.tagName) {
      case 'IMG': this.addImage(node); break;
    }
  }
  private addImage(node: HTMLElement) {
    if (!(node instanceof HTMLImageElement)) {
      throw new Error('Node is not a HTMLImageElement');
    }

    // Detect basic info of image
    const image = node;
    const url = direct(image.src);
    if (!url || url === this.href) {
      return;
    }

    // Detect description of image
    let description = image.alt || image.title;
    function detectSiblings(cur: ChildNode) {
      while (cur.nextSibling) {
        cur = cur.nextSibling;
        
        // filter script and style tag
        const tagName = (cur as HTMLElement).tagName;
        if (tagName === 'script' || tagName === 'style') {
          continue;
        }
        
        if (cur.textContent) {
          description = cur.textContent;
          break;
        }
      }
    }
    function detectParent(parent: HTMLElement) {
      description = parent.title;
    }
    if (!description) {
      let cur: HTMLElement = node;
      while (!description) {
        
        detectSiblings(cur);
        if (!description && cur.parentElement) {
          detectParent(cur.parentElement);
        }
        
        if (cur.parentElement) {
          cur = cur.parentElement;
        } else {
          break;
        }
      }
    }

    if (description) {
      description = description.trim();
    }

    // Send to resource service
    this.resourceService.add({ type: 'image', url, description, source: this.href });
  }

  // ----- Utils Functions ----- //
  private proxyNode(node: HTMLElement, attribute: string) {
    const url = (node as any)[attribute];
    if (!isProxied(url)) {
      const proxied = proxy(url);
      debug('DOM_HOOK', `${node.tagName}.${attribute}\n-> ${url}\n<- ${proxied}`, node);
      (node as any)[attribute] = proxied;
    }
  }
  
  // ----- Bypass Elements ----- //
  private isBypassElement(node: Element) {
    return !this.bypassElements.every(n => !n.contains(node));
  }
  public addBypassElement(node: Element) {
    return this.bypassElements.push(node);
  }
  public removeBypassElement(node: Element) {
    return this.bypassElements.splice(this.bypassElements.indexOf(node), 1);
  }
}
