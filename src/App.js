import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
import Form from './components/Form.js'
import UserForm from './components/UserForm.js'
import './App.css';

class App extends Component {

  constructor(props){
    super(props)

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);

    this.state={
      isLoggedIn:false,
      planeArray:[],
      loggedUserInfo: {
        username: "",
        userDatabaseID: null
      }
    }
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
              userDatabaseID: jData.id
            }
          }
        })
        console.log("LOGGED IN");
      } else {
        console.log("INVALID CREDENTIALS");
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
      console.log(jData);
    })
  }



  render(){
      return (
        <div>
          <UserForm handleLogIn={this.handleLogIn} handleCreateUser={this.handleCreateUser}
          handleEditUser={this.handleEditUser}
          isLoggedIn={this.state.isLoggedIn}
          loggedUserInfo={this.state.loggedUserInfo}/>
          <div>
          <OurMap />
          </div>
        </div>
      )
    }

}

export default App;
