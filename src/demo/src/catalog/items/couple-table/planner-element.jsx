import * as Three from 'three';
import React from 'react';

const WIDTH =  100;
const DEPTH =  120;
const HEIGHT = 100;

const brown = new Three.MeshLambertMaterial({color: 0xac6c25});
const black = new Three.MeshLambertMaterial({color: 0x000000});
const grey = new Three.MeshLambertMaterial({color: 0xC0C0C0});

const objectMaxLOD = makeObjectMaxLOD();
const objectMinLOD = makeObjectMinLOD();

function makeObjectMaxLOD() {

  //central pillar
  let centralPillar = new Three.BoxGeometry(1,3,1);
  let couple_table = new Three.Mesh(centralPillar,grey);

  // plane top
  let planeTop = new Three.Mesh(new Three.BoxGeometry(10,0.5,10),brown);
  planeTop.position.set(0,1.5,0);
  couple_table.add(planeTop);

  //plane nuts
  for(let dx=-0.25;dx<=0.25;dx+=0.5)
  {
    for(let dz=-0.25;dz<=0.25;dz+=0.5)
    {
      let nut = new Three.Mesh(new Three.CylinderGeometry(0.1,0.1,0.8,6),black);
      nut.position.set(dx,1.4,dz);
      couple_table.add(nut);
    }
  }

  // central axis
  let axis1 = new Three.Mesh(new Three.BoxGeometry(1,15,1),grey);
  axis1.rotation.x=0.5*Math.PI;
  axis1.position.set(0,-1,0);
  couple_table.add(axis1);

  //axis
  let axis2 = new Three.Mesh(new Three.BoxGeometry(1,10,1),grey);
  axis2.rotation.z=0.5*Math.PI;
  axis2.position.set(0,-1,-7);
  couple_table.add(axis2);

  //axis
  let axis3 = new Three.Mesh(new Three.BoxGeometry(1,10,1),grey);
  axis3.rotation.z=0.5*Math.PI;
  axis3.position.set(0,-1,7);
  couple_table.add(axis3);

  //legs
  for(let gx=-3;gx<=3;gx+=6)
  {
    for(let gz=7;gz>=-7;gz-=14)
    {
      let leg = new Three.Mesh(new Three.BoxGeometry(1,3,1),grey);
      leg.rotation.y=0.5*Math.PI;
      leg.position.set(gx,-2,gz);
      couple_table.add(leg);
    }
  }

  //legs base
  for(let fx=-3;fx<=3;fx+=6)
  {
    for(let fz=8;fz>=-8;fz-=16)
    {
      let legBase = new Three.Mesh(new Three.BoxGeometry(3,0.25,1),grey);
      legBase.rotation.y=0.5*Math.PI;
      legBase.position.set(fx,-3.5,fz+1);
      couple_table.add(legBase);

      // base nuts
      let baseNut1 = new Three.Mesh(new Three.CylinderGeometry(0.1,0.1,0.3,6),black);
      baseNut1.position.set(fx,-3.5,fz-1);
      baseNut1.position.set(fx,-3.5,fz+2);
      couple_table.add(baseNut1);

      if(fz>0)
      {
        legBase.position.set(fx,-3.5,fz-1);
        baseNut1.position.set(fx,-3.5,fz-2);
      }

      let baseNut2 = new Three.Mesh(new Three.CylinderGeometry(0.1,0.1,0.3,6),black);
      baseNut2.position.set(fx,-3.5,fz);
      couple_table.add(baseNut2);
    }
  }

  // chair back
  for(let fsx=-2;fsx<=2;fsx+=4)
  {
    for(let fsz=-9.24;fsz<=9.24;fsz+=18.48)
    {
      let chairBack = new Three.Mesh(new Three.BoxGeometry(4,0.5,2.5),brown);
      chairBack.rotation.x=0.5*Math.PI;
      chairBack.position.set(fsx,2.5,fsz);
      couple_table.add(chairBack);
    }
  }

  for(let fdx=-2;fdx<=2;fdx+=4)
  {
    for(let fdz=-7;fdz<=7;fdz+=14)
    {
      // seat chair
      let seat = new Three.Mesh(new Three.BoxGeometry(4,0.5,4),brown);
      seat.rotation.y=0.5*Math.PI;
      seat.position.set(fdx,-0.25,fdz);
      couple_table.add(seat);
    }
  }

  for(let fbsx=-4.5;fbsx<=4.5;fbsx+=9)
  {
    for(let fbsz=-9;fbsz<=9;fbsz+=18)
    {
      // seat support
      let seatSupport1 = new Three.Mesh(new Three.BoxGeometry(0.25,0.125,1),grey);
      seatSupport1.position.set(fbsx,-0.35,fbsz);
      couple_table.add(seatSupport1);

      let seatSupport2 = new Three.Mesh(new Three.BoxGeometry(0.25,0.125,1),grey);
      seatSupport2.position.set(fbsx-3,-0.35,fbsz);
      couple_table.add(seatSupport2);

      // seat nuts
      let seatNut1 = new Three.Mesh(new Three.CylinderGeometry(0.1,0.1,0.8,6),black);
      seatNut1.position.set(fbsx,-0.35,fbsz-2);
      couple_table.add(seatNut1);

      let seatNut2 = new Three.Mesh(new Three.CylinderGeometry(0.1,0.1,0.8,6),black);
      seatNut2.position.set(fbsx-3,-0.35,fbsz-2);
      couple_table.add(seatNut2);

      if(fbsx<0)
      {
        seatSupport2.position.set(fbsx+3,-0.35,fbsz);
        seatNut2.position.set(fbsx+3,-0.35,fbsz-2);
        if(fbsz<0)
          seatNut2.position.set(fbsx+3,-0.35,fbsz+2);
      }

      if(fbsz<0)
      {
        seatNut1.position.set(fbsx,-0.35,fbsz+2);

        if(fbsx>0)
          seatNut2.position.set(fbsx-3,-0.35,fbsz+2);

      }
    }
  }

  return couple_table
}

function makeObjectMinLOD() {

  //central pillar
  let centralPillar = new Three.BoxGeometry(1,3,1);
  let couple_table = new Three.Mesh(centralPillar,grey);

  // plane top
  let planeTop = new Three.Mesh(new Three.BoxGeometry(10,0.5,10),brown);
  planeTop.position.set(0,1.5,0);
  couple_table.add(planeTop);

  // central axis
  let axis1 = new Three.Mesh(new Three.BoxGeometry(1,15,1),grey);
  axis1.rotation.x=0.5*Math.PI;
  axis1.position.set(0,-1,0);
  couple_table.add(axis1);

  //axis
  let axis2 = new Three.Mesh(new Three.BoxGeometry(1,10,1),grey);
  axis2.rotation.z=0.5*Math.PI;
  axis2.position.set(0,-1,-7);
  couple_table.add(axis2);

  //axis
  let axis3 = new Three.Mesh(new Three.BoxGeometry(1,10,1),grey);
  axis3.rotation.z=0.5*Math.PI;
  axis3.position.set(0,-1,7);
  couple_table.add(axis3);

  //legs
  for(let gx=-3;gx<=3;gx+=6)
  {
    for(let gz=7;gz>=-7;gz-=14)
    {
      let leg = new Three.Mesh(new Three.BoxGeometry(1,3,1),grey);
      leg.rotation.y=0.5*Math.PI;
      leg.position.set(gx,-2,gz);
      couple_table.add(leg);
    }
  }

  //legs base
  for(let fx=-3;fx<=3;fx+=6)
  {
    for(let fz=8;fz>=-8;fz-=16)
    {
      let legBase = new Three.Mesh(new Three.BoxGeometry(3,0.25,1),grey);
      legBase.rotation.y=0.5*Math.PI;
      legBase.position.set(fx,-3.5,fz+1);
      couple_table.add(legBase);

      if(fz>0)
        legBase.position.set(fx,-3.5,fz-1);
    }
  }

  // chair back
  for(let fsx=-2;fsx<=2;fsx+=4)
  {
    for(let fsz=-9.24;fsz<=9.24;fsz+=18.48)
    {
      let chairBack = new Three.Mesh(new Three.BoxGeometry(4,0.5,2.5),brown);
      chairBack.rotation.x=0.5*Math.PI;
      chairBack.position.set(fsx,2.5,fsz);
      couple_table.add(chairBack);
    }
  }

  for(let fdx=-2;fdx<=2;fdx+=4)
  {
    for(let fdz=-7;fdz<=7;fdz+=14)
    {
      // seat chair
      let seat = new Three.Mesh(new Three.BoxGeometry(4,0.5,4),brown);
      seat.rotation.y=0.5*Math.PI;
      seat.position.set(fdx,-0.25,fdz);
      couple_table.add(seat);
    }
  }

  for(let fbsx=-4.5;fbsx<=4.5;fbsx+=9)
  {
    for(let fbsz=-9;fbsz<=9;fbsz+=18)
    {
      // seat support
      let seatSupport1 = new Three.Mesh(new Three.BoxGeometry(0.25,0.125,1),grey);
      seatSupport1.position.set(fbsx,-0.35,fbsz);

      couple_table.add(seatSupport1);

      let seatSupport2 = new Three.Mesh(new Three.BoxGeometry(0.25,0.125,1),grey);
      seatSupport2.position.set(fbsx-3,-0.35,fbsz);
      couple_table.add(seatSupport2);

      if(fbsx<0)
        seatSupport2.position.set(fbsx+3,-0.35,fbsz);
    }
  }

  return couple_table
}


export default {
  name: 'couple table',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood'],
    group: 'items',
    title: '2 seats table',
    description: '2 seats table',
    image: require('./couple_table.jpg')
  },

  properties: {
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0,
        unit: 'cm'
      }
    }
  },

  render2D: function (element, layer, scene) {

    let angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    const numberStyle = {
      position: 'absolute',
      width: '20px',
      height: '20px',
      fill: '#0096fd',
      stroke: 'white',
      left: WIDTH / 2,
      bottom: 0
    };

    return (

      <g transform={ `translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect key='1' x='0' y='0' width={WIDTH} height={DEPTH}
          style={{stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce'}}/>
        <text key='2' x='0' y='0'
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{textAnchor: 'middle', fontSize: '14px'}}>
            {element.name}
        </text>
        {
          element.number && (
            <g key='3' style={numberStyle}>
              <circle key='4' cx={WIDTH / 2} cy={0} r={20}></circle>
              <text key='5' x='0' y={6} transform={`translate(${WIDTH / 2}, ${0}) scale(1,-1) rotate(${textRotation})`} style={{textAnchor: 'middle'}}>{element.number}</text>
            </g>
          )
        }
      </g>
    )
  },


  render3D: function (element, layer, scene) {

    let newAltitude = element.properties.get('altitude').get('length');

    /************** lod max *****************/

    let couple_table_MaxLOD = new Three.Object3D();
    couple_table_MaxLOD.add(objectMaxLOD.clone());

    let valuePosition = new Three.Box3().setFromObject(couple_table_MaxLOD);

    let deltaX = Math.abs(valuePosition.max.x - valuePosition.min.x);
    let deltaY = Math.abs(valuePosition.max.y - valuePosition.min.y);
    let deltaZ = Math.abs(valuePosition.max.z - valuePosition.min.z);

    couple_table_MaxLOD.position.y+= HEIGHT/2 +newAltitude;
    couple_table_MaxLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /************** lod min *****************/

    let couple_table_MinLOD = new Three.Object3D();
    couple_table_MinLOD.add(objectMinLOD.clone());
    couple_table_MinLOD.position.y+= HEIGHT/2 +newAltitude;
    couple_table_MinLOD.scale.set(WIDTH / deltaX, HEIGHT / deltaY, DEPTH / deltaZ);

    /**** all level of detail ***/

    let lod = new Three.LOD();

    lod.addLevel(couple_table_MaxLOD, 200);
    lod.addLevel(couple_table_MinLOD, 900);
    lod.updateMatrix();
    lod.matrixAutoUpdate = false;

    if (element.selected) {
      let bbox = new Three.BoxHelper(lod, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      lod.add(bbox);
    }

    return Promise.resolve(lod)
  }
};
