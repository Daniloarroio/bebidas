const drinkForm = document.querySelector('#drink-form');
const nameField = document.querySelector('#drink-name');
const ingredientsField = document.querySelector('#drink-ingredients');
const priceField = document.querySelector('#drink-price');
const formMessage = document.querySelector('#form-message');
const drinkList = document.querySelector('#drink-list');
const itemCount = document.querySelector('#item-count');
const emptyMessage = document.querySelector('#empty-message');
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const errors = {
  name: document.querySelector('#name-error'),
  ingredients: document.querySelector('#ingredients-error'),
  price: document.querySelector('#price-error')
};

function setFieldError(field, target, message) {
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  target.textContent = message;
}

function clearFormMessage() {
  formMessage.textContent = '';
  formMessage.className = 'form-message';
}

function validateName() {
  const message = nameField.value.trim() ? '' : 'Informe o nome da bebida.';
  setFieldError(nameField, errors.name, message);
  return !message;
}

function validateIngredients() {
  const message = ingredientsField.value.trim() ? '' : 'Informe os ingredientes.';
  setFieldError(ingredientsField, errors.ingredients, message);
  return !message;
}

function validatePrice() {
  const price = Number(priceField.value);
  const message = !priceField.value || !Number.isFinite(price) || price <= 0
    ? 'Informe um preço maior que zero.'
    : '';
  setFieldError(priceField, errors.price, message);
  return !message;
}

function renderDrinks(drinks) {
  drinkList.replaceChildren();
  drinks.forEach((drink) => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    const details = document.createElement('small');
    const price = document.createElement('strong');
    title.textContent = drink.nome;
    details.textContent = `Ingredientes: ${drink.ingredientes}`;
    price.className = 'listed-price';
    price.textContent = priceFormat.format(Number(drink.preco));
    item.append(title, details, price);
    drinkList.append(item);
  });
  itemCount.textContent = drinks.length;
  emptyMessage.hidden = drinks.length > 0;
  emptyMessage.textContent = drinks.length ? '' : 'Nenhuma bebida cadastrada ainda.';
}

async function loadDrinks() {
  try {
    const result = await window.appApi.request('/api/bebidas');
    if (result.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!result.ok) throw new Error('Erro ao carregar bebidas.');
    renderDrinks(result.body);
  } catch {
    emptyMessage.hidden = false;
    emptyMessage.textContent = 'Não foi possível carregar as bebidas.';
  }
}

[nameField, ingredientsField, priceField].forEach((field) => {
  field.addEventListener('input', clearFormMessage);
});
nameField.addEventListener('input', validateName);
ingredientsField.addEventListener('input', validateIngredients);
priceField.addEventListener('input', validatePrice);

drinkForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const valid = [validateName(), validateIngredients(), validatePrice()].every(Boolean);
  if (!valid) {
    formMessage.textContent = 'Confira os campos destacados.';
    formMessage.className = 'form-message is-visible is-error';
    drinkForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const button = drinkForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const result = await window.appApi.request('/api/bebidas', {
      method: 'POST',
      body: JSON.stringify({
        name: nameField.value.trim(),
        ingredients: ingredientsField.value.trim(),
        price: Number(priceField.value)
      })
    });
    if (!result.ok) {
      formMessage.textContent = result.body?.message || 'Não foi possível cadastrar a bebida.';
      formMessage.className = 'form-message is-visible is-error';
      return;
    }

    drinkForm.reset();
    Object.entries({
      [nameField.id]: errors.name,
      [ingredientsField.id]: errors.ingredients,
      [priceField.id]: errors.price
    }).forEach(([id, target]) => {
      document.getElementById(id).setAttribute('aria-invalid', 'false');
      target.textContent = '';
    });
    formMessage.textContent = 'Bebida cadastrada no cardápio.';
    formMessage.className = 'form-message is-visible is-success';
    await loadDrinks();
  } catch {
    formMessage.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
    formMessage.className = 'form-message is-visible is-error';
  } finally {
    button.disabled = false;
  }
});

loadDrinks();
