import React, {Component} from 'react'

class Form extends Component{
  constructor(props){
    super(props)
    this.state ={
      createUsername: '',
      createPassword: '',
      username: '',
      password: ''
    }
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.clearForm=this.clearForm.bind(this)
    this.handleLogIn=this.handleLogIn.bind(this)
  }
  handleChange(event){
    this.setState({[event.target.name]: event.target.value})
  }
  handleSubmit(event){
    event.preventDefault()
    this.props.handleCreateTask(this.state.createUsername, this.state.createPassword)
    this.clearForm()
  }
  handleLogIn(event){
    event.preventDefault()
    this.props.handleLogIn(this.state.username, this.state.password)
    this.clearForm()
  }
  clearForm(){
    this.setState({
      createUsername: '',
      createPassword: '',
      username: '',
      password: ''
    })
  }
  render(){
    return(
      <div className="form">
      <form className="createUser" onSubmit={this.handleSubmit}>
        <label>Username</label>
        <input type='text' name="createUsername" value={this.state.createUsername} onChange={this.handleChange} placeholder="CREATE A USERNAME" />
        <label>Password</label>
        <input type='text' name="createPassword" value={this.state.createPassword} onChange={this.handleChange} placeholder="CREATE A PASSWORD" />
        <button type='submit' className="submit-button">CREATE</button>
      </form>
      <form className="logIn" onSubmit={this.handleLogIn}>
        <label>Username</label>
        <input type='text' name="username" value={this.state.username} onChange={this.handleChange} placeholder="USERNAME" />
        <label>Password</label>
        <input type='text' name="password" value={this.state.password} onChange={this.handleChange} placeholder="PASSWORD" />
        <button type='submit' className="submit-button">LOG IN</button>
      </form>
      </div>
    )
  }
}

export default Form
