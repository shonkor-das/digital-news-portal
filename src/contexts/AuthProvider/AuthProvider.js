import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateUserProfile, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, sendEmailVerification } from 'firebase/auth'
import app from '../../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app)
;
const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const providerLogin = (provider) =>{
        return signInWithPopup(auth, provider);
    }

    const createUser = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUserProfile = (profile) =>{
        return updateUserProfile(auth.currentUser, profile);
    }

    const verifyEmail = () =>{
        return sendEmailVerification(auth.currentUser);
    }
    const logOut = () =>{
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            console.log('User inside state change', currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        return () =>{
            unsubscribe();
        }

    },[])

    const authInfo = {
        user, 
        loading, 
        providerLogin,
        updateUserProfile,
        verifyEmail,
        logOut, 
        createUser, 
        signIn,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;