import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
import Display from './components/Display.js';
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
    this.intervalID=this.intervalID.bind(this)

    this.state={
      isLoggedIn:false,
      planeArray:[],

      loggedUserInfo: {
        username: "",
        userDatabaseID: null,
        usersPlanesIds: [], //make sure that we add planes back on log in.
        myPlanesData: []
      }
    }
    this.handleAPICall=this.handleAPICall.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
    this.handlePlaneArray=this.handlePlaneArray.bind(this)

    //TESTING ZONE

    this.callOpenSkyAPI = this.callOpenSkyAPI.bind(this);
    this.parallelAPIs = this.parallelAPIs.bind(this);
    this.callBackendAPI = this.callBackendAPI.bind(this);

    //END TESTING ZONE
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
    fetch('https://opensky-network.org/api/states/all?lamin=45.6272&lomin=-123.1207&lamax=49.2827&lomax=-115.4260').then(data => data.json()).then(jData => this.handlePlaneArray(jData.states));
    console.log('handleAPICall');
  }

  componentDidMount() {
    this.handleAPICall();
    // this.intervalID();
 }

  intervalID(){
    this.interval = setInterval(()=>{
      if(this.state.isLoggedIn){
        this.parallelAPIs();
      }else{
        this.handleAPICall()
      }},60000)
  }
  //TESTING ZONE
  //THIS WORKS - DON'T BREAK IT
  //The 'async' allows the javascript in the function to use await statements
  parallelAPIs = async function() {
    console.log("Launching Parallel API calls");

    //Begins both of the API calls as Promises
    let openSkyPromise = new Promise((resolveSent, reject) => {
      this.callOpenSkyAPI(resolveSent);
    });
    let backendPromise = new Promise((resolveSent, reject) => {
      this.callBackendAPI(resolveSent);
    });

    //This pauses the script here until each part of this promise has completed a resolve
    await Promise.all([openSkyPromise, backendPromise]);

    //Calculate the user's arrays here
    let userTrackedPlanes = [];
    for(let i = 0; i < this.state.planeArray.length; i++) {
      let thisPlanesICAO = this.state.planeArray[i][0];
      if (this.state.loggedUserInfo.usersPlanesIds.indexOf(thisPlanesICAO) !== -1) {
        userTrackedPlanes.push(this.state.planeArray[i]);
      }
    }
    //Add these to state!
    console.log(userTrackedPlanes);

    this.setState( (prevState) => {
      return {
        loggedUserInfo: Object.assign(
          {},
          prevState.loggedUserInfo,
          {myPlanesData: userTrackedPlanes}
        )}
      })
  };

  //OpenSky api call - used for the promise
  callOpenSkyAPI(resolution) {
    // console.log("API CALL");
    fetch('https://opensky-network.org/api/states/all?lamin=45.6272&lomin=-123.1207&lamax=49.2827&lomax=-115.4260').then(data => data.json()).then(jData => {
      // console.log(jData.states);
      this.setState({
        planeArray: jData.states
      }, () => {
        // console.log("OpenSky Done");
        resolution("OpenSky Done");
      })
    })
  }

  callBackendAPI(resolution) {
    // console.log("GET THE PLANES");
    fetch(`http://localhost:3000/users/${this.state.loggedUserInfo.userDatabaseID}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(data => {
      return data.json();
    }).then(jData => {
      let usersPlaneArray = [];
      let tempDeleteIDs = [];
      for(let i = 0; i < jData.length; i++) {
        usersPlaneArray.push(jData[i].icao_id);
        tempDeleteIDs.push(jData[i].plane_database_id);
      }
      this.setState( (prevState) => {
        return {
          loggedUserInfo: Object.assign(
            {},
            prevState.loggedUserInfo,
            {usersPlanesIds: usersPlaneArray},
            {deleteID: tempDeleteIDs}
          )}
        }, () => {
          // console.log("Backend Done");
          resolution("Backend Done");
        })
    });
  }











  //END TESTING ZONE


  handleLogIn(userData){
    // console.log(userData);
    // console.log(this.state);
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
              usersPlanesIds: [],
              myPlanesData: []
            }
          }
        })
        console.log("LOGGED IN");
        // window.clearInterval(this.intervalID());
        // this.intervalID();
      } else {
        console.log("INVALID CREDENTIALS");
      }
    })
  }

  getUsersPlanes() {
    console.log("GET THE PLANES");
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
          myPlanesData: [],
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

  handlePlaneDelete(planes){
    // console.log(planes);
    let deleteIndex = this.state.loggedUserInfo.usersPlanesIds.indexOf(planes);
    // console.log(deleteIndex);
    fetch(`http://localhost:3000/planes/${this.state.loggedUserInfo.deleteID[deleteIndex]}`,{
      method:"DELETE"
    }).then(this.setState( (prevState) => {
      prevState.loggedUserInfo.usersPlanesIds.splice(deleteIndex,1)
      prevState.loggedUserInfo.myPlanesData.splice(deleteIndex,1)
      prevState.loggedUserInfo.deleteID.splice(deleteIndex,1)
      // console.log(prevState);
      return {
        loggedUserInfo: Object.assign(
          {},
          prevState.loggedUserInfo
        )
        }
      }))
  }

  // usersPlanesIds: [],
  // myPlanesData: [],
  // deleteID: []



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
          <Display
          isLoggedIn={this.state.isLoggedIn}
          loggedUserInfo={this.state.loggedUserInfo}
          handlePlaneDelete={this.handlePlaneDelete}
          />
          </div>
        </div>
      )
    }
}

export default App;
