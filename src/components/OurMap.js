import React, {Component} from 'react';
import{ Map, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet';
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
      lat: 47.4162,
      lng: -121.0,
      zoom: 7,
    }
  this.handleMyPlanes=this.handleMyPlanes.bind(this)
  }

  handleMyPlanes(planeData, userData){
    console.log(planeData, userData);
    let myData = {
      planeData: planeData,
      userData: userData
    }
    fetch(`http://localhost:3000/planes`, {
      body: JSON.stringify(myData),
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      return data.json();
    }).then(jData => {
      console.log(jData);
    })
  }

  render(){
      // console.log("render");
      // console.log(this.props.userInfo);
      // console.log(this.props.planeArray);
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
            >
            {this.props.userInfo.usersPlanesIds.length > 0 ?
            <Tooltip direction="bottom" >
            {this.props.userInfo.usersPlanesIds.map(myPlane => (myPlane === plane[0] ? <p key={myPlane}>hello</p> : ""))}
            </Tooltip> : null }

              <Popup>
              <div>
              <ul>
                <li> icao_ID: {plane[0]}</li>
                <li> velocity: {plane[9]} m/s</li>
                <li> direction: {plane[10]}°</li>
              </ul>
              </div>
              {this.props.isLoggedIn ? <button onClick={() => {this.handleMyPlanes(plane[0],this.props.userInfo.userDatabaseID)}}>ADD TO MYTRACKER</button> : <p>LOG IN TO TRACK</p> }
              </Popup>
            </Marker>
          ))}
        </Map>
      )
}
}

export default OurMap;
