function k(e) {
  const n = {};
  return {
    dom: m(g(e, n), e),
    refs: n
  };
}
function m(e, n) {
  const r = {};
  return Object.entries(e).forEach(([c, t]) => r[c] = t), r.__self = n, r;
}
function g(e, n) {
  const r = {};
  for (let c = 0; c < e.children.length; c++) {
    const t = e.children[c], o = [t.tagName.toLowerCase()], s = t.getAttribute("ref");
    s && o.push(s);
    for (const i of o) {
      let a = r[i] instanceof Array;
      !a && r[i] && (a = !0, r[i] = [r[i]]);
      let l;
      t.children.length === 0 ? l = t : l = m(g(t, n), t), a ? r[i].push(l) : r[i] = l, s && (n[s] = r[i]);
    }
  }
  return r;
}
let v;
function E(e) {
  return (n = void 0) => n ? e : (v && e.observers.add(v), e.value);
}
function A(e) {
  const n = {
    value: e,
    observers: /* @__PURE__ */ new Set()
  };
  return [
    E(n),
    (r) => {
      n.value = r, n.observers.forEach((c) => c.update());
    }
  ];
}
function T(e) {
  const n = {
    value: void 0,
    observers: /* @__PURE__ */ new Set()
  };
  return u(() => {
    n.value = e();
    for (const r of n.observers)
      r.update();
  }), E(n);
}
function w(e) {
  e(!0).observers.forEach((r) => r.update());
}
function u(e) {
  const n = {
    update: () => {
      v = n, e(), v = void 0;
    }
  };
  return n.update(), n;
}
function M(e, n) {
  u(() => {
    const r = n();
    f(e, (c) => c.textContent = r);
  });
}
function I(e, n, r) {
  u(
    () => {
      const c = r();
      let t;
      typeof c == "object" ? t = Object.entries(c).map(([o, s]) => `${o}:${s}`).join(";") : t = c, typeof t == "boolean" ? Boolean(t) ? f(e, (o) => d(o).setAttribute(n, "")) : f(e, (o) => d(o).removeAttribute(n)) : f(e, (o) => d(o).setAttribute(n, t));
    }
  );
}
function L(e, n) {
  const r = /* @__PURE__ */ new Map();
  f(e, (t) => {
    const o = new Text();
    t.before(o), r.set(t, o);
  });
  let c;
  u(
    () => {
      const t = n();
      try {
        if (t === c)
          return;
        f(e, (o) => {
          if (t) {
            const s = r.get(o);
            s == null || s.before(o);
          } else
            o.remove();
        });
      } catch (o) {
        console.error(o);
      } finally {
        c = t;
      }
    }
  );
}
function O(e, n, r) {
  const c = [];
  f(e, (o) => {
    const s = new Text();
    o.before(s), o.remove(), c.push({
      marker: s,
      template: o.cloneNode(!0),
      elements: []
    });
  });
  let t;
  u(
    () => {
      const o = n();
      try {
        if (o === t)
          return;
        for (const s of c) {
          let i = o.length;
          t !== void 0 && t.length > i && (i = t.length);
          for (let a = 0; a < i; a++) {
            const l = o[a], h = t ? t[a] : null;
            if (l == h)
              continue;
            const p = s.elements[a];
            if (l === void 0)
              p.remove(), s.elements.splice(a, 1);
            else if (h === void 0 || !p) {
              const y = o[a], b = s.template.cloneNode(!0);
              s.marker.before(b), s.elements.push(b), requestAnimationFrame(() => r({ element: b, item: y, index: a }));
            } else
              r({ element: p, item: l, index: a });
          }
        }
      } catch (s) {
        console.error(s);
      } finally {
        t = o.map((s) => s instanceof Object ? structuredClone(s) : s);
      }
    }
  );
}
function H(e) {
  u(e);
}
function S(e, ...n) {
  const r = u(e);
  for (const c of n)
    c(!0).observers.add(r);
}
function x(e, n, r) {
  f(e, (c) => c.addEventListener(n, r));
}
function j(e, n) {
  x(e, "click", n);
}
function D(e, n, r) {
  f(e, (c) => {
    x(c, "input", (t) => {
      const o = t;
      let s;
      if (o.target instanceof HTMLInputElement) {
        const i = o.target.value;
        switch (s = i, o.target.type) {
          case "number":
          case "range":
            s = parseFloat(i);
            break;
          case "date":
          case "datetime-local":
            s = new Date(i);
            break;
          case "checkbox":
          case "radio":
            s = o.target.checked;
            break;
        }
      } else
        c instanceof HTMLTextAreaElement ? s = c.value : o.target instanceof HTMLSelectElement && (s = o.target.options[o.target.selectedIndex].text);
      r(s);
    });
  }), u(
    () => {
      const c = n();
      f(e, (t) => {
        if (t instanceof HTMLInputElement)
          t.type === "checkbox" || t.type === "radio" ? t.checked = c : t.type === "date" && c instanceof Date ? t.value = c.toISOString().split("T")[0] : t.value = c;
        else if (t instanceof HTMLTextAreaElement)
          t.value = c;
        else if (t instanceof HTMLSelectElement) {
          let o = 0;
          for (let s = 0; s < t.options.length; s++)
            if (t.options[s].text === c) {
              o = s;
              break;
            }
          t.selectedIndex = o;
        }
      });
    }
  );
}
function d(e) {
  return e instanceof Element ? e : e.__self;
}
function f(e, n) {
  let r;
  e instanceof Array ? r = [...e] : r = [e], r.forEach((c) => n(d(c)));
}
export {
  I as attr,
  j as click,
  T as computed,
  k as create,
  x as event,
  O as forEach,
  D as model,
  w as notify,
  L as renderIf,
  A as state,
  M as text,
  H as watch,
  S as watchDetached
};
