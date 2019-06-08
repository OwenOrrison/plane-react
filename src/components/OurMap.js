import React, {Component} from 'react';
import{ Map, TileLayer, Marker} from 'react-leaflet';
import L from 'leaflet'
import '../App.css';
import airplaneIcon from '../airplane-shape.svg'

// const mapBoxTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const mapBoxAttr = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
// const mapCenter = [51.505, -0.09];
// const zoomLevel = 13;
// const id = 'mapid'

const myIcon= L.icon({
  iconUrl:airplaneIcon,
  iconSize:[25,41],
  iconAnchor: [12.5,41],
  popupAnchor:[0, -41]
})

class OurMap extends Component {
  constructor(props){
    super(props)
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 2,
  }
  }
  render(){
      console.log(this.props.planeArray)
      const position=[this.state.lat, this.state.lng]
      return (
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.props.planeArray.map(plane => (
            <Marker
              key={plane}
              position={[plane[6],plane[5]]}
              icon={myIcon}
            />
          ))}

        </Map>
      )
}
}

export default OurMap;
