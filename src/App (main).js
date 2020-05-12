import React, { useState } from 'react';

import ol from 'openlayers';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';

import 'ol/ol.css';
import './App.css';
import 'antd/dist/antd.css';
import './react-geo.css';

import { Drawer } from 'antd';

import {
  MapComponent,
  SimpleButton,
  NominatimSearch,
  MeasureButton,
  LayerTree
} from '@terrestris/react-geo';

const layerGroup = new OlLayerGroup({
  name: 'OSM Layers Group',
  layers: [
    new OlLayerTile({
      source: new OlSourceOsm(),
      name: 'OSM'
    }),
    new OlLayerTile({
      name: 'OSM-Overlay-WMS',
      minResolution: 0,
      maxResolution: 200,
      source: new OlSourceTileWMS({
        url: 'https://ows.terrestris.de/osm/service',
        params: {
          'LAYERS': 'OSM-Overlay-WMS'
        }
      })
    }),
  ]
});

const map = new OlMap({
  view: new OlView({
    center: ol.proj.fromLonLat([55.9772, 54.7334]),
    zoom: 10,
  }),
  layers: [
    new OlLayerTile({
      name: 'Yandex',
      source: new XYZ({
        url: 'http://vec02.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU'
      })
    }),
    layerGroup
  ]
});

function App() {
  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible);
  }

  return (
    <div className="App">
      <MapComponent
        map={map}
      />
      <SimpleButton
        style={{position: 'fixed', top: '30px', right: '30px'}}
        onClick={toggleDrawer}
        icon="bars"
      />
      <Drawer
        title="Navigation"
        placement="right"
        onClose={toggleDrawer}
        visible={visible}
        mask={false}
      >
        <NominatimSearch
          key="search"
          map={map}
        />
      <MeasureButton
          key="measureButton"
          name="line"
          map={map}
          measureType="line"
          icon="pencil"
        >
          Measure distance
      </MeasureButton>
        <LayerTree
          map={map}
        />
      </Drawer>
    </div>
  );
}

export default App;
