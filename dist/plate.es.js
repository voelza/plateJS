function w(e) {
  const n = {};
  return {
    dom: m(g(e, n), e),
    refs: n
  };
}
function m(e, n) {
  const s = {};
  return Object.entries(e).forEach(([o, t]) => s[o] = t), s.__self = n, s;
}
function g(e, n) {
  const s = {};
  for (let o = 0; o < e.children.length; o++) {
    const t = e.children[o], c = [t.tagName.toLowerCase()], r = t.getAttribute("ref");
    r && c.push(r);
    for (const i of c) {
      let a = s[i] instanceof Array;
      !a && s[i] && (a = !0, s[i] = [s[i]]);
      let u;
      t.children.length === 0 ? u = t : u = m(g(t, n), t), a ? s[i].push(u) : s[i] = u, r && (n[r] = s[i]);
    }
  }
  return s;
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
    (s) => {
      n.value = s, n.observers.forEach((o) => o.update());
    }
  ];
}
function M(e) {
  const n = {
    value: void 0,
    observers: /* @__PURE__ */ new Set()
  };
  return l(() => {
    n.value = e();
    for (const s of n.observers)
      s.update();
  }), E(n);
}
function l(e) {
  const n = {
    update: () => {
      v = n, e(), v = void 0;
    }
  };
  return n.update(), n;
}
function T(e, n) {
  l(() => {
    const s = n();
    f(e, (o) => o.textContent = s);
  });
}
function k(e, n, s) {
  l(
    () => {
      const o = s();
      let t;
      typeof o == "object" ? t = Object.entries(o).map(([c, r]) => `${c}:${r}`).join(";") : t = o, typeof t == "boolean" ? Boolean(t) ? f(e, (c) => p(c).setAttribute(n, "")) : f(e, (c) => p(c).removeAttribute(n)) : f(e, (c) => p(c).setAttribute(n, t));
    }
  );
}
function L(e, n) {
  const s = /* @__PURE__ */ new Map();
  f(e, (t) => {
    var r;
    const c = new Text();
    (r = t.parentElement) == null || r.insertBefore(c, t), s.set(t, c);
  });
  let o;
  l(
    () => {
      const t = n();
      try {
        if (t === o)
          return;
        f(e, (c) => {
          var r;
          if (t) {
            const i = s.get(c);
            (r = i == null ? void 0 : i.parentElement) == null || r.insertBefore(c, i.nextSibling);
          } else
            c.remove();
        });
      } catch (c) {
        console.error(c);
      } finally {
        o = t;
      }
    }
  );
}
function S(e, n, s) {
  const o = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  f(e, (r) => {
    var a;
    const i = new Text();
    (a = r.parentElement) == null || a.insertBefore(i, r), o.set(r, i), t.set(r, []), r.remove();
  });
  let c;
  l(
    () => {
      const r = n();
      try {
        if (r === c)
          return;
        f(e, (i) => {
          var h;
          const a = t.get(i);
          for (const d of a)
            d.remove();
          const u = o.get(i);
          for (let d = 0; d < r.length; d++) {
            const y = r[d], b = i.cloneNode(!0);
            (h = u == null ? void 0 : u.parentElement) == null || h.insertBefore(b, u), a == null || a.push(b), requestAnimationFrame(() => s({ element: b, item: y, index: d }));
          }
        });
      } catch (i) {
        console.error(i);
      } finally {
        c = r;
      }
    }
  );
}
function I(e) {
  l(e);
}
function H(e, ...n) {
  const s = l(e);
  for (const o of n)
    o(!0).observers.add(s);
}
function x(e, n, s) {
  f(e, (o) => o.addEventListener(n, s));
}
function O(e, n) {
  x(e, "click", n);
}
function B(e, n, s) {
  f(e, (o) => {
    x(o, "input", (t) => {
      const c = t;
      let r;
      if (c.target instanceof HTMLInputElement) {
        const i = c.target.value;
        switch (r = i, c.target.type) {
          case "number":
          case "range":
            r = parseFloat(i);
            break;
          case "date":
          case "datetime-local":
            r = new Date(i);
            break;
          case "checkbox":
          case "radio":
            r = c.target.checked;
            break;
        }
      } else
        o instanceof HTMLTextAreaElement ? r = o.value : c.target instanceof HTMLSelectElement && (r = c.target.options[c.target.selectedIndex].text);
      s(r);
    });
  }), l(
    () => {
      const o = n();
      f(e, (t) => {
        if (t instanceof HTMLInputElement)
          t.type === "checkbox" || t.type === "radio" ? t.checked = o : t.type === "date" && o instanceof Date ? t.value = o.toISOString().split("T")[0] : t.value = o;
        else if (t instanceof HTMLTextAreaElement)
          t.value = o;
        else if (t instanceof HTMLSelectElement) {
          let c = 0;
          for (let r = 0; r < t.options.length; r++)
            if (t.options[r].text === o) {
              c = r;
              break;
            }
          t.selectedIndex = c;
        }
      });
    }
  );
}
function p(e) {
  return e instanceof Element ? e : e.__self;
}
function f(e, n) {
  let s;
  e instanceof Array ? s = [...e] : s = [e], s.forEach((o) => n(p(o)));
}
export {
  k as attr,
  O as click,
  M as computed,
  w as create,
  x as event,
  S as forEach,
  B as model,
  L as renderIf,
  A as state,
  T as text,
  I as watch,
  H as watchDetached
};
