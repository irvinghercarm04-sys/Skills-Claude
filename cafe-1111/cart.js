// Café 11•11 — carrito y envío del pedido por WhatsApp
(() => {
  const WA = '522214378911';
  const MENU = window.MENU || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n) => '$' + n.toLocaleString('es-MX');
  const KEY = 'cafe1111-cart';

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || '[]').filter((l) => MENU[l.id]); } catch { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };

  const unitPrice = (l) => {
    const it = MENU[l.id];
    let p = it.sizes[l.size][1];
    (it.opts || []).forEach((o, i) => { if (o.extra && l.opts[i]) p += o.extra; });
    return p;
  };
  const lineLabel = (l) => {
    const it = MENU[l.id];
    const size = it.sizes[l.size][0];
    return it.name + (size ? ' ' + size : '');
  };
  const lineMeta = (l) => {
    const it = MENU[l.id];
    return (it.opts || []).map((o, i) => {
      if (o.extra) return l.opts[i] ? `${o.name} +$${o.extra}` : null;
      return l.opts[i] != null ? (o.name === 'Leche' ? 'Leche ' + l.opts[i].toLowerCase() : l.opts[i]) : null;
    }).filter(Boolean).join(' · ');
  };
  const sig = (l) => l.id + '|' + l.size + '|' + JSON.stringify(l.opts);
  const total = () => cart.reduce((n, l) => n + unitPrice(l) * l.qty, 0);
  const count = () => cart.reduce((n, l) => n + l.qty, 0);

  // ---- toast
  const toast = $('[data-toast]');
  let tt;
  const say = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 1800); };

  // ---- add
  function add(line, btn) {
    const s = sig(line);
    const found = cart.find((l) => sig(l) === s);
    if (found) found.qty += line.qty; else cart.push(line);
    save(); render();
    say('Agregado: ' + (line.qty > 1 ? line.qty + ' × ' : '') + lineLabel(line));
    $$('[data-cart-count]').forEach((el) => { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); });
    if (btn) { btn.classList.add('is-added'); setTimeout(() => btn.classList.remove('is-added'), 700); }
  }

  // ---- options sheet
  const optsDlg = $('[data-opts]');
  const optsForm = $('[data-opts-form]');
  let draft = null, draftBtn = null;

  function openOpts(id, size, btn) {
    const it = MENU[id];
    draft = { id, size, opts: (it.opts || []).map((o) => (o.extra ? false : o.choices[0])), qty: 1 };
    draftBtn = btn;
    $('[data-opts-title]').textContent = it.name;
    $('[data-opts-desc]').textContent = it.desc || '';
    const body = $('[data-opts-body]');
    let html = '';
    if (it.sizes.length > 1) {
      html += `<fieldset class="opt"><legend>Tamaño</legend><div class="opt__choices">` +
        it.sizes.map(([lab, p], i) => `<label class="chip"><input type="radio" name="size" value="${i}" ${i === size ? 'checked' : ''}><span>${lab || 'Único'} <small>${fmt(p)}</small></span></label>`).join('') +
        `</div></fieldset>`;
    }
    (it.opts || []).forEach((o, i) => {
      if (o.extra) {
        html += `<fieldset class="opt"><legend>Extras</legend><div class="opt__choices"><label class="chip"><input type="checkbox" name="o${i}"><span>${o.name} <small>+${fmt(o.extra)}</small></span></label></div></fieldset>`;
      } else {
        html += `<fieldset class="opt"><legend>${o.name}</legend><div class="opt__choices">` +
          o.choices.map((c, j) => `<label class="chip"><input type="radio" name="o${i}" value="${c}" ${j === 0 ? 'checked' : ''}><span>${c}</span></label>`).join('') +
          `</div></fieldset>`;
      }
    });
    body.innerHTML = html;
    $('[data-qty-n]').textContent = '1';
    updDraft();
    optsDlg.showModal();
  }
  function updDraft() {
    if (!draft) return;
    const it = MENU[draft.id];
    const fd = new FormData(optsForm);
    if (fd.has('size')) draft.size = +fd.get('size');
    (it.opts || []).forEach((o, i) => { draft.opts[i] = o.extra ? fd.has('o' + i) : fd.get('o' + i); });
    $('[data-opts-total]').textContent = fmt(unitPrice(draft) * draft.qty);
  }
  optsForm.addEventListener('change', updDraft);
  optsDlg.addEventListener('click', (e) => {
    const q = e.target.closest('[data-qty]');
    if (q && draft) { draft.qty = Math.max(1, Math.min(20, draft.qty + +q.dataset.qty)); $('[data-qty-n]').textContent = draft.qty; updDraft(); }
  });
  optsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (draft) add({ ...draft, opts: [...draft.opts] }, draftBtn);
    optsDlg.close();
  });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const it = MENU[b.dataset.add];
    const size = +b.dataset.size;
    if (it.opts && it.opts.length) openOpts(it.id, size, b);
    else add({ id: it.id, size, opts: [], qty: 1 }, b);
  });

  // ---- cart sheet
  const cartDlg = $('[data-cart]');
  const lines = $('[data-cart-lines]');
  const bar = $('[data-cartbar]');

  function render() {
    const n = count(), t = total();
    $$('[data-cart-count]').forEach((el) => (el.textContent = n));
    $$('[data-cart-total]').forEach((el) => (el.textContent = fmt(t)));
    $$('[data-cart-noun]').forEach((el) => (el.textContent = n === 1 ? 'producto' : 'productos'));
    const wasHidden = bar.hidden;
    bar.hidden = n === 0;
    if (wasHidden && n > 0) { bar.classList.remove('is-in'); void bar.offsetWidth; bar.classList.add('is-in'); }
    cartDlg.classList.toggle('is-empty', n === 0);
    $('[data-cart-empty]').hidden = n > 0;
    lines.innerHTML = cart.map((l, i) => {
      const meta = lineMeta(l);
      return `<li class="cart__line"><span class="cart__name">${lineLabel(l)}</span><span class="cart__price">${fmt(unitPrice(l) * l.qty)}</span>` +
        (meta ? `<span class="cart__meta">${meta}</span>` : '') +
        `<div class="qty qty--sm" role="group" aria-label="Cantidad de ${lineLabel(l)}"><button type="button" class="qty__btn" data-line="${i}" data-d="-1" aria-label="Uno menos">−</button><output class="qty__n">${l.qty}</output><button type="button" class="qty__btn" data-line="${i}" data-d="1" aria-label="Uno más">+</button></div>` +
        `<button type="button" class="cart__remove" data-remove="${i}">Quitar</button></li>`;
    }).join('');
  }
  lines.addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]');
    const r = e.target.closest('[data-remove]');
    if (d) { const l = cart[+d.dataset.line]; l.qty += +d.dataset.d; if (l.qty < 1) cart.splice(+d.dataset.line, 1); }
    else if (r) cart.splice(+r.dataset.remove, 1);
    else return;
    save(); render();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); render(); cartDlg.showModal(); }
    const c = e.target.closest('[data-close]');
    if (c) c.closest('dialog').close();
  });
  // click on the backdrop closes
  [optsDlg, cartDlg].forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  // ---- send to WhatsApp
  const nameIn = $('#c-name'), nameErr = $('#c-name-err');
  nameIn.addEventListener('input', () => { if (nameIn.value.trim()) { nameErr.hidden = true; nameIn.removeAttribute('aria-invalid'); } });
  $('[data-cart-send]').addEventListener('click', () => {
    if (!cart.length) return;
    const name = nameIn.value.trim();
    if (!name) { nameErr.hidden = false; nameIn.setAttribute('aria-invalid', 'true'); nameIn.focus(); return; }
    const notes = $('#c-notes').value.trim();
    const out = ['Hola Café 11•11, quiero hacer este pedido:', ''];
    cart.forEach((l) => {
      const meta = lineMeta(l);
      out.push(`• ${l.qty} × ${lineLabel(l)}${meta ? ' (' + meta + ')' : ''} — ${fmt(unitPrice(l) * l.qty)}`);
    });
    out.push('', `*Total: ${fmt(total())} MXN*`, `A nombre de: ${name}`);
    if (notes) out.push(`Notas: ${notes}`);
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(out.join('\n'))}`;
    const w = window.open(url, '_blank');
    if (w) w.opener = null; else location.href = url;
  });

  render();
})();
