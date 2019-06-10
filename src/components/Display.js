import React, {Component} from 'react'

class Display extends Component{
  constructor(props){
    super(props)
    this.state = {
      displayPlanes: []
    }
  }
  handleDisplayPlanes(){
    let newDisplayPlanes = this.props.loggedUserInfo.usersPlanesIds
    this.setState({
      displayPlanes: newDisplayPlanes
    })
  }
  render(){
    // console.log(`this is displayPlanes ${this.state.displayPlanes}`);
    return(
      <div>
      {this.props.isLoggedIn ?
      <div>{this.props.loggedUserInfo.username}
      <h3>Planes you are tracking:</h3>
      <ul>
      {this.props.loggedUserInfo.usersPlanesIds.map(planes => (
          <li key={planes}>{planes}<button onClick={()=>this.props.handlePlaneDelete(planes)}>X</button></li>
      ))} </ul></div> : null }
      </div>
    )
  }
}

export default Display
