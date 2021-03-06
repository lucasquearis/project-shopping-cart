function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const addStorage = () => {
  const ol = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('cartItens', ol);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const img = image.replace(/-I.jpg/g, '-O.jpg'); 
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// DAVID MITO ME SALVOU!!!

const arrValorTotal = [];
const selectP = document.querySelector('.total-price');

const somaItensStorage = (elemento) => {
  const acharNumber = Number(elemento.innerHTML.split('$')[1]);
  arrValorTotal.push(acharNumber);
  const soma = arrValorTotal.reduce((acc, curr) => acc + curr, 0);
  selectP.innerText = soma;
};

function cartItemClickListener(elemento) {
  elemento.target.remove();
  addStorage();
  const li = document.getElementsByClassName('cart__item');
  const acharNumber = Number(elemento.target.innerHTML.split('$')[1]);
  const acharIndex = (arrValorTotal).indexOf(acharNumber);
  arrValorTotal.splice(acharIndex, 1);
  const subtrair = arrValorTotal.reduce((acc, curr) => acc + curr, 0);
  selectP.innerText = subtrair;
  if (li.length === 0) {
    localStorage.removeItem('cartItens');
  }
}

const precoTotal = (precos) => {
  arrValorTotal.push(precos);
  const soma = arrValorTotal.reduce((acc, curr) => acc + curr, 0);
  selectP.innerText = soma;
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (id) => {
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const selectOl = document.querySelector('.cart__items');

  await fetch(API_URL, myObject)
    .then((response) => response.json())
    .then(async (data) => {
      selectOl.appendChild(createCartItemElement(data));
      precoTotal(data.price);
    });
};

const selectButton = () => {
  const botaoAdd = document.querySelectorAll('.item__add');
    botaoAdd.forEach((botao) => botao
      .addEventListener('click', async function (event) {
      await fetchItem(event.target.parentNode.firstChild.innerText);
      addStorage();
  }));
};

const fetchMl = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const pegarItems = document.querySelector('.items');

  await fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((data) => (data.results))
    .then((itens) => itens
      .forEach((evento) => pegarItems
      .appendChild(createProductItemElement(evento))));
};

const listaStorage = () => {
  const selectOl = document.querySelector('.cart__items');
  selectOl.innerHTML = localStorage.getItem('cartItens');
  document
    .querySelectorAll('li').forEach((evento) => {
      evento
      .addEventListener('click', cartItemClickListener);
      somaItensStorage(evento);
    });  
};

const cleanCartList = () => {
const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', () => {
  const selectLi = document.querySelectorAll('li');
  selectLi.forEach((lista) => lista.remove());
  addStorage();
  selectP.innerHTML = `Valor Total: R$${0}.`;
});
};

const loadingScreen = () => {
  const criarH1 = document.createElement('h1');
  criarH1.innerText = 'Loading...';
  criarH1.className = 'loading';
  const selectBody = document.querySelector('body');
  selectBody.appendChild(criarH1);
};

const deleteLoading = () => {
  const selectLoading = document.querySelector('.loading');
  selectLoading.remove();
};

window.onload = async () => {
  loadingScreen();
  await fetchMl();
  deleteLoading();
  selectButton();
  listaStorage();
  cleanCartList();
};