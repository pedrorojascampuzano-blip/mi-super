import { h, mount } from '../lib/dom.js';
import { signIn, signUp } from '../lib/supabase.js';

export function renderLogin(container, onSuccess) {
  let isSignUp = false;
  let loading = false;

  function render() {
    const form = h('form', { class: 'auth-card', onSubmit: handleSubmit }, [
      h('h1', {}, isSignUp ? 'Create Account' : 'Welcome Back'),
      h('p', {}, isSignUp ? 'Sign up to get started with NexusAI' : 'Sign in to your NexusAI workspace'),
      h('div', { id: 'auth-error' }),
      h('div', { class: 'input-group' }, [
        h('label', {}, 'Email'),
        h('input', { class: 'input', type: 'email', name: 'email', required: 'true', placeholder: 'you@example.com' }),
      ]),
      h('div', { class: 'input-group' }, [
        h('label', {}, 'Password'),
        h('input', { class: 'input', type: 'password', name: 'password', required: 'true', placeholder: '••••••••', minlength: '6' }),
      ]),
      h('button', { class: 'btn btn-primary w-full', type: 'submit', style: { marginTop: '8px' } },
        loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')
      ),
      h('div', { class: 'auth-toggle' }, [
        document.createTextNode(isSignUp ? 'Already have an account? ' : "Don't have an account? "),
        h('a', { onClick: toggleMode }, isSignUp ? 'Sign in' : 'Sign up'),
      ]),
    ]);

    mount(container, h('div', { class: 'auth-container' }, [form]));
  }

  function toggleMode(e) {
    e.preventDefault();
    isSignUp = !isSignUp;
    render();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loading = true;
    render();

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err) {
      loading = false;
      render();
      const errorDiv = container.querySelector('#auth-error');
      if (errorDiv) {
        errorDiv.innerHTML = '';
        errorDiv.appendChild(h('div', { class: 'auth-error' }, err.message));
      }
    }
  }

  render();
}
