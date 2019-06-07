import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
import Form from './components/Form.js'
import UserForm from './components/UserForm.js'
import './App.css';


class App extends Component {
  constructor(props){
    super(props)
    this.state={
      isLoggedIn:false,
      planeArray:[],
      userData: ''
    }
    this.handleAPICall=this.handleAPICall.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
    this.handlePlaneArray=this.handlePlaneArray.bind(this)
  }
  handlePlaneArray(planes){
    let newArray=[]
    console.log(planes);
    planes.forEach((planes) =>{
      newArray.push(planes)
    })
    this.setState({
      planeArray: newArray
    })
    console.log(this.state.planeArray);
  }

  handleAPICall(){
    fetch('https://opensky-network.org/api/states/all?lamin=45.6272&lomin=-123.1207&lamax=49.2827&lomax=-115.4260').then(data => data.json()).then(jData => this.handlePlaneArray(jData.states))
  }
  componentDidMount(){
    this.handleAPICall()
  }
  render(){
      return (
        <div>
          <UserForm />
          <div>
          <OurMap
          planeArray={this.state.planeArray}
          />
          </div>
        </div>
      )
}
}

export default App;
