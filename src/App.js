import { calculateNewValue } from '@testing-library/user-event/dist/utils';
import React from 'react';
import { useState } from 'react';
const BASE_URL = 'http://localhost:8000/api/auth/';

const AUTH_TOKEN = "auth_token";

class App extends React.Component {



  constructor() {
    super();
    this.state = {
      loginMessage: "",
      token: "",
      users: [],
      finalVal: null,
      operandA: null,
      operandB: null
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getSecureData = this.getSecureData.bind(this);
    this.addValues = this.addValues.bind(this);
    this.register = this.register.bind(this);
  }

  // Called when constructor is finished building component.
  componentDidMount() {
    if (sessionStorage.getItem(AUTH_TOKEN) != null) {
      this.setState({
        token: sessionStorage.getItem(AUTH_TOKEN)
      });
    }
  }

  // Executes when button pressed.
  login(e) {
    const email = this.email.value;
    const password = this.password.value;


    const URL = BASE_URL + 'login';
    this.email.value = ""; // Clear input.
    this.password.value = ""; // Clear input.


    fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })

      // Response received.
      .then(response => response.json())
      // Data retrieved.
      .then(json => {
        // Store token with session data.
        if (json["access_token"] != null) {
          let token = json["access_token"];
          let email = json["user"]["email"];
          sessionStorage.setItem(AUTH_TOKEN, token);
          sessionStorage.setItem("email", email);
          this.token = token;
          this.email = email;
          this.setState({
            loginMessage: "The user has been logged in.",
            token: token, email: email
          });
        }
        else {
          this.setState({
            loginMessage:
              "An error occured at login. Try again."
          });
        }
      })
      // Data not retrieved.
      .catch(function (error) {
        if (sessionStorage[""]) {
          alert(error);
        }
      })
  }

  logout(e) {
    alert("Inside logout");
    if (sessionStorage.getItem([AUTH_TOKEN]) != null) {
      sessionStorage.clear();
    }
    this.setState({ todos: [], loginMessage: "", token: "" });
  }

  getSecureData(e) {
    let token = sessionStorage.getItem('auth_token');
    const URL = BASE_URL + 'getUsers';

    // This code gets data from the remote server.
    // fetch(URL).then(response => response.json())
    fetch(URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      // Data Retrieved.
      .then((data) => {
        alert(JSON.stringify(data))
        this.setState({ users: data['users'] });
      })

      // Data Not Retrieved.
      .catch((error) => {
        alert(error);
      });
  }

  addValues(e) {
    const URL = BASE_URL + 'addTwoNumbers';
    const operandOne = this.operandOne.value;
    const operandTwo = this.operandTwo.value;
    this.operandOne.value = ""; // Clear input.
    this.operandTwo.value = ""; // Clear input.
    // console.log(e)

    fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operandA: operandOne,
        operandB: operandTwo,
      })
    })
      // Response received.
      .then(response => response.json())
      // Data retrieved.
      .then(json => {
        let sumResult = json["sum"];
        this.finalVal = sumResult
        this.operandA = operandOne
        this.operandB = operandTwo
        this.setState({ finalVal: `${sumResult}` });

      })
      // Data not retrieved.
      .catch(function (error) {
        if (sessionStorage[""]) {
          alert(error);
        }
      })
  }


  // // Executes when button pressed.
  register(e) {

    const email = this.email.value;
    const password = this.password.value;
    const name = this.name.value;

    const URL = BASE_URL + 'register';
    this.name.value = ""; // Clear input.
    this.email.value = ""; // Clear input.
    this.password.value = ""; // Clear input.

    fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        password_confirmation: password,
      })
    })
    console.log("success")
      // Response received.
      .then(response => response.json())
      // Data retrieved.
      .then(json => {
        // Store token with session data.
        // if (json["access_token"] != null) {
        // let token = json["access_token"];
        let name = name["user"]["name"];
        let email = json["user"]["email"];
        let password = json["user"]["password"];
        // sessionStorage.setItem(AUTH_TOKEN, token);
        // sessionStorage.setItem("email", email);
        // this.token = token;
        this.name = name;
        this.email = email;
        this.password = password;

        this.setState({
          loginMessage: "The user has been logged in.",
          // token: token, email: email
          name: name, email: email, password: password
        });
        // }
        // else {
        //   this.setState({
        //     loginMessage:
        //       "An error occured at login. Try again."
        //   });
        // }
      })
      // Data not retrieved.
      .catch(function (error) {
        if (sessionStorage[""]) {
          alert(error);
        }
      })

  }



  render() {
    return (
      <div>
        {this.finalVal &&
          <h2>Final result from addTwoNumbers function in the php server is: {this.operandA} + {this.operandB} = {this.finalVal}</h2>}
        <table>
          <thead>
            <tr>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Name: </td>
              <td> <input type='text' ref={(nameInput) => this.name = nameInput} /> </td>
            </tr>
            <tr>
              <td> Email: </td>
              <td> <input type='text' ref={(emailInput) => this.email = emailInput} /> </td>
            </tr>
            <tr>
              <td>Password: </td>
              <td> <input type='text' ref={(passwordInput) => this.password = passwordInput} /></td>
            </tr>

            <tr><td><button onClick={this.login}>Login</button></td><td></td></tr>
            <tr><td><button onClick={this.register}>Register</button></td><td></td></tr>
            <tr>
              <td>Operand1: </td>
              <td> <input type='text' ref={(operandOneInput) => this.operandOne = operandOneInput} /></td>
            </tr>
            <tr>
              <td>Operand2: </td>
              <td> <input type='text' ref={(operandTwoInput) => this.operandTwo = operandTwoInput} /></td>
            </tr>
            <tr><td><button onClick={this.addValues}>Calculate</button></td><td></td></tr>
          </tbody>
        </table>
        {this.state.loginMessage}<br />{this.state.token}<br /><br />

        <button onClick={this.getSecureData}>Get Secure Data</button>
        <ul>
          {this.state.users.map((user, index) => (
            <li key={index}>{index} {user.name} {user.email}</li>
          ))}
        </ul>
        <br />
        <button onClick={this.logout}>Logout</button>

      </div>
    )
  }
}
export default App;
