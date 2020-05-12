import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import MainMap from './Components/MainMap';
import NormalLoginForm from './Components/Autorization';

import './App.css';
import './Components/Autorization.css';

/* после данной строки идут импорты для карты */
import ol from 'openlayers';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';

import 'ol/ol.css';
import 'antd/dist/antd.css';
import './Components/react-geo.css';

import {
  Drawer,

} from 'antd';

import {
  MapComponent,
  SimpleButton,
  NominatimSearch,
  MeasureButton,
  LayerTree,
  MapProvider,
  mappify,
  onDropAware,
  DigitizeButton
} from '@terrestris/react-geo';

//import DrawFeature from '@boundlessgeo/sdk';

const MappifiedNominatimSearch = mappify(NominatimSearch);
const MappifiedMeasureButton = mappify(MeasureButton);
const MappifiedLayerTree = mappify(LayerTree);
const Map = mappify(onDropAware(MapComponent));

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
    new OlLayerTile({
      name: 'RB',
      source: new OlSourceTileWMS({
        url: 'http://localhost:8080/geoserver/cite/wms',
        params: {
          'LAYERS': 'cite:dist2'
        }
      })
    })
  ]
});

const map = new OlMap({
  view: new OlView({
    center: ol.proj.fromLonLat([55.9772, 54.7334]),
    zoom: 7,
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
/* конец данного блока */

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div>
          <Route exact path="/" component={NormalLoginForm} />
          <Route exact path="/map" component={MainMap} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
