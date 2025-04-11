import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function UserForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false); // toggle mode

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;

    try {
      if (isLogin) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Logged in successfully!');
      } else {
        // Sign up
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email,
          createdAt: serverTimestamp(),
          uid: user.uid
        });

        setMessage('Account created successfully!');
        setForm({ firstName: '', lastName: '', email: '', password: '' });
      }
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className='AuthBox'>
      <h2>{isLogin ? 'Log In' : 'Create an Account'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">{isLogin ? 'Log In' : 'Register'}</button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}
