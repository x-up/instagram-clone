import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/AuthForm.module.css';
import Link from 'next/link';
import InstagramLogo from './icons/InstagramLogo';

export default function AuthForm({ mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      const user = loginData?.user;
      if (!user) {
        setError('Login failed.');
        return;
      }

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const newUsername = user.user_metadata?.username || user.email.split('@')[0];
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, username: newUsername });

        if (insertError) {
          setError('Logged in but failed to create profile.');
          return;
        }
      }

      router.push('/');
    }

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          redirectTo: `http://localhost:3000/login`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess('Check your email to confirm your signup.');
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.formContainer}>
        <h2 className={styles.logo}>
          <InstagramLogo />
        </h2>

        <form onSubmit={handleSubmit} className={styles.formBox}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{mode === 'signup' ? 'Sign Up' : 'Log In'}</button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: '#00c26e', marginTop: '10px' }}>{success}</p>}
      </div>

      {mode === 'login' && (
        <div className={styles.signupContainer}>
          <p>
            Don’t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      )}
    </div>
  );
}
