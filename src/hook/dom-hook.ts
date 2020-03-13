import {direct, isProxied, proxy} from '../utils/url-utils';
import {debug, log} from '../utils/log-utils';
import {ResourceService} from '../utils/resource-service';

export class DomHook {

  private readonly resourceService: ResourceService;
  private readonly href: string;

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
            Array.from(mutation.addedNodes).forEach((node: HTMLElement) => this.childNodeHandler(node)); break;
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
    const node = mutation.target as HTMLElement;
    const attribute = mutation.attributeName;
    this.detectResource(node);
    this.proxyNode(node, attribute);
  }
  private childNodeHandler(node: HTMLElement) {
    if (!node.tagName) { return; }
    this.detectResource(node);

    switch (node.tagName) {
      case 'IMG':
        this.proxyNode(node, 'src'); break;
      case 'A':
        this.proxyNode(node, 'href'); break;
      case 'FORM':
        this.proxyNode(node, 'action'); break;
    }

    node.childNodes.forEach((node: HTMLElement) => this.childNodeHandler(node));
  }

  // ----- Utils Functions ----- //
  private proxyNode(node: any, attribute: string) {
    const url = node[attribute];
    if (!isProxied(url)) {
      const proxied = proxy(url);
      debug('DOM_HOOK', `${node.tagName}.${attribute}\n-> ${url}\n<- ${proxied}`, node);
      node[attribute] = proxied;
    }
  }

  // ----- Resource Detectors ----- //
  private detectResource(node: HTMLElement) {
    switch (node.tagName) {
      case 'IMG': this.addImage(node); break;
    }
  }
  private addImage(node: HTMLElement) {
    const image = node as HTMLImageElement;
    const url = direct(image.src);
    if (!url || url === this.href) { return; }

    let description = image.alt || image.title;

    function detectSiblings(cur: ChildNode) {
      while (cur.nextSibling) {
        // log('Sibling===========')
        cur = cur.nextSibling;
        if (cur.textContent) {
          description = cur.textContent;
          break;
        }
      }
    }
    function detectParent(parent: HTMLElement) {
      description = parent.title;
    }

    // Detect description of image, Try 1
    if (!description) {
      let cur: HTMLElement = node;
      while (!description && cur) {
        const parent = cur.parentElement;
        if (parent && parent.childElementCount === 1) {
          detectParent(parent);
        } else {
          detectSiblings(cur);
        }
        cur = cur.parentElement;
      }
    }

    // Detect description of image, Try 2
    if (!description) {
      let parent: HTMLElement = node.parentElement;
      description = parent.title;
    }

    this.resourceService.add({ type: 'image', url, description, source: this.href });
  }
}
