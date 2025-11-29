import "./chunk-G3PMV62Z.js";

// node_modules/@tma.js/signals/dist/index.js
var r;
function y(e2, c3) {
  r ? r.set(e2, c3) : c3();
}
function m(e2) {
  if (r)
    return e2();
  r = /* @__PURE__ */ new Map();
  try {
    e2();
  } finally {
    r.forEach((c3) => c3()), r = void 0;
  }
}
function S(e2, c3) {
  c3 || (c3 = {});
  const g4 = c3.equals || Object.is;
  let u2 = [], s = e2;
  const i = (t) => {
    if (!g4(s, t)) {
      const l3 = s;
      s = t, y(o2, () => {
        [...u2].forEach(([f3, d3]) => {
          f3(t, l3), d3 && n(f3, true);
        });
      });
    }
  };
  function a(t) {
    const l3 = typeof t != "object" ? { once: t } : t;
    return {
      once: l3.once || false,
      signal: l3.signal || false
    };
  }
  const n = (t, l3) => {
    const f3 = a(l3), d3 = u2.findIndex(([h4, p2]) => h4 === t && p2.once === f3.once && p2.signal === f3.signal);
    d3 >= 0 && u2.splice(d3, 1);
  }, o2 = Object.assign(
    function() {
      return j(o2), s;
    },
    {
      destroy() {
        u2 = [];
      },
      set: i,
      reset() {
        i(e2);
      },
      sub(t, l3) {
        return u2.push([t, a(l3)]), () => n(t, l3);
      },
      unsub: n,
      unsubAll() {
        u2 = u2.filter((t) => t[1].signal);
      }
    }
  );
  return o2;
}
var b = [];
function j(e2) {
  b.length && b[b.length - 1].add(e2);
}
function x(e2, c3) {
  let g4 = /* @__PURE__ */ new Set(), u2;
  function s() {
    return u2 || (u2 = S(a(), c3));
  }
  function i() {
    s().set(a());
  }
  function a() {
    g4.forEach((t) => {
      t.unsub(i, { signal: true });
    });
    const n = /* @__PURE__ */ new Set();
    let o2;
    b.push(n);
    try {
      o2 = e2();
    } finally {
      b.pop();
    }
    return n.forEach((t) => {
      t.sub(i, { signal: true });
    }), g4 = n, o2;
  }
  return Object.assign(function() {
    return s()();
  }, {
    destroy() {
      s().destroy();
    },
    sub(...n) {
      return s().sub(...n);
    },
    unsub(...n) {
      s().unsub(...n);
    },
    unsubAll(...n) {
      s().unsubAll(...n);
    }
  });
}

// node_modules/valibot/dist/index.mjs
var store$4;
function getGlobalConfig(config$1) {
  return {
    lang: (config$1 == null ? void 0 : config$1.lang) ?? (store$4 == null ? void 0 : store$4.lang),
    message: config$1 == null ? void 0 : config$1.message,
    abortEarly: (config$1 == null ? void 0 : config$1.abortEarly) ?? (store$4 == null ? void 0 : store$4.abortEarly),
    abortPipeEarly: (config$1 == null ? void 0 : config$1.abortPipeEarly) ?? (store$4 == null ? void 0 : store$4.abortPipeEarly)
  };
}
var store$3;
function getGlobalMessage(lang) {
  return store$3 == null ? void 0 : store$3.get(lang);
}
var store$2;
function getSchemaMessage(lang) {
  return store$2 == null ? void 0 : store$2.get(lang);
}
var store$1;
function getSpecificMessage(reference, lang) {
  var _a;
  return (_a = store$1 == null ? void 0 : store$1.get(reference)) == null ? void 0 : _a.get(lang);
}
function _stringify(input) {
  var _a, _b;
  const type = typeof input;
  if (type === "string") return `"${input}"`;
  if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
  if (type === "object" || type === "function") return (input && ((_b = (_a = Object.getPrototypeOf(input)) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name)) ?? "null";
  return type;
}
function _addIssue(context, label, dataset, config$1, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected = (other == null ? void 0 : other.expected) ?? context.expects ?? null;
  const received = (other == null ? void 0 : other.received) ?? _stringify(input);
  const issue = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
    requirement: context.requirement,
    path: other == null ? void 0 : other.path,
    issues: other == null ? void 0 : other.issues,
    lang: config$1.lang,
    abortEarly: config$1.abortEarly,
    abortPipeEarly: config$1.abortPipeEarly
  };
  const isSchema = context.kind === "schema";
  const message$1 = (other == null ? void 0 : other.message) ?? context.message ?? getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? getSchemaMessage(issue.lang) : null) ?? config$1.message ?? getGlobalMessage(issue.lang);
  if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
  if (isSchema) dataset.typed = false;
  if (dataset.issues) dataset.issues.push(issue);
  else dataset.issues = [issue];
}
function _getStandardProps(context) {
  return {
    version: 1,
    vendor: "valibot",
    validate(value$1) {
      return context["~run"]({ value: value$1 }, getGlobalConfig());
    }
  };
}
function _isValidObjectKey(object$1, key) {
  return Object.hasOwn(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
function _joinExpects(values$1, separator) {
  const list = [...new Set(values$1)];
  if (list.length > 1) return `(${list.join(` ${separator} `)})`;
  return list[0] ?? "never";
}
var ValiError = class extends Error {
  /**
  * Creates a Valibot error with useful information.
  *
  * @param issues The error issues.
  */
  constructor(issues) {
    super(issues[0].message);
    this.name = "ValiError";
    this.issues = issues;
  }
};
var EMOJI_REGEX = new RegExp("^(?:[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|(?![\\p{Emoji_Modifier_Base}\\u{1F1E6}-\\u{1F1FF}])\\p{Emoji_Presentation}))*)+$", "u");
function check(requirement, message$1) {
  return {
    kind: "validation",
    type: "check",
    reference: check,
    async: false,
    expects: null,
    requirement,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
      return dataset;
    }
  };
}
function integer(message$1) {
  return {
    kind: "validation",
    type: "integer",
    reference: integer,
    async: false,
    expects: null,
    requirement: Number.isInteger,
    message: message$1,
    "~run"(dataset, config$1) {
      if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
      return dataset;
    }
  };
}
function transform(operation) {
  return {
    kind: "transformation",
    type: "transform",
    reference: transform,
    async: false,
    operation,
    "~run"(dataset) {
      dataset.value = this.operation(dataset.value);
      return dataset;
    }
  };
}
function getFallback(schema, dataset, config$1) {
  return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
function getDefault(schema, dataset, config$1) {
  return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
function is(schema, input) {
  return !schema["~run"]({ value: input }, { abortEarly: true }).issues;
}
function any() {
  return {
    kind: "schema",
    type: "any",
    reference: any,
    expects: "any",
    async: false,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset) {
      dataset.typed = true;
      return dataset;
    }
  };
}
function array(item, message$1) {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      var _a;
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0; key < input.length; key++) {
          const value$1 = input[key];
          const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value$1
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              (_a = dataset.issues) == null ? void 0 : _a.push(issue);
            }
            if (!dataset.issues) dataset.issues = itemDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) dataset.typed = false;
          dataset.value.push(itemDataset.value);
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function boolean(message$1) {
  return {
    kind: "schema",
    type: "boolean",
    reference: boolean,
    expects: "boolean",
    async: false,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "boolean") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function date(message$1) {
  return {
    kind: "schema",
    type: "date",
    reference: date,
    expects: "Date",
    async: false,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value instanceof Date) if (!isNaN(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1, { received: '"Invalid Date"' });
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function function_(message$1) {
  return {
    kind: "schema",
    type: "function",
    reference: function_,
    expects: "Function",
    async: false,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "function") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function instance(class_, message$1) {
  return {
    kind: "schema",
    type: "instance",
    reference: instance,
    expects: class_.name,
    async: false,
    class: class_,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value instanceof this.class) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function looseObject(entries$1, message$1) {
  return {
    kind: "schema",
    type: "loose_object",
    reference: looseObject,
    expects: "Object",
    async: false,
    entries: entries$1,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      var _a;
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const valueSchema = this.entries[key];
          if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
            const value$1 = key in input ? input[key] : getDefault(valueSchema);
            const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key,
                value: value$1
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                (_a = dataset.issues) == null ? void 0 : _a.push(issue);
              }
              if (!dataset.issues) dataset.issues = valueDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!valueDataset.typed) dataset.typed = false;
            dataset.value[key] = valueDataset.value;
          } else if (valueSchema.fallback !== void 0) dataset.value[key] = getFallback(valueSchema);
          else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
            _addIssue(this, "key", dataset, config$1, {
              input: void 0,
              expected: `"${key}"`,
              path: [{
                type: "object",
                origin: "key",
                input,
                key,
                value: input[key]
              }]
            });
            if (config$1.abortEarly) break;
          }
        }
        if (!dataset.issues || !config$1.abortEarly) {
          for (const key in input) if (_isValidObjectKey(input, key) && !(key in this.entries)) dataset.value[key] = input[key];
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function nullish(wrapped, default_) {
  return {
    kind: "schema",
    type: "nullish",
    reference: nullish,
    expects: `(${wrapped.expects} | null | undefined)`,
    async: false,
    wrapped,
    default: default_,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value === null || dataset.value === void 0) {
        if (this.default !== void 0) dataset.value = getDefault(this, dataset, config$1);
        if (dataset.value === null || dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  };
}
function number(message$1) {
  return {
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function optional(wrapped, default_) {
  return {
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `(${wrapped.expects} | undefined)`,
    async: false,
    wrapped,
    default: default_,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (dataset.value === void 0) {
        if (this.default !== void 0) dataset.value = getDefault(this, dataset, config$1);
        if (dataset.value === void 0) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped["~run"](dataset, config$1);
    }
  };
}
function record(key, value$1, message$1) {
  return {
    kind: "schema",
    type: "record",
    reference: record,
    expects: "Object",
    async: false,
    key,
    value: value$1,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      var _a, _b;
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const entryKey in input) if (_isValidObjectKey(input, entryKey)) {
          const entryValue = input[entryKey];
          const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
          if (keyDataset.issues) {
            const pathItem = {
              type: "object",
              origin: "key",
              input,
              key: entryKey,
              value: entryValue
            };
            for (const issue of keyDataset.issues) {
              issue.path = [pathItem];
              (_a = dataset.issues) == null ? void 0 : _a.push(issue);
            }
            if (!dataset.issues) dataset.issues = keyDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
          if (valueDataset.issues) {
            const pathItem = {
              type: "object",
              origin: "value",
              input,
              key: entryKey,
              value: entryValue
            };
            for (const issue of valueDataset.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              (_b = dataset.issues) == null ? void 0 : _b.push(issue);
            }
            if (!dataset.issues) dataset.issues = valueDataset.issues;
            if (config$1.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
          if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
        }
      } else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function string(message$1) {
  return {
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      if (typeof dataset.value === "string") dataset.typed = true;
      else _addIssue(this, "type", dataset, config$1);
      return dataset;
    }
  };
}
function _subIssues(datasets) {
  let issues;
  if (datasets) for (const dataset of datasets) if (issues) issues.push(...dataset.issues);
  else issues = dataset.issues;
  return issues;
}
function union(options, message$1) {
  return {
    kind: "schema",
    type: "union",
    reference: union,
    expects: _joinExpects(options.map((option) => option.expects), "|"),
    async: false,
    options,
    message: message$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
        if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
        else typedDatasets = [optionDataset];
        else {
          validDataset = optionDataset;
          break;
        }
        else if (untypedDatasets) untypedDatasets.push(optionDataset);
        else untypedDatasets = [optionDataset];
      }
      if (validDataset) return validDataset;
      if (typedDatasets) {
        if (typedDatasets.length === 1) return typedDatasets[0];
        _addIssue(this, "type", dataset, config$1, { issues: _subIssues(typedDatasets) });
        dataset.typed = true;
      } else if ((untypedDatasets == null ? void 0 : untypedDatasets.length) === 1) return untypedDatasets[0];
      else _addIssue(this, "type", dataset, config$1, { issues: _subIssues(untypedDatasets) });
      return dataset;
    }
  };
}
function unknown() {
  return {
    kind: "schema",
    type: "unknown",
    reference: unknown,
    expects: "unknown",
    async: false,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset) {
      dataset.typed = true;
      return dataset;
    }
  };
}
function parse(schema, input, config$1) {
  const dataset = schema["~run"]({ value: input }, getGlobalConfig(config$1));
  if (dataset.issues) throw new ValiError(dataset.issues);
  return dataset.value;
}
function pipe(...pipe$1) {
  return {
    ...pipe$1[0],
    pipe: pipe$1,
    get "~standard"() {
      return _getStandardProps(this);
    },
    "~run"(dataset, config$1) {
      for (const item of pipe$1) if (item.kind !== "metadata") {
        if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
      }
      return dataset;
    }
  };
}
function safeParse(schema, input, config$1) {
  const dataset = schema["~run"]({ value: input }, getGlobalConfig(config$1));
  return {
    typed: dataset.typed,
    success: !dataset.issues,
    output: dataset.value,
    issues: dataset.issues
  };
}

// node_modules/better-promises/dist/index.js
var $ = Object.defineProperty;
var q = (r2, e2, t) => e2 in r2 ? $(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var w = (r2, e2, t) => q(r2, typeof e2 != "symbol" ? e2 + "" : e2, t);
var D = Object.defineProperty;
var G = (r2, e2, t) => e2 in r2 ? D(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var E = (r2, e2, t) => G(r2, typeof e2 != "symbol" ? e2 + "" : e2, t);
function I(r2) {
  return (e2) => e2 instanceof r2;
}
function L(r2, e2) {
  const t = class extends Error {
    constructor(...d3) {
      const l3 = typeof e2 == "function" ? e2(...d3) : typeof e2 == "string" ? [e2] : e2 || [];
      super(...l3), this.name = r2;
    }
  };
  E(t, "is", I(t));
  let c3 = t;
  return Object.defineProperty(c3, "name", { value: r2 }), c3;
}
function H(r2, e2, t) {
  const c3 = class extends L(r2, t) {
    constructor(...l3) {
      super(...l3), E(this, "data"), this.data = e2(...l3);
    }
  };
  E(c3, "is", I(c3));
  let o2 = c3;
  return Object.defineProperty(o2, "name", { value: r2 }), o2;
}
var J = class extends L("CancelledError", "Promise was canceled") {
};
var K = class extends H(
  "TimeoutError",
  (e2) => ({ timeout: e2 }),
  (e2, t) => [`Timeout reached: ${e2}ms`, { cause: t }]
) {
};
var S2 = Symbol("resolved");
function M(r2) {
  return { tag: S2, value: r2 };
}
function C(r2, e2) {
  return r2.reject = e2.reject, r2.resolve = e2.resolve, r2;
}
var g = class _g extends Promise {
  constructor(t, c3) {
    let o2, d3, l3, p2;
    typeof t == "function" ? (l3 = t, p2 = c3 || {}) : p2 = t || {};
    let u2, a;
    const x5 = () => !!a, O2 = () => !!u2;
    let f3 = {};
    const b4 = [], T5 = () => {
      b4.forEach((m3) => m3()), b4.splice(0, b4.length), f3 = {};
    }, y4 = new AbortController(), k4 = () => O2() || x5();
    super((m3, F4) => {
      const { abortOnResolve: P4 = true, abortOnReject: A4 = true } = p2;
      d3 = (n) => {
        var h4, s;
        k4() || (m3(n), u2 = [n], (h4 = f3.resolved) == null || h4.forEach((i) => i(n)), (s = f3.finalized) == null || s.forEach((i) => i({ kind: "resolved", result: n })), T5(), P4 && y4.abort(M(n)));
      }, o2 = (n) => {
        var h4, s;
        k4() || (F4(n), a = [n], (h4 = f3.rejected) == null || h4.forEach((i) => i(n)), (s = f3.finalized) == null || s.forEach((i) => i({ kind: "rejected", reason: n })), T5(), A4 && y4.abort(n));
      };
      const { abortSignal: j4 } = p2;
      if (j4) {
        if (j4.aborted)
          return o2(j4.reason);
        const n = () => {
          o2(j4.reason);
        };
        j4.addEventListener("abort", n, true), b4.push(() => {
          j4.removeEventListener("abort", n, true);
        });
      }
      const { timeout: R3 } = p2;
      if (R3) {
        const n = setTimeout(() => {
          o2(new K(R3));
        }, R3);
        b4.push(() => {
          clearTimeout(n);
        });
      }
      try {
        const n = () => {
        }, h4 = l3 && l3(d3, o2, {
          abortSignal: y4.signal,
          get isRejected() {
            return x5();
          },
          get isResolved() {
            return O2();
          },
          on(s, i) {
            if (u2 || a) {
              if (s === "finalized") {
                const v4 = u2 ? { kind: "resolved", result: u2[0] } : { kind: "rejected", reason: a[0] };
                i(v4);
              } else s === "resolved" && u2 ? i(u2[0]) : s === "rejected" && a && i(a[0]);
              return n;
            }
            return f3[s] || (f3[s] = []), f3[s].push(i), () => {
              const v4 = f3[s] || [], z4 = v4.indexOf(i);
              z4 >= 0 && v4.splice(z4, 1);
            };
          },
          get result() {
            return u2 == null ? void 0 : u2[0];
          },
          get rejectReason() {
            return a == null ? void 0 : a[0];
          },
          throwIfRejected() {
            if (a)
              throw a[0];
          }
        });
        h4 instanceof Promise && h4.catch(o2);
      } catch (n) {
        o2(n);
      }
    });
    w(this, "reject");
    w(this, "resolve");
    this.reject = o2, this.resolve = d3;
  }
  static fn(t, c3) {
    return new _g(async (o2, d3, l3) => {
      try {
        o2(await t(l3));
      } catch (p2) {
        d3(p2);
      }
    }, c3);
  }
  static resolve(t) {
    return this.fn(() => t);
  }
  /**
   * @see Promise.reject
   */
  static reject(t) {
    return new _g((c3, o2) => {
      o2(t);
    });
  }
  /**
   * Rejects the promise with the `CancelledError` error.
   */
  cancel() {
    this.reject(new J());
  }
  /**
   * @see Promise.catch
   */
  catch(t) {
    return this.then(void 0, t);
  }
  /**
   * @see Promise.finally
   */
  finally(t) {
    return C(super.finally(t), this);
  }
  /**
   * @see Promise.then
   */
  then(t, c3) {
    return C(
      super.then(t, c3),
      this
    );
  }
};

// node_modules/@tma.js/toolkit/dist/index.js
function ar(r2) {
  return r2.replace(/[A-Z]/g, (n) => `-${n.toLowerCase()}`);
}
function F(r2) {
  return r2.replace(/_[a-z]/g, (n) => n[1].toUpperCase());
}
function I2(r2) {
  return Object.entries(r2).reduce((n, [t, e2]) => (n[F(t)] = e2, n), {});
}
function v(r2) {
  const n = I2(r2);
  for (const t in n) {
    const e2 = n[t];
    e2 && typeof e2 == "object" && !(e2 instanceof Date) && (n[t] = Array.isArray(e2) ? e2.map(v) : v(e2));
  }
  return n;
}
function cr(r2) {
  return r2.replace(/_([a-z])/g, (n, t) => `-${t.toLowerCase()}`);
}
function m2(r2) {
  return `tapps/${r2}`;
}
function sr(r2, n) {
  sessionStorage.setItem(m2(r2), JSON.stringify(n));
}
function fr(r2) {
  const n = sessionStorage.getItem(m2(r2));
  try {
    return n ? JSON.parse(n) : void 0;
  } catch {
  }
}
function lr(...r2) {
  const n = r2.flat(1);
  return [
    n.push.bind(n),
    () => {
      n.forEach((t) => {
        t();
      });
    }
  ];
}
function hr(r2, n) {
  n || (n = {});
  const {
    textColor: t,
    bgColor: e2,
    shouldLog: a
  } = n, u2 = a === void 0 ? true : a, i = typeof u2 == "boolean" ? () => u2 : u2, s = (f3, o2, ...c3) => {
    if (o2 || i()) {
      const l3 = "font-weight:bold;padding:0 5px;border-radius:100px", [x5, O2, j4] = {
        log: ["#0089c3", "white", "INFO"],
        error: ["#ff0000F0", "white", "ERR"],
        warn: ["#D38E15", "white", "WARN"]
      }[f3];
      console[f3](
        `%c${j4} ${Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
          timeZone: "UTC"
        }).format(/* @__PURE__ */ new Date())}%c %c${r2}`,
        `${l3};background-color:${x5};color:${O2}`,
        "",
        `${l3};${t ? `color:${t};` : ""}${e2 ? `background-color:${e2}` : ""}`,
        ...c3
      );
    }
  };
  return [
    ["log", "forceLog"],
    ["warn", "forceWarn"],
    ["error", "forceError"]
  ].reduce((f3, [o2, c3]) => (f3[o2] = s.bind(void 0, o2, false), f3[c3] = s.bind(void 0, o2, true), f3), {});
}
var P = function(r2, n, t) {
  if (t || arguments.length === 2) for (var e2 = 0, a = n.length, u2; e2 < a; e2++)
    (u2 || !(e2 in n)) && (u2 || (u2 = Array.prototype.slice.call(n, 0, e2)), u2[e2] = n[e2]);
  return r2.concat(u2 || Array.prototype.slice.call(n));
};
function d(r2, n, t, e2, a, u2, i, s, f3) {
  switch (arguments.length) {
    case 1:
      return r2;
    case 2:
      return function() {
        return n(r2.apply(this, arguments));
      };
    case 3:
      return function() {
        return t(n(r2.apply(this, arguments)));
      };
    case 4:
      return function() {
        return e2(t(n(r2.apply(this, arguments))));
      };
    case 5:
      return function() {
        return a(e2(t(n(r2.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return u2(a(e2(t(n(r2.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return i(u2(a(e2(t(n(r2.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return s(i(u2(a(e2(t(n(r2.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return f3(s(i(u2(a(e2(t(n(r2.apply(this, arguments)))))))));
      };
  }
}
function h(r2, n, t, e2, a, u2, i, s, f3) {
  switch (arguments.length) {
    case 1:
      return r2;
    case 2:
      return n(r2);
    case 3:
      return t(n(r2));
    case 4:
      return e2(t(n(r2)));
    case 5:
      return a(e2(t(n(r2))));
    case 6:
      return u2(a(e2(t(n(r2)))));
    case 7:
      return i(u2(a(e2(t(n(r2))))));
    case 8:
      return s(i(u2(a(e2(t(n(r2)))))));
    case 9:
      return f3(s(i(u2(a(e2(t(n(r2))))))));
    default: {
      for (var o2 = arguments[0], c3 = 1; c3 < arguments.length; c3++)
        o2 = arguments[c3](o2);
      return o2;
    }
  }
}
var w2 = function(r2, n) {
  var t = typeof r2 == "number" ? function(e2) {
    return e2.length >= r2;
  } : r2;
  return function() {
    var e2 = Array.from(arguments);
    return t(arguments) ? n.apply(this, e2) : function(a) {
      return n.apply(void 0, P([a], e2, false));
    };
  };
};
var R = function(r2) {
  return r2._tag === "Left";
};
var $2 = function(r2) {
  return { _tag: "Left", left: r2 };
};
var _ = function(r2) {
  return { _tag: "Right", right: r2 };
};
var C2 = $2;
var k = _;
var A = R;
var D2 = function(r2, n) {
  return function(t) {
    return A(t) ? r2(t.left) : n(t.right);
  };
};
var g2 = D2;
function K2(r2) {
  return d(k, r2.of);
}
function U(r2) {
  return d(C2, r2.of);
}
function W(r2) {
  return function(n, t) {
    return r2.chain(n, function(e2) {
      return A(e2) ? r2.of(e2) : t(e2.right);
    });
  };
}
function B(r2) {
  return function(n, t) {
    return function(e2) {
      return r2.map(e2, g2(n, t));
    };
  };
}
var L2 = function(r2, n) {
  return h(r2, M2(n));
};
var N = function(r2, n) {
  return h(r2, V(n));
};
var M2 = function(r2) {
  return function(n) {
    return function() {
      return Promise.resolve().then(n).then(r2);
    };
  };
};
var V = function(r2) {
  return function(n) {
    return function() {
      return Promise.all([Promise.resolve().then(n), Promise.resolve().then(r2)]).then(function(t) {
        var e2 = t[0], a = t[1];
        return e2(a);
      });
    };
  };
};
var p = function(r2) {
  return function() {
    return Promise.resolve(r2);
  };
};
var Z = w2(2, function(r2, n) {
  return function() {
    return Promise.resolve().then(r2).then(function(t) {
      return n(t)();
    });
  };
});
var S3 = "Task";
var z = {
  URI: S3,
  map: L2
};
var T = {
  of: p
};
var G2 = {
  URI: S3,
  map: L2,
  of: p,
  ap: N,
  chain: Z
};
var J2 = function(r2, n, t, e2) {
  function a(u2) {
    return u2 instanceof t ? u2 : new t(function(i) {
      i(u2);
    });
  }
  return new (t || (t = Promise))(function(u2, i) {
    function s(c3) {
      try {
        o2(e2.next(c3));
      } catch (l3) {
        i(l3);
      }
    }
    function f3(c3) {
      try {
        o2(e2.throw(c3));
      } catch (l3) {
        i(l3);
      }
    }
    function o2(c3) {
      c3.done ? u2(c3.value) : a(c3.value).then(s, f3);
    }
    o2((e2 = e2.apply(r2, n || [])).next());
  });
};
var q2 = function(r2, n) {
  var t = { label: 0, sent: function() {
    if (u2[0] & 1) throw u2[1];
    return u2[1];
  }, trys: [], ops: [] }, e2, a, u2, i;
  return i = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function s(o2) {
    return function(c3) {
      return f3([o2, c3]);
    };
  }
  function f3(o2) {
    if (e2) throw new TypeError("Generator is already executing.");
    for (; i && (i = 0, o2[0] && (t = 0)), t; ) try {
      if (e2 = 1, a && (u2 = o2[0] & 2 ? a.return : o2[0] ? a.throw || ((u2 = a.return) && u2.call(a), 0) : a.next) && !(u2 = u2.call(a, o2[1])).done) return u2;
      switch (a = 0, u2 && (o2 = [o2[0] & 2, u2.value]), o2[0]) {
        case 0:
        case 1:
          u2 = o2;
          break;
        case 4:
          return t.label++, { value: o2[1], done: false };
        case 5:
          t.label++, a = o2[1], o2 = [0];
          continue;
        case 7:
          o2 = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (u2 = t.trys, !(u2 = u2.length > 0 && u2[u2.length - 1]) && (o2[0] === 6 || o2[0] === 2)) {
            t = 0;
            continue;
          }
          if (o2[0] === 3 && (!u2 || o2[1] > u2[0] && o2[1] < u2[3])) {
            t.label = o2[1];
            break;
          }
          if (o2[0] === 6 && t.label < u2[1]) {
            t.label = u2[1], u2 = o2;
            break;
          }
          if (u2 && t.label < u2[2]) {
            t.label = u2[2], t.ops.push(o2);
            break;
          }
          u2[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      o2 = n.call(r2, t);
    } catch (c3) {
      o2 = [6, c3], a = 0;
    } finally {
      e2 = u2 = 0;
    }
    if (o2[0] & 5) throw o2[1];
    return { value: o2[0] ? o2[1] : void 0, done: true };
  }
};
var H2 = U(T);
var Q = K2(T);
var X = p;
var b2 = B(z);
var Y = b2;
var rr = function(r2, n) {
  return function() {
    return J2(void 0, void 0, void 0, function() {
      var t;
      return q2(this, function(e2) {
        switch (e2.label) {
          case 0:
            return e2.trys.push([0, 2, , 3]), [4, r2().then(_)];
          case 1:
            return [2, e2.sent()];
          case 2:
            return t = e2.sent(), [2, $2(n(t))];
          case 3:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  };
};
var nr = w2(2, W(G2));
var tr = nr;
function er(r2) {
  const n = (t) => {
    throw t;
  };
  return typeof r2 == "function" ? g.resolve(h(r2, b2(n, (t) => t))()) : h(r2, g2(n, (t) => t));
}
function gr(r2) {
  return Object.assign(
    (...n) => er(r2(...n)),
    r2
  );
}
var ur = Object.assign(
  (r2, n) => h(
    rr(
      () => new g((t, e2, a) => r2(
        (u2) => t(k(u2)),
        (u2) => t(C2(u2)),
        a
      ), n),
      (t) => t
    ),
    tr(g2(H2, Q))
  ),
  {
    fn: (r2, n) => ur((t, e2, a) => {
      const u2 = r2(a);
      h(
        typeof u2 == "function" ? u2 : X(u2),
        Y(e2, t)
      )();
    }, n)
  }
);

// node_modules/error-kid/dist/index.js
var l = Object.defineProperty;
var o = (e2, t, n) => t in e2 ? l(e2, t, { enumerable: true, configurable: true, writable: true, value: n }) : e2[t] = n;
var c = (e2, t, n) => o(e2, typeof t != "symbol" ? t + "" : t, n);
function f(e2) {
  return (t) => t instanceof e2;
}
function u(e2, t) {
  const s = class s extends Error {
    constructor(...d3) {
      const i = typeof t == "function" ? t(...d3) : typeof t == "string" ? [t] : t || [];
      super(...i), this.name = e2;
    }
  };
  c(s, "is", f(s));
  let n = s;
  return Object.defineProperty(n, "name", { value: e2 }), n;
}
function y2(e2, t, n) {
  const a = class a extends u(e2, n) {
    constructor(...r2) {
      super(...r2);
      c(this, "data");
      this.data = t(...r2);
    }
  };
  c(a, "is", f(a));
  let s = a;
  return Object.defineProperty(s, "name", { value: e2 }), s;
}

// node_modules/@tma.js/transformers/dist/index.js
function E2(t, r2, e2, u2, a, s, o2, R3, J4) {
  switch (arguments.length) {
    case 1:
      return t;
    case 2:
      return r2(t);
    case 3:
      return e2(r2(t));
    case 4:
      return u2(e2(r2(t)));
    case 5:
      return a(u2(e2(r2(t))));
    case 6:
      return s(a(u2(e2(r2(t)))));
    case 7:
      return o2(s(a(u2(e2(r2(t))))));
    case 8:
      return R3(o2(s(a(u2(e2(r2(t)))))));
    case 9:
      return J4(R3(o2(s(a(u2(e2(r2(t))))))));
    default: {
      for (var y4 = arguments[0], _3 = 1; _3 < arguments.length; _3++)
        y4 = arguments[_3](y4);
      return y4;
    }
  }
}
var V2 = function(t) {
  return t._tag === "Left";
};
var q3 = function(t) {
  return { _tag: "Left", left: t };
};
var v2 = function(t) {
  return { _tag: "Right", right: t };
};
var Q2 = q3;
var f2 = v2;
var x2 = function(t) {
  return function(r2) {
    return j2(r2) ? r2 : f2(t(r2.right));
  };
};
var j2 = V2;
var G3 = function(t, r2) {
  try {
    return f2(t());
  } catch (e2) {
    return Q2(r2(e2));
  }
};
function M3(t) {
  const r2 = (e2) => {
    const u2 = {};
    return new URLSearchParams(e2).forEach((a, s) => {
      const o2 = u2[s];
      Array.isArray(o2) ? o2.push(a) : o2 === void 0 ? u2[s] = a : u2[s] = [o2, a];
    }), parse(t, u2);
  };
  return pipe(
    union([string(), instance(URLSearchParams)]),
    check((e2) => {
      try {
        return r2(e2), true;
      } catch {
        return false;
      }
    }, "The value doesn't match required schema"),
    transform(r2)
  );
}
function H3(t) {
  return pipe(
    string(),
    check((r2) => {
      try {
        return JSON.parse(r2), true;
      } catch {
        return false;
      }
    }, "Input is not a valid JSON value"),
    transform(JSON.parse),
    t
  );
}
function h2(t) {
  return pipe(string(), H3(t));
}
function W2(t) {
  return pipe(
    union([string(), instance(URLSearchParams)]),
    M3(t)
  );
}
function d2(t) {
  return (r2) => t.test(r2);
}
var K3 = d2(/^#[\da-f]{3}$/i);
var X2 = d2(/^#[\da-f]{4}$/i);
var Y2 = d2(/^#[\da-f]{6}$/i);
var Z2 = d2(/^#[\da-f]{8}$/i);
function k2(t) {
  return [Y2, Z2, K3, X2].some((r2) => r2(t));
}
function $3(t) {
  let r2 = "#";
  for (let e2 = 0; e2 < t.length - 1; e2 += 1)
    r2 += t[1 + e2].repeat(2);
  return r2;
}
function b3(t) {
  const r2 = t.replace(/\s/g, "").toLowerCase();
  if (/^#[\da-f]{3}$/i.test(r2))
    return f2($3(r2.toLowerCase() + "f"));
  if (/^#[\da-f]{4}$/i.test(r2))
    return f2($3(r2.toLowerCase()));
  if (/^#[\da-f]{6}$/i.test(r2))
    return f2(r2.toLowerCase() + "ff");
  if (/^#[\da-f]{8}$/i.test(r2))
    return f2(r2.toLowerCase());
  const e2 = r2.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/) || r2.match(/^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})\)$/);
  return e2 ? f2(
    e2.slice(1).reduce(
      (u2, a) => u2 + parseInt(a, 10).toString(16).padStart(2, "0"),
      "#"
    ).padEnd(9, "f")
  ) : Q2(new Error(`Value "${t}" does not satisfy any of known RGB formats.`));
}
function tt(t) {
  return E2(
    b3(t),
    x2((r2) => r2.slice(0, 7))
  );
}
var ct = gr(tt);
var ft = gr(b3);
function rt() {
  return looseObject({
    id: number(),
    photo_url: optional(string()),
    type: string(),
    title: string(),
    username: optional(string())
  });
}
function P2() {
  return looseObject({
    added_to_attachment_menu: optional(boolean()),
    allows_write_to_pm: optional(boolean()),
    first_name: string(),
    id: number(),
    is_bot: optional(boolean()),
    is_premium: optional(boolean()),
    last_name: optional(string()),
    language_code: optional(string()),
    photo_url: optional(string()),
    username: optional(string())
  });
}
function et() {
  return looseObject({
    auth_date: pipe(
      string(),
      transform((t) => new Date(Number(t) * 1e3)),
      date()
    ),
    can_send_after: optional(pipe(string(), transform(Number), integer())),
    chat: optional(h2(rt())),
    chat_type: optional(string()),
    chat_instance: optional(string()),
    hash: string(),
    query_id: optional(string()),
    receiver: optional(h2(P2())),
    start_param: optional(string()),
    signature: string(),
    user: optional(h2(P2()))
  });
}
function F2() {
  return W2(et());
}
function B2() {
  return record(
    string(),
    pipe(
      union([string(), number()]),
      transform((t) => typeof t == "number" ? `#${(t & 16777215).toString(16).padStart(6, "0")}` : t),
      check(k2)
    )
  );
}
function nt() {
  const t = optional(pipe(string(), transform((r2) => r2 === "1")));
  return looseObject({
    tgWebAppBotInline: t,
    tgWebAppData: optional(F2()),
    tgWebAppDefaultColors: optional(h2(B2())),
    tgWebAppFullscreen: t,
    tgWebAppPlatform: string(),
    tgWebAppShowSettings: t,
    tgWebAppStartParam: optional(string()),
    tgWebAppThemeParams: h2(B2()),
    tgWebAppVersion: string()
  });
}
function T2() {
  return W2(nt());
}
function ht() {
  return looseObject({
    eventType: string(),
    eventData: optional(unknown())
  });
}
function at(t) {
  return G3(
    () => parse(F2(), t),
    (r2) => r2
  );
}
function it(t) {
  return G3(
    () => parse(T2(), t),
    (r2) => r2
  );
}
var lt = gr(at);
var mt = gr(it);
function C3(t, r2) {
  return r2 || (r2 = (e2, u2) => JSON.stringify(u2)), new URLSearchParams(
    Object.entries(t).reduce((e2, [u2, a]) => (Array.isArray(a) ? e2.push(...a.map((s) => [u2, String(s)])) : a != null && e2.push([
      u2,
      a instanceof Date ? (a.getTime() / 1e3 | 0).toString() : typeof a == "string" || typeof a == "number" ? String(a) : typeof a == "boolean" ? a ? "1" : "0" : r2(u2, a)
    ]), e2), [])
  ).toString();
}
function ut(t) {
  return C3(t);
}
function gt(t) {
  return C3(t, (r2, e2) => r2 === "tgWebAppData" ? ut(e2) : JSON.stringify(e2));
}

// node_modules/mitt/dist/mitt.mjs
function mitt_default(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e2) {
    var i = n.get(t);
    i ? i.push(e2) : n.set(t, [e2]);
  }, off: function(t, e2) {
    var i = n.get(t);
    i && (e2 ? i.splice(i.indexOf(e2) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e2) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e2);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e2);
    });
  } };
}

// node_modules/@tma.js/bridge/dist/index.js
function pe(e2) {
  return is(
    looseObject({ TelegramWebviewProxy: looseObject({ postEvent: function_() }) }),
    e2
  );
}
function _e() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
var je = function(e2, t, r2) {
  if (r2 || arguments.length === 2) for (var n = 0, a = t.length, o2; n < a; n++)
    (o2 || !(n in t)) && (o2 || (o2 = Array.prototype.slice.call(t, 0, n)), o2[n] = t[n]);
  return e2.concat(o2 || Array.prototype.slice.call(t));
};
function ze(e2) {
  return e2;
}
function S4(e2, t, r2, n, a, o2, s, i, c3) {
  switch (arguments.length) {
    case 1:
      return e2;
    case 2:
      return function() {
        return t(e2.apply(this, arguments));
      };
    case 3:
      return function() {
        return r2(t(e2.apply(this, arguments)));
      };
    case 4:
      return function() {
        return n(r2(t(e2.apply(this, arguments))));
      };
    case 5:
      return function() {
        return a(n(r2(t(e2.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return o2(a(n(r2(t(e2.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return s(o2(a(n(r2(t(e2.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return i(s(o2(a(n(r2(t(e2.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return c3(i(s(o2(a(n(r2(t(e2.apply(this, arguments)))))))));
      };
  }
}
function l2(e2, t, r2, n, a, o2, s, i, c3) {
  switch (arguments.length) {
    case 1:
      return e2;
    case 2:
      return t(e2);
    case 3:
      return r2(t(e2));
    case 4:
      return n(r2(t(e2)));
    case 5:
      return a(n(r2(t(e2))));
    case 6:
      return o2(a(n(r2(t(e2)))));
    case 7:
      return s(o2(a(n(r2(t(e2))))));
    case 8:
      return i(s(o2(a(n(r2(t(e2)))))));
    case 9:
      return c3(i(s(o2(a(n(r2(t(e2))))))));
    default: {
      for (var u2 = arguments[0], p2 = 1; p2 < arguments.length; p2++)
        u2 = arguments[p2](u2);
      return u2;
    }
  }
}
var C4 = function(e2, t) {
  var r2 = typeof e2 == "number" ? function(n) {
    return n.length >= e2;
  } : e2;
  return function() {
    var n = Array.from(arguments);
    return r2(arguments) ? t.apply(this, n) : function(a) {
      return t.apply(void 0, je([a], n, false));
    };
  };
};
var Ge = { _tag: "None" };
var Ve = function(e2) {
  return { _tag: "Some", value: e2 };
};
var Be = function(e2) {
  return e2._tag === "Left";
};
var De = function(e2) {
  return { _tag: "Left", left: e2 };
};
var Ne = function(e2) {
  return { _tag: "Right", right: e2 };
};
var w3 = De;
var _2 = Ne;
var fe = C4(2, function(e2, t) {
  return v3(e2) ? e2 : t(e2.right);
});
var Je = function(e2) {
  return function(t) {
    return v3(t) ? t : _2(e2(t.right));
  };
};
var Qe = function(e2, t) {
  return function(r2) {
    return v3(r2) ? w3(e2(r2.left)) : _2(t(r2.right));
  };
};
var He = function(e2) {
  return function(t) {
    return v3(t) ? w3(e2(t.left)) : t;
  };
};
var v3 = Be;
var le = function(e2, t) {
  return function(r2) {
    return v3(r2) ? e2(r2.left) : t(r2.right);
  };
};
var Ke = le;
var I3 = le;
var Ye = I3;
var O = function(e2, t) {
  try {
    return _2(e2());
  } catch (r2) {
    return w3(t(r2));
  }
};
var Xe = fe;
var Ze = fe;
var et2 = Ge;
var tt2 = Ve;
var rt2 = function(e2) {
  return e2._tag === "None";
};
var nt2 = function(e2, t) {
  return function(r2) {
    return rt2(r2) ? e2() : t(r2.value);
  };
};
var ot = nt2;
function at2(e2) {
  return S4(_2, e2.of);
}
function st(e2) {
  return S4(w3, e2.of);
}
function it2(e2) {
  return function(t, r2) {
    return e2.chain(t, function(n) {
      return v3(n) ? e2.of(n) : r2(n.right);
    });
  };
}
function ut2(e2) {
  return function(t, r2, n) {
    return e2.map(t, Qe(r2, n));
  };
}
function ct2(e2) {
  return function(t, r2) {
    return function(n) {
      return e2.map(n, I3(t, r2));
    };
  };
}
var me = function(e2, t) {
  return l2(e2, _t(t));
};
var pt = function(e2, t) {
  return l2(e2, ft2(t));
};
var _t = function(e2) {
  return function(t) {
    return function() {
      return Promise.resolve().then(t).then(e2);
    };
  };
};
var ft2 = function(e2) {
  return function(t) {
    return function() {
      return Promise.all([Promise.resolve().then(t), Promise.resolve().then(e2)]).then(function(r2) {
        var n = r2[0], a = r2[1];
        return n(a);
      });
    };
  };
};
var we = function(e2) {
  return function() {
    return Promise.resolve(e2);
  };
};
var lt2 = C4(2, function(e2, t) {
  return function() {
    return Promise.resolve().then(e2).then(function(r2) {
      return t(r2)();
    });
  };
});
var he = "Task";
var ge = {
  URI: he,
  map: me
};
var de = {
  of: we
};
var mt2 = {
  URI: he,
  map: me,
  of: we,
  ap: pt,
  chain: lt2
};
var wt = st(de);
var ve = at2(de);
var be = ct2(ge);
var ye = C4(3, ut2(ge));
var Ee = C4(2, it2(mt2));
var ht2 = Ee;
var Pe = Ee;
var gt2 = class extends u("MethodUnsupportedError", (t, r2) => [
  `Method "${t}" is unsupported in Mini Apps version ${r2}`
]) {
};
var dt = class extends u("MethodParameterUnsupportedError", (t, r2, n) => [
  `Parameter "${r2}" of "${t}" method is unsupported in Mini Apps version ${n}`
]) {
};
var vt = class extends y2(
  "LaunchParamsRetrieveError",
  (t) => ({ errors: t }),
  (t) => [
    [
      "Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?",
      "📖 Refer to docs for more information:",
      "https://docs.telegram-mini-apps.com/packages/tma-js-bridge/environment",
      "",
      "Collected errors:",
      ...t.map(({ source: r2, error: n }) => `Source: ${r2} / ${n instanceof Error ? n.message : String(n)}`)
    ].join(`
`)
  ]
) {
};
var bt = class extends u("InvalidLaunchParamsError", (t, r2) => [
  `Invalid value for launch params: ${t}`,
  { cause: r2 }
]) {
};
var xe = class extends u("UnknownEnvError") {
};
var yt = class extends u(
  "InvokeCustomMethodError",
  (t) => [`Server returned error: ${t}`]
) {
};
var N2 = "launchParams";
function J3(e2) {
  return e2.replace(/^[^?#]*[?#]/, "").replace(/[?#]/g, "&");
}
var Et = S4(L3, Xe(it));
var Jt = gr(Et);
var Pt = S4(L3, Je((e2) => {
  const t = new URLSearchParams(e2).get("tgWebAppData");
  return t ? tt2(t) : et2;
}));
var Qt = S4(
  Pt,
  Ye((e2) => {
    throw e2;
  }, (e2) => e2),
  ot(() => {
  }, (e2) => e2)
);
function L3() {
  const e2 = [];
  for (const [t, r2] of [
    // Try to retrieve launch parameters from the current location. This method
    // can return nothing in case, location was changed, and then the page was
    // reloaded.
    [() => J3(window.location.href), "window.location.href"],
    // Then, try using the lower level API - window.performance.
    [() => {
      const n = performance.getEntriesByType("navigation")[0];
      return n && J3(n.name);
    }, "performance navigation entries"],
    // Finally, try using the session storage.
    [() => fr(N2), "local storage"]
  ]) {
    const n = t();
    if (!n) {
      e2.push({ source: r2, error: new Error("Source is empty") });
      continue;
    }
    const a = l2(
      it(n),
      Ke((o2) => o2, () => true)
    );
    if (typeof a != "boolean") {
      e2.push({ source: r2, error: a });
      continue;
    }
    return sr(N2, n), _2(n);
  }
  return w3(new vt(e2));
}
var Ht = gr(L3);
function xt(e2, t) {
  const r2 = /* @__PURE__ */ new Map(), n = mitt_default(), a = (o2, s, i = false) => {
    const c3 = r2.get(o2) || /* @__PURE__ */ new Map();
    r2.set(o2, c3);
    const u2 = c3.get(s) || [];
    c3.set(s, u2);
    const p2 = u2.findIndex((f3) => f3[1] === i);
    if (p2 >= 0 && (n.off(o2, u2[p2][0]), u2.splice(p2, 1), !u2.length && (c3.delete(s), !c3.size))) {
      const f3 = r2.size;
      r2.delete(o2), f3 && !r2.size && t();
    }
  };
  return {
    on(o2, s, i) {
      !r2.size && e2();
      const c3 = () => {
        a(o2, s, i);
      }, u2 = (...h4) => {
        i && c3(), o2 === "*" ? s({ name: h4[0], payload: h4[1] }) : s(...h4);
      };
      n.on(o2, u2);
      const p2 = r2.get(o2) || /* @__PURE__ */ new Map();
      r2.set(o2, p2);
      const f3 = p2.get(s) || [];
      return p2.set(s, f3), f3.push([u2, i || false]), c3;
    },
    off: a,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    emit: n.emit,
    clear() {
      const o2 = r2.size;
      n.all.clear(), r2.clear(), o2 && t();
    }
  };
}
function F3(e2, t) {
  window.dispatchEvent(new MessageEvent("message", {
    data: JSON.stringify({ eventType: e2, eventData: t }),
    // We specify this kind of source here in order to allow the package's "on" function to
    // capture it. The reason is this function always checks the event source and relies on
    // it to be the parent window.
    source: window.parent
  }));
}
var T3 = S(false);
var j3 = S("https://web.telegram.org");
var kt = (e2) => {
  g3().log("Event received:", e2);
};
var ke = x(T3);
function Kt(e2) {
  e2 !== T3() && (T3.set(e2), (e2 ? z2 : At)("*", kt));
}
var Se = x(j3);
function Yt(e2) {
  j3.set(e2), g3().log("New target origin set", e2);
}
var x3 = S((...e2) => {
  window.parent.postMessage(...e2);
});
var g3 = S(hr("Bridge", {
  bgColor: "#9147ff",
  textColor: "white",
  shouldLog: ke
}));
function W3(e2, t, r2) {
  const n = [r2], a = e2[t];
  typeof a == "function" && n.push(a);
  const o2 = (...i) => {
    n.forEach((c3) => c3(...i));
  }, s = Object.assign((...i) => {
    o2(...i);
  }, {
    // Unwraps the composer.
    unwrap() {
      const { length: i } = n;
      if (i === 1) {
        delete e2[t];
        return;
      }
      if (i === 2) {
        H4(e2, t, n[1]);
        return;
      }
      n.unshift(1), H4(e2, t, o2);
    }
  });
  Ae(
    e2,
    t,
    () => s,
    (i) => n.push(i)
  );
}
function Q3(e2, t) {
  const r2 = e2[t];
  Ae(e2, t, () => r2, (n) => {
    Object.entries(n).forEach(([a, o2]) => {
      r2[a] = o2;
    });
  });
}
function Ae(e2, t, r2, n) {
  Object.defineProperty(e2, t, {
    enumerable: true,
    configurable: true,
    get: r2,
    set: n
  });
}
function H4(e2, t, r2) {
  Object.defineProperty(e2, t, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r2
  });
}
var St = {
  clipboard_text_received: looseObject({
    req_id: string(),
    data: nullish(string())
  }),
  custom_method_invoked: looseObject({
    req_id: string(),
    result: optional(unknown()),
    error: optional(string())
  }),
  popup_closed: nullish(
    looseObject({ button_id: nullish(string(), () => {
    }) }),
    {}
  ),
  viewport_changed: nullish(
    looseObject({
      height: number(),
      width: nullish(number(), () => window.innerWidth),
      is_state_stable: boolean(),
      is_expanded: boolean()
    }),
    // TODO: At the moment, macOS has a bug with the invalid event payload - it is always equal to
    //  null. Leaving this default value until the bug is fixed.
    () => ({
      height: window.innerHeight,
      is_state_stable: true,
      is_expanded: true
    })
  ),
  theme_changed: looseObject({
    theme_params: B2()
  })
};
function K4(e2) {
  if (e2.source !== window.parent)
    return;
  let t;
  try {
    t = parse(h2(ht()), e2.data);
  } catch {
    return;
  }
  const { eventType: r2, eventData: n } = t, a = St[r2];
  let o2;
  try {
    o2 = a ? parse(a, n) : n;
  } catch (s) {
    return g3().forceError(
      [
        `An error occurred processing the "${r2}" event from the Telegram application.`,
        "Please, file an issue here:",
        "https://github.com/Telegram-Mini-Apps/tma.js/issues/new/choose"
      ].join(`
`),
      t,
      s
    );
  }
  Tt(r2, o2);
}
var {
  on: z2,
  off: At,
  emit: Tt,
  clear: $t
} = xt(
  () => {
    const e2 = window;
    !e2.TelegramGameProxy && (e2.TelegramGameProxy = {}), W3(e2.TelegramGameProxy, "receiveEvent", F3), Q3(e2, "TelegramGameProxy"), !e2.Telegram && (e2.Telegram = {}), !e2.Telegram.WebView && (e2.Telegram.WebView = {}), W3(e2.Telegram.WebView, "receiveEvent", F3), Q3(e2.Telegram, "WebView"), W3(e2, "TelegramGameProxy_receiveEvent", F3), window.addEventListener("message", K4);
  },
  () => {
    [
      ["TelegramGameProxy_receiveEvent"],
      ["TelegramGameProxy", "receiveEvent"],
      ["Telegram", "WebView", "receiveEvent"]
    ].forEach((e2) => {
      const t = window;
      let r2 = [void 0, t];
      for (const o2 of e2)
        if (r2 = [r2[1], r2[1][o2]], !r2[1])
          return;
      const [n, a] = r2;
      "unwrap" in a && (a.unwrap(), n && n !== t && !Object.keys(n).length && delete t[e2[0]]);
    }), window.removeEventListener("message", K4);
  }
);
var Mt = (...e2) => x3()(...e2);
function Ct(e2, t) {
  l2(
    A2(
      // @ts-expect-error It's ok, TS can't determine a specific override.
      e2,
      t
    ),
    He((r2) => {
      throw r2;
    })
  );
}
function A2(e2, t) {
  g3().log("Posting event:", t ? { eventType: e2, eventData: t } : { eventType: e2 });
  const r2 = window, n = JSON.stringify({ eventType: e2, eventData: t });
  return _e() ? (Mt(n, Se()), _2(void 0)) : pe(r2) ? (r2.TelegramWebviewProxy.postEvent(e2, JSON.stringify(t)), _2(void 0)) : is(looseObject({ external: looseObject({ notify: function_() }) }), r2) ? (r2.external.notify(n), _2(void 0)) : w3(new xe());
}
function G4(e2, t, r2 = {}) {
  const {
    // If no capture function was passed, we capture the first compatible event.
    capture: n = () => true,
    postEvent: a = A2
  } = r2, o2 = S(), [s, i] = lr();
  (Array.isArray(t) ? t : [t]).forEach((u2) => {
    s(
      z2(u2, (p2) => {
        const f3 = Array.isArray(t);
        n(f3 ? { event: u2, payload: p2 } : p2) && o2.set([
          f3 ? { event: u2, payload: p2 } : p2
        ]);
      })
    );
  });
  const c3 = (u2) => (i(), u2);
  return l2(
    async () => a(e2, r2.params),
    Pe(() => ur((u2, p2, f3) => {
      const h4 = o2();
      if (h4)
        return u2(h4[0]);
      const b4 = (y4) => {
        y4 && u2(y4[0]);
      }, q5 = () => {
        o2.unsub(b4);
      };
      o2.sub(b4), f3.on("finalized", q5);
    }, r2)),
    ye(c3, c3)
  );
}
function er2(e2, t) {
  const r2 = Lt(
    // @ts-expect-error TS doesn't get what override we are going to use.
    e2,
    t
  );
  return typeof r2 == "function" ? g.fn(() => er(r2)) : r2;
}
function Lt(e2, t) {
  const r2 = pe(window);
  if (!e2)
    return r2 || l2(L3(), I3(() => false, () => true));
  if (r2)
    return ve(true);
  const { timeout: n = 100 } = t || {};
  return l2(
    G4("web_app_request_theme", "theme_changed", { ...t, timeout: n }),
    be(
      (a) => K.is(a) || xe.is(a) ? _2(false) : w3(a),
      () => _2(true)
    )
  );
}
function tr2({ launchParams: e2, onEvent: t, resetPostMessage: r2 } = {}) {
  if (e2) {
    const o2 = typeof e2 == "string" || e2 instanceof URLSearchParams ? e2.toString() : (
      // Here we have to trick serializeLaunchParamsQuery into thinking, it serializes a valid
      // value. We are doing it because we are working with tgWebAppData presented as a
      // string, not an object as serializeLaunchParamsQuery requires.
      gt({ ...e2, tgWebAppData: void 0 }) + (e2.tgWebAppData ? `&tgWebAppData=${encodeURIComponent(e2.tgWebAppData.toString())}` : "")
    );
    try {
      mt(o2);
    } catch (s) {
      throw new bt(o2, s);
    }
    sr("launchParams", o2);
  }
  if (_e()) {
    if (!t)
      return;
    r2 && x3.reset();
    const o2 = x3();
    x3.set((...s) => {
      const [i] = s, c3 = () => {
        o2(...s);
      };
      try {
        const u2 = parse(h2(ht()), i);
        t({ name: u2.eventType, params: u2.eventData }, c3);
      } catch {
        c3();
      }
    });
    return;
  }
  const n = window.TelegramWebviewProxy || {}, a = n.postEvent || (() => {
  });
  window.TelegramWebviewProxy = {
    ...n,
    postEvent(o2, s) {
      const i = () => {
        a(o2, s);
      };
      t ? t({
        name: o2,
        params: s ? JSON.parse(s) : void 0
      }, i) : i();
    }
  }, g3().log("Environment was mocked by the mockTelegramEnv function");
}
function qt(e2) {
  return ({ req_id: t }) => t === e2;
}
var Y3 = {
  "6.0": [
    "iframe_ready",
    "iframe_will_reload",
    "web_app_close",
    "web_app_data_send",
    "web_app_expand",
    "web_app_open_link",
    "web_app_ready",
    "web_app_request_theme",
    "web_app_request_viewport",
    "web_app_setup_main_button",
    "web_app_setup_closing_behavior"
  ],
  6.1: [
    "web_app_open_tg_link",
    "web_app_open_invoice",
    "web_app_setup_back_button",
    "web_app_set_background_color",
    "web_app_set_header_color",
    "web_app_trigger_haptic_feedback"
  ],
  6.2: ["web_app_open_popup"],
  6.4: [
    "web_app_close_scan_qr_popup",
    "web_app_open_scan_qr_popup",
    "web_app_read_text_from_clipboard",
    { method: "web_app_open_link", param: "try_instant_view" }
  ],
  6.7: ["web_app_switch_inline_query"],
  6.9: [
    "web_app_invoke_custom_method",
    "web_app_request_write_access",
    "web_app_request_phone",
    { method: "web_app_set_header_color", param: "color" }
  ],
  "6.10": ["web_app_setup_settings_button"],
  7.2: [
    "web_app_biometry_get_info",
    "web_app_biometry_open_settings",
    "web_app_biometry_request_access",
    "web_app_biometry_request_auth",
    "web_app_biometry_update_token"
  ],
  7.6: [
    { method: "web_app_open_link", param: "try_browser" },
    { method: "web_app_close", param: "return_back" }
  ],
  7.7: ["web_app_setup_swipe_behavior"],
  7.8: ["web_app_share_to_story"],
  "7.10": [
    "web_app_setup_secondary_button",
    "web_app_set_bottom_bar_color",
    { method: "web_app_setup_main_button", param: "has_shine_effect" }
  ],
  "8.0": [
    "web_app_request_safe_area",
    "web_app_request_content_safe_area",
    "web_app_request_fullscreen",
    "web_app_exit_fullscreen",
    "web_app_set_emoji_status",
    "web_app_add_to_home_screen",
    "web_app_check_home_screen",
    "web_app_request_emoji_status_access",
    "web_app_check_location",
    "web_app_open_location_settings",
    "web_app_request_file_download",
    "web_app_request_location",
    "web_app_send_prepared_message",
    "web_app_start_accelerometer",
    "web_app_start_device_orientation",
    "web_app_start_gyroscope",
    "web_app_stop_accelerometer",
    "web_app_stop_device_orientation",
    "web_app_stop_gyroscope",
    "web_app_toggle_orientation_lock"
  ],
  "9.0": [
    "web_app_device_storage_clear",
    "web_app_device_storage_get_key",
    "web_app_device_storage_save_key",
    "web_app_secure_storage_clear",
    "web_app_secure_storage_get_key",
    "web_app_secure_storage_restore_key",
    "web_app_secure_storage_save_key"
  ],
  9.1: ["web_app_hide_keyboard"]
};
function X3(e2, t) {
  return Object.keys(Y3).find((n) => Y3[n].some((a) => t ? typeof a == "object" && a.method === e2 && a.param === t : a === e2)) || null;
}
function Z3(e2) {
  return e2.split(".").map(Number);
}
function Ft(e2, t) {
  const r2 = Z3(e2), n = Z3(t), a = Math.max(r2.length, n.length);
  for (let o2 = 0; o2 < a; o2 += 1) {
    const s = r2[o2] || 0, i = n[o2] || 0;
    if (s !== i)
      return s > i ? 1 : -1;
  }
  return 0;
}
function ee(e2, t, r2) {
  const n = r2 ? X3(
    e2,
    t
  ) : X3(e2);
  return n ? Ft(n, r2 || t) <= 0 : false;
}
function rr2(e2, t = "strict") {
  const r2 = typeof t == "function" ? t : (n) => {
    const { method: a, version: o2 } = n, s = "param" in n ? new dt(a, n.param, o2) : new gt2(a, o2);
    if (t === "strict")
      throw s;
    return g3().forceWarn(s.message);
  };
  return (n, a) => ee(n, e2) ? n === "web_app_set_header_color" && is(looseObject({ color: any() }), a) && !ee(n, "color", e2) ? r2({ version: e2, method: n, param: "color" }) : Ct(n, a) : r2({ version: e2, method: n });
}
function Wt(e2, t, r2, n) {
  return l2(
    G4("web_app_invoke_custom_method", "custom_method_invoked", {
      ...n || {},
      params: { method: e2, params: t, req_id: r2 },
      capture: qt(r2)
    }),
    ht2(({ result: a, error: o2 }) => o2 ? wt(new yt(o2)) : ve(a))
  );
}
function Rt(e2, t, r2 = {}) {
  const {
    // If no capture function was passed, we capture the first compatible event.
    capture: n = () => true,
    postEvent: a = A2
  } = r2, o2 = S(), [s, i] = lr();
  (Array.isArray(t) ? t : [t]).forEach((u2) => {
    s(
      z2(u2, (p2) => {
        (Array.isArray(t) ? n({ event: u2, payload: p2 }) : n(p2)) && o2.set([p2]);
      })
    );
  });
  const c3 = (u2) => (i(), u2);
  return l2(
    async () => a(e2, r2.params),
    Pe(() => ur((u2, p2, f3) => {
      const h4 = o2();
      if (h4)
        return u2(h4[0]);
      const b4 = (y4) => {
        y4 && u2(y4[0]);
      }, q5 = () => {
        o2.unsub(b4);
      };
      o2.sub(b4), f3.on("finalized", q5);
    }, r2)),
    ye(c3, c3)
  );
}
function ar2() {
  Object.hasOwn || (Object.hasOwn = function(e2, t) {
    return Object.prototype.hasOwnProperty.call(e2, t);
  });
}
function Te(e2) {
  return O(() => decodeURIComponent(
    atob(
      e2.replace(/-/g, "+").replace(/_/g, "/")
    ).split("").map((t) => "%" + ("00" + t.charCodeAt(0).toString(16)).slice(-2)).join("")
  ), (t) => t);
}
var sr2 = gr(Te);
function $e(e2) {
  return btoa(
    encodeURIComponent(e2).replace(/%([0-9A-F]{2})/g, (t, r2) => String.fromCharCode(parseInt(`0x${r2}`)))
  ).replace(/\+/g, "-").replace(/\//g, "_");
}
var Ut = function(e2) {
  return O(function() {
    return JSON.parse(e2);
  }, ze);
};
function It(e2) {
  const t = $e(typeof e2 == "string" ? e2 : JSON.stringify(e2));
  return t.length > 512 ? w3(new Error("Value is too long for start parameter")) : _2(t);
}
var ir = gr(It);
function ur2(e2, t) {
  return er(
    Ot(
      e2,
      // @ts-expect-error TypeScript is unable to detect a correct override.
      typeof t == "function" ? (r2) => O(() => t(r2), (n) => n) : t
    )
  );
}
function Ot(e2, t) {
  return l2(
    Te(e2),
    Ze((r2) => t ? typeof t == "function" ? t(r2) : Ut(r2) : _2(r2))
  );
}
function cr2(e2) {
  return $e(e2).length <= 512;
}

// node_modules/@tma.js/sdk/dist/index.js
var Rt2 = Object.defineProperty;
var Lt2 = (s, t, r2) => t in s ? Rt2(s, t, { enumerable: true, configurable: true, writable: true, value: r2 }) : s[t] = r2;
var e = (s, t, r2) => Lt2(s, typeof t != "symbol" ? t + "" : t, r2);
var ss = function(s, t, r2) {
  if (r2 || arguments.length === 2) for (var n = 0, i = t.length, o2; n < i; n++)
    (o2 || !(n in t)) && (o2 || (o2 = Array.prototype.slice.call(t, 0, n)), o2[n] = t[n]);
  return s.concat(o2 || Array.prototype.slice.call(t));
};
function bt2(s, t, r2, n, i, o2, u2, a, l3) {
  switch (arguments.length) {
    case 1:
      return s;
    case 2:
      return function() {
        return t(s.apply(this, arguments));
      };
    case 3:
      return function() {
        return r2(t(s.apply(this, arguments)));
      };
    case 4:
      return function() {
        return n(r2(t(s.apply(this, arguments))));
      };
    case 5:
      return function() {
        return i(n(r2(t(s.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return o2(i(n(r2(t(s.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return u2(o2(i(n(r2(t(s.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return a(u2(o2(i(n(r2(t(s.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return l3(a(u2(o2(i(n(r2(t(s.apply(this, arguments)))))))));
      };
  }
}
function c2(s, t, r2, n, i, o2, u2, a, l3) {
  switch (arguments.length) {
    case 1:
      return s;
    case 2:
      return t(s);
    case 3:
      return r2(t(s));
    case 4:
      return n(r2(t(s)));
    case 5:
      return i(n(r2(t(s))));
    case 6:
      return o2(i(n(r2(t(s)))));
    case 7:
      return u2(o2(i(n(r2(t(s))))));
    case 8:
      return a(u2(o2(i(n(r2(t(s)))))));
    case 9:
      return l3(a(u2(o2(i(n(r2(t(s))))))));
    default: {
      for (var p2 = arguments[0], m3 = 1; m3 < arguments.length; m3++)
        p2 = arguments[m3](p2);
      return p2;
    }
  }
}
var he2 = function(s, t) {
  var r2 = typeof s == "number" ? function(n) {
    return n.length >= s;
  } : s;
  return function() {
    var n = Array.from(arguments);
    return r2(arguments) ? t.apply(this, n) : function(i) {
      return t.apply(void 0, ss([i], n, false));
    };
  };
};
var rs = { _tag: "None" };
var ns = function(s) {
  return { _tag: "Some", value: s };
};
var os = function(s) {
  return s._tag === "Left";
};
var gt3 = function(s) {
  return { _tag: "Left", left: s };
};
var Ft2 = function(s) {
  return { _tag: "Right", right: s };
};
var Pe2 = {};
function is2(s, t) {
  return function(r2) {
    return function(n) {
      return s.ap(s.map(n, function(i) {
        return function(o2) {
          return t.ap(i, o2);
        };
      }), r2);
    };
  };
}
function as(s, t) {
  return function(r2) {
    return function(n) {
      return s.map(n, function(i) {
        return t.map(i, r2);
      });
    };
  };
}
function Oe(s) {
  return function(t, r2) {
    return function(n) {
      return s.chain(n, function(i) {
        return s.map(r2(i), function(o2) {
          var u2;
          return Object.assign({}, i, (u2 = {}, u2[t] = o2, u2));
        });
      });
    };
  };
}
var T4 = gt3;
var x4 = Ft2;
var us = he2(2, function(s, t) {
  return re(s) ? s : t(s.right);
});
var De2 = function(s, t) {
  return c2(s, D3(t));
};
var wt2 = function(s, t) {
  return c2(s, hs(t));
};
var Ue = "Either";
var D3 = function(s) {
  return function(t) {
    return re(t) ? t : x4(s(t.right));
  };
};
var cs = {
  URI: Ue,
  map: De2
};
var ps = x4;
var ls = function(s) {
  return function(t) {
    return re(t) ? t : re(s) ? s : x4(t.right(s.right));
  };
};
var hs = ls;
var ds = {
  URI: Ue,
  map: De2,
  ap: wt2
};
var fs = {
  URI: Ue,
  map: De2,
  ap: wt2,
  chain: us
};
var _s = function(s, t) {
  return function(r2) {
    return re(r2) ? T4(s(r2.left)) : x4(t(r2.right));
  };
};
var re = os;
var Ct2 = function(s, t) {
  return function(r2) {
    return re(r2) ? s(r2.left) : t(r2.right);
  };
};
var de2 = Ct2;
var ms = function(s, t) {
  try {
    return x4(s());
  } catch (r2) {
    return T4(t(r2));
  }
};
var bs = ps(Pe2);
var gs = Oe(fs);
var ut3 = gs;
function U2(s) {
  return typeof s == "function" ? s() : s;
}
var fe2 = class {
  constructor({
    onMounted: t,
    restoreState: r2,
    initialState: n,
    onUnmounted: i,
    isPageReload: o2
  }) {
    e(this, "_isMounted", S(false));
    e(this, "isMounted", x(this._isMounted));
    e(this, "mount");
    e(this, "unmount");
    this.mount = () => {
      if (this.isMounted())
        return x4(void 0);
      const u2 = U2(o2) ? r2() : void 0, a = u2 ? x4(u2) : typeof n == "function" ? n() : x4(n);
      return c2(a, D3((l3) => {
        m(() => {
          this._isMounted.set(true), t == null || t(l3);
        });
      }));
    }, this.unmount = () => {
      this._isMounted() && m(() => {
        this._isMounted.set(false), i == null || i();
      });
    };
  }
};
function Me(s) {
  const t = {};
  for (const r2 in s) {
    const n = s[r2];
    n !== void 0 && (t[r2] = n);
  }
  return t;
}
function Ee2(s, t) {
  const r2 = Object.keys(s), n = Object.keys(t);
  return r2.length !== n.length ? false : r2.every((i) => Object.prototype.hasOwnProperty.call(t, i) && s[i] === t[i]);
}
var ee2 = class {
  constructor({ initialState: t, onChange: r2 }) {
    e(this, "_state");
    e(this, "state");
    e(this, "setState", (t2) => {
      const r3 = { ...this.state(), ...Me(t2) };
      Ee2(r3, this.state()) || this._state.set(r3);
    });
    this._state = S(t, { equals: Ee2 }), this.state = x(this._state), this.state.sub(r2);
  }
  /**
   * Creates a computed signal based on the state.
   * @param key - a state key to use as a source.
   */
  getter(t) {
    return x(() => this._state()[t]);
  }
  /**
   * @returns True if specified payload will update the state.
   * @param state
   */
  hasDiff(t) {
    return !Ee2({ ...this.state(), ...Me(t) }, this.state());
  }
};
function z3(s, t) {
  return x(() => ee(s, U2(t)));
}
var ie = rs;
var _e2 = ns;
var Fs = function(s, t) {
  return c2(s, Ss(t));
};
var ws = function(s, t) {
  return c2(s, ys(t));
};
var Cs = "Option";
var Ss = function(s) {
  return function(t) {
    return pe2(t) ? ie : _e2(s(t.value));
  };
};
var vs = _e2;
var ys = function(s) {
  return function(t) {
    return pe2(t) || pe2(s) ? ie : _e2(t.value(s.value));
  };
};
var ks = he2(2, function(s, t) {
  return pe2(s) ? ie : t(s.value);
});
var Is = {
  URI: Cs,
  map: Fs,
  ap: ws,
  chain: ks
};
var pe2 = function(s) {
  return s._tag === "None";
};
var Es = function(s, t) {
  return function(r2) {
    return pe2(r2) ? s() : t(r2.value);
  };
};
var St2 = Es;
var As = vs(Pe2);
var ct3 = Oe(Is);
function h3(s) {
  return Object.assign(gr(s), {
    ifAvailable(...t) {
      return c2(
        s.ifAvailable(...t),
        St2(
          () => ({ ok: false }),
          (r2) => ({
            ok: true,
            data: er(r2)
          })
        )
      );
    }
  });
}
function xs(s) {
  return bt2(x4, s.of);
}
function qs(s) {
  return bt2(T4, s.of);
}
function Bs(s) {
  return as(s, cs);
}
function Ms(s) {
  return is2(s, ds);
}
function Ts(s) {
  return function(t, r2) {
    return s.chain(t, function(n) {
      return re(n) ? s.of(n) : r2(n.right);
    });
  };
}
function Vs(s) {
  return function(t, r2, n) {
    return s.map(t, _s(r2, n));
  };
}
function $s(s) {
  return function(t, r2) {
    return function(n) {
      return s.map(n, de2(t, r2));
    };
  };
}
var Ge2 = function(s, t) {
  return c2(s, Rs(t));
};
var vt2 = function(s, t) {
  return c2(s, Ls(t));
};
var Rs = function(s) {
  return function(t) {
    return function() {
      return Promise.resolve().then(t).then(s);
    };
  };
};
var Ls = function(s) {
  return function(t) {
    return function() {
      return Promise.all([Promise.resolve().then(t), Promise.resolve().then(s)]).then(function(r2) {
        var n = r2[0], i = r2[1];
        return n(i);
      });
    };
  };
};
var je2 = function(s) {
  return function() {
    return Promise.resolve(s);
  };
};
var Ps = he2(2, function(s, t) {
  return function() {
    return Promise.resolve().then(s).then(function(r2) {
      return t(r2)();
    });
  };
});
var He2 = "Task";
var We = {
  URI: He2,
  map: Ge2
};
var yt2 = {
  of: je2
};
var Os = {
  URI: He2,
  map: Ge2,
  ap: vt2
};
var Ds = {
  URI: He2,
  map: Ge2,
  of: je2,
  ap: vt2,
  chain: Ps
};
var Us = function(s, t, r2, n) {
  function i(o2) {
    return o2 instanceof r2 ? o2 : new r2(function(u2) {
      u2(o2);
    });
  }
  return new (r2 || (r2 = Promise))(function(o2, u2) {
    function a(m3) {
      try {
        p2(n.next(m3));
      } catch (d3) {
        u2(d3);
      }
    }
    function l3(m3) {
      try {
        p2(n.throw(m3));
      } catch (d3) {
        u2(d3);
      }
    }
    function p2(m3) {
      m3.done ? o2(m3.value) : i(m3.value).then(a, l3);
    }
    p2((n = n.apply(s, t || [])).next());
  });
};
var Gs = function(s, t) {
  var r2 = { label: 0, sent: function() {
    if (o2[0] & 1) throw o2[1];
    return o2[1];
  }, trys: [], ops: [] }, n, i, o2, u2;
  return u2 = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (u2[Symbol.iterator] = function() {
    return this;
  }), u2;
  function a(p2) {
    return function(m3) {
      return l3([p2, m3]);
    };
  }
  function l3(p2) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; u2 && (u2 = 0, p2[0] && (r2 = 0)), r2; ) try {
      if (n = 1, i && (o2 = p2[0] & 2 ? i.return : p2[0] ? i.throw || ((o2 = i.return) && o2.call(i), 0) : i.next) && !(o2 = o2.call(i, p2[1])).done) return o2;
      switch (i = 0, o2 && (p2 = [p2[0] & 2, o2.value]), p2[0]) {
        case 0:
        case 1:
          o2 = p2;
          break;
        case 4:
          return r2.label++, { value: p2[1], done: false };
        case 5:
          r2.label++, i = p2[1], p2 = [0];
          continue;
        case 7:
          p2 = r2.ops.pop(), r2.trys.pop();
          continue;
        default:
          if (o2 = r2.trys, !(o2 = o2.length > 0 && o2[o2.length - 1]) && (p2[0] === 6 || p2[0] === 2)) {
            r2 = 0;
            continue;
          }
          if (p2[0] === 3 && (!o2 || p2[1] > o2[0] && p2[1] < o2[3])) {
            r2.label = p2[1];
            break;
          }
          if (p2[0] === 6 && r2.label < o2[1]) {
            r2.label = o2[1], o2 = p2;
            break;
          }
          if (o2 && r2.label < o2[2]) {
            r2.label = o2[2], r2.ops.push(p2);
            break;
          }
          o2[2] && r2.ops.pop(), r2.trys.pop();
          continue;
      }
      p2 = t.call(s, r2);
    } catch (m3) {
      p2 = [6, m3], i = 0;
    } finally {
      n = o2 = 0;
    }
    if (p2[0] & 5) throw p2[1];
    return { value: p2[0] ? p2[1] : void 0, done: true };
  }
};
var V3 = qs(yt2);
var q4 = xs(yt2);
var kt2 = je2;
var js = $s(We);
var Hs = function(s, t) {
  return function() {
    return Us(void 0, void 0, void 0, function() {
      var r2;
      return Gs(this, function(n) {
        switch (n.label) {
          case 0:
            return n.trys.push([0, 2, , 3]), [4, s().then(Ft2)];
          case 1:
            return [2, n.sent()];
          case 2:
            return r2 = n.sent(), [2, gt3(t(r2))];
          case 3:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  };
};
var Ws = function(s, t) {
  return c2(s, k3(t));
};
var Ks = function(s, t) {
  return c2(s, Ns(t));
};
var k3 = Bs(We);
var Ke2 = he2(3, Vs(We));
var Ns = Ms(Os);
var Ne2 = he2(2, Ts(Ds));
var Qs = q4;
var zs = "TaskEither";
var Js = {
  URI: zs,
  map: Ws,
  ap: Ks,
  chain: Ne2
};
var Ys = Qs(Pe2);
var Zs = Oe(Js);
var Fe = Zs;
var K5 = Ne2;
var ae = Ne2;
function ne(s) {
  return [s];
}
var we2 = class extends y2(
  "ValidationError",
  (t, r2) => ({ input: t, issues: r2 }),
  "Validation error"
) {
};
var Qe2 = class extends u(
  "CSSVarsBoundError",
  "CSS variables are already bound"
) {
};
var Xs = class extends y2("DeviceStorageMethodError", (t) => ({ error: t }), (t) => [t]) {
};
var er3 = class extends y2("SecureStorageMethodError", (t) => ({ error: t }), (t) => [t]) {
};
var tr3 = class extends u(
  "NotAvailableError",
  ne
) {
};
var qn = class extends u(
  "InvalidEnvError",
  ne
) {
};
var sr3 = class extends u(
  "FunctionNotAvailableError",
  ne
) {
};
var Q4 = class extends u(
  "InvalidArgumentsError",
  (t, r2) => [t, { cause: r2 }]
) {
};
var ze2 = class extends u(
  "ConcurrentCallError",
  ne
) {
};
var rr3 = class extends u(
  "SetEmojiStatusError",
  (t) => [`Failed to set emoji status: ${t}`]
) {
};
var It2 = class extends u(
  "AccessDeniedError",
  ne
) {
};
var nr2 = class extends u(
  "FullscreenFailedError",
  ne
) {
};
var or = class extends u(
  "ShareMessageError",
  ne
) {
};
var ir2 = class extends u(
  "UnknownThemeParamsKeyError",
  (t) => [`Unknown theme params key passed: ${t}`]
) {
};
function A3(s, t) {
  const r2 = x(() => U2(t.version) || "100"), n = x(() => U2(t.isTma)), { requires: i, returns: o2 } = t, u2 = i ? typeof i == "object" ? i : { every: [i] } : void 0, a = (_3) => {
    if (!t.supports)
      return true;
    const b4 = t.supports[_3];
    return ee(b4.method, b4.param, r2());
  }, l3 = () => {
    if (!u2)
      return;
    const [_3, b4] = "every" in u2 ? ["every", u2.every] : ["some", u2.some];
    for (let f3 = 0; f3 < b4.length; f3++) {
      const B3 = b4[f3], L4 = typeof B3 == "function" ? B3() : ee(B3, r2()) ? void 0 : `it is unsupported in Mini Apps version ${r2()}`;
      if (L4 && (_3 === "every" || f3 === b4.length - 1))
        return L4;
    }
  }, p2 = (..._3) => {
    for (const b4 in t.supports)
      if (t.supports[b4].shouldCheck(..._3) && !a(b4))
        return `option ${b4} is not supported in Mini Apps version ${r2()}`;
  }, m3 = x(() => !l3()), d3 = x(() => r2() !== "0.0"), w4 = x(() => t.isMounted ? t.isMounted() : true), g4 = x(
    () => n() && d3() && m3() && w4()
  ), S5 = (_3) => {
    const b4 = new sr3(_3);
    return ["task", "promise"].includes(t.returns) ? V3(b4) : T4(b4);
  }, v4 = (..._3) => o2 === "plain" ? ms(() => s(..._3), (b4) => b4) : o2 === "promise" ? Hs(() => s(..._3), (b4) => b4) : s(..._3);
  return Object.assign(
    (..._3) => {
      var L4;
      const b4 = "Unable to call function:";
      if (!n())
        return S5(`${b4} it can't be called outside Mini Apps`);
      if (!d3())
        return S5(`${b4} the SDK was not initialized. Use the SDK init() function`);
      const f3 = l3();
      if (f3)
        return S5(`${b4} ${f3}`);
      const B3 = p2(..._3);
      if (B3)
        return S5(`${b4} ${B3}`);
      if (!w4()) {
        const $4 = (L4 = t.isMounting) != null && L4.call(t) ? "mounting. Wait for the mount completion" : "unmounted. Use the mount() method";
        return S5(`${b4} the component is ${$4}`);
      }
      return v4(..._3);
    },
    s,
    {
      isAvailable: g4,
      ifAvailable(..._3) {
        return g4() ? _e2(v4(..._3)) : ie;
      }
    },
    u2 ? { isSupported: m3 } : {},
    t.supports ? { supports: a } : {}
  );
}
function I4(s) {
  return (t) => A3(t, s);
}
var ke2 = class {
  constructor({
    isTma: t,
    storage: r2,
    onClick: n,
    offClick: i,
    initialState: o2,
    isPageReload: u2,
    postEvent: a,
    payload: l3,
    method: p2,
    version: m3
  }) {
    e(this, "isMounted");
    e(this, "isSupported");
    e(this, "state");
    e(this, "stateSetters");
    e(this, "stateBoolSetters");
    e(this, "setStateFp");
    e(this, "setState");
    e(this, "onClickFp");
    e(this, "onClick");
    e(this, "offClickFp");
    e(this, "offClick");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const d3 = new ee2({
      initialState: o2,
      onChange(_3) {
        r2.set(_3);
      }
    }), w4 = new fe2({
      initialState: o2,
      isPageReload: u2,
      onMounted: d3.setState,
      restoreState: r2.get
    }), g4 = { version: m3, requires: p2, isTma: t }, S5 = I4({
      ...g4,
      returns: "plain"
    }), v4 = I4({
      ...g4,
      returns: "either",
      isMounted: w4.isMounted
    });
    this.isMounted = w4.isMounted, this.isSupported = z3(p2, m3), this.state = d3.state, this.setStateFp = v4((_3) => {
      const b4 = { ...this.state(), ...Me(_3) };
      return d3.hasDiff(b4) ? c2(
        a(p2, l3(b4)),
        D3(() => {
          d3.setState(b4);
        })
      ) : x4(void 0);
    }), this.setState = h3(this.setStateFp), this.onClickFp = S5(n), this.onClick = h3(this.onClickFp), this.offClickFp = S5(i), this.offClick = h3(this.offClickFp), this.mountFp = S5(() => {
      const _3 = () => {
      };
      return c2(w4.mount(), de2(_3, _3));
    }), this.mount = h3(this.mountFp), this.unmount = w4.unmount, this.stateSetters = (_3) => {
      const b4 = v4((f3) => this.setStateFp({ [_3]: f3 }));
      return [h3(b4), b4];
    }, this.stateBoolSetters = (_3) => {
      const [, b4] = this.stateSetters(_3), f3 = v4(() => b4(false)), B3 = v4(() => b4(true));
      return [
        [h3(f3), f3],
        [h3(B3), B3]
      ];
    };
  }
  /**
   * @returns A computed based on the specified state and its related key.
   * @param key - a key to use.
   */
  stateGetter(t) {
    return x(() => this.state()[t]);
  }
};
var ar3 = class {
  constructor(t) {
    e(this, "isVisible");
    e(this, "isMounted");
    e(this, "isSupported");
    e(this, "hideFp");
    e(this, "hide");
    e(this, "showFp");
    e(this, "show");
    e(this, "onClickFp");
    e(this, "onClick");
    e(this, "offClickFp");
    e(this, "offClick");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const r2 = new ke2({
      ...t,
      method: "web_app_setup_back_button",
      payload: (n) => ({ is_visible: n.isVisible }),
      initialState: { isVisible: false }
    });
    this.isVisible = r2.stateGetter("isVisible"), this.isMounted = r2.isMounted, this.isSupported = r2.isSupported, [[this.hide, this.hideFp], [this.show, this.showFp]] = r2.stateBoolSetters("isVisible"), this.onClick = r2.onClick, this.onClickFp = r2.onClickFp, this.offClick = r2.offClick, this.offClickFp = r2.offClickFp, this.mount = r2.mount, this.mountFp = r2.mountFp, this.unmount = r2.unmount;
  }
};
function C5() {
  return { isTma: x(() => Lt()) };
}
function ue(s) {
  return (t) => ({ ...t, ...U2(s) });
}
function me2(s, t) {
  return S(s, t);
}
var Et2 = me2(A2);
var ce = (...s) => Et2()(...s);
var ur3 = (...s) => er(ce(...s));
var R2 = ue({
  postEvent: ce
});
function cr3(s) {
  return {
    get: () => fr(s),
    set(t) {
      sr(s, t);
    }
  };
}
function pr() {
  return performance.getEntriesByType("navigation")[0];
}
function lr2() {
  const s = pr();
  return !!s && s.type === "reload";
}
function te(s) {
  return ue({
    storage: cr3(s),
    isPageReload: lr2
  });
}
var Te2 = me2("0.0");
var y3 = ue({ version: Te2 });
function Je2(s, t) {
  return {
    ...c2(
      C5(),
      R2,
      y3,
      te(s)
    ),
    onClick(r2, n) {
      return z2(t, r2, n);
    },
    offClick(r2, n) {
      At(t, r2, n);
    }
  };
}
var Bn = new ar3(Je2("backButton", "back_button_pressed"));
var Ye2 = class {
  constructor({
    initialState: t,
    onMounted: r2,
    restoreState: n,
    onUnmounted: i,
    isPageReload: o2
  }) {
    e(this, "_isMounted", S(false));
    e(this, "isMounted", x(this._isMounted));
    e(this, "mount");
    e(this, "unmount");
    this.mount = (u2) => {
      if (this._isMounted())
        return q4(void 0);
      const a = U2(o2) ? n() : void 0;
      return c2(
        a ? q4(a) : t(u2),
        k3((l3) => {
          this._isMounted() || m(() => {
            this._isMounted.set(true), r2 == null || r2(l3);
          });
        })
      );
    }, this.unmount = () => {
      this._isMounted() && m(() => {
        this._isMounted.set(false), i == null || i();
      });
    };
  }
};
var pt2 = new tr3("Biometry is not available");
function Ae2(s) {
  let t = false, r2 = false, n = "", i = false, o2 = "", u2 = false;
  return s.available && (t = true, r2 = s.token_saved, n = s.device_id, i = s.access_requested, o2 = s.type, u2 = s.access_granted), { available: t, tokenSaved: r2, deviceId: n, type: o2, accessGranted: u2, accessRequested: i };
}
var hr2 = class {
  constructor({
    version: t,
    request: r2,
    postEvent: n,
    storage: i,
    onInfoReceived: o2,
    offInfoReceived: u2,
    isTma: a,
    isPageReload: l3
  }) {
    e(this, "isAvailable");
    e(this, "isSupported");
    e(this, "isMounted");
    e(this, "state");
    e(this, "authenticateFp");
    e(this, "authenticate");
    e(this, "openSettingsFp");
    e(this, "openSettings");
    e(this, "requestAccessFp");
    e(this, "requestAccess");
    e(this, "updateTokenFp");
    e(this, "updateToken");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const p2 = (_3) => {
      m3.setState(Ae2(_3));
    }, m3 = new ee2({
      initialState: {
        available: false,
        type: "unknown",
        accessGranted: false,
        accessRequested: false,
        deviceId: "",
        tokenSaved: false
      },
      onChange: i.set
    }), d3 = new Ye2({
      initialState(_3) {
        return c2(
          r2("web_app_biometry_get_info", "biometry_info_received", _3),
          k3(Ae2)
        );
      },
      isPageReload: l3,
      onMounted(_3) {
        m3.setState(_3), o2(p2);
      },
      onUnmounted() {
        u2(p2);
      },
      restoreState: i.get
    }), w4 = { version: t, requires: "web_app_biometry_request_auth", isTma: a }, g4 = I4({
      ...w4,
      returns: "either"
    }), S5 = I4({
      ...w4,
      returns: "task"
    }), v4 = I4({
      ...w4,
      isMounted: d3.isMounted,
      returns: "task"
    });
    this.isAvailable = m3.getter("available"), this.isMounted = d3.isMounted, this.isSupported = z3("web_app_biometry_request_auth", t), this.state = m3.state, this.unmount = d3.unmount, this.mountFp = S5(d3.mount), this.authenticateFp = v4((_3) => this.isAvailable() ? c2(
      r2("web_app_biometry_request_auth", "biometry_auth_requested", {
        ..._3,
        params: { reason: ((_3 || {}).reason || "").trim() }
      }),
      k3((b4) => (m3.setState({ token: b4.token }), b4))
    ) : V3(pt2)), this.openSettingsFp = g4(() => n("web_app_biometry_open_settings")), this.requestAccessFp = v4((_3) => c2(
      r2("web_app_biometry_request_access", "biometry_info_received", {
        ..._3,
        params: { reason: ((_3 || {}).reason || "").trim() }
      }),
      K5((b4) => {
        const f3 = Ae2(b4);
        return f3.available ? (m3.setState(f3), q4(f3.accessRequested)) : V3(pt2);
      })
    )), this.updateTokenFp = v4((_3 = {}) => {
      var b4;
      return c2(
        r2("web_app_biometry_update_token", "biometry_token_updated", {
          ..._3,
          params: { token: _3.token || "", reason: (b4 = _3.reason) == null ? void 0 : b4.trim() }
        }),
        k3((f3) => f3.status)
      );
    }), this.authenticate = h3(this.authenticateFp), this.openSettings = h3(this.openSettingsFp), this.requestAccess = h3(this.requestAccessFp), this.updateToken = h3(this.updateTokenFp), this.mount = h3(this.mountFp);
  }
};
var dr = (s, t, r2) => Rt(s, t, {
  postEvent: ce,
  ...r2
});
var fr2 = (s, t, r2) => G4(s, t, {
  postEvent: ce,
  ...r2
});
var Mn = (...s) => g.fn(() => dr(...s)());
var P3 = ue({ request: fr2 });
var Tn = new hr2({
  ...c2(
    C5(),
    R2,
    y3,
    P3,
    te("biometry")
  ),
  offInfoReceived(s) {
    At("biometry_info_received", s);
  },
  onInfoReceived(s) {
    return z2("biometry_info_received", s);
  }
});
var _r = class {
  constructor({ postEvent: t, storage: r2, isTma: n, isPageReload: i }) {
    e(this, "isConfirmationEnabled");
    e(this, "isMounted");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    e(this, "disableConfirmationFp");
    e(this, "disableConfirmation");
    e(this, "enableConfirmationFp");
    e(this, "enableConfirmation");
    const o2 = new ee2({
      initialState: { isConfirmationEnabled: false },
      onChange(d3) {
        r2.set(d3);
      }
    }), u2 = new fe2({
      onMounted: o2.setState,
      restoreState: r2.get,
      initialState: { isConfirmationEnabled: false },
      isPageReload: i
    }), a = { requires: "web_app_setup_closing_behavior", isTma: n }, l3 = I4({
      ...a,
      returns: "plain"
    }), p2 = I4({
      ...a,
      returns: "either",
      isMounted: u2.isMounted
    }), m3 = (d3) => d3 === this.isConfirmationEnabled() ? x4(void 0) : (o2.setState({ isConfirmationEnabled: d3 }), t("web_app_setup_closing_behavior", {
      need_confirmation: d3
    }));
    this.isConfirmationEnabled = o2.getter("isConfirmationEnabled"), this.isMounted = u2.isMounted, this.disableConfirmationFp = p2(() => m3(false)), this.enableConfirmationFp = p2(() => m3(true)), this.mountFp = l3(() => {
      const d3 = () => {
      };
      return c2(u2.mount(), de2(d3, d3));
    }), this.unmount = u2.unmount, this.disableConfirmation = h3(this.disableConfirmationFp), this.enableConfirmation = h3(this.enableConfirmationFp), this.mount = h3(this.mountFp);
  }
};
var Vn = new _r(c2(
  C5(),
  te("closingBehavior"),
  R2
));
var mr = class {
  constructor({ version: t, isTma: r2, invokeCustomMethod: n }) {
    e(this, "isSupported");
    e(this, "deleteItemFp");
    e(this, "deleteItem");
    e(this, "getItemFp");
    e(this, "getItem");
    e(this, "getItemsFp");
    e(this, "getItems");
    e(this, "getKeysFp");
    e(this, "getKeys");
    e(this, "setItemFp");
    e(this, "setItem");
    e(this, "clearFp");
    e(this, "clear");
    const i = I4({
      version: t,
      requires: "web_app_invoke_custom_method",
      isTma: r2,
      returns: "task"
    });
    this.isSupported = z3("web_app_invoke_custom_method", t), this.deleteItemFp = i((o2, u2) => {
      const a = Array.isArray(o2) ? o2 : [o2];
      return c2(
        a.length ? n("deleteStorageValues", { keys: a }, u2) : q4(void 0),
        k3(() => {
        })
      );
    }), this.getItemFp = i((o2, u2) => c2(
      this.getItemsFp([o2], u2),
      k3((a) => a[o2] || "")
    )), this.getItemsFp = i((o2, u2) => c2(
      o2.length ? n("getStorageValues", { keys: o2 }, u2) : q4({}),
      k3((a) => ({
        // Fulfill the response with probably missing keys.
        ...o2.reduce((l3, p2) => (l3[p2] = "", l3), {}),
        ...parse(record(string(), string()), a)
      }))
    )), this.getKeysFp = i((o2) => c2(
      n("getStorageKeys", {}, o2),
      k3((u2) => parse(array(string()), u2))
    )), this.setItemFp = i((o2, u2, a) => c2(
      n("saveStorageValue", { key: o2, value: u2 }, a),
      k3(() => {
      })
    )), this.clearFp = i((o2) => c2(this.getKeysFp(o2), K5(this.deleteItemFp))), this.deleteItem = h3(this.deleteItemFp), this.getItem = h3(this.getItemFp), this.getItems = h3(this.getItemsFp), this.getKeys = h3(this.getKeysFp), this.setItem = h3(this.setItemFp), this.clear = h3(this.clearFp);
  }
};
var xe2 = me2(0);
function Ze2() {
  return xe2.set(xe2() + 1), xe2().toString();
}
function br(s, t, r2) {
  return Wt(s, t, Ze2(), {
    ...r2 || {},
    postEvent: ce
  });
}
var Xe2 = ue({
  invokeCustomMethod: br
});
var $n = new mr(c2(
  C5(),
  y3,
  Xe2
));
var gr2 = class {
  constructor({ isTma: t, request: r2, version: n, createRequestId: i }) {
    e(this, "getItemFp");
    e(this, "getItem");
    e(this, "setItemFp");
    e(this, "setItem");
    e(this, "deleteItemFp");
    e(this, "deleteItem");
    e(this, "clearFp");
    e(this, "clear");
    const o2 = I4({
      version: n,
      requires: "web_app_device_storage_get_key",
      isTma: t,
      returns: "task"
    }), u2 = (a, l3, p2) => {
      const m3 = i();
      return c2(
        r2(a, ["device_storage_failed", l3], {
          params: { ...p2, req_id: m3 },
          capture: (d3) => "payload" in d3 ? d3.payload.req_id === m3 : true
        }),
        K5((d3) => d3.event === "device_storage_failed" ? V3(new Xs(d3.payload.error || "UNKNOWN_ERROR")) : q4(d3.payload))
      );
    };
    this.getItemFp = o2((a) => c2(
      u2("web_app_device_storage_get_key", "device_storage_key_received", { key: a }),
      k3((l3) => l3.value)
    )), this.setItemFp = o2((a, l3) => c2(
      u2("web_app_device_storage_save_key", "device_storage_key_saved", { key: a, value: l3 }),
      k3(() => {
      })
    )), this.deleteItemFp = o2((a) => this.setItemFp(a, null)), this.clearFp = o2(() => c2(
      u2("web_app_device_storage_clear", "device_storage_cleared", {}),
      k3(() => {
      })
    )), this.getItem = h3(this.getItemFp), this.setItem = h3(this.setItemFp), this.deleteItem = h3(this.deleteItemFp), this.clear = h3(this.clearFp);
  }
};
var At2 = ue({ createRequestId: Ze2 });
var Rn = new gr2(c2(
  C5(),
  y3,
  P3,
  At2
));
function Fr({ request: s, ...t }) {
  return A3((r2) => c2(
    s("web_app_request_emoji_status_access", "emoji_status_access_requested", r2),
    k3((n) => n.status)
  ), { ...t, requires: "web_app_request_emoji_status_access", returns: "task" });
}
var wr = Fr(c2(
  C5(),
  y3,
  P3
));
var Ln = h3(wr);
function Cr({ request: s, ...t }) {
  return A3((r2, n) => c2(
    s("web_app_set_emoji_status", ["emoji_status_set", "emoji_status_failed"], {
      params: {
        custom_emoji_id: r2,
        duration: (n || {}).duration
      },
      ...n
    }),
    ae((i) => i.event === "emoji_status_failed" ? V3(new rr3(i.payload.error)) : q4(void 0))
  ), {
    ...t,
    requires: "web_app_set_emoji_status",
    returns: "task"
  });
}
var Sr = Cr(c2(
  C5(),
  P3,
  y3
));
var Pn = h3(Sr);
var vr = class {
  constructor({ postEvent: t, isTma: r2, version: n }) {
    e(this, "isSupported");
    e(this, "impactOccurredFp");
    e(this, "impactOccurred");
    e(this, "notificationOccurredFp");
    e(this, "notificationOccurred");
    e(this, "selectionChangedFp");
    e(this, "selectionChanged");
    const i = "web_app_trigger_haptic_feedback", o2 = I4({
      requires: i,
      isTma: r2,
      version: n,
      returns: "plain"
    });
    this.isSupported = z3(i, n), this.impactOccurredFp = o2((u2) => t(i, { type: "impact", impact_style: u2 })), this.notificationOccurredFp = o2((u2) => t(i, { type: "notification", notification_type: u2 })), this.selectionChangedFp = o2(() => t(i, { type: "selection_change" })), this.impactOccurred = h3(this.impactOccurredFp), this.notificationOccurred = h3(this.notificationOccurredFp), this.selectionChanged = h3(this.selectionChangedFp);
  }
};
var On = new vr(c2(
  C5(),
  R2,
  y3
));
function yr({ postEvent: s, ...t }) {
  return A3(() => s("web_app_add_to_home_screen"), { ...t, requires: "web_app_add_to_home_screen", returns: "either" });
}
var kr = yr(c2(
  C5(),
  y3,
  R2
));
var Dn = h3(kr);
function Ir({ request: s, ...t }) {
  return A3((r2) => c2(
    s("web_app_check_home_screen", "home_screen_checked", r2),
    k3((n) => n.status || "unknown")
  ), { ...t, requires: "web_app_check_home_screen", returns: "task" });
}
var Er = Ir(c2(
  C5(),
  y3,
  P3
));
var Un = h3(Er);
var Ar = class {
  constructor({ retrieveInitData: t }) {
    e(this, "_state", S());
    e(this, "_raw", S());
    e(this, "state", x(this._state));
    e(this, "authDate", this.fromState("auth_date"));
    e(this, "canSendAfter", this.fromState("can_send_after"));
    e(this, "canSendAfterDate", x(() => {
      const t2 = this.authDate(), r2 = this.canSendAfter();
      return r2 && t2 ? new Date(t2.getTime() + r2 * 1e3) : void 0;
    }));
    e(this, "chat", this.fromState("chat"));
    e(this, "chatType", this.fromState("chat_type"));
    e(this, "chatInstance", this.fromState("chat_instance"));
    e(this, "hash", this.fromState("hash"));
    e(this, "queryId", this.fromState("query_id"));
    e(this, "raw", x(this._raw));
    e(this, "receiver", this.fromState("receiver"));
    e(this, "signature", this.fromState("signature"));
    e(this, "startParam", this.fromState("start_param"));
    e(this, "user", this.fromState("user"));
    e(this, "restoreFp");
    e(this, "restore");
    this.restoreFp = () => c2(
      t(),
      D3(St2(() => {
      }, ({ raw: r2, obj: n }) => {
        this._state.set(n), this._raw.set(r2);
      }))
    ), this.restore = gr(this.restoreFp);
  }
  fromState(t) {
    return x(() => {
      const r2 = this._state();
      return r2 ? r2[t] : void 0;
    });
  }
};
var Gn = new Ar({
  retrieveInitData() {
    return c2(
      bs,
      ut3("obj", () => c2(
        Et(),
        D3(({ tgWebAppData: s }) => s ? _e2(s) : ie)
      )),
      ut3("raw", Pt),
      D3(({ obj: s, raw: t }) => c2(
        As,
        ct3("obj", () => s),
        ct3("raw", () => t)
      ))
    );
  }
});
var xr = class {
  constructor({ version: t, request: r2, isTma: n }) {
    e(this, "isOpened");
    e(this, "isSupported");
    e(this, "openSlugFp");
    e(this, "openSlug");
    e(this, "openUrlFp");
    e(this, "openUrl");
    const i = I4({
      version: t,
      isTma: n,
      requires: "web_app_open_invoice",
      returns: "task"
    }), o2 = S(false), u2 = () => {
      o2.set(false);
    };
    this.isSupported = z3("web_app_open_invoice", t), this.isOpened = x(o2), this.openSlugFp = i((a, l3) => c2(
      this.isOpened() ? V3(new ze2("Invoice is already opened")) : q4(void 0),
      K5(() => (o2.set(true), r2("web_app_open_invoice", "invoice_closed", {
        ...l3,
        params: { slug: a },
        capture: (p2) => a === p2.slug
      }))),
      Ke2((p2) => (u2(), p2), (p2) => (u2(), p2.status))
    )), this.openUrlFp = i((a, l3) => {
      const { hostname: p2, pathname: m3 } = new URL(a, window.location.href);
      if (p2 !== "t.me")
        return V3(new Q4(`Link has unexpected hostname: ${p2}`));
      const d3 = m3.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/);
      return d3 ? this.openSlugFp(d3[2], l3) : V3(new Q4(
        'Expected to receive a link with a pathname in format "/invoice/{slug}" or "/${slug}"'
      ));
    }), this.openUrl = h3(this.openUrlFp), this.openSlug = h3(this.openSlugFp);
  }
};
var jn = new xr(c2(C5(), P3, y3));
function qr({ postEvent: s, ...t }) {
  return A3((r2, n = {}) => {
    if (typeof r2 == "string")
      try {
        r2 = new URL(r2);
      } catch (i) {
        return T4(new Q4(`"${r2.toString()}" is invalid URL`, i));
      }
    return s("web_app_open_link", {
      url: r2.toString(),
      try_browser: n.tryBrowser,
      try_instant_view: n.tryInstantView
    });
  }, { ...t, returns: "either" });
}
var Br = qr(c2(
  C5(),
  R2
));
var Hn = h3(Br);
function Mr({ postEvent: s, version: t, ...r2 }) {
  return A3((n) => {
    const i = n.toString();
    return i.match(/^https:\/\/t.me\/.+/) ? ee("web_app_open_tg_link", U2(t)) ? (n = new URL(n), s("web_app_open_tg_link", { path_full: n.pathname + n.search })) : (window.location.href = i, x4(void 0)) : T4(new Q4(`"${i}" is invalid URL`));
  }, { ...r2, returns: "either" });
}
var xt2 = Mr(c2(
  C5(),
  R2,
  y3
));
var Wn = h3(xt2);
function Tr({ openTelegramLink: s, ...t }) {
  return A3((r2, n) => s(
    "https://t.me/share/url?" + new URLSearchParams({ url: r2, text: n || "" }).toString().replace(/\+/g, "%20")
  ), { ...t, returns: "either" });
}
var Vr = Tr({
  ...C5(),
  openTelegramLink: xt2
});
var Kn = h3(Vr);
function $r(s) {
  let t = false, r2, n;
  return s.available && (t = true, r2 = s.access_requested, n = s.access_granted), {
    available: t,
    accessGranted: n || false,
    accessRequested: r2 || false
  };
}
var Rr = class {
  constructor({
    version: t,
    request: r2,
    postEvent: n,
    storage: i,
    isTma: o2,
    isPageReload: u2
  }) {
    e(this, "state");
    e(this, "isAvailable");
    e(this, "isAccessGranted");
    e(this, "isAccessRequested");
    e(this, "isMounted");
    e(this, "isSupported");
    e(this, "openSettingsFp");
    e(this, "openSettings");
    e(this, "requestLocationFp");
    e(this, "requestLocation");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const a = new ee2({
      initialState: {
        available: false,
        accessGranted: false,
        accessRequested: false
      },
      onChange: i.set
    }), l3 = new Ye2({
      isPageReload: u2,
      restoreState: i.get,
      onMounted: a.setState,
      initialState(g4) {
        return c2(
          r2("web_app_check_location", "location_checked", g4),
          k3($r)
        );
      }
    }), p2 = { version: t, requires: "web_app_check_location", isTma: o2 }, m3 = I4({
      ...p2,
      returns: "either"
    }), d3 = I4({
      ...p2,
      returns: "task"
    }), w4 = I4({
      ...p2,
      returns: "task",
      isMounted: l3.isMounted
    });
    this.isAvailable = a.getter("available"), this.isAccessRequested = a.getter("accessRequested"), this.isAccessGranted = a.getter("accessGranted"), this.isSupported = z3("web_app_check_location", t), this.isMounted = l3.isMounted, this.state = a.state, this.unmount = l3.unmount, this.mountFp = d3(l3.mount), this.openSettingsFp = m3(() => n("web_app_open_location_settings")), this.requestLocationFp = w4((g4) => c2(
      r2("web_app_request_location", "location_requested", g4),
      k3((S5) => {
        if (!S5.available)
          return a.setState({ available: false }), null;
        const { available: v4, ..._3 } = S5;
        return _3;
      })
    )), this.mount = h3(this.mountFp), this.openSettings = h3(this.openSettingsFp), this.requestLocation = h3(this.requestLocationFp);
  }
};
var Nn = new Rr(c2(
  C5(),
  R2,
  y3,
  P3,
  te("locationManager")
));
var Lr = class {
  constructor({ defaults: t, ...r2 }) {
    e(this, "bgColor");
    e(this, "hasShineEffect");
    e(this, "isEnabled");
    e(this, "isLoaderVisible");
    e(this, "isVisible");
    e(this, "isMounted");
    e(this, "state");
    e(this, "text");
    e(this, "textColor");
    e(this, "showFp");
    e(this, "show");
    e(this, "hideFp");
    e(this, "hide");
    e(this, "enableFp");
    e(this, "enable");
    e(this, "enableShineEffectFp");
    e(this, "enableShineEffect");
    e(this, "disableFp");
    e(this, "disable");
    e(this, "disableShineEffectFp");
    e(this, "disableShineEffect");
    e(this, "setBgColorFp");
    e(this, "setBgColor");
    e(this, "setTextColorFp");
    e(this, "setTextColor");
    e(this, "setTextFp");
    e(this, "setText");
    e(this, "showLoaderFp");
    e(this, "showLoader");
    e(this, "hideLoaderFp");
    e(this, "hideLoader");
    e(this, "setParamsFp");
    e(this, "setParams");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    e(this, "onClickFp");
    e(this, "onClick");
    e(this, "offClickFp");
    e(this, "offClick");
    const n = new ke2({
      ...r2,
      version: "100",
      initialState: {
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: false,
        isVisible: false,
        text: "Continue"
      },
      method: "web_app_setup_main_button",
      payload: (o2) => ({
        has_shine_effect: o2.hasShineEffect,
        is_visible: o2.isVisible,
        is_active: o2.isEnabled,
        is_progress_visible: o2.isLoaderVisible,
        text: o2.text,
        color: o2.bgColor,
        text_color: o2.textColor
      })
    }), i = (o2, u2) => {
      const a = n.stateGetter(o2);
      return x(() => a() || U2(u2));
    };
    this.bgColor = i("bgColor", t.bgColor), this.textColor = i("textColor", t.textColor), this.hasShineEffect = n.stateGetter("hasShineEffect"), this.isEnabled = n.stateGetter("isEnabled"), this.isLoaderVisible = n.stateGetter("isLoaderVisible"), this.text = n.stateGetter("text"), this.isVisible = n.stateGetter("isVisible"), this.isMounted = n.isMounted, this.state = n.state, [this.setBgColor, this.setBgColorFp] = n.stateSetters("bgColor"), [this.setTextColor, this.setTextColorFp] = n.stateSetters("textColor"), [
      [this.disableShineEffect, this.disableShineEffectFp],
      [this.enableShineEffect, this.enableShineEffectFp]
    ] = n.stateBoolSetters("hasShineEffect"), [
      [this.disable, this.disableFp],
      [this.enable, this.enableFp]
    ] = n.stateBoolSetters("isEnabled"), [
      [this.hideLoader, this.hideLoaderFp],
      [this.showLoader, this.showLoaderFp]
    ] = n.stateBoolSetters("isLoaderVisible"), [this.setText, this.setTextFp] = n.stateSetters("text"), [[this.hide, this.hideFp], [this.show, this.showFp]] = n.stateBoolSetters("isVisible"), this.setParams = n.setState, this.setParamsFp = n.setStateFp, this.onClick = n.onClick, this.onClickFp = n.onClickFp, this.offClick = n.offClick, this.offClickFp = n.offClickFp, this.mount = n.mount, this.mountFp = n.mountFp, this.unmount = n.unmount;
  }
  //#endregion
};
function et3(s, t) {
  document.documentElement.style.setProperty(s, t);
}
function tt3(s) {
  document.documentElement.style.removeProperty(s);
}
function Pr(s) {
  return c2(
    b3(s),
    D3((t) => Math.sqrt(
      [0.299, 0.587, 0.114].reduce((r2, n, i) => {
        const o2 = parseInt(t.slice(1 + i * 2, 1 + (i + 1) * 2), 16);
        return r2 + o2 * o2 * n;
      }, 0)
    ) < 120)
  );
}
var qt2 = gr(Pr);
var Or = class {
  constructor({
    initialState: t,
    onChange: r2,
    offChange: n,
    isTma: i,
    storage: o2,
    isPageReload: u2
  }) {
    e(this, "accentTextColor");
    e(this, "bgColor");
    e(this, "buttonColor");
    e(this, "buttonTextColor");
    e(this, "bottomBarBgColor");
    e(this, "destructiveTextColor");
    e(this, "headerBgColor");
    e(this, "hintColor");
    e(this, "linkColor");
    e(this, "secondaryBgColor");
    e(this, "sectionBgColor");
    e(this, "sectionHeaderTextColor");
    e(this, "sectionSeparatorColor");
    e(this, "subtitleTextColor");
    e(this, "textColor");
    e(this, "_isCssVarsBound", S(false));
    e(this, "isCssVarsBound", x(this._isCssVarsBound));
    e(this, "bindCssVarsFp");
    e(this, "bindCssVars");
    e(this, "state");
    e(this, "isDark", x(() => {
      const t2 = this.bgColor();
      return !t2 || qt2(t2);
    }));
    e(this, "isMounted");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const a = new ee2({
      initialState: {},
      onChange: o2.set
    }), l3 = (g4) => {
      a.setState(g4.theme_params);
    }, p2 = new fe2({
      initialState: () => x4(U2(t)),
      isPageReload: u2,
      onMounted(g4) {
        a.setState(g4), r2(l3);
      },
      onUnmounted() {
        n(l3);
      },
      restoreState: o2.get
    }), m3 = { isTma: i, returns: "either" }, d3 = I4(m3), w4 = I4({
      ...m3,
      isMounted: p2.isMounted
    });
    this.accentTextColor = a.getter("accent_text_color"), this.bgColor = a.getter("bg_color"), this.buttonColor = a.getter("button_color"), this.buttonTextColor = a.getter("button_text_color"), this.bottomBarBgColor = a.getter("bottom_bar_bg_color"), this.destructiveTextColor = a.getter("destructive_text_color"), this.headerBgColor = a.getter("header_bg_color"), this.hintColor = a.getter("hint_color"), this.linkColor = a.getter("link_color"), this.secondaryBgColor = a.getter("secondary_bg_color"), this.sectionBgColor = a.getter("section_bg_color"), this.sectionHeaderTextColor = a.getter("section_header_text_color"), this.sectionSeparatorColor = a.getter("section_separator_color"), this.subtitleTextColor = a.getter("subtitle_text_color"), this.textColor = a.getter("text_color"), this.state = a.state, this.isMounted = p2.isMounted, this.bindCssVarsFp = w4((g4) => {
      if (this._isCssVarsBound())
        return T4(new Qe2());
      g4 || (g4 = (_3) => `--tg-theme-${cr(_3)}`);
      const S5 = (_3) => {
        Object.entries(a.state()).forEach(([b4, f3]) => {
          f3 && _3(b4, f3);
        });
      }, v4 = () => {
        S5((_3, b4) => {
          et3(g4(_3), b4);
        });
      };
      return v4(), a.state.sub(v4), this._isCssVarsBound.set(true), x4(() => {
        S5(tt3), a.state.unsub(v4), this._isCssVarsBound.set(false);
      });
    }), this.mountFp = d3(p2.mount), this.unmount = p2.unmount, this.bindCssVars = h3(this.bindCssVarsFp), this.mount = h3(this.mountFp);
  }
  //#endregion
};
var Ve2 = me2({});
var ve2 = new Or({
  ...c2(
    C5(),
    te("themeParams")
  ),
  offChange(s) {
    At("theme_changed", s);
  },
  onChange(s) {
    z2("theme_changed", s);
  },
  initialState: Ve2
});
function Bt(s, t, r2) {
  return c2(
    Je2(s, t),
    (n) => ({ ...n, defaults: r2 })
  );
}
var Qn = new Lr(
  Bt("mainButton", "main_button_pressed", {
    bgColor: x(() => ve2.buttonColor() || "#2481cc"),
    textColor: x(() => ve2.buttonTextColor() || "#ffffff")
  })
);
var Dr = class {
  constructor({
    storage: t,
    isPageReload: r2,
    version: n,
    postEvent: i,
    isTma: o2,
    theme: u2,
    onVisibilityChanged: a,
    offVisibilityChanged: l3
  }) {
    e(this, "isSupported");
    e(this, "isDark", x(() => {
      const t2 = this.bgColorRgb();
      return t2 ? qt2(t2) : false;
    }));
    e(this, "isActive");
    e(this, "state");
    e(this, "isCssVarsBound");
    e(this, "bindCssVarsFp");
    e(this, "bindCssVars");
    e(this, "isMounted");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    e(this, "bgColor");
    e(this, "bgColorRgb");
    e(this, "setBgColorFp");
    e(this, "setBgColor");
    e(this, "headerColor");
    e(this, "headerColorRgb");
    e(this, "setHeaderColorFp");
    e(this, "setHeaderColor");
    e(this, "bottomBarColor");
    e(this, "bottomBarColorRgb");
    e(this, "setBottomBarColorFp");
    e(this, "setBottomBarColor");
    e(this, "closeFp");
    e(this, "close");
    e(this, "readyFp");
    e(this, "ready");
    const p2 = (f3) => {
      w4.setState({ isActive: f3.is_visible });
    }, m3 = (f3) => {
      [
        [this.headerColor, "web_app_set_header_color"],
        [this.bgColor, "web_app_set_background_color"],
        [this.bottomBarColor, "web_app_set_bottom_bar_color"]
      ].forEach(([B3, L4]) => {
        const $4 = B3();
        if (!Y2($4) && (L4 !== "web_app_set_header_color" || !["bg_color", "secondary_bg_color"].includes($4))) {
          const G5 = f3[$4];
          G5 && i(L4, { color: G5 });
        }
      });
    }, d3 = new fe2({
      initialState() {
        return x4({
          bgColor: "bg_color",
          headerColor: "header_bg_color",
          bottomBarColor: "bottom_bar_bg_color",
          isActive: true
        });
      },
      isPageReload: r2,
      onMounted: (f3) => {
        a(p2), u2.sub(m3), w4.setState(f3);
      },
      onUnmounted() {
        l3(p2), u2.unsub(m3);
      },
      restoreState: t.get
    });
    this.isMounted = d3.isMounted, this.mountFp = A3(() => {
      const f3 = () => {
      };
      return c2(d3.mount(), de2(f3, f3));
    }, { isTma: o2, returns: "plain" }), this.mount = h3(this.mountFp), this.unmount = d3.unmount;
    const w4 = new ee2({
      initialState: {
        bgColor: "bg_color",
        bottomBarColor: "bottom_bar_bg_color",
        headerColor: "bg_color",
        isActive: false
      },
      onChange: t.set
    });
    this.state = w4.state;
    const g4 = (f3) => Y2(f3) ? f3 : U2(u2)[f3], S5 = (f3) => x(() => g4(f3()));
    this.isActive = w4.getter("isActive"), this.isSupported = x(() => [
      "web_app_set_header_color",
      "web_app_set_background_color",
      "web_app_set_bottom_bar_color"
    ].some((f3) => ee(f3, U2(n))));
    const v4 = S(false);
    this.isCssVarsBound = x(v4), this.bindCssVarsFp = A3((f3) => {
      if (v4())
        return T4(new Qe2());
      const [B3, L4] = lr(() => {
        v4.set(false);
      }), $4 = (G5, O2) => {
        const N3 = () => {
          et3(G5, O2() || null);
        };
        N3(), B3(O2.sub(N3), tt3.bind(null, G5));
      };
      return f3 || (f3 = (G5) => `--tg-${ar(G5)}`), $4(f3("bgColor"), this.bgColorRgb), $4(f3("bottomBarColor"), this.bottomBarColorRgb), $4(f3("headerColor"), this.headerColorRgb), v4.set(true), x4(L4);
    }, { isTma: o2, returns: "either", isMounted: this.isMounted }), this.bindCssVars = h3(this.bindCssVarsFp);
    const _3 = (f3) => {
      const B3 = w4.getter(f3), L4 = S5(B3), $4 = {
        headerColor: "web_app_set_header_color",
        bgColor: "web_app_set_background_color",
        bottomBarColor: "web_app_set_bottom_bar_color"
      }[f3], G5 = A3(
        (O2) => {
          if (O2 === B3())
            return x4(void 0);
          if ($4 === "web_app_set_header_color" && (O2 === "bg_color" || O2 === "secondary_bg_color"))
            return c2(
              i("web_app_set_header_color", { color_key: O2 }),
              D3(() => {
                w4.setState({ [f3]: O2 });
              })
            );
          const N3 = g4(O2);
          return c2(
            N3 ? i($4, { color: N3 }) : T4(new ir2(O2)),
            D3(() => {
              w4.setState({ [f3]: O2 });
            })
          );
        },
        {
          isTma: o2,
          version: n,
          requires: $4,
          isMounted: this.isMounted,
          returns: "either",
          supports: f3 === "headerColor" ? {
            rgb: {
              method: "web_app_set_header_color",
              param: "color",
              shouldCheck: Y2
            }
          } : void 0
        }
      );
      return [B3, L4, h3(G5), G5];
    };
    [
      this.bgColor,
      this.bgColorRgb,
      this.setBgColor,
      this.setBgColorFp
    ] = _3("bgColor"), [
      this.headerColor,
      this.headerColorRgb,
      this.setHeaderColor,
      this.setHeaderColorFp
    ] = _3("headerColor"), [
      this.bottomBarColor,
      this.bottomBarColorRgb,
      this.setBottomBarColor,
      this.setBottomBarColorFp
    ] = _3("bottomBarColor");
    const b4 = I4({ isTma: o2, returns: "either" });
    this.closeFp = b4((f3) => i("web_app_close", { return_back: f3 })), this.close = h3(this.closeFp), this.readyFp = b4(() => i("web_app_ready")), this.ready = h3(this.readyFp);
  }
  //#endregion
};
var Ur = new Dr({
  ...c2(
    C5(),
    R2,
    y3,
    te("miniApp")
  ),
  offVisibilityChanged(s) {
    At("visibility_changed", s);
  },
  onVisibilityChanged(s) {
    z2("visibility_changed", s);
  },
  theme: ve2.state
});
function Gr(s) {
  const t = s.message.trim(), r2 = (s.title || "").trim(), n = s.buttons || [];
  if (r2.length > 64)
    return T4(new Q4(`Invalid title: ${r2}`));
  if (!t || t.length > 256)
    return T4(new Q4(`Invalid message: ${t}`));
  if (n.length > 3)
    return T4(new Q4(`Invalid buttons count: ${n.length}`));
  const i = [];
  if (!n.length)
    i.push({ type: "close", id: "" });
  else
    for (let o2 = 0; o2 < n.length; o2++) {
      const u2 = n[o2], a = u2.id || "";
      if (a.length > 64)
        return T4(new Q4(`Button with index ${o2} has invalid id: ${a}`));
      if (!u2.type || u2.type === "default" || u2.type === "destructive") {
        const l3 = u2.text.trim();
        if (!l3 || l3.length > 64)
          return T4(new Q4(`Button with index ${o2} has invalid text: ${l3}`));
        i.push({ type: u2.type, text: l3, id: a });
      } else
        i.push({ type: u2.type, id: a });
    }
  return x4({ title: r2, message: t, buttons: i });
}
var jr = class {
  constructor({ version: t, isTma: r2, request: n }) {
    e(this, "isOpened");
    e(this, "isSupported");
    e(this, "showFp");
    e(this, "show");
    const i = S(false), o2 = () => {
      i.set(false);
    }, u2 = I4({
      version: t,
      isTma: r2,
      requires: "web_app_open_popup",
      returns: "task"
    });
    this.isSupported = z3("web_app_open_popup", t), this.isOpened = x(i), this.showFp = u2((a) => c2(
      this.isOpened() ? V3(new ze2("A popup is already opened")) : q4(void 0),
      ae(() => kt2(Gr(a))),
      K5((l3) => (i.set(true), n("web_app_open_popup", "popup_closed", {
        ...a,
        params: l3
      }))),
      Ke2(
        (l3) => (o2(), l3),
        (l3) => (o2(), l3.button_id)
      )
    )), this.show = h3(this.showFp);
  }
};
var zn = new jr(c2(C5(), P3, y3));
function Hr({ request: s, ...t }) {
  return A3((r2) => c2(
    s("web_app_request_phone", "phone_requested", r2),
    k3((n) => n.status)
  ), { ...t, requires: "web_app_request_phone", returns: "task" });
}
var Mt2 = Hr(c2(
  C5(),
  y3,
  P3
));
var Jn = h3(Mt2);
function Wr({
  invokeCustomMethod: s,
  requestPhoneAccess: t,
  ...r2
}) {
  const n = (u2) => c2(
    s("getRequestedContact", {}, {
      ...u2,
      timeout: (u2 || {}).timeout || 5e3
    }),
    ae((a) => {
      const l3 = safeParse(string(), a);
      if (!l3.success)
        return V3(new we2(a, l3.issues));
      if (!l3.output)
        return q4(void 0);
      const p2 = safeParse(
        W2(
          looseObject({
            contact: h2(looseObject({
              user_id: number(),
              phone_number: string(),
              first_name: string(),
              last_name: optional(string())
            })),
            auth_date: pipe(
              string(),
              transform((m3) => new Date(Number(m3) * 1e3)),
              date()
            ),
            hash: string()
          })
        ),
        l3.output
      );
      return p2.success ? q4({ raw: l3.output, parsed: p2.output }) : V3(new we2(l3.output, p2.issues));
    })
  ), i = (u2) => c2(
    n(u2),
    js(
      // All other errors except validation ones should be ignored. Receiving validation error
      // means that we have some data, but we are unable to parse it properly. So, there is no
      // need to make some more requests further, the problem is local.
      (a) => we2.is(a) ? T4(a) : x4(void 0),
      (a) => x4(a)
    )
  ), o2 = (u2) => ur(
    async (a, l3, p2) => {
      let m3 = 50;
      for (; !p2.isRejected; ) {
        const d3 = await i(p2)();
        if (d3._tag === "Left")
          return l3(d3.left);
        if (d3.right)
          return a(d3.right);
        await new Promise((w4) => setTimeout(w4, m3)), m3 += 50;
      }
    },
    u2
  );
  return A3((u2) => ur.fn((a) => c2(
    // Try to get the requested contact. Probably, we already requested it before.
    i(a),
    K5((l3) => l3 ? q4(l3) : c2(
      t(a),
      ae((p2) => p2 === "sent" ? o2(a) : V3(new It2("User denied access")))
    ))
  ), u2), { ...r2, returns: "task", requires: "web_app_request_phone" });
}
function Kr({ requestContact: s, ...t }) {
  return A3(
    s,
    { ...t, returns: "task", requires: "web_app_request_phone" }
  );
}
var Tt2 = Wr({
  ...c2(C5(), Xe2, y3),
  requestPhoneAccess: Mt2
});
var Yn = h3(Tt2);
var Nr = Kr({
  ...c2(C5(), y3),
  requestContact(s) {
    return c2(
      Tt2(s),
      k3((t) => t.parsed)
    );
  }
});
var Zn = h3(Nr);
function Qr({ request: s, ...t }) {
  return A3((r2) => c2(
    s("web_app_request_write_access", "write_access_requested", r2),
    k3((n) => n.status)
  ), { ...t, requires: "web_app_request_write_access", returns: "task" });
}
var zr = Qr(c2(
  C5(),
  y3,
  P3
));
var Xn = h3(zr);
var Jr = class {
  constructor({
    version: t,
    onClosed: r2,
    onTextReceived: n,
    isTma: i,
    postEvent: o2
  }) {
    e(this, "isOpened");
    e(this, "isSupported");
    e(this, "captureFp");
    e(this, "capture");
    e(this, "closeFp");
    e(this, "close");
    e(this, "openFp");
    e(this, "open");
    const u2 = { version: t, requires: "web_app_open_scan_qr_popup", isTma: i }, a = I4({ ...u2, returns: "either" }), l3 = I4({ ...u2, returns: "task" }), p2 = S(false), m3 = () => {
      p2.set(false);
    };
    this.isSupported = z3("web_app_open_scan_qr_popup", t), this.isOpened = x(p2), this.captureFp = l3((d3) => {
      let w4;
      return c2(
        this.openFp({
          ...d3,
          onCaptured: (g4) => {
            d3.capture(g4) && (w4 = g4, this.close());
          }
        }),
        k3(() => w4)
      );
    }), this.closeFp = a(() => c2(o2("web_app_close_scan_qr_popup"), D3(m3))), this.openFp = l3((d3) => c2(
      p2() ? V3(new ze2("The QR Scanner is already opened")) : async () => o2("web_app_open_scan_qr_popup", { text: d3.text }),
      ae(() => {
        p2.set(true);
        const [w4, g4] = lr(), S5 = (v4) => (g4(), p2.set(false), v4);
        return c2(
          ur((v4) => {
            w4(
              // The scanner was closed externally.
              r2(v4),
              // The scanner was closed internally.
              p2.sub((_3) => {
                _3 || v4();
              }),
              n(d3.onCaptured)
            );
          }, d3),
          Ke2(S5, S5)
        );
      })
    )), this.open = h3(this.openFp), this.capture = h3(this.captureFp), this.close = h3(this.closeFp);
  }
};
var eo = new Jr({
  ...c2(C5(), R2, y3),
  onClosed(s) {
    return z2("scan_qr_popup_closed", s);
  },
  onTextReceived(s) {
    return z2("qr_text_received", (t) => {
      s(t.data);
    });
  }
});
var Yr = class {
  constructor({ defaults: t, ...r2 }) {
    e(this, "isSupported");
    e(this, "position");
    e(this, "bgColor");
    e(this, "hasShineEffect");
    e(this, "isEnabled");
    e(this, "isLoaderVisible");
    e(this, "isVisible");
    e(this, "isMounted");
    e(this, "state");
    e(this, "text");
    e(this, "textColor");
    e(this, "showFp");
    e(this, "show");
    e(this, "hideFp");
    e(this, "hide");
    e(this, "enableFp");
    e(this, "enable");
    e(this, "enableShineEffectFp");
    e(this, "enableShineEffect");
    e(this, "disableFp");
    e(this, "disable");
    e(this, "disableShineEffectFp");
    e(this, "disableShineEffect");
    e(this, "setBgColorFp");
    e(this, "setBgColor");
    e(this, "setTextColorFp");
    e(this, "setTextColor");
    e(this, "setTextFp");
    e(this, "setText");
    e(this, "setPositionFp");
    e(this, "setPosition");
    e(this, "showLoaderFp");
    e(this, "showLoader");
    e(this, "hideLoaderFp");
    e(this, "hideLoader");
    e(this, "setParamsFp");
    e(this, "setParams");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    e(this, "onClickFp");
    e(this, "onClick");
    e(this, "offClickFp");
    e(this, "offClick");
    const n = new ke2({
      ...r2,
      initialState: {
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: false,
        isVisible: false,
        text: "Cancel",
        position: "left"
      },
      method: "web_app_setup_secondary_button",
      payload: (o2) => ({
        has_shine_effect: o2.hasShineEffect,
        is_visible: o2.isVisible,
        is_active: o2.isEnabled,
        is_progress_visible: o2.isLoaderVisible,
        text: o2.text,
        color: o2.bgColor,
        text_color: o2.textColor,
        position: o2.position
      })
    }), i = (o2, u2) => {
      const a = n.stateGetter(o2);
      return x(() => a() || U2(u2));
    };
    this.isSupported = z3("web_app_setup_secondary_button", r2.version), this.bgColor = i("bgColor", t.bgColor), this.textColor = i("textColor", t.textColor), this.position = n.stateGetter("position"), this.hasShineEffect = n.stateGetter("hasShineEffect"), this.isEnabled = n.stateGetter("isEnabled"), this.isLoaderVisible = n.stateGetter("isLoaderVisible"), this.text = n.stateGetter("text"), this.isVisible = n.stateGetter("isVisible"), this.isMounted = n.isMounted, this.state = n.state, [this.setPosition, this.setPositionFp] = n.stateSetters("position"), [this.setBgColor, this.setBgColorFp] = n.stateSetters("bgColor"), [this.setTextColor, this.setTextColorFp] = n.stateSetters("textColor"), [
      [this.disableShineEffect, this.disableShineEffectFp],
      [this.enableShineEffect, this.enableShineEffectFp]
    ] = n.stateBoolSetters("hasShineEffect"), [
      [this.disable, this.disableFp],
      [this.enable, this.enableFp]
    ] = n.stateBoolSetters("isEnabled"), [
      [this.hideLoader, this.hideLoaderFp],
      [this.showLoader, this.showLoaderFp]
    ] = n.stateBoolSetters("isLoaderVisible"), [this.setText, this.setTextFp] = n.stateSetters("text"), [[this.hide, this.hideFp], [this.show, this.showFp]] = n.stateBoolSetters("isVisible"), this.setParams = n.setState, this.setParamsFp = n.setStateFp, this.onClick = n.onClick, this.onClickFp = n.onClickFp, this.offClick = n.offClick, this.offClickFp = n.offClickFp, this.mount = n.mount, this.mountFp = n.mountFp, this.unmount = n.unmount;
  }
  //#endregion
};
var to = new Yr(
  Bt("secondaryButton", "secondary_button_pressed", {
    bgColor: x(() => Ur.bottomBarColorRgb() || "#000000"),
    textColor: x(() => ve2.buttonColor() || "#2481cc")
  })
);
var Zr = class {
  constructor({ isTma: t, request: r2, version: n, createRequestId: i }) {
    e(this, "getItemFp");
    e(this, "getItem");
    e(this, "restoreItemFp");
    e(this, "restoreItem");
    e(this, "setItemFp");
    e(this, "setItem");
    e(this, "deleteItemFp");
    e(this, "deleteItem");
    e(this, "clearFp");
    e(this, "clear");
    const o2 = I4({
      version: n,
      requires: "web_app_secure_storage_get_key",
      isTma: t,
      returns: "task"
    }), u2 = (a, l3, p2) => {
      const m3 = i();
      return c2(
        r2(a, ["secure_storage_failed", l3], {
          params: { ...p2, req_id: m3 },
          capture: (d3) => "payload" in d3 ? d3.payload.req_id === m3 : true
        }),
        K5((d3) => d3.event === "secure_storage_failed" ? V3(new er3(d3.payload.error || "UNKNOWN_ERROR")) : q4(d3.payload))
      );
    };
    this.getItemFp = o2((a) => c2(
      u2("web_app_secure_storage_get_key", "secure_storage_key_received", { key: a }),
      k3((l3) => ({
        value: l3.value,
        canRestore: !!l3.can_restore
      }))
    )), this.setItemFp = o2((a, l3) => c2(
      u2("web_app_secure_storage_save_key", "secure_storage_key_saved", { key: a, value: l3 }),
      k3(() => {
      })
    )), this.deleteItemFp = o2((a) => this.setItemFp(a, null)), this.clearFp = o2(() => c2(
      u2("web_app_secure_storage_clear", "secure_storage_cleared", {}),
      k3(() => {
      })
    )), this.restoreItemFp = o2((a) => c2(
      u2("web_app_secure_storage_restore_key", "secure_storage_key_restored", { key: a }),
      k3((l3) => l3.value)
    )), this.getItem = h3(this.getItemFp), this.setItem = h3(this.setItemFp), this.deleteItem = h3(this.deleteItemFp), this.clear = h3(this.clearFp), this.restoreItem = h3(this.restoreItemFp);
  }
};
var so = new Zr(c2(
  C5(),
  y3,
  P3,
  At2
));
var Xr = class {
  constructor(t) {
    e(this, "isVisible");
    e(this, "isMounted");
    e(this, "isSupported");
    e(this, "hideFp");
    e(this, "hide");
    e(this, "showFp");
    e(this, "show");
    e(this, "onClickFp");
    e(this, "onClick");
    e(this, "offClickFp");
    e(this, "offClick");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    const r2 = new ke2({
      ...t,
      method: "web_app_setup_settings_button",
      payload: (n) => ({ is_visible: n.isVisible }),
      initialState: { isVisible: false }
    });
    this.isVisible = r2.stateGetter("isVisible"), this.isMounted = r2.isMounted, this.isSupported = r2.isSupported, [[this.hide, this.hideFp], [this.show, this.showFp]] = r2.stateBoolSetters("isVisible"), this.onClick = r2.onClick, this.onClickFp = r2.onClickFp, this.offClick = r2.offClick, this.offClickFp = r2.offClickFp, this.mount = r2.mount, this.mountFp = r2.mountFp, this.unmount = r2.unmount;
  }
};
var ro = new Xr(
  Je2("settingsButton", "settings_button_pressed")
);
var en = class {
  constructor({ postEvent: t, storage: r2, isTma: n, isPageReload: i, version: o2 }) {
    e(this, "isSupported");
    e(this, "isVerticalEnabled");
    e(this, "isMounted");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "unmount");
    e(this, "disableVerticalFp");
    e(this, "disableVertical");
    e(this, "enableVerticalFp");
    e(this, "enableVertical");
    const u2 = { isVerticalEnabled: true }, a = new ee2({
      initialState: u2,
      onChange(g4) {
        r2.set(g4);
      }
    }), l3 = new fe2({
      initialState: u2,
      isPageReload: i,
      onMounted: a.setState,
      restoreState: r2.get
    }), p2 = { requires: "web_app_setup_swipe_behavior", isTma: n, version: o2 }, m3 = I4({
      ...p2,
      returns: "plain"
    }), d3 = I4({
      ...p2,
      isMounted: l3.isMounted,
      returns: "either"
    }), w4 = (g4) => {
      const S5 = { isVerticalEnabled: g4 };
      return a.hasDiff(S5) ? c2(
        t("web_app_setup_swipe_behavior", { allow_vertical_swipe: g4 }),
        D3(() => {
          a.setState(S5);
        })
      ) : x4(void 0);
    };
    this.isSupported = z3("web_app_setup_swipe_behavior", o2), this.isVerticalEnabled = a.getter("isVerticalEnabled"), this.isMounted = l3.isMounted, this.disableVerticalFp = d3(() => w4(false)), this.enableVerticalFp = d3(() => w4(true)), this.mountFp = m3(() => {
      const g4 = () => {
      };
      return c2(l3.mount(), de2(g4, g4));
    }), this.unmount = l3.unmount, this.disableVertical = h3(this.disableVerticalFp), this.enableVertical = h3(this.enableVerticalFp), this.mount = h3(this.mountFp);
  }
};
var no = new en(c2(
  C5(),
  R2,
  y3,
  te("swipeBehavior")
));
async function oo(s) {
  try {
    const { clipboard: r2 } = navigator;
    if (r2)
      return await r2.writeText(s);
  } catch {
  }
  const t = document.createElement("textarea");
  t.value = s, t.style.top = "0", t.style.left = "0", t.style.position = "fixed", document.body.appendChild(t), t.focus(), t.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(t);
  }
}
function tn({ request: s, ...t }) {
  return A3((r2, n, i) => c2(
    s(
      "web_app_request_file_download",
      "file_download_requested",
      { ...i, params: { url: r2, file_name: n } }
    ),
    K5((o2) => o2.status === "downloading" ? q4(void 0) : V3(new It2("User denied the action")))
  ), { ...t, requires: "web_app_request_file_download", returns: "task" });
}
var sn = tn(c2(
  C5(),
  P3,
  y3
));
var io = h3(sn);
function rn({ invokeCustomMethod: s, ...t }) {
  return A3((r2) => c2(
    s("getCurrentTime", {}, r2),
    K5((n) => {
      const i = safeParse(
        pipe(number(), integer(), transform((o2) => new Date(o2 * 1e3)), date()),
        n
      );
      return i.success ? q4(i.output) : V3(new we2(n, i.issues));
    })
  ), { ...t, requires: "web_app_invoke_custom_method", returns: "task" });
}
var nn = rn(c2(
  C5(),
  Xe2,
  y3
));
var ao = h3(nn);
function on({ postEvent: s, ...t }) {
  return A3(() => s("web_app_hide_keyboard"), { ...t, returns: "either", requires: "web_app_hide_keyboard" });
}
var an = on(c2(
  C5(),
  R2,
  y3
));
var uo = h3(an);
function un({ request: s, createRequestId: t, ...r2 }) {
  return A3((n) => {
    const i = t();
    return c2(
      s("web_app_read_text_from_clipboard", "clipboard_text_received", {
        ...n,
        params: { req_id: i },
        capture: qt(i)
      }),
      k3(({ data: o2 = null }) => o2)
    );
  }, { ...r2, requires: "web_app_read_text_from_clipboard", returns: "task" });
}
var cn = un({
  ...c2(
    C5(),
    y3,
    P3
  ),
  createRequestId: Ze2
});
var co = h3(cn);
function pn(s) {
  const t = {}, r2 = s.match(/Telegram-Android(?:\/([^ ]+))?(?: (\([^)]+\))?|$)/);
  if (r2) {
    const [, n, i] = r2;
    n && (t.appVersion = n), i && i.slice(1, i.length - 1).split(";").forEach((o2) => {
      const [u2, a] = o2.trim().split(" ");
      if (u2 === "Android")
        t.androidVersion = a;
      else if (u2 === "SDK") {
        const l3 = parseInt(a, 10);
        l3 && (t.sdkVersion = l3);
      } else a ? (t.manufacturer = u2, t.model = a) : t.performanceClass = u2;
    });
  }
  return t;
}
function po() {
  return pn(navigator.userAgent);
}
function ln({ postEvent: s, ...t }) {
  return A3((r2) => {
    const { size: n } = new Blob([r2]);
    return !n || n > 4096 ? T4(
      new Q4(n ? "Maximum size of data to send is 4096 bytes" : "Attempted to send empty data")
    ) : s("web_app_data_send", { data: r2 });
  }, { ...t, returns: "either" });
}
var hn = ln(c2(C5(), R2));
var lo = h3(hn);
function dn({ request: s, ...t }) {
  return A3((r2, n) => c2(
    s(
      "web_app_send_prepared_message",
      ["prepared_message_failed", "prepared_message_sent"],
      {
        ...n,
        params: { id: r2 }
      }
    ),
    K5((i) => i.event === "prepared_message_failed" ? V3(new or(i.payload.error)) : q4(void 0))
  ), { ...t, requires: "web_app_send_prepared_message", returns: "task" });
}
var fn = dn(c2(
  C5(),
  P3,
  y3
));
var ho = h3(fn);
function _n({ postEvent: s, ...t }) {
  return A3((r2, n = {}) => s("web_app_share_to_story", {
    text: n.text,
    media_url: r2,
    widget_link: n.widgetLink
  }), { ...t, requires: "web_app_share_to_story", returns: "either" });
}
var mn = _n(c2(
  C5(),
  R2,
  y3
));
var fo = h3(mn);
var $e2 = me2(false);
function bn({ isInlineMode: s, postEvent: t, ...r2 }) {
  return A3((n, i) => t("web_app_switch_inline_query", {
    query: n,
    chat_types: i || []
  }), {
    ...r2,
    requires: {
      every: ["web_app_switch_inline_query", () => U2(s) ? void 0 : "The application must be launched in the inline mode"]
    },
    returns: "either"
  });
}
var gn = bn({
  ...c2(
    C5(),
    R2,
    y3
  ),
  isInlineMode: $e2
});
var _o = h3(gn);
var Fn = class {
  constructor({
    storage: t,
    isPageReload: r2,
    onContentSafeAreaInsetsChanged: n,
    onSafeAreaInsetsChanged: i,
    onViewportChanged: o2,
    onFullscreenChanged: u2,
    offContentSafeAreaInsetsChanged: a,
    offFullscreenChanged: l3,
    offSafeAreaInsetsChanged: p2,
    offViewportChanged: m3,
    request: d3,
    isViewportStable: w4,
    isFullscreen: g4,
    isTma: S5,
    version: v4,
    postEvent: _3
  }) {
    e(this, "state");
    e(this, "height");
    e(this, "stableHeight");
    e(this, "width");
    e(this, "isExpanded");
    e(this, "isStable", x(() => this.height() === this.stableHeight()));
    e(this, "contentSafeAreaInsets");
    e(this, "contentSafeAreaInsetTop");
    e(this, "contentSafeAreaInsetLeft");
    e(this, "contentSafeAreaInsetRight");
    e(this, "contentSafeAreaInsetBottom");
    e(this, "safeAreaInsets");
    e(this, "safeAreaInsetTop");
    e(this, "safeAreaInsetLeft");
    e(this, "safeAreaInsetRight");
    e(this, "safeAreaInsetBottom");
    e(this, "isFullscreen");
    e(this, "requestFullscreenFp");
    e(this, "requestFullscreen");
    e(this, "exitFullscreenFp");
    e(this, "exitFullscreen");
    e(this, "isCssVarsBound");
    e(this, "bindCssVarsFp");
    e(this, "bindCssVars");
    e(this, "isMounted");
    e(this, "mountFp");
    e(this, "mount");
    e(this, "expandFp");
    e(this, "expand");
    const b4 = { top: 0, right: 0, left: 0, bottom: 0 }, f3 = new ee2({
      initialState: {
        contentSafeAreaInsets: b4,
        height: 0,
        isExpanded: false,
        isFullscreen: false,
        safeAreaInsets: b4,
        stableHeight: 0,
        width: 0
      },
      onChange: t.set
    }), B3 = (E3) => {
      f3.setState({
        isExpanded: E3.is_expanded,
        height: E3.height,
        width: E3.width,
        stableHeight: E3.is_state_stable ? E3.height : void 0
      });
    }, L4 = (E3) => {
      f3.setState({ isFullscreen: E3.is_fullscreen });
    }, $4 = (E3) => {
      f3.setState({ safeAreaInsets: E3 });
    }, G5 = (E3) => {
      f3.setState({ contentSafeAreaInsets: E3 });
    }, O2 = new Ye2({
      initialState(E3) {
        const se = (J4) => () => {
          const [X4, H5] = J4 === "safe-area" ? ["web_app_request_safe_area", "safe_area_changed"] : ["web_app_request_content_safe_area", "content_safe_area_changed"];
          return ee(X4, U2(v4)) ? d3(X4, H5, E3) : q4({ top: 0, left: 0, right: 0, bottom: 0 });
        }, M4 = (J4) => () => typeof J4 == "boolean" ? q4(J4) : kt2(J4());
        return c2(
          Ys,
          Fe("safeAreaInsets", se("safe-area")),
          Fe("contentSafeAreaInsets", se("content-safe-area")),
          Fe("isFullscreen", M4(g4)),
          Fe("isViewportStable", M4(w4)),
          ae(({ isViewportStable: J4, ...X4 }) => J4 ? q4({
            ...X4,
            height: window.innerHeight,
            isExpanded: true,
            stableHeight: window.innerHeight,
            width: window.innerWidth
          }) : c2(
            d3("web_app_request_viewport", "viewport_changed", E3),
            k3((H5) => ({
              ...X4,
              height: H5.height,
              isExpanded: H5.is_expanded,
              stableHeight: H5.is_state_stable ? H5.height : 0,
              width: H5.width
            }))
          ))
        );
      },
      isPageReload: r2,
      onMounted(E3) {
        o2(B3), u2(L4), i($4), n(G5), f3.setState(E3);
      },
      onUnmounted() {
        m3(B3), l3(L4), p2($4), a(G5);
      },
      restoreState: t.get
    }), N3 = (E3) => x(() => this.safeAreaInsets()[E3]), be2 = (E3) => x(() => this.contentSafeAreaInsets()[E3]);
    this.state = f3.state, this.height = f3.getter("height"), this.stableHeight = f3.getter("stableHeight"), this.width = f3.getter("width"), this.isExpanded = f3.getter("isExpanded"), this.safeAreaInsets = f3.getter("safeAreaInsets"), this.safeAreaInsetTop = N3("top"), this.safeAreaInsetBottom = N3("bottom"), this.safeAreaInsetLeft = N3("left"), this.safeAreaInsetRight = N3("right"), this.contentSafeAreaInsets = f3.getter("contentSafeAreaInsets"), this.contentSafeAreaInsetTop = be2("top"), this.contentSafeAreaInsetBottom = be2("bottom"), this.contentSafeAreaInsetLeft = be2("left"), this.contentSafeAreaInsetRight = be2("right");
    const Vt = I4({ isTma: S5, returns: "task" }), st2 = I4({
      isTma: S5,
      returns: "either"
    }), $t2 = I4({
      isTma: S5,
      requires: "web_app_request_fullscreen",
      version: v4,
      returns: "task"
    }), rt3 = (E3) => $t2((se) => c2(
      d3(
        E3 ? "web_app_request_fullscreen" : "web_app_exit_fullscreen",
        ["fullscreen_changed", "fullscreen_failed"],
        se
      ),
      K5((M4) => M4.event === "fullscreen_failed" && M4.payload.error !== "ALREADY_FULLSCREEN" ? V3(new nr2(M4.payload.error)) : (f3.setState({
        isFullscreen: "is_fullscreen" in M4.payload ? M4.payload.is_fullscreen : true
      }), q4(void 0)))
    ));
    this.isMounted = O2.isMounted, this.mountFp = Vt(O2.mount), this.mount = h3(this.mountFp), this.isFullscreen = f3.getter("isFullscreen"), this.requestFullscreenFp = rt3(true), this.requestFullscreen = h3(this.requestFullscreenFp), this.exitFullscreenFp = rt3(false), this.exitFullscreen = h3(this.exitFullscreenFp);
    const ge2 = S(false);
    this.isCssVarsBound = x(ge2), this.bindCssVarsFp = st2(
      (E3) => {
        if (ge2())
          return T4(new Qe2());
        E3 || (E3 = (M4) => `--tg-viewport-${ar(M4)}`);
        const se = [
          ["height", this.height],
          ["stableHeight", this.stableHeight],
          ["width", this.width],
          ["safeAreaInsetTop", this.safeAreaInsetTop],
          ["safeAreaInsetBottom", this.safeAreaInsetBottom],
          ["safeAreaInsetLeft", this.safeAreaInsetLeft],
          ["safeAreaInsetRight", this.safeAreaInsetRight],
          ["contentSafeAreaInsetTop", this.contentSafeAreaInsetTop],
          ["contentSafeAreaInsetBottom", this.contentSafeAreaInsetBottom],
          ["contentSafeAreaInsetLeft", this.contentSafeAreaInsetLeft],
          ["contentSafeAreaInsetRight", this.contentSafeAreaInsetRight]
        ].reduce((M4, [J4, X4]) => {
          const H5 = E3(J4);
          if (H5) {
            const nt3 = () => {
              et3(H5, `${X4()}px`);
            };
            M4.push({ update: nt3, removeListener: X4.sub(nt3), cssVar: H5 });
          }
          return M4;
        }, []);
        return se.forEach((M4) => {
          M4.update();
        }), ge2.set(true), x4(() => {
          se.forEach((M4) => {
            M4.removeListener(), tt3(M4.cssVar);
          }), ge2.set(false);
        });
      }
    ), this.bindCssVars = h3(this.bindCssVarsFp), this.expandFp = st2(() => _3("web_app_expand")), this.expand = h3(this.expandFp);
  }
  //#endregion
};
function wn() {
  const s = (o2) => ({
    on: (u2) => {
      z2(o2, u2);
    },
    off: (u2) => {
      At(o2, u2);
    }
  }), t = s("viewport_changed"), r2 = s("fullscreen_changed"), n = s("safe_area_changed"), i = s("content_safe_area_changed");
  return new Fn({
    ...c2(
      C5(),
      te("viewport"),
      y3,
      R2,
      P3
    ),
    isFullscreen() {
      return c2(Et(), D3((o2) => !!o2.tgWebAppFullscreen));
    },
    isViewportStable() {
      return c2(Et(), D3((o2) => ["macos", "tdesktop", "unigram", "webk", "weba", "web"].includes(o2.tgWebAppPlatform)));
    },
    offContentSafeAreaInsetsChanged: i.off,
    offFullscreenChanged: r2.off,
    offSafeAreaInsetsChanged: n.off,
    offViewportChanged: t.off,
    onContentSafeAreaInsetsChanged: i.on,
    onFullscreenChanged: r2.on,
    onSafeAreaInsetsChanged: n.on,
    onViewportChanged: t.on
  });
}
var mo = wn();
function Cn(s = {}) {
  const {
    version: t,
    isInlineMode: r2,
    themeParams: n
  } = s;
  if (t && typeof r2 == "boolean" && n)
    Te2.set(t), $e2.set(r2), Ve2.set(n);
  else {
    const a = c2(Et(), Ct2(
      (l3) => l3,
      (l3) => {
        Te2.set(t || l3.tgWebAppVersion), $e2.set(typeof r2 == "boolean" ? r2 : !!l3.tgWebAppBotInline), Ve2.set(n || l3.tgWebAppThemeParams);
      }
    ));
    if (a)
      return T4(a);
  }
  s.postEvent && Et2.set(s.postEvent);
  const [i, o2] = lr(
    z2("reload_iframe", () => {
      g3().log("Received a request to reload the page"), ur3("iframe_will_reload"), window.location.reload();
    })
  ), { acceptCustomStyles: u2 = true } = s;
  if (u2) {
    const a = document.createElement("style");
    a.id = "telegram-custom-styles", document.head.appendChild(a), i(
      z2("set_custom_style", (l3) => {
        a.innerHTML = l3;
      }),
      () => {
        document.head.removeChild(a);
      }
    );
  }
  return c2(
    ce("iframe_ready", { reload_supported: true }),
    D3(() => (g3().log("The package was initialized"), o2))
  );
}
var bo = gr(Cn);
export {
  It2 as AccessDeniedError,
  ar3 as BackButton,
  hr2 as Biometry,
  Qe2 as CSSVarsBoundError,
  J as CancelledError,
  _r as ClosingBehavior,
  mr as CloudStorage,
  ze2 as ConcurrentCallError,
  gr2 as DeviceStorage,
  Xs as DeviceStorageMethodError,
  nr2 as FullscreenFailedError,
  sr3 as FunctionUnavailableError,
  vr as HapticFeedback,
  Ar as InitData,
  Q4 as InvalidArgumentsError,
  qn as InvalidEnvError,
  bt as InvalidLaunchParamsError,
  xr as Invoice,
  yt as InvokeCustomMethodFailedError,
  vt as LaunchParamsRetrieveError,
  Rr as LocationManager,
  Lr as MainButton,
  dt as MethodParameterUnsupportedError,
  gt2 as MethodUnsupportedError,
  Dr as MiniApp,
  tr3 as NotAvailableError,
  jr as Popup,
  Jr as QrScanner,
  Yr as SecondaryButton,
  Zr as SecureStorage,
  er3 as SecureStorageMethodError,
  rr3 as SetEmojiStatusError,
  Xr as SettingsButton,
  or as ShareMessageError,
  en as SwipeBehavior,
  Or as ThemeParams,
  K as TimeoutError,
  xe as UnknownEnvError,
  ir2 as UnknownThemeParamsKeyError,
  we2 as ValidationError,
  Fn as Viewport,
  Dn as addToHomeScreen,
  kr as addToHomeScreenFp,
  ar2 as applyPolyfills,
  Bn as backButton,
  Tn as biometry,
  Un as checkHomeScreenStatus,
  Er as checkHomeScreenStatusFp,
  Vn as closingBehavior,
  $n as cloudStorage,
  oo as copyTextToClipboard,
  hr as createLogger,
  rr2 as createPostEvent,
  Ze2 as createRequestId,
  ir as createStartParam,
  It as createStartParamFp,
  ke as debug,
  sr2 as decodeBase64Url,
  Te as decodeBase64UrlFp,
  ur2 as decodeStartParam,
  Ot as decodeStartParamFp,
  v as deepSnakeToCamelObjKeys,
  Rn as deviceStorage,
  io as downloadFile,
  sn as downloadFileFp,
  F3 as emitEvent,
  $e as encodeBase64Url,
  ao as getCurrentTime,
  nn as getCurrentTimeFp,
  X3 as getReleaseVersion,
  On as hapticFeedback,
  uo as hideKeyboard,
  an as hideKeyboardFp,
  bo as init,
  Gn as initData,
  Cn as initFp,
  jn as invoice,
  br as invokeCustomMethod,
  k2 as isAnyRGB,
  qt2 as isColorDark,
  Pr as isColorDarkFp,
  Y2 as isRGB,
  Z2 as isRGBA,
  X2 as isRGBAShort,
  K3 as isRGBShort,
  cr2 as isSafeToCreateStartParam,
  er2 as isTMA,
  Lt as isTMAFp,
  Nn as locationManager,
  g3 as logger,
  Qn as mainButton,
  Ur as miniApp,
  tr2 as mockTelegramEnv,
  At as off,
  $t as offAll,
  z2 as on,
  Hn as openLink,
  Br as openLinkFp,
  Wn as openTelegramLink,
  xt2 as openTelegramLinkFp,
  lt as parseInitDataQuery,
  at as parseInitDataQueryFp,
  mt as parseLaunchParamsQuery,
  it as parseLaunchParamsQueryFp,
  zn as popup,
  ur3 as postEvent,
  ce as postEventFp,
  eo as qrScanner,
  co as readTextFromClipboard,
  cn as readTextFromClipboardFp,
  Mn as request,
  Zn as requestContact,
  Yn as requestContactComplete,
  Tt2 as requestContactCompleteFp,
  Nr as requestContactFp,
  Ln as requestEmojiStatusAccess,
  wr as requestEmojiStatusAccessFp,
  dr as requestFp,
  Jn as requestPhoneAccess,
  Mt2 as requestPhoneAccessFp,
  Xn as requestWriteAccess,
  zr as requestWriteAccessFp,
  po as retrieveAndroidDeviceData,
  pn as retrieveAndroidDeviceDataFrom,
  Jt as retrieveLaunchParams,
  Et as retrieveLaunchParamsFp,
  Qt as retrieveRawInitData,
  Pt as retrieveRawInitDataFp,
  Ht as retrieveRawLaunchParams,
  L3 as retrieveRawLaunchParamsFp,
  to as secondaryButton,
  so as secureStorage,
  lo as sendData,
  hn as sendDataFp,
  ut as serializeInitDataQuery,
  gt as serializeLaunchParamsQuery,
  Kt as setDebug,
  Pn as setEmojiStatus,
  Sr as setEmojiStatusFp,
  Yt as setTargetOrigin,
  ro as settingsButton,
  ho as shareMessage,
  fn as shareMessageFp,
  fo as shareStory,
  mn as shareStoryFp,
  Kn as shareURL,
  Vr as shareURLFp,
  ee as supports,
  no as swipeBehavior,
  _o as switchInlineQuery,
  gn as switchInlineQueryFp,
  Se as targetOrigin,
  ve2 as themeParams,
  ct as toRGB,
  tt as toRGBFp,
  ft as toRGBFull,
  b3 as toRGBFullFp,
  mo as viewport
};
//# sourceMappingURL=@tma__js_sdk.js.map
