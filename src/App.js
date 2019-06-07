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
  }
  render(){
      return (
        <div>
          <UserForm />
          <div>
          <OurMap />
          </div>
        </div>
      )
}
}

export default App;
