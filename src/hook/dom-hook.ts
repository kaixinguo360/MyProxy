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
    this.detectResource(node);
    this.proxyNode(node, attribute);
  }
  private childNodeHandler(node: Node) {
    if (!(node instanceof HTMLElement && node.tagName)) {
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

  // ----- Utils Functions ----- //
  private proxyNode(node: HTMLElement, attribute: string) {
    const url = (node as any)[attribute];
    if (!isProxied(url)) {
      const proxied = proxy(url);
      debug('DOM_HOOK', `${node.tagName}.${attribute}\n-> ${url}\n<- ${proxied}`, node);
      (node as any)[attribute] = proxied;
    }
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
    if (!description) {
      let cur: HTMLElement = node;
      while (!description) {
        const parent = cur.parentElement;
        if (parent && parent.childElementCount === 1) {
          detectParent(parent);
        } else {
          detectSiblings(cur);
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
}
