import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';


const formSignIn = [
  {
    field: 'input',
    name: 'username',
    placeholder: 'Name',
    type: 'text'
  },
  {
    field: 'input',
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    autocomplete: 'current-password'
  },
  {
    field: 'button',
    placeholder: 'Sign In',
    onClick: 'signIn'
  }
]

const formSignUp = [
  {
    field: 'input',
    name: 'username',
    placeholder: 'Name',
    type: 'text',
    autocomplete: 'name'
  },
  {
    field: 'input',
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    autocomplete: 'current-password'
  },
  {
    field: 'input',
    name: 'email',
    placeholder: 'E-mail',
    type: 'email'
  },
  {
    field: 'input',
    name: 'phone_number',
    placeholder: 'Phone',
    type: 'number'
  },
  {
    field: 'button',
    placeholder: 'Sign Up',
    onClick: 'signUp'
  }
]

const formConfirm = [
  {
    field: 'input',
    name: 'username',
    placeholder: 'Name',
    type: 'text'
  },
  {
    field: 'input',
    name: 'authenticationCode',
    placeholder: 'Authentication Code',
    type: 'number',
  },
  {
    field: 'button',
    placeholder: 'Confirm',
    onClick: 'confirmSignUp'
  }
]

const formSignOut = [
  {
    field: 'button',
    placeholder: 'Sign out',
    onClick: 'signOut'
  }
]

const formResendCode = [
  {
    field: 'input',
    name: 'username',
    placeholder: 'Name',
    type: 'text'
  },
  {
    field: 'button',
    placeholder: 'Resend Confirmation Code',
    onClick: 'resendConfirmationCode'
  }
]


const forms = [
  {
    title: 'Sign In',
    fields: formSignIn,
    authParams: [ 'username', 'password' ]
  },
  {
    title: 'Sign Up',
    fields: formSignUp,
  },
  {
    title: 'Confirm',
    fields: formConfirm
  },
  {
    title: 'Sign Out',
    fields: formSignOut
  },
  {
    title: 'Resend Confirmation Code',
    fields: formResendCode
  },
]


const App = () => {
  
  const [state, setState] = useState({
    username: '',
    password: '',
    email: '',
    phone_number: '',
    authenticationCode: '',
    currentState: ''
  })

  const [loggedUser, setLoggedUser] = useState()
  const [status, setStatus] = useState()
  
  const onChange = e => {
    e.preventDefault()
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const signIn = async () => {
    const {username, password} = state
    try {
      const user = await Auth.signIn(username, password)
      console.log(user)
      setLoggedUser(user)
    } catch(err)  { 
      console.log(err)
      window.alert(err.message)
    }
  }

  const signUp = async () => {
    const {username, password, email, phone_number} = state
    try {
      const { user }  = await Auth.signUp({ username, password, attributes: {email, phone_number} })
      console.log(user)
    } catch(err) { 
      console.log(err)
      window.alert(err.message)
    }
  }
  
  const confirmSignUp = async () => {
    const {username, authenticationCode} = state
    try {
      const { user } = await Auth.confirmSignUp(username, authenticationCode)
      console.log(user)
    } catch(err)  { 
      console.log(err)
      window.alert(err.message)
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
      console.log('You are logged out')
    } catch(err)  { 
      console.log(err)
      window.alert(err.message)
    }
  }
  
  const resendConfirmationCode = async () => {
    const {username} = state
    try {
      await Auth.resendSignUp(username)
      console.log('Code resent successfully')
    } catch(err)  { 
      console.log(err)
      window.alert(err.message)
    }
  }
  
  const handleAuthStateChange = state => {
    setStatus(state)
    if (state === 'signedIn') {
      /* Do something when the user has signed-in */
      window.alert('Logged In')
    }
  }

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setLoggedUser(user)
    } catch(err){
      console.log(err)
    }
  }

  const AlwaysOn = (props) => {
    return (
        <div>
            <div>I am always here to show current auth state: {props.authState}</div>
            <button onClick={() => props.onStateChange('signUp')}>Show Sign Up</button>
        </div>
    )
  }

    useEffect(() => {
    checkUser()
    console.log(state)
    console.log(status)
  }, [state, status])

  useEffect(() => {
    console.log(loggedUser)
  }, [loggedUser])

  const functions = {
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    resendConfirmationCode
  }

  const renderField = (input, i) => {
    const { onClick, type, name, placeholder, autocomplete, field } = input
    const handleClick = e => {
      e.preventDefault()
      functions[onClick]()
    }
    const components = {
      button: <button key={i} onClick={handleClick}>{placeholder}</button>,
      input: <input
        autoFocus 
        type={type} 
        key={i} 
        onChange={onChange} 
        name={name} 
        placeholder={placeholder} 
        value={state[name]} 
        autoComplete={autocomplete}
      />
    }
    const formField = components[field]
    return formField
  }
 

  return (
    <div className="App">
    <div>Hi, {loggedUser?.username}! You are {status}</div>
      {forms.map((form, i) => (
          <div key={i}>
            <h1>{form.title}</h1>
            <form style={style.form}>
              {form.fields.map((input, formI) => renderField(input, formI))}
            </form>
          </div>
      ))}
      <h1>With Authenticator components</h1>
      <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
            <SignIn/>
            <SignUp/>
            <ConfirmSignUp/>
            <Greetings/>
            <AlwaysOn/>
        </Authenticator>
    </div>
  );
}

const style = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    margin: 'auto'
  }
}

export default App;
