import {Record, List, Map, fromJS} from 'immutable';
import {MODE_IDLE} from './constants';
import {SNAP_MASK} from './utils/snap';

let safeLoadMapList = (mapList, Model, defaultMap) => {
  return mapList
    ? new Map(mapList).map(m => new Model(m)).toMap()
    : (defaultMap || new Map());
};


export class Guide extends Record({
  id: '',
  type: '',
  properties: Map()
}, 'Guide') {
  constructor(json = {}) {
    super({
      ...json,
      properties: fromJS(json.properties || {})
    });
  }
}

export const DefaultGuides = new Map({
  'h1': new Guide({
    id: 'h1',
    type: 'horizontal-streak',
    properties: {
      step: 20,
      colors: ['#808080', '#ddd', '#ddd', '#ddd', '#ddd']
    }
  }),
  'v1': new Guide({
    id: 'v1',
    type: 'vertical-streak',
    properties: {
      step: 20,
      colors: ['#808080', '#ddd', '#ddd', '#ddd', '#ddd']
    }
  })
});


export class ElementsSet extends Record({
  vertices: new List(),
  lines: new List(),
  holes: new List(),
  areas: new List(),
  items: new List(),
}, 'ElementsSet') {
  constructor(json = {}) {
    super({
      vertices: new List(json.vertices || []),
      lines: new List(json.lines || []),
      holes: new List(json.holes || []),
      areas: new List(json.areas || []),
      items: new List(json.items || [])
    })
  }
}

const sharedAttributes =
{
  id: '',
  type: '',
  prototype: '',
  name: '',
  misc: new Map(),
  selected: false,
  properties: new Map()
}

export class Vertex extends Record({
  ...sharedAttributes,
  x: -1,
  y: -1,
  prototype: 'vertices',
  lines: new List(),
  areas: new List()
}, 'Vertex') {
  constructor(json = {}) {
    super({
      ...json,
      lines: new List(json.lines || []),
      areas: new List(json.areas || [])
    })
  }
}

export class Line extends Record({
  ...sharedAttributes,
  prototype: 'lines',
  vertices: new List(),
  holes: new List()
}, 'Line') {
  constructor(json = {}) {
    super({
      ...json,
      properties: fromJS(json.properties || {}),
      vertices: new List(json.vertices || []),
      holes: new List(json.holes || []),
    })
  }
}

export class Hole extends Record({
  ...sharedAttributes,
  prototype: 'holes',
  offset: -1,
  line: ''
}, 'Hole') {
  constructor(json = {}) {
    super({
      ...json,
      properties: fromJS(json.properties || {})
    })
  }
}

export class Area extends Record({
  ...sharedAttributes,
  prototype: 'areas',
  vertices: new List(),
  holes: new List()
}, 'Area') {
  constructor(json = {}) {
    super({
      ...json,
      properties: fromJS(json.properties || {}),
      vertices: new List(json.vertices || [])
    })
  }
}

export class Item extends Record({
  ...sharedAttributes,
  prototype: 'items',
  x: 0,
  y: 0,
  rotation: 0,
  number: '',
  seats: 0
}, 'Item') {
  constructor(json = {}) {
    super({
      ...json,
      properties: fromJS(json.properties || {})
    });
  }
}

export class Layer extends Record({
  id: '',
  altitude: 0,
  order: 0,
  opacity: 1,
  name: '',
  visible: true,
  vertices: new Map(),
  lines: new Map(),
  holes: new Map(),
  areas: new Map(),
  items: new Map(),
  selected: new ElementsSet(),
}, 'Layer') {
  constructor(json = {}) {
    super({
      ...json,
      vertices: safeLoadMapList(json.vertices, Vertex),
      lines: safeLoadMapList(json.lines, Line),
      holes: safeLoadMapList(json.holes, Hole),
      areas: safeLoadMapList(json.areas, Area),
      items: safeLoadMapList(json.items, Item),
      selected: new ElementsSet(json.selected)
    });
  }
}


export const DefaultLayers = new Map({
  'layer-1': new Layer({id: 'layer-1', name: 'default'})
});


export class Scene extends Record({
  unit: 'cm',
  layers: new Map(),
  guides: new Map(),
  selectedLayer: null,
  width: 3000,
  height: 2000,
  meta: new Map()   //additional info
}, 'Scene') {
  constructor(json = {}) {
    let layers = safeLoadMapList(json.layers, Layer, DefaultLayers);
    super({
      ...json,
      guides: safeLoadMapList(json.guides, Guide, DefaultGuides),
      layers,
      selectedLayer: layers.first().id,
      meta: json.meta ? fromJS(json.meta) : new Map()
    })
  }
}

export class CatalogElement extends Record({
  name: '',
  prototype: '',
  info: new Map(),
  properties: new Map(),
}, 'CatalogElement') {
  constructor(json = {}) {
    super({
      ...json,
      info: fromJS(json.info),
      properties: fromJS(json.properties)
    });
  }
}

export class Catalog extends Record({
  ready: false,
  page: "root",
  path: new List(),
  elements: new Map(),
}, 'Catalog') {
  constructor(json = {}) {
    let elements = safeLoadMapList(json.elements, CatalogElement);
    super({
      elements,
      ready: !elements.isEmpty()
    })
  }

  factoryElement(type, options, initialProperties = {}) {
    if (!this.elements.has(type)) {
      let catList = this.elements.map(element => element.name).toArray();
      throw new Error(`Element ${type} does not exist in catalog ${catList}`);
    }

    let element = this.elements.get(type);
    let properties = element.properties.map((value, key) => initialProperties[key] || value.get('defaultValue'));

    switch (element.prototype) {
      case 'lines':
        return new Line(options).merge({properties});

      case 'holes':
        return new Hole(options).merge({properties});

      case 'areas':
        return new Area(options).merge({properties});

      case 'items':
        return new Item(options).merge({properties});

      default:
        throw new Error('prototype not valid');
    }
  }
}

export class State extends Record({
  mode: MODE_IDLE,
  scene: new Scene(),
  sceneHistory: new List([new Scene()]),
  catalog: new Catalog(),
  viewer2D: new Map(),
  mouse: new Map({x: 0, y: 0}),
  zoom: 0,
  snapMask: SNAP_MASK,
  snapElements: new List(),
  activeSnapElement: null,
  drawingSupport: new Map(),
  draggingSupport: new Map(),
  rotatingSupport: new Map(),
  errors: new List(),
  warnings: new List(),
  clipboardProperties: null,
  selectedElementsHistory: new List(),
  misc: new Map()   //additional info
}, 'State') {
  constructor(json = {}) {
    let scene = new Scene(json.scene);
    super({
      ...json,
      scene,
      sceneHistory: json.sceneHistory ? json.sceneHistory : new List([scene]),
      catalog: new Catalog(json.catalog || {}),
      viewer2D: new Map(json.viewer2D || {}),
      drawingSupport: new Map(json.drawingSupport || {}),
      draggingSupport: new Map(json.draggingSupport || {}),
      rotatingSupport: new Map(json.rotatingSupport || {}),
      misc: json.misc ? fromJS(json.misc) : new Map()
    })
  }
}



