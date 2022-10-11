function k(e) {
  const n = {};
  return {
    dom: h(g(e, n), e),
    refs: n
  };
}
function h(e, n) {
  const s = {};
  return Object.entries(e).forEach(([c, t]) => s[c] = t), s.__self = n, s;
}
function g(e, n) {
  const s = {};
  for (let c = 0; c < e.children.length; c++) {
    const t = e.children[c], o = [t.tagName.toLowerCase()], r = t.getAttribute("ref");
    r && o.push(r);
    for (const i of o) {
      let a = s[i] instanceof Array;
      !a && s[i] && (a = !0, s[i] = [s[i]]);
      let l;
      t.children.length === 0 ? l = t : l = h(g(t, n), t), a ? s[i].push(l) : s[i] = l, r && (n[r] = s[i]);
    }
  }
  return s;
}
let v;
function x(e) {
  return (n = void 0) => n ? e : (v && e.observers.add(v), e.value);
}
function A(e) {
  const n = {
    value: e,
    observers: /* @__PURE__ */ new Set()
  };
  return [
    x(n),
    (s) => {
      n.value = s, n.observers.forEach((c) => c.update());
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
    for (const s of n.observers)
      s.update();
  }), x(n);
}
function u(e) {
  const n = {
    update: () => {
      v = n, e(), v = void 0;
    }
  };
  return n.update(), n;
}
function w(e, n) {
  u(() => {
    const s = n();
    f(e, (c) => c.textContent = s);
  });
}
function M(e, n, s) {
  u(
    () => {
      const c = s();
      let t;
      typeof c == "object" ? t = Object.entries(c).map(([o, r]) => `${o}:${r}`).join(";") : t = c, typeof t == "boolean" ? Boolean(t) ? f(e, (o) => d(o).setAttribute(n, "")) : f(e, (o) => d(o).removeAttribute(n)) : f(e, (o) => d(o).setAttribute(n, t));
    }
  );
}
function I(e, n) {
  const s = /* @__PURE__ */ new Map();
  f(e, (t) => {
    const o = new Text();
    t.before(o), s.set(t, o);
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
            const r = s.get(o);
            r == null || r.before(o);
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
function L(e, n, s) {
  const c = [];
  f(e, (o) => {
    const r = new Text();
    o.before(r), o.remove(), c.push({
      marker: r,
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
        for (const r of c) {
          let i = o.length;
          t !== void 0 && t.length > i && (i = t.length);
          for (let a = 0; a < i; a++) {
            const l = o[a], b = t ? t[a] : null;
            if (l == b)
              continue;
            const p = r.elements[a];
            if (l === void 0)
              p.remove(), r.elements.splice(a, 1);
            else if (b === void 0 || !p) {
              const y = o[a], m = r.template.cloneNode(!0);
              r.marker.before(m), r.elements.push(m), requestAnimationFrame(() => s({ element: m, item: y, index: a }));
            } else
              s({ element: p, item: l, index: a });
          }
        }
      } catch (r) {
        console.error(r);
      } finally {
        t = o.map((r) => r instanceof Object ? structuredClone(r) : r);
      }
    }
  );
}
function O(e) {
  u(e);
}
function H(e, ...n) {
  const s = u(e);
  for (const c of n)
    c(!0).observers.add(s);
}
function E(e, n, s) {
  f(e, (c) => c.addEventListener(n, s));
}
function S(e, n) {
  E(e, "click", n);
}
function j(e, n, s) {
  f(e, (c) => {
    E(c, "input", (t) => {
      const o = t;
      let r;
      if (o.target instanceof HTMLInputElement) {
        const i = o.target.value;
        switch (r = i, o.target.type) {
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
            r = o.target.checked;
            break;
        }
      } else
        c instanceof HTMLTextAreaElement ? r = c.value : o.target instanceof HTMLSelectElement && (r = o.target.options[o.target.selectedIndex].text);
      s(r);
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
          for (let r = 0; r < t.options.length; r++)
            if (t.options[r].text === c) {
              o = r;
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
  let s;
  e instanceof Array ? s = [...e] : s = [e], s.forEach((c) => n(d(c)));
}
export {
  M as attr,
  S as click,
  T as computed,
  k as create,
  E as event,
  L as forEach,
  j as model,
  I as renderIf,
  A as state,
  w as text,
  O as watch,
  H as watchDetached
};
