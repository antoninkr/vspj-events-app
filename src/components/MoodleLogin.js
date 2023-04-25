import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { moodleAuthenticateUser } from '../store/authSlice';
import MoodleLoginForm from '../components/MoodleLoginForm';

const MoodleLogin = () => {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState('');

  const loginUser = ({ username, password }, formikActions) => {
    dispatch(moodleAuthenticateUser(username, password))
      .then(async (action) => {
        formikActions.setSubmitting(false);
      })
      .catch((error) => {
        console.log('catch((error)', error);

        setErrorMessage(error.message);
        formikActions.resetForm();
        formikActions.setSubmitting(false);
      });
  };

  return <MoodleLoginForm onSubmit={loginUser} errorMessage={errorMessage} />;
};

export default MoodleLogin;
