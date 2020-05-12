import React, { useState } from 'react';

import ol from 'openlayers';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import OlSourceImage from 'ol/source/Image';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import NormalLoginForm from './Components/Autorization';
import { BrowserRouter, Route } from 'react-router-dom';

import 'ol/ol.css';
import './App.css';
import 'antd/dist/antd.css';
import './react-geo.css';
import './Components/Autorization.css';

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

function App() {
  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible);
  }

  return (
    <div className="App">
      
      <BrowserRouter>
        <div>
          <Route exact path="/login" component={NormalLoginForm} />
        </div>
      </BrowserRouter>

      <MapProvider
        map={map}
      >
        
        <Map />
        
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
          {/*<MappifiedNominatimSearch
            key="search"
          />*/}

          <DigitizeButton
              name="drawPoint"
              map={map}
              drawType="Point"
              icon="pencil"
            >
            &nbsp; Draw Point
          </DigitizeButton>

          {/*<DrawFeature map={map} />*/}

          <MappifiedMeasureButton
              key="measureButton"
              name="poly"
              map={map}
              measureType="polygon"
              icon="pencil"
            >
            &nbsp; Измерить площадь
          </MappifiedMeasureButton>

          <DigitizeButton
                name="selectAndModify"
                map={map}
                editType="Edit"
                icon="pencil"
              >
              &nbsp; Редактирование
          </DigitizeButton>

            <MappifiedLayerTree
              map={map}
            />
        </Drawer>
      </MapProvider>
    </div>
  );
}

export default App;
