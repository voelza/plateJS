function A(e) {
  const t = {};
  return {
    dom: b(g(e, t), e),
    refs: t
  };
}
function b(e, t) {
  const n = {};
  return Object.entries(e).forEach(([o, r]) => n[o] = r), n.__self = t, n;
}
function g(e, t) {
  const n = {};
  for (let o = 0; o < e.children.length; o++) {
    const r = e.children[o], i = [r.tagName.toLowerCase()], s = r.getAttribute("ref");
    s && i.push(s);
    for (const c of i) {
      let a = n[c] instanceof Array;
      !a && n[c] && (a = !0, n[c] = [n[c]]);
      let f;
      r.children.length === 0 ? f = r : f = b(g(r, t), r), a ? n[c].push(f) : n[c] = f, s && (t[s] = n[c]);
    }
  }
  return n;
}
let h = !1, v = [];
function k(e) {
  const t = {
    value: e,
    observers: []
  };
  return [
    () => (h && v.push(t), t.value),
    (n) => {
      t.value = n;
      for (const o of t.observers)
        o.update();
    }
  ];
}
function M(e) {
  const t = {
    value: void 0,
    observers: []
  };
  return l(() => {
    t.value = e();
    for (const n of t.observers)
      n.update();
  }), () => (h && v.push(t), t.value);
}
function l(e) {
  E(e, e);
}
function E(e, t) {
  if (h = !0, e(), v.length > 0) {
    const n = { update: t };
    for (const o of v)
      o.observers.push(n);
  }
  h = !1, v = [];
}
function O(e, t) {
  l(
    () => {
      const n = t();
      u(e, (o) => o.textContent = n);
    }
  );
}
function B(e, t, n) {
  l(
    () => {
      const o = n();
      let r;
      typeof o == "object" ? r = Object.entries(o).map(([i, s]) => `${i}:${s}`).join(";") : r = o, u(e, (i) => w(i).setAttribute(t, r));
    }
  );
}
function R(e, t) {
  const n = /* @__PURE__ */ new Map();
  u(e, (r) => {
    var s;
    const i = new Text();
    (s = r.parentElement) == null || s.insertBefore(i, r), n.set(r, i);
  });
  let o;
  l(
    () => {
      const r = t();
      try {
        if (r === o)
          return;
        u(e, (i) => {
          var s;
          if (r) {
            const c = n.get(i);
            (s = c == null ? void 0 : c.parentElement) == null || s.insertBefore(i, c.nextSibling);
          } else
            i.remove();
        });
      } catch (i) {
        console.error(i);
      } finally {
        o = r;
      }
    }
  );
}
function j(e, t, n) {
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  u(e, (s) => {
    var a;
    const c = new Text();
    (a = s.parentElement) == null || a.insertBefore(c, s), o.set(s, c), r.set(s, []), s.remove();
  });
  let i;
  l(
    () => {
      const s = t();
      try {
        if (s === i)
          return;
        u(e, (c) => {
          var m;
          const a = r.get(c);
          for (const d of a)
            d.remove();
          const f = o.get(c);
          for (let d = 0; d < s.length; d++) {
            const x = s[d], p = c.cloneNode(!0);
            (m = f == null ? void 0 : f.parentElement) == null || m.insertBefore(p, f), a == null || a.push(p), requestAnimationFrame(() => n({ element: p, item: x, index: d }));
          }
        });
      } catch (c) {
        console.error(c);
      } finally {
        i = s;
      }
    }
  );
}
function D(e) {
  l(e);
}
function _(e, ...t) {
  E(() => t.forEach((n) => n()), e);
}
function y(e, t, n) {
  u(e, (o) => o.addEventListener(t, n));
}
function F(e, t) {
  y(e, "click", t);
}
function T(e, t, n) {
  u(e, (o) => {
    y(o, "input", (r) => {
      const s = r.target, c = s.value;
      let a = c;
      switch (s.type) {
        case "number":
        case "range":
          a = parseFloat(c);
        case "date":
        case "datetime-local":
          a = new Date(c);
        case "checkbox":
        case "radio":
          a = s.checked;
      }
      n(a);
    });
  }), l(
    () => {
      const o = t();
      u(e, (r) => {
        const i = r;
        i.type === "checkbox" || i.type === "radio" ? i.checked = o : i.value = o;
      });
    }
  );
}
function w(e) {
  return e instanceof Element ? e : e.__self;
}
function u(e, t) {
  let n;
  e instanceof Array ? n = [...e] : n = [e], n.forEach((o) => t(w(o)));
}
export {
  B as attr,
  F as click,
  M as computed,
  A as create,
  y as event,
  j as forEach,
  T as model,
  R as renderIf,
  k as state,
  O as text,
  D as watch,
  _ as watchDetached
};
