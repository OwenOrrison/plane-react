import React, { Component } from "react";

class UserForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.swapForm = this.swapForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.setFormDisplay = this.setFormDisplay.bind(this);

    this.state = {
      displayForm: true,
      formType: "logIn", //"logIn", "createUser", or "editUser"
      formData: {
        username: "",
        password: ""
      }
    }

  }

  //Change the form values
  handleChange(e) {
    this.setState({formData[e.target.name]: e.target.value});
  }

  //Have this call the correct function in App to login/create/edit
  handleSubmit(e) {
    e.preventDefault();

    //Call the correct function here!
    if(formType === "logIn"){
      // this.props.HANDLELOGIN(this.state.formData);
    } else if (formType === "createUser") {
      // this.props.HANDLECREATEUSER(this.state.formData);
    } else if (formType === "editUser") {
      // this.props.HANDLEEDITUSER(this.state.formData);
    }

    this.clearForm();
  }

  clearForm() {
    this.setState({
      formData: {
        username: "",
        password: ""
      }
    });
  }

  swapForm(newForm = "") {
    if(newForm != this.state.formType) {
      this.setState({formType: newForm});
      this.clearForm();
    }
  }

  //
  setFormDisplay(newFormState) {

  }

  render() {
    return (
      <div>
        <button onClick={this.swapForm("logIn")}> Log In </button>
        <button onClick={this.swapForm("createUser")}> Create New Account </button>
        <button onClick={this.swapForm("editUser")}> (show only if logged in) Edit Account Details </button>
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <input type='text' value={this.state.formData.username} onChange={this.handleChange} name="username"/>
            <input type='text' value={this.state.formData.username} onChange={this.handleChange} name="password"/>
            <button type="submit" className="submit-button"><i className="fas fa-plus"></i></button>
          </form>
        </div>
      </div>
    );
  };
};

export default UserForm;
