"use strict";

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import * as Three from 'three';
import {parseData, updateScene} from './scene-creator';
import {disposeScene} from './three-memory-cleaner';
import OrbitControls from './libs/orbit-controls';
import diff from 'immutablediff';
import * as SharedStyle from '../../shared-style';

export default class Scene3DViewer extends React.Component {

  constructor(props) {
    super(props);

    this.lastMousePosition = {};
    this.width = props.width;
    this.height = props.height;
    this.stopRendering = false;

    this.renderer = window.__threeRenderer || new Three.WebGLRenderer({preserveDrawingBuffer: true});
    window.__threeRenderer = this.renderer;
  }

  componentDidMount() {

    let actions = {
      areaActions: this.context.areaActions,
      holesActions: this.context.holesActions,
      itemsActions: this.context.itemsActions,
      linesActions: this.context.linesActions,
      projectActions: this.context.projectActions
    };

    let {state} = this.props;
    let data = state.scene;
    let canvasWrapper = ReactDOM.findDOMNode(this.refs.canvasWrapper);

    let scene3D = new Three.Scene();

    //RENDERER
    this.renderer.setClearColor(new Three.Color(SharedStyle.COLORS.white));
    this.renderer.setSize(this.width, this.height);

    // LOAD DATA
    let planData = parseData(data, actions, this.context.catalog);

    scene3D.add(planData.plan);
    scene3D.add(planData.grid);

    let aspectRatio = this.width / this.height;
    let camera = new Three.PerspectiveCamera(45, aspectRatio, 1, 300000);

    scene3D.add(camera);

    // Set position for the camera
    let cameraPositionX = -(planData.boundingBox.max.x - planData.boundingBox.min.x) / 2;
    let cameraPositionY = (planData.boundingBox.max.y - planData.boundingBox.min.y) / 2 * 10;
    let cameraPositionZ = (planData.boundingBox.max.z - planData.boundingBox.min.z) / 2;

    camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    camera.up = new Three.Vector3(0, 1, 0);

    // HELPER AXIS
    // let axisHelper = new Three.AxisHelper(100);
    // scene3D.add(axisHelper);

    // LIGHT
    let light = new Three.AmbientLight(0xafafaf); // soft white light
    scene3D.add(light);

    // Add another light

    let spotLight1 = new Three.SpotLight(SharedStyle.COLORS.white, 0.30);
    spotLight1.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    scene3D.add(spotLight1);

    // OBJECT PICKING
    let toIntersect = [planData.plan];
    let mouse = new Three.Vector2();
    let raycaster = new Three.Raycaster();

    this.mouseDownEvent = (event) => {
      this.lastMousePosition.x = event.offsetX / this.width * 2 - 1;
      this.lastMousePosition.y = -event.offsetY / this.height * 2 + 1;
    };

    this.mouseUpEvent = (event) => {
      event.preventDefault();

      mouse.x = (event.offsetX / this.width) * 2 - 1;
      mouse.y = -(event.offsetY / this.height) * 2 + 1;

      if (Math.abs(mouse.x - this.lastMousePosition.x) <= 0.02 && Math.abs(mouse.y - this.lastMousePosition.y) <= 0.02) {

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(toIntersect, true);

        if (intersects.length > 0 && !(isNaN(intersects[0].distance))) {
          intersects[0].object.interact && intersects[0].object.interact();
        } else {
          this.context.projectActions.unselectAll();
        }
      }
    };

    this.renderer.domElement.addEventListener('mousedown', this.mouseDownEvent);
    this.renderer.domElement.addEventListener('mouseup', this.mouseUpEvent);
    this.renderer.domElement.style.display = 'block';

    // add the output of the renderer to the html element
    canvasWrapper.appendChild(this.renderer.domElement);

    // create orbit controls
    let orbitController = new OrbitControls(camera, this.renderer.domElement);
    let spotLightTarget = new Three.Object3D();
    spotLightTarget.position.set(orbitController.target.x, orbitController.target.y, orbitController.target.z);
    scene3D.add(spotLightTarget);
    spotLight1.target = spotLightTarget;


    /************************************/
    /********* SCENE EXPORTER ***********/
    /************************************/

    let exportScene = () => {

      let convertToBufferGeometry = (geometry) => {
        console.log("geometry = ", geometry);
        let bufferGeometry = new Three.BufferGeometry().fromGeometry(geometry);
        return bufferGeometry;
      };

      scene3D.remove(planData.grid);

      scene3D.traverse((child) => {
        console.log(child);
        if (child instanceof Three.Mesh && !(child.geometry instanceof Three.BufferGeometry))
          child.geometry = convertToBufferGeometry(child.geometry);
      });

      let output = scene3D.toJSON();

      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

      let name = prompt('insert file name');
      name = name.trim() || 'scene';
      let blob = new Blob([output], {type: 'text/plain'});

      let fileOutputLink = document.createElement('a');
      let url = window.URL.createObjectURL(blob);
      fileOutputLink.setAttribute('download', name);
      fileOutputLink.href = url;
      document.body.appendChild(fileOutputLink);
      fileOutputLink.click();
      document.body.removeChild(fileOutputLink);

      scene3D.add(planData.grid);

    };

    // window.exportScene = exportScene;

    /************************************/


    /************************************/
    /********** PLAN EXPORTER ***********/
    /************************************/


    let exportPlan = () => {

      let convertToBufferGeometry = (geometry) => {
        return new Three.BufferGeometry().fromGeometry(geometry);
      };

      planData.plan.traverse((child) => {
        if (child instanceof Three.Mesh && !(child.geometry instanceof Three.BufferGeometry))
          child.geometry = convertToBufferGeometry(child.geometry);
      });

      let output = planData.plan.toJSON();

      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

      let name = prompt('insert file name');
      name = name.trim() || 'plan';
      let blob = new Blob([output], {type: 'text/plain'});

      let fileOutputLink = document.createElement('a');
      let url = window.URL.createObjectURL(blob);
      fileOutputLink.setAttribute('download', name);
      fileOutputLink.href = url;
      document.body.appendChild(fileOutputLink);
      fileOutputLink.click();
      document.body.removeChild(fileOutputLink);

      scene3D.add(planData.grid);

    };

    // window.exportPlan = exportPlan;

    /************************************/

    let render = () => {
      if (!this.stopRendering) {
        orbitController.update();
        spotLight1.position.set(camera.position.x, camera.position.y, camera.position.z);
        spotLightTarget.position.set(orbitController.target.x, orbitController.target.y, orbitController.target.z);
        camera.updateMatrix();
        camera.updateMatrixWorld();

        for (let elemID in planData.sceneGraph.LODs) {
          planData.sceneGraph.LODs[elemID].update(camera)
        }

        this.renderer.render(scene3D, camera);
        requestAnimationFrame(render);
      }
    };

    render();

    this.orbitControls = orbitController;
    this.camera = camera;
    this.scene3D = scene3D;
    this.planData = planData;
  }

  componentWillUnmount() {
    this.orbitControls.dispose();
    this.stopRendering = true;

    this.renderer.domElement.removeEventListener('mousedown', this.mouseDownEvent);
    this.renderer.domElement.removeEventListener('mouseup', this.mouseUpEvent);

    disposeScene(this.scene3D);
    this.scene3D.remove(this.planData.plan);
    this.scene3D.remove(this.planData.grid);

    this.scene3D = null;
    // this.planData.sceneGraph = null;
    this.planData = null;

  }

  componentWillReceiveProps(nextProps) {
    let {width, height} = nextProps;
    let {camera, renderer, scene3D} = this;

    let actions = {
      areaActions: this.context.areaActions,
      holesActions: this.context.holesActions,
      itemsActions: this.context.itemsActions,
      linesActions: this.context.linesActions,
      projectActions: this.context.projectActions
    };

    this.width = width;
    this.height = height;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    if (nextProps.state.scene !== this.props.state.scene) {

      let changedValues = diff(this.props.state.scene, nextProps.state.scene);
      updateScene(this.planData, nextProps.state.scene, this.props.state.scene, changedValues.toJS(), actions, this.context.catalog);
    }

    renderer.setSize(width, height);
    //renderer.render(scene3D, camera);
  }

  render() {
    return React.createElement("div", {
      ref: "canvasWrapper"
    });
  }
}

Scene3DViewer.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

Scene3DViewer.contextTypes = {
  areaActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object
};
