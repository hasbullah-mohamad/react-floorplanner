import {BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper} from 'three';

import React from 'react';

export default {
  name: "concert stage",
  prototype: "items",

  info: {
    title: "Concert Stage",
    tag: ['demo'],
    group: "Items",
    description: "Concert Stage",
    image: require('./concert.jpg')
  },

  properties: {
    color: {
      label: "Color",
      type: "color",
      defaultValue: "#f48342"
    },
  },

  render2D: (element, layer, scene) => {
    let style = {
      stroke: "#000",
      strokeWidth: element.selected ? "2px" : "0px",
      fill: element.properties.get('color')
    };

    return (
      <g transform="translate(-50, -50)">
        <rect x="0" y="0" width="300" height="100" style={style}/>
        <text key='2' x='0' y='0'
          transform={`translate(${150}, ${50}) scale(1,-1) rotate(0)`}
          style={{ textAnchor: 'middle', fontSize: '14px' }}>
          {element.name}
        </text>
      </g>
    );
  },

  render3D: (element, layer, scene) => {
    let geometry = new BoxGeometry(500, 20, 200);
    let material = new MeshBasicMaterial({
      color: element.properties.get('color')
    });

    let mesh = new Mesh(geometry, material);

    if (element.selected) {
      let box = new BoxHelper(mesh, '#000');
      box.material.linewidth = 1;
      box.material.depthTest = false;
      box.renderOrder = 1000;
      mesh.add(box);
    }

    mesh.position.y = 0;

    return Promise.resolve(mesh);
  }

};
