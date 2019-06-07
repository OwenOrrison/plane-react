import React, {Component} from 'react';
import OurMap from './components/OurMap.js';
import Form from './components/Form.js'
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
        <Form />
        <div>
        <OurMap />
        </div>
        </div>
      )
}
}

export default App;
