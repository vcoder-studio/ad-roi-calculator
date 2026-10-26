// Web calculator widget. The math is the extension's own solver
// (solver.js / metadata.js / number-format.js are copies from ../../js/),
// so results on the site and in the extension always match.
import { FunnelSolver, ContradictionError } from './solver.js';
import { METRICS_METADATA } from './metadata.js';
import { formatValue, parseInputValue } from './number-format.js';

// Solve from the values the person typed. Returns { ok, vars } or
// { ok: false, conflicts } when the typed values can't all be true.
function run(values) {
  const solver = new FunnelSolver();
  solver.setInputs(values);
  try {
    solver.solve();
    // The solver may settle by overwriting its own derived values; re-check
    // every formula against the final numbers so we never show a plan that
    // doesn't add up.
    for (const c of solver.constraints) c.evaluate(solver.vars, null);
  } catch (e) {
    if (e instanceof ContradictionError) return { ok: false, conflicts: e.conflicts || [] };
    throw e;
  }
  return { ok: true, vars: solver.vars };
}

export const fmt = (v, format = 'number') => formatValue(v, format);

export function mountCalculator(root, cfg) {
  const fields = [];
  let values = {};
  let order = []; // keys the person typed, oldest first

  const card = document.createElement('div');
  card.className = 'calc-card';
  card.innerHTML = `
    <div class="calc-top">
      <p class="calc-help">${cfg.help || 'Fill in what you know. Everything else is calculated. You can type into a result too, and the calculator works backwards.'}</p>
      <div class="calc-actions">
        <button type="button" class="btn-ghost" data-act="example">Example</button>
        <button type="button" class="btn-ghost" data-act="clear">Clear all</button>
      </div>
    </div>
    <div class="summary" aria-live="polite"></div>
    <div class="rows"></div>
    <p class="notice" hidden></p>
    <p class="legend"><span class="dot dot-user"></span>your input <span class="dot dot-calc"></span>calculated</p>`;
  const rowsEl = card.querySelector('.rows');
  const summaryEl = card.querySelector('.summary');
  const noticeEl = card.querySelector('.notice');

  for (const item of cfg.fields) {
    if (item.heading) {
      const h = document.createElement('h3');
      h.className = 'rows-heading';
      h.textContent = item.heading;
      rowsEl.appendChild(h);
      continue;
    }
    const f = typeof item === 'string' ? { key: item } : item;
    const meta = METRICS_METADATA[f.key] || {};
    const field = {
      key: f.key,
      label: f.label || meta.label,
      hint: f.hint || '',
      format: meta.format || 'number',
    };
    const id = `${root.id || 'calc'}-${f.key}`;
    const suffix = field.format === 'percent' ? '%' : '';
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <label for="${id}"><span class="lbl"></span><span class="hint"></span></label>
      <div class="field">
        <input id="${id}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="—">
        ${suffix ? `<span class="sfx">${suffix}</span>` : ''}
        <button type="button" class="x" aria-label="Clear ${field.label}">×</button>
      </div>
      <span class="tag"></span>`;
    row.querySelector('.lbl').textContent = field.label;
    row.querySelector('.hint').textContent = field.hint;
    field.row = row;
    field.input = row.querySelector('input');
    field.tag = row.querySelector('.tag');
    rowsEl.appendChild(row);
    fields.push(field);

    field.input.addEventListener('focus', () => {
      if (!(field.key in values)) field.input.select();
    });
    field.input.addEventListener('input', () => {
      const v = parseInputValue(field.input.value.trim(), field.format);
      order = order.filter(k => k !== field.key);
      if (v === undefined) delete values[field.key];
      else { values[field.key] = v; order.push(field.key); }
      update(field.key);
    });
    field.input.addEventListener('blur', () => update());
    row.querySelector('.x').addEventListener('click', () => {
      delete values[field.key];
      order = order.filter(k => k !== field.key);
      update();
      field.input.focus();
    });
  }

  card.querySelector('[data-act="example"]').addEventListener('click', () => {
    values = { ...cfg.example };
    order = Object.keys(cfg.example);
    update();
  });
  card.querySelector('[data-act="clear"]').addEventListener('click', () => {
    values = {};
    order = [];
    update();
  });

  function update(changedKey) {
    let res = run(values);
    let dropped = null;
    // Typed a new number that clashes with an older one: let the newest win
    // and drop the oldest value that makes the plan consistent again.
    if (!res.ok && changedKey) {
      for (const k of order) {
        if (k === changedKey) continue;
        const trial = { ...values };
        delete trial[k];
        const r = run(trial);
        if (r.ok) {
          delete values[k];
          order = order.filter(x => x !== k);
          res = r;
          dropped = k;
          break;
        }
      }
    }
    paint(res, dropped);
  }

  function paint(res, dropped) {
    const conflicts = new Set(res.ok ? [] : res.conflicts);
    for (const f of fields) {
      const typed = f.key in values;
      const calc = !typed && res.ok && res.vars[f.key] !== undefined;
      f.row.classList.toggle('is-user', typed);
      f.row.classList.toggle('is-calc', calc);
      f.row.classList.toggle('is-conflict', conflicts.has(f.key));
      f.tag.textContent = typed ? 'your input' : calc ? 'calculated' : '';
      if (document.activeElement === f.input && typed) continue;
      f.input.value = typed ? fmt(values[f.key], f.format) : calc ? fmt(res.vars[f.key], f.format) : '';
    }
    const label = k => (fields.find(f => f.key === k) || {}).label || k;
    if (dropped) {
      noticeEl.hidden = false;
      noticeEl.className = 'notice';
      noticeEl.textContent = `Cleared “${label(dropped)}”: it no longer fit the numbers you just typed.`;
    } else if (!res.ok) {
      noticeEl.hidden = false;
      noticeEl.className = 'notice notice-bad';
      noticeEl.textContent = 'These numbers can’t all be true at once. Clear one of the fields you typed (×) and the rest will be recalculated.';
    } else {
      noticeEl.hidden = true;
    }
    const text = res.ok && cfg.summary ? cfg.summary(res.vars) : '';
    summaryEl.innerHTML = text || '';
    summaryEl.hidden = !text;
  }

  root.appendChild(card);
  values = { ...cfg.example };
  order = Object.keys(cfg.example);
  update();
}
