import React from 'react';
import PropTypes from 'prop-types';
import PanelElementEditor from './panel-element-editor/panel-element-editor';
import PanelLayers from './panel-layers';
import PanelLayerElements from './panel-layer-elements';
import * as SharedStyle from '../../shared-style';
import CatalogList from '../catalog-view/catalog-list';

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '20px'
};

export default function Sidebar({state, width, height, sidebarComponents}) {

  return (
    <aside
      style={{width, height, ...STYLE}}
      onKeyDown={event => event.stopPropagation()}
      onKeyUp={event => event.stopPropagation()}
      className="sidebar"
    >
      <div className="catalogs">
        <CatalogList state={state} width={width} height={height} />
      </div>
      <div className="layers"><PanelLayers state={state}/></div>
      <div className="layer-elements"><PanelLayerElements mode={state.mode} layers={state.scene.layers} selectedLayer={state.scene.selectedLayer}/></div>
      <div className="properties"><PanelElementEditor state={state}/></div>
      {sidebarComponents.map((Component, index) => <Component state={state} key={index}/>)}
    </aside>
  );
}

Sidebar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
