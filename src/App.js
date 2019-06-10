import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
// import Form from './components/Form.js'
import UserForm from './components/UserForm.js'
import './App.css';


class App extends Component {

  constructor(props){
    super(props)

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleDeleteUser  =this.handleDeleteUser.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handlePlaneDelete = this.handlePlaneDelete.bind(this);

    this.state={
      isLoggedIn:false,
      planeArray:[],

      loggedUserInfo: {
        username: "",
        userDatabaseID: null,
        usersPlanesIds: [] //make sure that we add planes back on log in.
      }
    }
    this.handleAPICall=this.handleAPICall.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
    this.handlePlaneArray=this.handlePlaneArray.bind(this)
  }
  handlePlaneArray(planes){
    let newArray=[]
    planes.forEach((planes) =>{
      newArray.push(planes)
    })
    this.setState({
      planeArray: newArray
    })
  }

  handleAPICall(){
    fetch('https://opensky-network.org/api/states/all?lamin=45.6272&lomin=-123.1207&lamax=49.2827&lomax=-115.4260').then(data => data.json()).then(jData => this.handlePlaneArray(jData.states))
  }
  componentDidMount(){
    this.handleAPICall()
  }

  handleLogIn(userData){
    console.log(userData);
    console.log(this.state);
    fetch(`http://localhost:3000/users/logIn`, {
      body: JSON.stringify(userData),
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
		.then(data => {
      return data.json();
    }).then(jData => {
      if(jData !== null) {
        this.setState( (prevState) => {
          return {
            isLoggedIn:true,
            loggedUserInfo: {
              username: jData.username,
              userDatabaseID: jData.id,
              usersPlanesIds: []
            }
          }
        })
        console.log("LOGGED IN");
        this.getUsersPlanes();
      } else {
        console.log("INVALID CREDENTIALS");
      }
    })
  }

  getUsersPlanes() {
    fetch(`http://localhost:3000/users/${this.state.loggedUserInfo.userDatabaseID}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(data => {
      return data.json();
    }).then(jData => {
      let tempUserPlaneId = [];
      let tempDBID=[];
      for(let i = 0; i < jData.length; i++) {
        tempUserPlaneId.push(jData[i].icao_id);
        tempDBID.push(jData[i].plane_database_id);
      }
      this.setState( (prevState) => {
        return {
          loggedUserInfo: Object.assign(
            {},
            prevState.loggedUserInfo,
            {usersPlanesIds: tempUserPlaneId},
            {deleteID: tempDBID}
          )
          }
        })
    });
  }

  handleLogOut() {
    this.setState( (prevState) => {
      return {
        isLoggedIn:false,
        loggedUserInfo: {
          username: "",
          userDatabaseID: null,
          usersPlanesIds: [],
          deleteID: []
        }
      }
    })
  }

  handleCreateUser(userData){
    console.log(userData);
    fetch(`http://localhost:3000/users`, {
      body: JSON.stringify(userData),
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
  /////////////////////////
  /////////////////////////
  //Move to lower component
  /////////////////////////
  /////////////////////////
  handlePlaneDelete(planes){
    console.log(planes);
    let deleteIndex = this.state.loggedUserInfo.usersPlanesIds.indexOf(planes);
    console.log(deleteIndex);
    fetch(`http://localhost:3000/planes/${this.state.loggedUserInfo.deleteID[deleteIndex]}`,{
      method:"DELETE"
    })
  }
  /////////////////////////
  /////////////////////////
  /////////////////////////
  /////////////////////////

  handleDeleteUser(){
    fetch(`http://localhost:3000/users/${this.state.loggedUserInfo.userDatabaseID}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      return data.json();
    }).then(jData => {
      console.log(jData);
      this.handleLogOut();
    })
  }

  handleEditUser(userData){
    console.log(userData);
    console.log(this.state);
    console.log(this.state.loggedUserInfo.userDatabaseID);
    fetch(`http://localhost:3000/users/${this.state.loggedUserInfo.userDatabaseID}`, {
      body: JSON.stringify(userData),
      method: "PUT",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(data => {
      return data.json();
    }).then(jData => {
      // console.log(jData);
    })
  }



  render(){
      return (
        <div>
        <h1>Inclined Plane™</h1>
          <UserForm handleLogIn={this.handleLogIn}
          handleLogOut={this.handleLogOut}
          handleCreateUser={this.handleCreateUser}
          handleDeleteUser={this.handleDeleteUser}
          handleEditUser={this.handleEditUser}
          isLoggedIn={this.state.isLoggedIn}
          loggedUserInfo={this.state.loggedUserInfo}/>
          <div>
          <OurMap
          planeArray={this.state.planeArray}
          userInfo={this.state.loggedUserInfo}
          isLoggedIn={this.state.isLoggedIn}
          />
          </div>
          <div>
          {this.state.isLoggedIn ?
          <div>{this.state.loggedUserInfo.username}
          <h3>Planes you are tracking:</h3>
          <ul>
          {this.state.loggedUserInfo.usersPlanesIds.map(planes => (
              <li key={planes}>{planes}<button onClick={()=>this.handlePlaneDelete(planes)}>X</button></li>
          ))} </ul></div> : null }

          </div>
        </div>
      )
    }

}

export default App;
