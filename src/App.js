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
    this.getBaseURL =this.getBaseURL.bind(this);

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
    this.intervalID();
 }

  intervalID(){
    this.interval = setInterval(()=>{
      if(this.state.isLoggedIn){
        this.parallelAPIs();
      }else{
        this.handleAPICall()
      }},10000)
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


    //Plane: {icao_id, deleteID, [trackingUsernames], isThisUsers}
    //Iterates through all tracked planes, and forms a temporary object for storing the relevent data.
    let trackedPlaneArray = [];
    let lastPlane = {};
    let allTrackedPlaneData = this.state.loggedUserInfo.allPlaneData;
    for (let i = 0; i < allTrackedPlaneData.length; i++) {
      if(lastPlane.icao_id === allTrackedPlaneData[i].icao_id) { //Same plane, tack on a username
        lastPlane.trackingUsernames.push(allTrackedPlaneData[i].username);
        if(allTrackedPlaneData[i].linked_user_id === this.state.loggedUserInfo.userDatabaseID) {
          lastPlane.isThisUsers = true;
        }
      } else { //new plane. Append the previous one, then make the new one.
        if(i > 0) {
          trackedPlaneArray.push(lastPlane);
        }
        lastPlane = Object.assign({},
          {icao_id: allTrackedPlaneData[i].icao_id,
          deleteID: allTrackedPlaneData[i].plane_database_id,
          trackingUsernames: [],
          isThisUsers: false},
        );
        lastPlane.trackingUsernames.push(allTrackedPlaneData[i].username);
        if(allTrackedPlaneData[i].linked_user_id === this.state.loggedUserInfo.userDatabaseID) {
          lastPlane.isThisUsers = true;
        }
      }
      if(i+1 === allTrackedPlaneData.length) { //Last plane, append it.
        trackedPlaneArray.push(lastPlane);
      }
    }

    //Now iterate through the opensky plane list, and break it up into three arrays:
    let userTrackedPlanes = []; //Planes the the user is tracking.
    let userICAOIds = [];
    let userDeleteIDs = [];
    let otherUsersTrackedPlanes = []; //Planes the user is not tracking, but others are
    let leftoverPlanes = []; //Planes no one is tracking
    for(let i = 0; i < this.state.planeArray.length; i++) { //Iterate over all Opensky Planes
      let thisPlane = this.state.planeArray[i];
      let thisPlanesICAO = thisPlane[0]; //For each opensky plane
      let isTracked = false;

      for(let j = 0; j < trackedPlaneArray.length; j++) { //Iterate over all tracked planes
        if(thisPlanesICAO === trackedPlaneArray[j].icao_id) { //Its a tracked plane!
          thisPlane.push(trackedPlaneArray[j].trackingUsernames); //Add the list of usernames
          if(trackedPlaneArray[j].isThisUsers){ //Tracked by user
            userTrackedPlanes.push(thisPlane);
            userICAOIds.push(trackedPlaneArray[j].icao_id);
            userDeleteIDs.push(trackedPlaneArray[j].deleteID);
          } else { //Only tracked by others
            otherUsersTrackedPlanes.push(thisPlane);
          }
          isTracked = true;
          j = trackedPlaneArray.length * 2; //Leave this loop.
        }
      } //End loop over tracked planes
      if(isTracked === false) { //Untracked plane.
        leftoverPlanes.push(thisPlane);
      }

    } //End loop over Opensky planes


    this.setState( (prevState) => {
      return {
        othersPlaneArray: otherUsersTrackedPlanes,
        planeArray: leftoverPlanes,
        loggedUserInfo: Object.assign(
          {},
          prevState.loggedUserInfo,
          {myPlanesData: userTrackedPlanes,
          usersPlanesIds: userICAOIds,
          deleteID: userDeleteIDs}
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
    console.log("GET THE PLANES");
    fetch(`${this.getBaseURL()}/planes`, {
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(data => {
      return data.json();
    }).then(jData => {
      let allPlaneData = [];
      for(let i = 0; i < jData.length; i++) {
        allPlaneData.push(jData[i]);
      }
      this.setState( (prevState) => {
        return {
          loggedUserInfo: Object.assign(
            {},
            prevState.loggedUserInfo,
            {allPlaneData: allPlaneData},
          )}
        }, () => {
          // console.log("Backend Done");
          resolution("Backend Done");
        })
    });
  }

  getBaseURL() {
    let baseURL
    if(process.env["IS_ON_HEROKU"]) {
      baseURL = "https://whispering-mesa-41107.herokuapp.com";
    } else {
      baseURL = "http://localhost:3000";
    }
    return baseURL;
  }


  handleLogIn(userData){
    // console.log(userData);
    // console.log(this.state);
    fetch(`${this.getBaseURL()}/users/logIn`, {
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
        window.clearInterval(this.interval);
        this.parallelAPIs();
        this.intervalID();
      } else {
        console.log("INVALID CREDENTIALS");
      }
    })
  }

  getUsersPlanes() {
    console.log("GET THE PLANES");
    fetch(`${this.getBaseURL()}/users/${this.state.loggedUserInfo.userDatabaseID}`, {
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
        othersPlaneArray: [],
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
    fetch(`${this.getBaseURL()}/users`, {
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
    fetch(`${this.getBaseURL()}/users/${this.state.loggedUserInfo.userDatabaseID}`, {
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
    fetch(`${this.getBaseURL()}/users/${this.state.loggedUserInfo.userDatabaseID}`, {
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
    fetch(`${this.getBaseURL()}/planes/${this.state.loggedUserInfo.deleteID[deleteIndex]}`,{
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
          othersPlaneArray={this.state.othersPlaneArray}
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
