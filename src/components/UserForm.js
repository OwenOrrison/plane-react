import React, { Component } from "react";

class UserForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.setDisplayType = this.setDisplayType.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      displayForm: true,
      displayButton: false,
      formType: "logIn", //"logIn", "createUser", "editUser", or "deleteUser"
      formData: {
        username: "",
        password: ""
      }
    }

  }

  //Change the form values
  handleChange(e) {

    let whichInput = e.target.name;
    let newValue = e.target.value;

    this.setState( (prevState) => {
      return {
        formData: Object.assign(
          {},
          prevState.formData,
          {[whichInput]: newValue}
        )
      }
    })
  }

  //Have this call the correct function in App to login/create/edit
  handleSubmit(e) {
    e.preventDefault();

    //Call the correct function here!
    if(this.state.formType === "logIn"){
      this.props.handleLogIn(this.state.formData);
    } else if (this.state.formType === "createUser") {
      this.props.handleCreateUser(this.state.formData);
      console.log("createUser");
    } else if (this.state.formType === "editUser") {
      this.props.handleEditUser(this.state.formData);
      console.log("editUser");
    }

    this.clearForm();
    this.setDisplayType(false, false);
  }

  handleButtonClick(e) {

  }

  clearForm() {
    this.setState({
      formData: {
        username: "",
        password: ""
      }
    });
  }

  //Set whether the form should be displayed or not
  setDisplayType(whichForm, newFormState, newButtonState) {
    this.setState({
      formType: whichForm,
      displayForm: newFormState,
      displayButton: newButtonState
    });
    this.clearForm();
  }

  render() {
    let submitButtonText = "BUTTON TEXT UNASSIGNED";
    if(this.state.formType === "logIn") {
      submitButtonText = "Log In";
    } else if (this.state.formType === "createUser") {
      submitButtonText = "Create Account";
    } else if (this.state.formType === "editUser") {
      submitButtonText = "Edit Details";
    } else if (this.state.formType === "deleteUser") {
      submitButtonText = "CONFIRM DELETE ACCOUNT";
    } else if (this.state.formType === "logOut") {
      submitButtonText = "Confirm log out";
    }


    return (
      <div>

        <div className="nav">
        {this.props.isLoggedIn ?
          <div>
          <button onClick={() => {this.setDisplayType("editUser", true, false)}}> Edit Account Details </button>
          <button onClick={() => {this.setDisplayType("deleteUser", false, true)}}> Delete User Account </button>
          </div>
          :
          <div>
          <button onClick={() => {this.setDisplayType("logIn", true, false)}}> Log In </button>
          <button onClick={() => {this.setDisplayType("createUser", true, false)}}>  Create New Account </button>
          </div>
        }
        </div>

      {this.state.displayForm ?
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type='text' value={this.state.formData.username} onChange={this.handleChange} name="username"/>
            <input type='text' value={this.state.formData.password} onChange={this.handleChange} name="password"/>
            <button type="submit">{submitButtonText}</button>
          </form>
        </div> : "" }
        {this.state.displayButton ?
          <button onClick={()=>{this.handleButtonClick()}}> {submitButtonText} </button>
           : "" }
      </div>
    );
  };
};

export default UserForm;
