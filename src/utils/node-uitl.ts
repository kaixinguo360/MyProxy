import {Resource} from './resource-service';
import {log} from './log-utils';
declare var __location: Location;

export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  part?: boolean;
  collection?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  source?: string;
  description?: string;
  comment?: string;
}
export class ExtraData {
  nodeType!: string;
}
export class ListItem<T extends ExtraData = ExtraData> {
  node?: Node<T>;
  status?: string;
}
export class Node<T extends ExtraData = ExtraData> {
  mainData!: MainData;
  extraData?: T;
  extraList?: ListItem[];
  tags?: Node[] | number[];
}

export class Image extends ExtraData {
  url!: string;
  type?: string;
  author?: string;
  gallery?: string;
  source?: string;
}
export class Video extends ExtraData {
  url!: string;
  format?: string = 'mp4';
}

export function savePage(apiUrl?: string) {
  const draft: Node = {
    mainData: {
      title: document.title,
      type: 'node',
      source: __location.href,
    },
  };
  saveDraft(draft, apiUrl);
}
export function saveResource(resource: Resource, apiUrl?: string) {
  const draft = toNode(resource);
  if (!supportedType(draft.mainData.type)) {
    alert(`Unsupported type: ${draft.mainData.type}`);
    return;
  }
  draft.mainData.title = document.title;
  saveDraft(draft, apiUrl);
}
export function saveResources(resources: Resource[], apiUrl?: string) {
  const draft: Node = {
    mainData: {
      title: document.title,
      type: 'collection',
      collection: true,
      source: __location.href,
    },
    extraList: resources
      .map(resource => {
        const node = toNode(resource);
        node.mainData.part = true;
        return node;
      })
      .filter(node => supportedType(node.mainData.type))
      .map(node => ({status: 'new', node: node}))
  };
  saveDraft(draft, apiUrl);
}

function supportedType(type?: string) {
  if (!type) {
    return false;
  } else {
    return (['image', 'video'].indexOf(type) !== -1);
  }
}
function toNode(resource: Resource) {
  const draft: Node = {
    mainData: {
      title: resource.title,
      type: getType(resource),
      source: resource.source,
      description: resource.description,
    }
  };
  if (draft.mainData.type === 'image') {
    (draft as Node<Image>).extraData = {
      nodeType: 'image',
      url: resource.url,
    };
  } else if (draft.mainData.type === 'video') {
    (draft as Node<Video>).extraData = {
      nodeType: 'video',
      url: resource.url,
    };
  } else if (draft.mainData.type === 'music') {
    log('NODE_CONVERTER', 'Unsupported type: music');
  }
  return draft;
}
function getType(resource: Resource) {
  return (resource.type === 'audio') ? 'music' : resource.type;
}
function saveDraft(draft: Node, apiUrl?: string) {
  draft.tags = [];
  if (apiUrl) {
    location.href = apiUrl + '/save?draft=' + JSON.stringify(draft);
  } else {
    localStorage.setItem('node-edit@draft', JSON.stringify(draft));
    location.href = location.origin + '/node/new?draft=1';
  }
}
