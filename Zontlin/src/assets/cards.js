/* ======= Datos demo ======= */
const CARDS = {
  debit: {
    label: 'Debit',
    number: '2233123443210987',
    amountLabel: 'Mount',
    amount: 1234.5,
    active: true,                 // ON por defecto
    movements: [
      { title: 'Movimiento 4', date: '12/09/25', amount: +123.67 },
      { title: 'Movimiento 3', date: '10/09/25', amount: -14.68 }
    ]
  },
  credit: {
    label: 'Credit',
    number: '2233123443210988',
    amountLabel: 'Debt',
    amount: 3256.5,
    active: true,                 // ON por defecto
    movements: [
      { title: 'Pago parcial', date: '09/09/25', amount: -500.00 },
      { title: 'Compra tienda', date: '04/09/25', amount: -1200.40 }
    ]
  }
};

/* ======= Utilidades ======= */
const fmtCard = n => n.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
const maskCard = n => n.replace(/\d(?=\d{4})/g, '*').replace(/(\*{4})(?=\d)/g, '$1 ').replace(/(\d{4})(?=\s|$)/g, '$1');
const money = n => `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const eyeIcon = (open = true) => open
  ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`
  : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.78 20.78 0 0 1 5.06-5.94"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/></svg>`;

/* ======= Render de cada tarjeta ======= */
document.querySelectorAll('.row').forEach(row => {
  const key = row.dataset.key;
  const d = CARDS[key];

  // número oculto inicialmente
  const numEl = row.querySelector('.js-number');
  numEl.textContent = maskCard(fmtCard(d.number));

  // label monto
  const labelEl = row.querySelector('.js-amount-label');
  labelEl.textContent = `${d.amountLabel}: $***`;

  // ojo
  const eyeBtn = row.querySelector('.js-eye');
  eyeBtn.innerHTML = eyeIcon(false);
  eyeBtn.dataset.open = 'false';
  eyeBtn.addEventListener('click', () => {
    const open = eyeBtn.dataset.open !== 'true';
    eyeBtn.dataset.open = String(open);
    numEl.textContent = open ? fmtCard(d.number) : maskCard(fmtCard(d.number));
    labelEl.textContent = open ? `${d.amountLabel}: ${money(d.amount)}` : `${d.amountLabel}: $***`;
    eyeBtn.innerHTML = eyeIcon(open);
    eyeBtn.setAttribute('aria-label', open ? 'Hide card number' : 'Show card number');
  });

  // SWITCH en la tarjeta
  const sw = row.querySelector('.js-switch');
  const swLabel = row.querySelector('.js-toggle-label');
  function paintSwitch(el, lbl, isOn) {
    el.classList.toggle('is-on', isOn);
    el.classList.toggle('is-off', !isOn);
    el.setAttribute('aria-checked', String(isOn));
    lbl.textContent = isOn ? 'Turn on' : 'Turn off';
  }
  paintSwitch(sw, swLabel, d.active);

  sw.addEventListener('click', () => {
    d.active = !d.active;
    paintSwitch(sw, swLabel, d.active);

    // si el modal abierto corresponde a esta tarjeta, sincroniza
    if (currentKey === key && dlgOpen) {
      paintSwitch(dlgSwitch, dlgToggleLabel, d.active);
    }
  });

  // details abre modal
  row.querySelector('.js-details').addEventListener('click', () => openDetails(key));
});

/* ======= Modal ======= */
const overlay = document.getElementById('overlay');
const dlgTitle = document.getElementById('dlg-title');
const dlgNumber = document.getElementById('dlg-number');
const dlgAmount = document.getElementById('dlg-amount');
const dlgEye = document.getElementById('dlg-eye');
const dlgSwitch = document.getElementById('dlg-switch');
const dlgToggleLabel = document.getElementById('dlg-toggle-label');
const movelist = document.getElementById('movelist');
const search = document.getElementById('search');
const closeBtn = document.getElementById('closeBtn');

let currentKey = null;
let dlgOpen = false;

const paintSwitch = (el, lbl, isOn) => {
  el.classList.toggle('is-on', isOn);
  el.classList.toggle('is-off', !isOn);
  el.setAttribute('aria-checked', String(isOn));
  lbl.textContent = isOn ? 'Turn on' : 'Turn off';
};

function openDetails(key) {
  currentKey = key;
  const d = CARDS[key];

  dlgTitle.textContent = d.label;
  dlgNumber.textContent = maskCard(fmtCard(d.number));
  dlgAmount.textContent = `${d.amountLabel}: $***`;
  dlgEye.innerHTML = eyeIcon(false);
  dlgEye.dataset.open = 'false';
  dlgEye.onclick = () => {
    const open = dlgEye.dataset.open !== 'true';
    dlgEye.dataset.open = String(open);
    dlgNumber.textContent = open ? fmtCard(d.number) : maskCard(fmtCard(d.number));
    dlgAmount.textContent = open ? `${d.amountLabel}: ${money(d.amount)}` : `${d.amountLabel}: $***`;
    dlgEye.innerHTML = eyeIcon(open);
  };

  // switch del modal sincronizado
  paintSwitch(dlgSwitch, dlgToggleLabel, d.active);
  dlgSwitch.onclick = () => {
    d.active = !d.active;
    paintSwitch(dlgSwitch, dlgToggleLabel, d.active);
    // sincroniza el de la tarjeta visible
    const row = document.querySelector(`.row[data-key="${key}"]`);
    const rowSw = row.querySelector('.js-switch');
    const rowLbl = row.querySelector('.js-toggle-label');
    paintSwitch(rowSw, rowLbl, d.active);
  };

  // movimientos
  renderMovements(d.movements);

  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  dlgOpen = true;
  search.value = '';
  search.focus();
}

function renderMovements(items) {
  movelist.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'mov-item';
    div.innerHTML = `
      <div class="mov-icon">$</div>
      <div class="mov-data">
        <span class="mov-title">${item.title}</span>
        <span class="mov-date">${item.date}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="mov-amount ${item.amount >= 0 ? 'plus' : 'minus'}">${item.amount >= 0 ? '+' : ''}$${Math.abs(item.amount).toFixed(2)}</span>
        <button class="btn" style="padding:6px 10px;">Details</button>
      </div>`;
    movelist.appendChild(div);
  });
}

function closeDetails() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  dlgOpen = false;
}
overlay.addEventListener('click', e => { if (e.target === overlay) closeDetails(); });
closeBtn.addEventListener('click', closeDetails);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && dlgOpen) closeDetails(); });

// Buscador
search.addEventListener('input', () => {
  const q = search.value.toLowerCase();
  const base = CARDS[currentKey].movements;
  const filtered = base.filter(m => m.title.toLowerCase().includes(q) || m.date.includes(q));
  renderMovements(filtered);
});

