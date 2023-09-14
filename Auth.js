import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css';
function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);

    const handleAuthAction = () => {
        // Reset any previous errors
        setError(null);

        if (isSignUp) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('User signed up:', user);
                })
                .catch((error) => {
                    // Handle sign-up errors
                    setError(error.message);
                    console.error('Error signing up:', error);
                });
        } else {
            // Sign in
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('User signed in:', user);
                })
                .catch((error) => {
                    // Handle sign-in errors
                    setError(error.message);
                    console.error('Error signing in:', error);
                });
        }
    };

    const toggleAuthAction = () => {
        setIsSignUp(!isSignUp);
        setError(null);
    };

    const handleGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log('Google Sign-In Successful', user);
            })
            .catch((error) => {
                console.error('Google Sign-In Error', error);
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <Paper elevation={3} className="auth-form" style={{backgroundColor:'#282c34',color:'white'}} >
                    <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                    <div style={{paddingBottom:'10px'}}>
                    <TextField
                        type="text"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                    />
                    </div>
                    <div style={{paddingBottom:'10px'}}>
                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                    />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAuthAction}
                        fullWidth
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={toggleAuthAction}
                        fullWidth
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </Button>
                </Paper>
                <div className="google-signin-container">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGoogleSignIn}
                        fullWidth
                    >
                        Sign In with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
