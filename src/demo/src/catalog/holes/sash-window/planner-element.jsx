import React from 'react';
import * as Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
import path from 'path';

let cached3DWindow = null;

export default {
  name: "sash window",
  prototype: "holes",

  info: {
    title: "sash window",
    tag: ['window'],
    group: "Vertical closure",
    description: "Sash window",
    image: require('./window.png')
  },

  properties: {
    width: {
      label: "Width",
      type: "length-measure",
      defaultValue: {
        length: 90
      }
    },
    height: {
      label: "Height",
      type: "length-measure",
      defaultValue: {
        length: 100
      }
    },
    altitude: {
      label: "Altitude",
      type: "length-measure",
      defaultValue: {
        length: 90
      }
    },
    thickness: {
      label: "Thickness",
      type: "length-measure",
      defaultValue: {
        length: 10
      }
    }
  },

  render2D: function (element, layer, scene) {
    const STYLE_HOLE_BASE = {stroke: "#000", strokeWidth: "3px", fill: "transparent"};
    const STYLE_HOLE_SELECTED = {stroke: "#0096fd", strokeWidth: "3px", fill: "transparent", cursor: "move"};
    //let line = layer.lines.get(hole.line);
    //let epsilon = line.properties.get('thickness') / 2;

    let epsilon = 3;

    let holeWidth = element.properties.get('width').get('length');
    let leftPath = `M${0},${-epsilon*2}  A${holeWidth / 4},${holeWidth / 6} 0 0,1 ${holeWidth / 6},${holeWidth / 6}`;
    let rightPath = `M${holeWidth},${-epsilon*2}  C${holeWidth*2/3},0 ${holeWidth*5/6},${holeWidth / 6} ${holeWidth*5/6},${holeWidth / 6}`;
    let holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    let length = element.properties.get('width').get('length');
    return (
      <g transform={`translate(${-length / 2}, 0)`}>
        <rect key='1' x={0} y={-15} width={holeWidth} height={30}
          style={{stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#4285F4'}}/>
        <line key="2" x1={holeWidth / 2} y1={-12 - epsilon} x2={holeWidth / 2} y2={12 + epsilon} style={holeStyle}/>
        <line key="3" x1={epsilon * 5} y1={epsilon} x2={holeWidth*4/5} y2={epsilon} style={holeStyle} />
        <path key="8" d={leftPath} style={holeStyle}/>
        <path key="9" d={rightPath} style={holeStyle}/>
        <line key="6" x1={0} y1={-epsilon*2} x2={holeWidth / 8} y2={-12 - epsilon} style={holeStyle} />
        <line key="7" x1={holeWidth} y1={-epsilon*2} x2={holeWidth*7 / 8} y2={-12 - epsilon} style={holeStyle} />
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let onLoadItem = (object) => {
      let boundingBox = new Three.Box3().setFromObject(object);

      let initialWidth = boundingBox.max.x - boundingBox.min.x;
      let initialHeight = boundingBox.max.y - boundingBox.min.y;
      let initialThickness = boundingBox.max.z - boundingBox.min.z;

      if (element.selected) {
        let box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.renderOrder = 1000;
        object.add(box);
      }

      let width = element.properties.get('width').get('length');
      let height = element.properties.get('height').get('length');
      let thickness = element.properties.get('thickness').get('length');

      object.scale.set(width / initialWidth, height / initialHeight,
        thickness / initialThickness);

      return object;
    };

    if(cached3DWindow) {
      return Promise.resolve(onLoadItem(cached3DWindow.clone()));
    }

    let mtl = require('./sash-window.mtl');
    let obj = require('./sash-window.obj');
    let img = require('./texture.png');

    return loadObjWithMaterial(mtl, obj, path.dirname(img) + '/')
      .then(object => {
        cached3DWindow = object;
        return onLoadItem(cached3DWindow.clone());
      })
  }
};
