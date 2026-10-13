const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');
const formMessage = document.querySelector('#form-message');
const togglePassword = document.querySelector('.show-password');

function clearMessage() {
  formMessage.textContent = '';
  formMessage.className = 'form-message';
}

if (new URLSearchParams(window.location.search).has('cadastro')) {
  formMessage.textContent = 'Cadastro realizado. Entre com seu e-mail e senha.';
  formMessage.className = 'form-message is-visible is-success';
}

emailInput.addEventListener('input', () => {
  emailError.textContent = '';
  emailInput.setAttribute('aria-invalid', 'false');
  clearMessage();
});

passwordInput.addEventListener('input', () => {
  passwordError.textContent = '';
  passwordInput.setAttribute('aria-invalid', 'false');
  clearMessage();
});

togglePassword.addEventListener('click', () => {
  const showing = passwordInput.type === 'password';
  passwordInput.type = showing ? 'text' : 'password';
  togglePassword.textContent = showing ? 'Ocultar' : 'Mostrar';
  togglePassword.setAttribute('aria-label', showing ? 'Ocultar senha' : 'Mostrar senha');
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  let valid = true;

  if (emailInput.validity.valueMissing) {
    emailError.textContent = 'Informe seu e-mail.';
    emailInput.setAttribute('aria-invalid', 'true');
    valid = false;
  } else if (emailInput.validity.typeMismatch) {
    emailError.textContent = 'Digite um e-mail válido.';
    emailInput.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.textContent = 'Informe sua senha.';
    passwordInput.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (!valid) {
    formMessage.textContent = 'Confira os campos destacados.';
    formMessage.className = 'form-message is-visible is-error';
    loginForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const button = loginForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const result = await window.appApi.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value })
    });
    if (!result.ok) {
      formMessage.textContent = result.body?.message || 'E-mail ou senha incorretos.';
      formMessage.className = 'form-message is-visible is-error';
      return;
    }
    window.location.href = 'home.html';
  } catch {
    formMessage.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
    formMessage.className = 'form-message is-visible is-error';
  } finally {
    button.disabled = false;
  }
});
