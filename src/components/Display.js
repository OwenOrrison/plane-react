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
      <div>
      <h1>{this.props.loggedUserInfo.username}</h1>
      <h3>Planes you are tracking:</h3>
      <ul>
      {this.props.loggedUserInfo.usersPlanesIds.map(planes => (
          <li key={planes}>{planes}<button onClick={()=>this.props.handlePlaneDelete(planes)}>X</button></li>
      ))}
      </ul>

      <h3>Planes no longer in view:</h3>
      <ul>
      {this.props.loggedUserInfo.lostPlanes ? this.props.loggedUserInfo.lostPlanes.map(planes => (
          <li key={planes}>{planes}<button onClick={()=>this.props.handlePlaneDelete(planes)}>X</button></li>
      )) : null}
      </ul></div>
      : null }
      </div>


    )
  }
}

export default Display
