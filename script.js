const bouquets = [
  {
    id: "single-tulip",
    name: "Один тюльпан",
    emoji: "🌷",
    description: "Один тюльпан в аккуратной упаковке — для небольшого, но очень тёплого жеста.",
    colors: ["pink", "white", "red"],
    isTulip: true,
    isRose: false,
    roseLength: null,
    price: 250,
    tag: "один цветок",
  },
  {
    id: "single-rose-60",
    name: "Одна роза 60 см",
    emoji: "🌹",
    description: "Одна удлинённая роза в стильной упаковке. Цвет можно уточнить во времени подтверждения заказа.",
    colors: ["red", "white", "pink"],
    isTulip: false,
    isRose: true,
    roseLength: 60,
    price: 450,
    tag: "один цветок",
  },
  {
    id: "tulip-classic-9",
    name: "Тюльпаны классика (9 шт.)",
    emoji: "🌷",
    description: "Нежные однотонные тюльпаны, собранные в бумагу крафт или пастель.",
    colors: ["pink", "white", "red"],
    isTulip: true,
    isRose: false,
    roseLength: null,
    price: 1990,
    tag: "эконом",
  },
  {
    id: "tulip-mix-15",
    name: "Тюльпаны MIX (15 шт.)",
    emoji: "💐",
    description: "Яркий микс из тюльпанов — идеальный вариант для весеннего настроения.",
    colors: ["mixed"],
    isTulip: true,
    isRose: false,
    roseLength: null,
    price: 2790,
    tag: "самый популярный",
  },
  {
    id: "tulip-big-25",
    name: "Тюльпаны XXL (25 шт.)",
    emoji: "🌷",
    description: "Объёмный букет тюльпанов для особого повода.",
    colors: ["pink", "mixed"],
    isTulip: true,
    isRose: false,
    roseLength: null,
    price: 3990,
    tag: "выгодно",
  },
  {
    id: "rose-40-9",
    name: "Розы 40 см (9 шт.)",
    emoji: "🌹",
    description: "Классические розы средней длины в стильной упаковке.",
    colors: ["red", "white", "pink"],
    isTulip: false,
    isRose: true,
    roseLength: 40,
    price: 2990,
    tag: "компактный формат",
  },
  {
    id: "rose-60-15",
    name: "Розы 60 см (15 шт.)",
    emoji: "🌹",
    description: "Розы с удлинённым стеблем — эффектный и запоминающийся вариант.",
    colors: ["red", "white"],
    isTulip: false,
    isRose: true,
    roseLength: 60,
    price: 5490,
    tag: "классика",
  },
  {
    id: "rose-80-25",
    name: "Розы 80 см (25 шт.)",
    emoji: "🌹",
    description: "Премиальные высокие розы для самого важного человека.",
    colors: ["red"],
    isTulip: false,
    isRose: true,
    roseLength: 80,
    price: 10990,
    tag: "вау‑эффект",
  },
  {
    id: "mix-tulip-rose",
    name: "Тюльпаны и розы",
    emoji: "💞",
    description: "Комбинация из тюльпанов и роз в нежной пастельной гамме.",
    colors: ["mixed"],
    isTulip: true,
    isRose: true,
    roseLength: 40,
    price: 4990,
    tag: "идеален к 8 марта",
  },
];

const bouquetList = document.getElementById("bouquetList");
const typeFilters = document.getElementById("typeFilters");
const roseLengthFilter = document.getElementById("roseLengthFilter");
const selectedBouquetInput = document.getElementById("selectedBouquet");
const orderTotalEl = document.getElementById("orderTotal");
const orderForm = document.getElementById("orderForm");
const deliveryAddressField = document.getElementById("deliveryAddressField");
const orderResultBlock = document.getElementById("orderResult");
const orderResultText = document.getElementById("orderResultText");
const sendTelegramBtn = document.getElementById("sendTelegram");

let activeType = "all";
let activeRoseLength = "all";
let selectedBouquetIds = [];

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function createBouquetCard(bouquet) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = bouquet.id;
  card.dataset.colors = bouquet.colors.join(",");
  card.dataset.isRose = String(bouquet.isRose);
  card.dataset.isTulip = String(bouquet.isTulip);
  if (bouquet.roseLength) {
    card.dataset.roseLength = String(bouquet.roseLength);
  }

  const image = document.createElement("div");
  image.className = "card__image";
  const emoji = document.createElement("div");
  emoji.className = "card__emoji";
  emoji.textContent = bouquet.emoji;
  image.appendChild(emoji);

  const body = document.createElement("div");
  body.className = "card__body";

  const titleRow = document.createElement("div");
  titleRow.className = "card__title-row";

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = bouquet.name;

  titleRow.appendChild(title);
  if (bouquet.tag) {
    const pill = document.createElement("span");
    pill.className = "card__pill";
    pill.textContent = bouquet.tag;
    titleRow.appendChild(pill);
  }

  const desc = document.createElement("p");
  desc.className = "card__desc";
  desc.textContent = bouquet.description;

  const meta = document.createElement("div");
  meta.className = "card__meta";

  if (bouquet.isTulip) {
    const tulipBadge = document.createElement("span");
    tulipBadge.className = "card__meta-item badge--tulip";
    tulipBadge.textContent = "С тюльпанами";
    meta.appendChild(tulipBadge);
  }

  if (bouquet.isRose) {
    const roseBadge = document.createElement("span");
    roseBadge.className = "card__meta-item badge--rose";
    roseBadge.textContent = bouquet.roseLength ? `Розы ${bouquet.roseLength} см` : "С розами";
    meta.appendChild(roseBadge);
  }

  const colorBadge = document.createElement("span");
  colorBadge.className = "card__meta-item";
  colorBadge.textContent = bouquet.colors.includes("mixed") ? "Цвет: микс" : `Цвет: ${bouquet.colors.length} вариант(а)`;
  meta.appendChild(colorBadge);

  const bottom = document.createElement("div");
  bottom.className = "card__bottom";

  const price = document.createElement("div");
  price.className = "card__price";
  price.textContent = formatPrice(bouquet.price);

  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "card__cta";
  cta.textContent = "Выбрать букет";

  bottom.appendChild(price);
  bottom.appendChild(cta);

  body.appendChild(titleRow);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(bottom);

  card.appendChild(image);
  card.appendChild(body);

  card.addEventListener("click", () => selectBouquet(bouquet.id));
  cta.addEventListener("click", (event) => {
    event.stopPropagation();
    selectBouquet(bouquet.id);
  });

  return card;
}

function renderBouquets() {
  bouquetList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  bouquets.forEach((bouquet) => {
    if (!passesFilters(bouquet)) return;
    const card = createBouquetCard(bouquet);
    if (selectedBouquetIds.includes(bouquet.id)) {
      card.classList.add("card--selected");
    }
    fragment.appendChild(card);
  });

  bouquetList.appendChild(fragment);
}

function passesFilters(bouquet) {
  if (activeType === "tulip" && !bouquet.isTulip) return false;
  if (activeType === "rose" && !bouquet.isRose) return false;
  if (activeType === "mix" && !(bouquet.isTulip && bouquet.isRose)) return false;

  if (bouquet.isRose) {
    if (activeRoseLength !== "all" && String(bouquet.roseLength) !== String(activeRoseLength)) {
      return false;
    }
  }

  return true;
}

function setupFilters() {
  typeFilters.addEventListener("click", (event) => {
    const target = event.target.closest(".chip");
    if (!target) return;
    const type = target.dataset.type;
    if (!type) return;

    activeType = type;
    Array.from(typeFilters.querySelectorAll(".chip")).forEach((chip) =>
      chip.classList.toggle("chip--active", chip === target)
    );

    renderBouquets();
  });

  roseLengthFilter.addEventListener("click", (event) => {
    const target = event.target.closest(".chip");
    if (!target) return;
    const length = target.dataset.length;
    if (!length) return;

    activeRoseLength = length;
    Array.from(roseLengthFilter.querySelectorAll(".chip")).forEach((chip) =>
      chip.classList.toggle("chip--active", chip === target)
    );

    renderBouquets();
  });
}

function selectBouquet(id) {
  const index = selectedBouquetIds.indexOf(id);
  if (index === -1) {
    selectedBouquetIds.push(id);
  } else {
    selectedBouquetIds.splice(index, 1);
  }

  if (!selectedBouquetIds.length) {
    selectedBouquetInput.value = "";
    selectedBouquetInput.placeholder = "Выберите один или несколько букетов выше";
  } else {
    const lines = selectedBouquetIds
      .map((selectedId, idx) => {
        const bouquet = bouquets.find((b) => b.id === selectedId);
        if (!bouquet) return null;
        return `${idx + 1}) ${bouquet.name} (${formatPrice(bouquet.price)})`;
      })
      .filter(Boolean);
    selectedBouquetInput.value = lines.join("\n");
  }

  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("card--selected", selectedBouquetIds.includes(card.dataset.id));
  });

  updateTotal();
  orderResultBlock.hidden = true;
}

function calculateTotal() {
  return selectedBouquetIds
    .map((id) => bouquets.find((b) => b.id === id))
    .filter(Boolean)
    .reduce((sum, b) => sum + (b.price || 0), 0);
}

function updateTotal() {
  if (!orderTotalEl) return;
  const wrapper = document.getElementById("orderTotalWrapper");
  const total = calculateTotal();

  if (!selectedBouquetIds.length) {
    if (wrapper) wrapper.style.display = "none";
    orderTotalEl.textContent = "0 ₽";
    return;
  }

  if (wrapper) wrapper.style.display = "";
  orderTotalEl.textContent = formatPrice(total);
}

function setupDeliveryToggle() {
  const deliveryRadios = orderForm.elements["deliveryType"];
  function updateAddressVisibility() {
    const type = Array.from(deliveryRadios).find((r) => r.checked)?.value;
    if (type === "delivery") {
      deliveryAddressField.style.display = "";
      orderForm.deliveryAddress.required = true;
    } else {
      deliveryAddressField.style.display = "none";
      orderForm.deliveryAddress.required = false;
      orderForm.deliveryAddress.value = "";
    }
  }

  Array.from(deliveryRadios).forEach((radio) => {
    radio.addEventListener("change", updateAddressVisibility);
  });

  updateAddressVisibility();
}

function buildOrderText(formData) {
  const selected = selectedBouquetIds
    .map((id) => bouquets.find((b) => b.id === id))
    .filter(Boolean);
  const name = formData.get("customerName") || "";
  const phone = formData.get("customerPhone") || "";
  const deliveryType = formData.get("deliveryType");
  const address = formData.get("deliveryAddress") || "";
  const comment = formData.get("orderComment") || "";

  const lines = [];
  lines.push("Заявка на букет к 8 марта:");
  lines.push("");
  if (selected.length === 1) {
    const b = selected[0];
    lines.push(`Букет: ${b.name} (${formatPrice(b.price)})`);
  } else if (selected.length > 1) {
    lines.push("Букеты:");
    selected.forEach((b, index) => {
      lines.push(`  ${index + 1}) ${b.name} (${formatPrice(b.price)})`);
    });
  }

  const total = calculateTotal();
  if (total > 0) {
    lines.push("");
    lines.push(`Итого к оплате: ${formatPrice(total)}`);
  }
  lines.push(`Имя: ${name}`);
  lines.push(`Телефон: ${phone}`);

  if (deliveryType === "delivery") {
    lines.push("Способ получения: доставка");
    lines.push(`Адрес: ${address || "не указан"}`);
  } else {
    lines.push("Способ получения: заберу в магазине");
  }

  if (comment.trim()) {
    lines.push("");
    lines.push(`Комментарий: ${comment.trim()}`);
  }

  lines.push("");
  lines.push("Отправлено с мини-лендинга в Telegram.");

  return lines.join("\n");
}

function setupForm() {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedBouquetIds.length) {
      selectedBouquetInput.focus();
      selectedBouquetInput.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const formData = new FormData(orderForm);
    const text = buildOrderText(formData);
    orderResultText.value = text;
    orderResultBlock.hidden = false;
    orderResultBlock.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupTelegramButton() {
  if (!sendTelegramBtn) return;
  sendTelegramBtn.addEventListener("click", () => {
    const text = orderResultText.value;
    if (!text.trim()) return;

    const baseUrl = "https://t.me/belovaiulya";
    const url = `${baseUrl}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupDeliveryToggle();
  setupForm();
  setupTelegramButton();

  renderBouquets();
  updateTotal();
});

