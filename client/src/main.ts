import DrinkSevice from "./drink_service.js";
import IDrink from "./idrink.js";
import IOrder from "./iorder.js";
const API: string = "http://localhost:3000";

let orderList: IOrder[] = [];

const listDrinks = (async () => {
  const drinkSevice = new DrinkSevice(API);
  return await drinkSevice.getDrinks();
})();
const getdrink = async (id: string) => {
  const drinkSevice = new DrinkSevice(API);
  return await drinkSevice.getDrinkById(id);
};

const listCategorys = (async () => {
  const categoryList = new Set<string>();
  await listDrinks.then((drinks) => {
    drinks.forEach((drink) => {
      if (!categoryList.has(drink.category)) {
        categoryList.add(drink.category);
      }
    });
  });

  return categoryList;
})();

const createDrinkList = async (index: number = 0) => {
  const groupDinks = document.getElementById("group-drink");
  const cateList = await listCategorys;

  if (groupDinks) groupDinks.innerHTML = "";

  await listDrinks.then((drinks) => {
    const category = Array.from(cateList)[index];
    const firstDrinkList = drinks.filter((drink) => drink.category === category);

    firstDrinkList.forEach((drink, index) => {
      const divItemDrik = document.createElement("div");
      divItemDrik.className = "item-drink";
      const h3 = document.createElement("h3");
      h3.className = "name-drink";
      h3.textContent = drink.name;
      const imgItem = document.createElement("img");
      imgItem.className = "img-item";
      imgItem.src = `https://picsum.photos/100/?${index}`;
      imgItem.setAttribute("loading", "lazy");
      imgItem.alt = drink.name;
      const divBottom = document.createElement("div");
      divBottom.className = "bottom-card";
      const p = document.createElement("p");
      p.textContent = `${drink.price.S} VND`;
      const button = document.createElement("button");
      button.textContent = "+";
      button.className = "bottom-card-btn";
      button.addEventListener("click", (e) => {
        handleAddOrderBtn(drink);
      });
      divBottom.appendChild(p);
      divBottom.appendChild(button);
      divItemDrik.appendChild(h3);
      divItemDrik.appendChild(imgItem);
      groupDinks?.appendChild(divItemDrik);
      divItemDrik.appendChild(divBottom);
    });
  });
};

createDrinkList(0);
(function Init() {
  const closeBtn = document.getElementById("closebtn");
  const openCartBtn = document.getElementById("cart");
  const clearAll = document.getElementById("btn-clear-cart");
  const checkout = document.getElementById("btn-checkout");
  checkout?.addEventListener("click", () => {
    alert("Bạn đã thanh toán thành công.");
    deleteAll();
  });
  clearAll?.addEventListener("click", () => {
    deleteAll();
  });
  closeBtn?.addEventListener("click", () => {
    closeNav();
  });
  openCartBtn?.addEventListener("click", () => {
    openNav();
    handleRenderListOrder();
  });
})();
function openNav() {
  const sidenav = document.getElementById("mySidenav") as HTMLElement;
  sidenav.style.transition = "0.5s";
  sidenav.style.width = "375px";
  const body = document.getElementById("root") as HTMLElement;
  body.style.transition = "0.5s";
  body.style.marginRight = "375px";
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav") as HTMLElement;
  sidenav.style.transition = "0.5s";
  sidenav.style.width = "0";
  const body = document.getElementById("root") as HTMLElement;
  body.style.transition = "0.5s";
  body.style.marginRight = "0";
}

function handleAddOrderBtn(drink: IDrink) {
  const order: IOrder = {
    id: Math.random().toString(36).substr(2, 9),
    drinkId: drink.id,
    quantity: 1,
    size: "S",
    price: drink.price.S,
    status: "pending",
  };
  const isHasDrink = orderList.find((d: IOrder) => d.drinkId === order.drinkId && d.size === order.size);

  if (isHasDrink) {
    isHasDrink.quantity++;
    return;
  }
  orderList.push(order);
  console.log(orderList);
}

(async function createCategoryBtn() {
  const tabFaB = document.getElementById("tab-fb");
  if (tabFaB) tabFaB.innerHTML = "";
  const cateList = await listCategorys;
  let int: number = 0;
  cateList.forEach((category) => {
    const div = document.createElement("div");
    div.className = "tab-fb-btn";
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.id = int.toString();
    btn.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      await createDrinkList(Number(target.id));
    });
    int++;
    div.appendChild(btn);
    tabFaB?.appendChild(div);
  });
})();

(function handleOpenCart() {
  const cart = document.getElementById("card");
  cart?.addEventListener("click", () => {
    createCart();
  });
})();

function createCart() {
  const containerMenu = document.getElementById("container-menu");
  if (containerMenu) containerMenu.innerHTML = "";
  const divContainer = document.createElement("div");
  divContainer.className = "container-menu";
  divContainer.textContent = "đây là giỏ hàng";
  containerMenu?.appendChild(divContainer);
  orderList.forEach((order) => {});
}

async function createItemOrder(order: IOrder) {
  const drink = await getdrink(order.drinkId);

  const itemOrderDiv = document.createElement("div");
  itemOrderDiv.classList.add("item-order");
  itemOrderDiv.id = order.id;

  const imgElement = document.createElement("img");
  imgElement.classList.add("img-item-order");
  imgElement.src = `https://picsum.photos/100/?${order.drinkId}`;
  imgElement.alt = "item-order";
  itemOrderDiv.appendChild(imgElement);

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info-item-order");

  const nameElement = document.createElement("h3");
  nameElement.classList.add("name-item-order");
  nameElement.textContent = drink.name;
  infoDiv.appendChild(nameElement);

  const detailElement = document.createElement("p");
  detailElement.classList.add("detail-item-order");
  detailElement.textContent = drink.description;
  infoDiv.appendChild(detailElement);

  const priceElement = document.createElement("p");
  priceElement.classList.add("price-item-order");
  priceElement.textContent = `${drink.price.S} VND`;
  infoDiv.appendChild(priceElement);

  itemOrderDiv.appendChild(infoDiv);

  const quantityDiv = document.createElement("div");
  quantityDiv.classList.add("quantity-item-order");

  const increaseButton = document.createElement("p");
  increaseButton.textContent = "▲";
  quantityDiv.appendChild(increaseButton);

  const quantityValue = document.createElement("div");
  quantityValue.classList.add("quantity-item-order-value");
  quantityValue.textContent = `${order.quantity}`;
  quantityDiv.appendChild(quantityValue);

  const decreaseButton = document.createElement("p");
  decreaseButton.textContent = "▼";
  quantityDiv.appendChild(decreaseButton);

  //create event
  increaseButton.addEventListener("click", (e) => {
    handleQuantity(true, quantityValue, Number(quantityValue.textContent), order, e);
  });
  decreaseButton.addEventListener("click", (e) => {
    handleQuantity(false, quantityValue, Number(quantityValue.textContent), order, e);
  });

  itemOrderDiv.appendChild(quantityDiv);

  const deleteButton = document.createElement("p");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", (e) => {
    deleteOrder(e);
  });
  itemOrderDiv.appendChild(deleteButton);
  return itemOrderDiv;
}

function handleRenderListOrder() {
  const containerMenu = document.getElementById("container-item-order");
  const totalPriceValue = document.getElementById("total-price-value");
  let total: number = 0;
  if (containerMenu) containerMenu.innerHTML = "";
  orderList.forEach(async (order) => {
    total += order.price * order.quantity;
    return containerMenu?.appendChild(await createItemOrder(order));
  });
  if (totalPriceValue) totalPriceValue.textContent = `${total} VND`;
}

function handleQuantity(isPlus: boolean, quantityValue: HTMLDivElement, currentQuantity: number, order: IOrder, event: Event) {
  const totalPrice = document.getElementById("total-price-value");
  let total: number = 0;
  const orderItem = orderList.find((o) => o.id === order.id);
  if (totalPrice && orderItem) {
    total = Number(totalPrice.textContent?.split(" ")[0]);

    if (isPlus) {
      currentQuantity += 1;
      total += order.price;
    } else {
      if (currentQuantity > 1) {
        currentQuantity -= 1;
        total -= order.price;
      }
    }

    quantityValue.textContent = `${currentQuantity}`;
    orderItem.quantity = currentQuantity;
    totalPrice.textContent = `${total} VND`;
    order.quantity = currentQuantity;
  }
}

function deleteOrder(e: Event) {
  const totalPrice = document.getElementById("total-price-value");
  let price = Number(totalPrice?.textContent?.split(" ")[0]);
  const order = e.target as HTMLDivElement;
  const orderId = order.parentElement?.id;
  const orderItem = orderList.find((o) => o.id === orderId);
  if (orderItem) {
    orderList = orderList.filter((o) => o.id !== orderItem.id);
    price -= orderItem.price * orderItem.quantity;
    order.parentElement?.remove();
  }
  if (totalPrice) {
    totalPrice.textContent = `${price} VND`;
  }
  console.log(orderId);
}

function deleteAll() {
  orderList = [];
  const containerMenu = document.getElementById("container-item-order");
  const totalPriceValue = document.getElementById("total-price-value");
  if (containerMenu) containerMenu.innerHTML = "";
  if (totalPriceValue) totalPriceValue.textContent = "0 VND";
}
