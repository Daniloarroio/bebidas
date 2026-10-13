const form = document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmInput = document.querySelector('#confirm-password');
const message = document.querySelector('#form-message');

const errorTargets = {
  name: document.querySelector('#name-error'),
  email: document.querySelector('#email-error'),
  password: document.querySelector('#password-error'),
  confirm: document.querySelector('#confirm-error')
};

function setError(input, target, text) {
  input.setAttribute('aria-invalid', text ? 'true' : 'false');
  target.textContent = text;
}

function validateName() {
  const value = nameInput.value.trim();
  const error = value.length < 2 ? 'Digite seu nome completo.' : '';
  setError(nameInput, errorTargets.name, error);
  return !error;
}

function validateEmail() {
  const error = emailInput.validity.valueMissing
    ? 'Informe seu e-mail.'
    : emailInput.validity.typeMismatch
      ? 'Digite um e-mail válido.'
      : '';
  setError(emailInput, errorTargets.email, error);
  return !error;
}

function validatePassword() {
  const error = passwordInput.value.length < 8 ? 'A senha precisa ter pelo menos 8 caracteres.' : '';
  setError(passwordInput, errorTargets.password, error);
  if (confirmInput.value) validateConfirmation();
  return !error;
}

function validateConfirmation() {
  const error = !confirmInput.value
    ? 'Confirme sua senha.'
    : confirmInput.value !== passwordInput.value
      ? 'As senhas não são iguais.'
      : '';
  setError(confirmInput, errorTargets.confirm, error);
  return !error;
}

function clearMessage() {
  message.textContent = '';
  message.className = 'form-message';
}

nameInput.addEventListener('input', () => { validateName(); clearMessage(); });
emailInput.addEventListener('input', () => { validateEmail(); clearMessage(); });
passwordInput.addEventListener('input', () => { validatePassword(); clearMessage(); });
confirmInput.addEventListener('input', () => { validateConfirmation(); clearMessage(); });

document.querySelectorAll('[data-toggle-password]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.togglePassword);
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    button.textContent = showing ? 'Ocultar' : 'Mostrar';
    button.setAttribute('aria-label', `${showing ? 'Ocultar' : 'Mostrar'} ${input.id === 'password' ? 'senha' : 'confirmação da senha'}`);
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const valid = [validateName(), validateEmail(), validatePassword(), validateConfirmation()].every(Boolean);
  if (!valid) {
    message.textContent = 'Confira os campos destacados antes de continuar.';
    message.className = 'form-message is-visible is-error';
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const result = await window.appApi.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmInput.value
      })
    });
    if (!result.ok) {
      message.textContent = result.body?.message || 'Não foi possível concluir o cadastro.';
      message.className = 'form-message is-visible is-error';
      return;
    }
    window.location.href = 'login.html?cadastro=ok';
  } catch {
    message.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
    message.className = 'form-message is-visible is-error';
  } finally {
    button.disabled = false;
  }
});
