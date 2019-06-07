import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
import Form from './components/Form.js'
import UserForm from './components/UserForm.js'
import './App.css';

class App extends Component {

  constructor(props){
    super(props)

    this.handleLogIn = this.handleLogIn.bind(this);

    this.state={
      isLoggedIn:false,
      planeArray:[],
      userData: ''
    }
  }

  handleLogIn(userData){
    console.log(userData);
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
      console.log(jData);
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



  render(){
      return (
        <div>
          <UserForm handleLogIn={this.handleLogIn} handleCreateUser={this.handleCreateUser}/>
          <div>
          <OurMap />
          </div>
        </div>
      )
    }

}

export default App;
