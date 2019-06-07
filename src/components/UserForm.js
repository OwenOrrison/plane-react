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

  // this.setState({
  //   formData: Object.assign(
  //     {},
  //     this.state.formData,
  //     {[e.target.name]: e.target.value}
  //   )
  // })

  //Have this call the correct function in App to login/create/edit
  handleSubmit(e) {
    e.preventDefault();

    //Call the correct function here!
    if(this.state.formType === "logIn"){
      // this.props.HANDLELOGIN(this.state.formData);
      console.log("logIn");
    } else if (this.state.formType === "createUser") {
      // this.props.HANDLECREATEUSER(this.state.formData);
      console.log("createUser");
    } else if (this.state.formType === "editUser") {
      // this.props.HANDLEEDITUSER(this.state.formData);
      console.log("editUser");
    }

    this.clearForm();
    this.setFormDisplay(false);
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
    if(newForm !== this.state.formType) {
      this.setState({formType: newForm});
      this.clearForm();
    }
  }

  //Set whether the form should be displayed or not
  setFormDisplay(newFormState) {
    if(newFormState !== this.state.displayForm) {
      this.setState({displayForm: newFormState});
      this.clearForm();
    }
  }

  render() {
    let submitButtonText = "BUTTON TEXT UNASSIGNED";
    if(this.state.formType === "logIn") {
      submitButtonText = "Log In";
    } else if (this.state.formType === "createUser") {
      submitButtonText = "Create Account";
    } else if (this.state.formType === "editUser") {
      submitButtonText = "Edit Details";
    }
    return (
      <div>
        <button onClick={() => {this.swapForm("logIn")}}> (show only if not logged in) Log In </button>
        <button onClick={() => {this.swapForm("createUser")}}> (show only if not logged in) Create New Account </button>
        <button onClick={() => {this.swapForm("editUser"); this.setFormDisplay(true)}}> (show only if logged in) Edit Account Details </button>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input type='text' value={this.state.formData.username} onChange={this.handleChange} name="username"/>
            <input type='text' value={this.state.formData.password} onChange={this.handleChange} name="password"/>
            <button type="submit">{submitButtonText}</button>
          </form>
        </div>
      </div>
    );
  };
};

export default UserForm;
