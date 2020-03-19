import {debug, log} from '../utils/log-utils';
import {ResourceService} from '../utils/resource-service';
import {ProxyService} from '../utils/proxy-service';

export class DomHook {

  private readonly resourceService: ResourceService;
  private readonly proxyService: ProxyService;
  private readonly href: string;

  private bypassElements: Element[] = [];

  // ----- Init ----- //
  constructor(
    resourceService: ResourceService,
    proxyService: ProxyService,
    href: string,
  ) {
    this.resourceService = resourceService;
    this.proxyService = proxyService;
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
    this.process(node);
  }
  private childNodeHandler(node: Node) {
    if (!(node instanceof HTMLElement && node.tagName)) {
      return;
    }
    if (this.isBypassElement(node)) {
      return;
    }
    this.process(node);
    node.childNodes.forEach(node => this.childNodeHandler(node));
  }
  private process(node: HTMLElement) {
    this.detectResource(node);
    switch (node.tagName) {
      case 'IMG':
        this.proxyNode(node, 'src', 'image'); break;
      case 'A':
        this.proxyNode(node, 'href', 'document'); break;
      case 'FORM':
        this.proxyNode(node, 'action', 'document'); break;
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
    const url = this.proxyService.direct(image.src);
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
  private proxyNode(node: HTMLElement, attribute: string, type?: string) {
    const url = (node as any)[attribute];
    const proxyUrl = this.proxyService.proxy(url, type);
    if (proxyUrl !== url) {
      debug('DOM_HOOK', `${node.tagName}.${attribute}\n-> ${url}\n<- ${proxyUrl}`, node);
      (node as any)[attribute] = proxyUrl;
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
