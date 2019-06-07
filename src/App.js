import React, {Component} from 'react';
import{ Map, TileLayer} from 'react-leaflet';
import './App.css';

const mapBoxTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const mapBoxAttr = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
const mapCenter = [51.505, -0.09];
const zoomLevel = 13;
const id = 'mapid'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 2,
  }
  }
  render(){
    const position = [this.state.lat, this.state.lng]
      return (
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        </Map>
      )
}
}

export default App;
