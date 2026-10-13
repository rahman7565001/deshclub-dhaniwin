import {
    b8 as nn,
    P as on,
    bM as rn,
    bN as an,
    c as sn,
    aZ as ln,
    aU as cn,
    aY as un
} from "./index-BgAwOX9Q.js";
import {
    d as fn
} from "./common-D-vNz206.js";
import {
    u as mn
} from "./useAgentL3-D0Pib9Ld.js"; /*! @license DOMPurify 3.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.7/LICENSE */
function yt(n, o) {
    (o == null || o > n.length) && (o = n.length);
    for (var a = 0, s = Array(o); a < o; a++) s[a] = n[a];
    return s
}

function pn(n) {
    if (Array.isArray(n)) return n
}

function dn(n, o) {
    var a = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
    if (a != null) {
        var s, u, p, E, te = [],
            I = !0,
            ne = !1;
        try {
            if (p = (a = a.call(n)).next, o !== 0)
                for (; !(I = (s = p.call(a)).done) && (te.push(s.value), te.length !== o); I = !0);
        } catch (Le) {
            ne = !0, u = Le
        } finally {
            try {
                if (!I && a.return != null && (E = a.return(), Object(E) !== E)) return
            } finally {
                if (ne) throw u
            }
        }
        return te
    }
}

function Tn() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}

function _n(n, o) {
    return pn(n) || dn(n, o) || gn(n, o) || Tn()
}

function gn(n, o) {
    if (n) {
        if (typeof n == "string") return yt(n, o);
        var a = {}.toString.call(n).slice(8, -1);
        return a === "Object" && n.constructor && (a = n.constructor.name), a === "Map" || a === "Set" ? Array.from(n) : a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? yt(n, o) : void 0
    }
}
const kt = Object.entries,
    bt = Object.setPrototypeOf,
    hn = Object.isFrozen,
    An = Object.getPrototypeOf,
    En = Object.getOwnPropertyDescriptor;
let D = Object.freeze,
    C = Object.seal,
    ee = Object.create,
    vt = typeof Reflect < "u" && Reflect,
    Ke = vt.apply,
    Ze = vt.construct;
D || (D = function(o) {
    return o
});
C || (C = function(o) {
    return o
});
Ke || (Ke = function(o, a) {
    for (var s = arguments.length, u = new Array(s > 2 ? s - 2 : 0), p = 2; p < s; p++) u[p - 2] = arguments[p];
    return o.apply(a, u)
});
Ze || (Ze = function(o) {
    for (var a = arguments.length, s = new Array(a > 1 ? a - 1 : 0), u = 1; u < a; u++) s[u - 1] = arguments[u];
    return new o(...s)
});
const Z = A(Array.prototype.forEach),
    Sn = A(Array.prototype.lastIndexOf),
    Rt = A(Array.prototype.pop),
    J = A(Array.prototype.push),
    yn = A(Array.prototype.splice),
    N = Array.isArray,
    fe = A(String.prototype.toLowerCase),
    Ye = A(String.prototype.toString),
    Ot = A(String.prototype.match),
    Q = A(String.prototype.replace),
    Nt = A(String.prototype.indexOf),
    bn = A(String.prototype.trim),
    Rn = A(Number.prototype.toString),
    On = A(Boolean.prototype.toString),
    Dt = typeof BigInt > "u" ? null : A(BigInt.prototype.toString),
    It = typeof Symbol > "u" ? null : A(Symbol.prototype.toString),
    d = A(Object.prototype.hasOwnProperty),
    ce = A(Object.prototype.toString),
    b = A(RegExp.prototype.test),
    ue = Nn(TypeError);

function A(n) {
    return function(o) {
        o instanceof RegExp && (o.lastIndex = 0);
        for (var a = arguments.length, s = new Array(a > 1 ? a - 1 : 0), u = 1; u < a; u++) s[u - 1] = arguments[u];
        return Ke(n, o, s)
    }
}

function Nn(n) {
    return function() {
        for (var o = arguments.length, a = new Array(o), s = 0; s < o; s++) a[s] = arguments[s];
        return Ze(n, a)
    }
}

function l(n, o) {
    let a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : fe;
    if (bt && bt(n, null), !N(o)) return n;
    let s = o.length;
    for (; s--;) {
        let u = o[s];
        if (typeof u == "string") {
            const p = a(u);
            p !== u && (hn(o) || (o[s] = p), u = p)
        }
        n[u] = !0
    }
    return n
}

function Dn(n) {
    for (let o = 0; o < n.length; o++) d(n, o) || (n[o] = null);
    return n
}

function R(n) {
    const o = ee(null);
    for (const s of kt(n)) {
        var a = _n(s, 2);
        const u = a[0],
            p = a[1];
        d(n, u) && (N(p) ? o[u] = Dn(p) : p && typeof p == "object" && p.constructor === Object ? o[u] = R(p) : o[u] = p)
    }
    return o
}

function In(n) {
    switch (typeof n) {
        case "string":
            return n;
        case "number":
            return Rn(n);
        case "boolean":
            return On(n);
        case "bigint":
            return Dt ? Dt(n) : "0";
        case "symbol":
            return It ? It(n) : "Symbol()";
        case "undefined":
            return ce(n);
        case "function":
        case "object":
            {
                if (n === null) return ce(n);
                const o = n,
                    a = U(o, "toString");
                if (typeof a == "function") {
                    const s = a(o);
                    return typeof s == "string" ? s : ce(s)
                }
                return ce(n)
            }
        default:
            return ce(n)
    }
}

function U(n, o) {
    for (; n !== null;) {
        const s = En(n, o);
        if (s) {
            if (s.get) return A(s.get);
            if (typeof s.value == "function") return A(s.value)
        }
        n = An(n)
    }

    function a() {
        return null
    }
    return a
}

function Ln(n) {
    try {
        return b(n, ""), !0
    } catch {
        return !1
    }
}
const Lt = D(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]),
    $e = D(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]),
    Xe = D(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]),
    Cn = D(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]),
    Ve = D(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]),
    wn = D(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]),
    Ct = D(["#text"]),
    wt = D(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]),
    qe = D(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]),
    Mt = D(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]),
    Ie = D(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
    Mn = C(/{{[\w\W]*|^[\w\W]*}}/g),
    xn = C(/<%[\w\W]*|^[\w\W]*%>/g),
    Pn = C(/\${[\w\W]*/g),
    kn = C(/^data-[\-\w.\u00B7-\uFFFF]+$/),
    vn = C(/^aria-[\-\w]+$/),
    xt = C(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),
    Fn = C(/^(?:\w+script|data):/i),
    Un = C(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
    Hn = C(/^html$/i),
    zn = C(/^[a-z][.\w]*(-[.\w]+)+$/i),
    F = {
        element: 1,
        attribute: 2,
        text: 3,
        cdataSection: 4,
        entityReference: 5,
        entityNode: 6,
        progressingInstruction: 7,
        comment: 8,
        document: 9,
        documentType: 10,
        documentFragment: 11,
        notation: 12
    },
    Gn = function() {
        return typeof window > "u" ? null : window
    },
    Bn = function(o, a) {
        if (typeof o != "object" || typeof o.createPolicy != "function") return null;
        let s = null;
        const u = "data-tt-policy-suffix";
        a && a.hasAttribute(u) && (s = a.getAttribute(u));
        const p = "dompurify" + (s ? "#" + s : "");
        try {
            return o.createPolicy(p, {
                createHTML(E) {
                    return E
                },
                createScriptURL(E) {
                    return E
                }
            })
        } catch {
            return null
        }
    },
    Pt = function() {
        return {
            afterSanitizeAttributes: [],
            afterSanitizeElements: [],
            afterSanitizeShadowDOM: [],
            beforeSanitizeAttributes: [],
            beforeSanitizeElements: [],
            beforeSanitizeShadowDOM: [],
            uponSanitizeAttribute: [],
            uponSanitizeElement: [],
            uponSanitizeShadowNode: []
        }
    };

function Ft() {
    let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Gn();
    const o = i => Ft(i);
    if (o.version = "3.4.7", o.removed = [], !n || !n.document || n.document.nodeType !== F.document || !n.Element) return o.isSupported = !1, o;
    let a = n.document;
    const s = a,
        u = s.currentScript;
    n.DocumentFragment;
    const p = n.HTMLTemplateElement,
        E = n.Node,
        te = n.Element,
        I = n.NodeFilter,
        ne = n.NamedNodeMap;
    ne === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
    const Le = n.DOMParser,
        me = n.trustedTypes,
        B = te.prototype,
        Ut = U(B, "cloneNode"),
        Ht = U(B, "remove"),
        zt = U(B, "nextSibling"),
        pe = U(B, "childNodes"),
        de = U(B, "parentNode"),
        Te = U(B, "shadowRoot"),
        Gt = U(B, "attributes"),
        w = E && E.prototype ? U(E.prototype, "nodeType") : null,
        Y = E && E.prototype ? U(E.prototype, "nodeName") : null;
    if (typeof p == "function") {
        const i = a.createElement("template");
        i.content && i.content.ownerDocument && (a = i.content.ownerDocument)
    }
    let O, oe = "";
    const _e = a,
        Ce = _e.implementation,
        Je = _e.createNodeIterator,
        Bt = _e.createDocumentFragment,
        Wt = _e.getElementsByTagName,
        jt = s.importNode;
    let S = Pt();
    o.isSupported = typeof kt == "function" && typeof de == "function" && Ce && Ce.createHTMLDocument !== void 0;
    const ge = Mn,
        he = xn,
        Ae = Pn,
        Yt = kn,
        $t = vn,
        Xt = Fn,
        Qe = Un,
        Vt = zn;
    let et = xt,
        T = null;
    const we = l({}, [...Lt, ...$e, ...Xe, ...Ve, ...Ct]);
    let h = null;
    const Me = l({}, [...wt, ...qe, ...Mt, ...Ie]);
    let _ = Object.seal(ee(null, {
            tagNameCheck: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: null
            },
            attributeNameCheck: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: null
            },
            allowCustomizedBuiltInElements: {
                writable: !0,
                configurable: !1,
                enumerable: !0,
                value: !1
            }
        })),
        re = null,
        Ee = null;
    const z = Object.seal(ee(null, {
        tagCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null
        },
        attributeCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null
        }
    }));
    let tt = !0,
        xe = !0,
        nt = !1,
        ot = !0,
        G = !1,
        ie = !0,
        W = !1,
        Pe = !1,
        ke = !1,
        $ = !1,
        Se = !1,
        ye = !1,
        rt = !0,
        it = !1;
    const at = "user-content-";
    let ve = !0,
        ae = !1,
        X = {},
        P = null;
    const Fe = l({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let st = null;
    const lt = l({}, ["audio", "video", "img", "source", "image", "track"]);
    let Ue = null;
    const ct = l({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]),
        be = "http://www.w3.org/1998/Math/MathML",
        Re = "http://www.w3.org/2000/svg",
        k = "http://www.w3.org/1999/xhtml";
    let V = k,
        He = !1,
        ze = null;
    const qt = l({}, [be, Re, k], Ye);
    let Ge = l({}, ["mi", "mo", "mn", "ms", "mtext"]),
        Be = l({}, ["annotation-xml"]);
    const Kt = l({}, ["title", "style", "font", "a", "script"]);
    let se = null;
    const Zt = ["application/xhtml+xml", "text/html"],
        Jt = "text/html";
    let g = null,
        q = null;
    const Qt = a.createElement("form"),
        ut = function(e) {
            return e instanceof RegExp || e instanceof Function
        },
        We = function() {
            let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            if (q && q === e) return;
            (!e || typeof e != "object") && (e = {}), e = R(e), se = Zt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? Jt : e.PARSER_MEDIA_TYPE, g = se === "application/xhtml+xml" ? Ye : fe, T = d(e, "ALLOWED_TAGS") && N(e.ALLOWED_TAGS) ? l({}, e.ALLOWED_TAGS, g) : we, h = d(e, "ALLOWED_ATTR") && N(e.ALLOWED_ATTR) ? l({}, e.ALLOWED_ATTR, g) : Me, ze = d(e, "ALLOWED_NAMESPACES") && N(e.ALLOWED_NAMESPACES) ? l({}, e.ALLOWED_NAMESPACES, Ye) : qt, Ue = d(e, "ADD_URI_SAFE_ATTR") && N(e.ADD_URI_SAFE_ATTR) ? l(R(ct), e.ADD_URI_SAFE_ATTR, g) : ct, st = d(e, "ADD_DATA_URI_TAGS") && N(e.ADD_DATA_URI_TAGS) ? l(R(lt), e.ADD_DATA_URI_TAGS, g) : lt, P = d(e, "FORBID_CONTENTS") && N(e.FORBID_CONTENTS) ? l({}, e.FORBID_CONTENTS, g) : Fe, re = d(e, "FORBID_TAGS") && N(e.FORBID_TAGS) ? l({}, e.FORBID_TAGS, g) : R({}), Ee = d(e, "FORBID_ATTR") && N(e.FORBID_ATTR) ? l({}, e.FORBID_ATTR, g) : R({}), X = d(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? R(e.USE_PROFILES) : e.USE_PROFILES : !1, tt = e.ALLOW_ARIA_ATTR !== !1, xe = e.ALLOW_DATA_ATTR !== !1, nt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, ot = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, G = e.SAFE_FOR_TEMPLATES || !1, ie = e.SAFE_FOR_XML !== !1, W = e.WHOLE_DOCUMENT || !1, $ = e.RETURN_DOM || !1, Se = e.RETURN_DOM_FRAGMENT || !1, ye = e.RETURN_TRUSTED_TYPE || !1, ke = e.FORCE_BODY || !1, rt = e.SANITIZE_DOM !== !1, it = e.SANITIZE_NAMED_PROPS || !1, ve = e.KEEP_CONTENT !== !1, ae = e.IN_PLACE || !1, et = Ln(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : xt, V = typeof e.NAMESPACE == "string" ? e.NAMESPACE : k, Ge = d(e, "MATHML_TEXT_INTEGRATION_POINTS") && e.MATHML_TEXT_INTEGRATION_POINTS && typeof e.MATHML_TEXT_INTEGRATION_POINTS == "object" ? R(e.MATHML_TEXT_INTEGRATION_POINTS) : l({}, ["mi", "mo", "mn", "ms", "mtext"]), Be = d(e, "HTML_INTEGRATION_POINTS") && e.HTML_INTEGRATION_POINTS && typeof e.HTML_INTEGRATION_POINTS == "object" ? R(e.HTML_INTEGRATION_POINTS) : l({}, ["annotation-xml"]);
            const t = d(e, "CUSTOM_ELEMENT_HANDLING") && e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING == "object" ? R(e.CUSTOM_ELEMENT_HANDLING) : ee(null);
            if (_ = ee(null), d(t, "tagNameCheck") && ut(t.tagNameCheck) && (_.tagNameCheck = t.tagNameCheck), d(t, "attributeNameCheck") && ut(t.attributeNameCheck) && (_.attributeNameCheck = t.attributeNameCheck), d(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (_.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), G && (xe = !1), Se && ($ = !0), X && (T = l({}, Ct), h = ee(null), X.html === !0 && (l(T, Lt), l(h, wt)), X.svg === !0 && (l(T, $e), l(h, qe), l(h, Ie)), X.svgFilters === !0 && (l(T, Xe), l(h, qe), l(h, Ie)), X.mathMl === !0 && (l(T, Ve), l(h, Mt), l(h, Ie))), z.tagCheck = null, z.attributeCheck = null, d(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? z.tagCheck = e.ADD_TAGS : N(e.ADD_TAGS) && (T === we && (T = R(T)), l(T, e.ADD_TAGS, g))), d(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? z.attributeCheck = e.ADD_ATTR : N(e.ADD_ATTR) && (h === Me && (h = R(h)), l(h, e.ADD_ATTR, g))), d(e, "ADD_URI_SAFE_ATTR") && N(e.ADD_URI_SAFE_ATTR) && l(Ue, e.ADD_URI_SAFE_ATTR, g), d(e, "FORBID_CONTENTS") && N(e.FORBID_CONTENTS) && (P === Fe && (P = R(P)), l(P, e.FORBID_CONTENTS, g)), d(e, "ADD_FORBID_CONTENTS") && N(e.ADD_FORBID_CONTENTS) && (P === Fe && (P = R(P)), l(P, e.ADD_FORBID_CONTENTS, g)), ve && (T["#text"] = !0), W && l(T, ["html", "head", "body"]), T.table && (l(T, ["tbody"]), delete re.tbody), e.TRUSTED_TYPES_POLICY) {
                if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw ue('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
                if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ue('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
                O = e.TRUSTED_TYPES_POLICY, oe = O.createHTML("")
            } else O === void 0 && (O = Bn(me, u)), O !== null && typeof oe == "string" && (oe = O.createHTML(""));
            (S.uponSanitizeElement.length > 0 || S.uponSanitizeAttribute.length > 0) && T === we && (T = R(T)), S.uponSanitizeAttribute.length > 0 && h === Me && (h = R(h)), D && D(e), q = e
        },
        ft = l({}, [...$e, ...Xe, ...Cn]),
        mt = l({}, [...Ve, ...wn]),
        en = function(e) {
            let t = de(e);
            (!t || !t.tagName) && (t = {
                namespaceURI: V,
                tagName: "template"
            });
            const r = fe(e.tagName),
                f = fe(t.tagName);
            return ze[e.namespaceURI] ? e.namespaceURI === Re ? t.namespaceURI === k ? r === "svg" : t.namespaceURI === be ? r === "svg" && (f === "annotation-xml" || Ge[f]) : !!ft[r] : e.namespaceURI === be ? t.namespaceURI === k ? r === "math" : t.namespaceURI === Re ? r === "math" && Be[f] : !!mt[r] : e.namespaceURI === k ? t.namespaceURI === Re && !Be[f] || t.namespaceURI === be && !Ge[f] ? !1 : !mt[r] && (Kt[r] || !ft[r]) : !!(se === "application/xhtml+xml" && ze[e.namespaceURI]) : !1
        },
        M = function(e) {
            J(o.removed, {
                element: e
            });
            try {
                de(e).removeChild(e)
            } catch {
                Ht(e)
            }
        },
        j = function(e, t) {
            try {
                J(o.removed, {
                    attribute: t.getAttributeNode(e),
                    from: t
                })
            } catch {
                J(o.removed, {
                    attribute: null,
                    from: t
                })
            }
            if (t.removeAttribute(e), e === "is")
                if ($ || Se) try {
                    M(t)
                } catch {} else try {
                    t.setAttribute(e, "")
                } catch {}
        },
        pt = function(e) {
            let t = null,
                r = null;
            if (ke) e = "<remove></remove>" + e;
            else {
                const m = Ot(e, /^[\r\n\t ]+/);
                r = m && m[0]
            }
            se === "application/xhtml+xml" && V === k && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
            const f = O ? O.createHTML(e) : e;
            if (V === k) try {
                t = new Le().parseFromString(f, se)
            } catch {}
            if (!t || !t.documentElement) {
                t = Ce.createDocument(V, "template", null);
                try {
                    t.documentElement.innerHTML = He ? oe : f
                } catch {}
            }
            const c = t.body || t.documentElement;
            return e && r && c.insertBefore(a.createTextNode(r), c.childNodes[0] || null), V === k ? Wt.call(t, W ? "html" : "body")[0] : W ? t.documentElement : c
        },
        dt = function(e) {
            return Je.call(e.ownerDocument || e, e, I.SHOW_ELEMENT | I.SHOW_COMMENT | I.SHOW_TEXT | I.SHOW_PROCESSING_INSTRUCTION | I.SHOW_CDATA_SECTION, null)
        },
        Tt = function(e) {
            e.normalize();
            const t = Je.call(e.ownerDocument || e, e, I.SHOW_TEXT | I.SHOW_COMMENT | I.SHOW_CDATA_SECTION | I.SHOW_PROCESSING_INSTRUCTION, null);
            let r = t.nextNode();
            for (; r;) {
                let f = r.data;
                Z([ge, he, Ae], c => {
                    f = Q(f, c, " ")
                }), r.data = f, r = t.nextNode()
            }
        },
        Oe = function(e) {
            const t = Y ? Y(e) : null;
            return typeof t != "string" || g(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== Gt(e) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== w(e) || e.childNodes !== pe(e)
        },
        le = function(e) {
            if (!w || typeof e != "object" || e === null) return !1;
            try {
                return w(e) === F.documentFragment
            } catch {
                return !1
            }
        },
        Ne = function(e) {
            if (!w || typeof e != "object" || e === null) return !1;
            try {
                return typeof w(e) == "number"
            } catch {
                return !1
            }
        };

    function H(i, e, t) {
        Z(i, r => {
            r.call(o, e, t, q)
        })
    }
    const _t = function(e) {
            let t = null;
            if (H(S.beforeSanitizeElements, e, null), Oe(e)) return M(e), !0;
            const r = g(e.nodeName);
            if (H(S.uponSanitizeElement, e, {
                    tagName: r,
                    allowedTags: T
                }), ie && e.hasChildNodes() && !Ne(e.firstElementChild) && b(/<[/\w!]/g, e.innerHTML) && b(/<[/\w!]/g, e.textContent) || ie && e.namespaceURI === k && r === "style" && Ne(e.firstElementChild) || e.nodeType === F.progressingInstruction || ie && e.nodeType === F.comment && b(/<[/\w]/g, e.data)) return M(e), !0;
            if (re[r] || !(z.tagCheck instanceof Function && z.tagCheck(r)) && !T[r]) {
                if (!re[r] && ht(r) && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, r) || _.tagNameCheck instanceof Function && _.tagNameCheck(r))) return !1;
                if (ve && !P[r]) {
                    const c = de(e),
                        m = pe(e);
                    if (m && c) {
                        const L = m.length;
                        for (let v = L - 1; v >= 0; --v) {
                            const x = Ut(m[v], !0);
                            c.insertBefore(x, zt(e))
                        }
                    }
                }
                return M(e), !0
            }
            return (w ? w(e) : e.nodeType) === F.element && !en(e) || (r === "noscript" || r === "noembed" || r === "noframes") && b(/<\/no(script|embed|frames)/i, e.innerHTML) ? (M(e), !0) : (G && e.nodeType === F.text && (t = e.textContent, Z([ge, he, Ae], c => {
                t = Q(t, c, " ")
            }), e.textContent !== t && (J(o.removed, {
                element: e.cloneNode()
            }), e.textContent = t)), H(S.afterSanitizeElements, e, null), !1)
        },
        gt = function(e, t, r) {
            if (Ee[t] || rt && (t === "id" || t === "name") && (r in a || r in Qt)) return !1;
            const f = h[t] || z.attributeCheck instanceof Function && z.attributeCheck(t, e);
            if (!(xe && !Ee[t] && b(Yt, t))) {
                if (!(tt && b($t, t))) {
                    if (!f || Ee[t]) {
                        if (!(ht(e) && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, e) || _.tagNameCheck instanceof Function && _.tagNameCheck(e)) && (_.attributeNameCheck instanceof RegExp && b(_.attributeNameCheck, t) || _.attributeNameCheck instanceof Function && _.attributeNameCheck(t, e)) || t === "is" && _.allowCustomizedBuiltInElements && (_.tagNameCheck instanceof RegExp && b(_.tagNameCheck, r) || _.tagNameCheck instanceof Function && _.tagNameCheck(r)))) return !1
                    } else if (!Ue[t]) {
                        if (!b(et, Q(r, Qe, ""))) {
                            if (!((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Nt(r, "data:") === 0 && st[e])) {
                                if (!(nt && !b(Xt, Q(r, Qe, "")))) {
                                    if (r) return !1
                                }
                            }
                        }
                    }
                }
            }
            return !0
        },
        tn = l({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]),
        ht = function(e) {
            return !tn[fe(e)] && b(Vt, e)
        },
        At = function(e) {
            H(S.beforeSanitizeAttributes, e, null);
            const t = e.attributes;
            if (!t || Oe(e)) return;
            const r = {
                attrName: "",
                attrValue: "",
                keepAttr: !0,
                allowedAttributes: h,
                forceKeepAttr: void 0
            };
            let f = t.length;
            for (; f--;) {
                const c = t[f],
                    m = c.name,
                    L = c.namespaceURI,
                    v = c.value,
                    x = g(m),
                    je = v;
                let y = m === "value" ? je : bn(je);
                if (r.attrName = x, r.attrValue = y, r.keepAttr = !0, r.forceKeepAttr = void 0, H(S.uponSanitizeAttribute, e, r), y = r.attrValue, it && (x === "id" || x === "name") && Nt(y, at) !== 0 && (j(m, e), y = at + y), ie && b(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, y)) {
                    j(m, e);
                    continue
                }
                if (x === "attributename" && Ot(y, "href")) {
                    j(m, e);
                    continue
                }
                if (r.forceKeepAttr) continue;
                if (!r.keepAttr) {
                    j(m, e);
                    continue
                }
                if (!ot && b(/\/>/i, y)) {
                    j(m, e);
                    continue
                }
                G && Z([ge, he, Ae], St => {
                    y = Q(y, St, " ")
                });
                const Et = g(e.nodeName);
                if (!gt(Et, x, y)) {
                    j(m, e);
                    continue
                }
                if (O && typeof me == "object" && typeof me.getAttributeType == "function" && !L) switch (me.getAttributeType(Et, x)) {
                    case "TrustedHTML":
                        {
                            y = O.createHTML(y);
                            break
                        }
                    case "TrustedScriptURL":
                        {
                            y = O.createScriptURL(y);
                            break
                        }
                }
                if (y !== je) try {
                    L ? e.setAttributeNS(L, m, y) : e.setAttribute(m, y), Oe(e) ? M(e) : Rt(o.removed)
                } catch {
                    j(m, e)
                }
            }
            H(S.afterSanitizeAttributes, e, null)
        },
        De = function(e) {
            let t = null;
            const r = dt(e);
            for (H(S.beforeSanitizeShadowDOM, e, null); t = r.nextNode();)
                if (H(S.uponSanitizeShadowNode, t, null), _t(t), At(t), le(t.content) && De(t.content), (w ? w(t) : t.nodeType) === F.element) {
                    const c = Te ? Te(t) : t.shadowRoot;
                    le(c) && (K(c), De(c))
                }
            H(S.afterSanitizeShadowDOM, e, null)
        },
        K = function(e) {
            const t = w ? w(e) : e.nodeType;
            if (t === F.element) {
                const c = Te ? Te(e) : e.shadowRoot;
                le(c) && (K(c), De(c))
            }
            const r = pe ? pe(e) : e.childNodes;
            if (!r) return;
            const f = [];
            Z(r, c => {
                J(f, c)
            });
            for (const c of f) K(c);
            if (t === F.element) {
                const c = Y ? Y(e) : null;
                if (typeof c == "string" && g(c) === "template") {
                    const m = e.content;
                    le(m) && K(m)
                }
            }
        };
    return o.sanitize = function(i) {
        let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            t = null,
            r = null,
            f = null,
            c = null;
        if (He = !i, He && (i = "<!-->"), typeof i != "string" && !Ne(i) && (i = In(i), typeof i != "string")) throw ue("dirty is not a string, aborting");
        if (!o.isSupported) return i;
        if (Pe || We(e), o.removed = [], typeof i == "string" && (ae = !1), ae) {
            const v = Y ? Y(i) : i.nodeName;
            if (typeof v == "string") {
                const x = g(v);
                if (!T[x] || re[x]) throw ue("root node is forbidden and cannot be sanitized in-place")
            }
            if (Oe(i)) throw ue("root node is clobbered and cannot be sanitized in-place");
            K(i)
        } else if (Ne(i)) t = pt("<!---->"), r = t.ownerDocument.importNode(i, !0), r.nodeType === F.element && r.nodeName === "BODY" || r.nodeName === "HTML" ? t = r : t.appendChild(r), K(r);
        else {
            if (!$ && !G && !W && i.indexOf("<") === -1) return O && ye ? O.createHTML(i) : i;
            if (t = pt(i), !t) return $ ? null : ye ? oe : ""
        }
        t && ke && M(t.firstChild);
        const m = dt(ae ? i : t);
        for (; f = m.nextNode();) _t(f), At(f), le(f.content) && De(f.content);
        if (ae) return G && Tt(i), i;
        if ($) {
            if (G && Tt(t), Se)
                for (c = Bt.call(t.ownerDocument); t.firstChild;) c.appendChild(t.firstChild);
            else c = t;
            return (h.shadowroot || h.shadowrootmode) && (c = jt.call(s, c, !0)), c
        }
        let L = W ? t.outerHTML : t.innerHTML;
        return W && T["!doctype"] && t.ownerDocument && t.ownerDocument.doctype && t.ownerDocument.doctype.name && b(Hn, t.ownerDocument.doctype.name) && (L = "<!DOCTYPE " + t.ownerDocument.doctype.name + `>
` + L), G && Z([ge, he, Ae], v => {
            L = Q(L, v, " ")
        }), O && ye ? O.createHTML(L) : L
    }, o.setConfig = function() {
        let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        We(i), Pe = !0
    }, o.clearConfig = function() {
        q = null, Pe = !1
    }, o.isValidAttribute = function(i, e, t) {
        q || We({});
        const r = g(i),
            f = g(e);
        return gt(r, f, t)
    }, o.addHook = function(i, e) {
        typeof e == "function" && J(S[i], e)
    }, o.removeHook = function(i, e) {
        if (e !== void 0) {
            const t = Sn(S[i], e);
            return t === -1 ? void 0 : yn(S[i], t, 1)[0]
        }
        return Rt(S[i])
    }, o.removeHooks = function(i) {
        S[i] = []
    }, o.removeAllHooks = function() {
        S = Pt()
    }, o
}
var Wn = Ft();
const jn = {
        class: "content ar-ua-html"
    },
    Yn = nn({
        __name: "index",
        setup(n) {
            const {
                getFrontdeskProtocolFn: o,
                rule: a
            } = mn(), s = sn(() => {
                const u = fn(a.value);
                return Wn.sanitize(u)
            });
            return on(async () => {
                await o(6)
            }), (u, p) => {
                const E = rn("safe-html");
                return an((cn(), ln("div", jn, null, 512)), [
                    [E, s.value]
                ])
            }
        }
    }),
    qn = un(Yn, [
        ["__scopeId", "data-v-e78af78c"]
    ]);
export {
    qn as r
};