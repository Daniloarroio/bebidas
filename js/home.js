const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const drinkGrid = document.querySelector('#drink-grid');
const emptyMenu = document.querySelector('#empty-menu');
const menuError = document.querySelector('#menu-error');
const summary = document.querySelector('#order-summary');
const orderItems = document.querySelector('#order-items');
const orderCount = document.querySelector('#order-count');
const orderTotal = document.querySelector('#order-total');
const order = new Map();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderOrder() {
  orderItems.replaceChildren();
  let count = 0;
  let total = 0;

  order.forEach((item) => {
    count += item.quantity;
    total += item.quantity * item.price;
    const row = element('li');
    row.append(element('span', '', `${item.quantity}x ${item.name}`));
    row.append(element('strong', '', currency.format(item.quantity * item.price)));
    orderItems.append(row);
  });

  orderCount.textContent = count;
  orderTotal.textContent = currency.format(total);
  summary.hidden = order.size === 0;
}

function addDrinkCard(drink) {
  const card = element('article', 'drink-card');
  const colorBar = element('div', 'drink-color color-lemon');
  colorBar.setAttribute('aria-hidden', 'true');
  const info = element('div', 'drink-info');
  const category = element('p', 'category', 'Bebida');
  const name = element('h2', '', drink.nome);
  const ingredients = element('p', 'ingredients');
  const ingredientsLabel = element('strong', '', 'Ingredientes: ');
  ingredients.append(ingredientsLabel, document.createTextNode(drink.ingredientes));
  const footer = element('div', 'card-footer');
  const price = element('strong', 'price', currency.format(Number(drink.preco)));
  const controls = element('div', 'order-controls');
  const quantityControl = element('div', 'quantity-control');
  quantityControl.setAttribute('aria-label', `Quantidade de ${drink.nome}`);
  const decrease = element('button', 'quantity-button', '−');
  decrease.type = 'button';
  decrease.setAttribute('aria-label', 'Diminuir quantidade');
  const quantityOutput = element('output', 'quantity', '0');
  const increase = element('button', 'quantity-button', '+');
  increase.type = 'button';
  increase.setAttribute('aria-label', 'Aumentar quantidade');
  const orderButton = element('button', 'order-button', 'Pedir');
  orderButton.type = 'button';
  orderButton.disabled = true;
  controls.append(quantityControl, orderButton);
  quantityControl.append(decrease, quantityOutput, increase);
  footer.append(price, controls);
  info.append(category, name, ingredients, footer);
  card.append(colorBar, info);
  drinkGrid.append(card);

  let quantity = 0;
  const updateQuantity = (change) => {
    quantity = Math.max(0, quantity + change);
    quantityOutput.value = String(quantity);
    quantityOutput.textContent = String(quantity);
    orderButton.disabled = quantity === 0;
  };

  decrease.addEventListener('click', () => updateQuantity(-1));
  increase.addEventListener('click', () => updateQuantity(1));
  orderButton.addEventListener('click', () => {
    if (quantity === 0) return;
    const current = order.get(drink.id);
    order.set(drink.id, {
      name: drink.nome,
      price: Number(drink.preco),
      quantity: quantity + (current?.quantity || 0)
    });
    updateQuantity(-quantity);
    renderOrder();
  });
}

async function loadMenu() {
  try {
    const result = await window.appApi.request('/api/bebidas');
    if (result.status === 401) {
      window.location.href = 'login.html';
      return;
    }
    if (!result.ok) throw new Error('Falha ao carregar o cardápio.');
    drinkGrid.replaceChildren();
    result.body.forEach(addDrinkCard);
    emptyMenu.hidden = result.body.length > 0;
  } catch {
    menuError.hidden = false;
  }
}

document.querySelector('#logout-link').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    await window.appApi.request('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = 'login.html';
  }
});

loadMenu();
