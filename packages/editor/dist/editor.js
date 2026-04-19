import { computed as e, createBlock as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, onBeforeUnmount as a, onMounted as o, openBlock as s, ref as c, shallowRef as l, watch as u, withModifiers as d } from "vue";
import { EditorState as f, Plugin as p, PluginKey as m } from "prosemirror-state";
import { Decoration as h, DecorationSet as g, EditorView as _ } from "prosemirror-view";
import { Schema as v } from "prosemirror-model";
import { MarkdownParser as y, MarkdownSerializer as b } from "prosemirror-markdown";
import { history as x, redo as S, undo as C } from "prosemirror-history";
import { keymap as w } from "prosemirror-keymap";
import { baseKeymap as ee, chainCommands as T, createParagraphNear as te, exitCode as ne, lift as re, liftEmptyBlock as ie, newlineInCode as ae, setBlockType as oe, splitBlock as se, toggleMark as E, wrapIn as ce } from "prosemirror-commands";
import { liftListItem as le, sinkListItem as ue, splitListItem as de, wrapInList as fe } from "prosemirror-schema-list";
import { InputRule as pe, inputRules as me, textblockTypeInputRule as he, undoInputRule as ge, wrappingInputRule as _e } from "prosemirror-inputrules";
//#region \0rolldown/runtime.js
var ve = Object.defineProperty, ye = (e, t) => {
	let n = {};
	for (var r in e) ve(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || ve(n, Symbol.toStringTag, { value: "Module" }), n;
}, be = ["dir"], xe = {
	__name: "Toolbar",
	props: {
		editor: {
			type: Object,
			default: null
		},
		dir: {
			type: String,
			default: "rtl"
		}
	},
	setup(e) {
		let t = e;
		function n(e, ...n) {
			t.editor && t.editor.execCommand(e, ...n);
		}
		return (t, a) => (s(), r("div", {
			class: "editor-toolbar",
			dir: e.dir,
			role: "toolbar"
		}, [
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Bold",
				"aria-label": "Bold",
				onMousedown: a[0] ||= d(() => {}, ["prevent"]),
				onClick: a[1] ||= (e) => n("toggleBold")
			}, [...a[30] ||= [i("strong", null, "B", -1)]], 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Italic",
				"aria-label": "Italic",
				onMousedown: a[2] ||= d(() => {}, ["prevent"]),
				onClick: a[3] ||= (e) => n("toggleItalic")
			}, [...a[31] ||= [i("em", null, "I", -1)]], 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Inline code",
				"aria-label": "Inline code",
				onMousedown: a[4] ||= d(() => {}, ["prevent"]),
				onClick: a[5] ||= (e) => n("toggleCode")
			}, [...a[32] ||= [i("code", null, "{ }", -1)]], 32),
			a[33] ||= i("span", {
				class: "editor-toolbar-sep",
				"aria-hidden": "true"
			}, null, -1),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Paragraph",
				"aria-label": "Paragraph",
				onMousedown: a[6] ||= d(() => {}, ["prevent"]),
				onClick: a[7] ||= (e) => n("setParagraph")
			}, " P ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Heading 1",
				"aria-label": "Heading 1",
				onMousedown: a[8] ||= d(() => {}, ["prevent"]),
				onClick: a[9] ||= (e) => n("toggleHeading", 1)
			}, " H1 ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Heading 2",
				"aria-label": "Heading 2",
				onMousedown: a[10] ||= d(() => {}, ["prevent"]),
				onClick: a[11] ||= (e) => n("toggleHeading", 2)
			}, " H2 ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Heading 3",
				"aria-label": "Heading 3",
				onMousedown: a[12] ||= d(() => {}, ["prevent"]),
				onClick: a[13] ||= (e) => n("toggleHeading", 3)
			}, " H3 ", 32),
			a[34] ||= i("span", {
				class: "editor-toolbar-sep",
				"aria-hidden": "true"
			}, null, -1),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Bullet list",
				"aria-label": "Bullet list",
				onMousedown: a[14] ||= d(() => {}, ["prevent"]),
				onClick: a[15] ||= (e) => n("toggleBulletList")
			}, " • ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Ordered list",
				"aria-label": "Ordered list",
				onMousedown: a[16] ||= d(() => {}, ["prevent"]),
				onClick: a[17] ||= (e) => n("toggleOrderedList")
			}, " 1. ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Blockquote",
				"aria-label": "Blockquote",
				onMousedown: a[18] ||= d(() => {}, ["prevent"]),
				onClick: a[19] ||= (e) => n("toggleBlockquote")
			}, " “ ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Code block",
				"aria-label": "Code block",
				onMousedown: a[20] ||= d(() => {}, ["prevent"]),
				onClick: a[21] ||= (e) => n("toggleCodeBlock")
			}, " </> ", 32),
			a[35] ||= i("span", {
				class: "editor-toolbar-sep",
				"aria-hidden": "true"
			}, null, -1),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Link",
				"aria-label": "Link",
				onMousedown: a[22] ||= d(() => {}, ["prevent"]),
				onClick: a[23] ||= (e) => n("toggleLink")
			}, " 🔗 ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Image",
				"aria-label": "Image",
				onMousedown: a[24] ||= d(() => {}, ["prevent"]),
				onClick: a[25] ||= (e) => n("insertImage")
			}, " 📷 ", 32),
			a[36] ||= i("span", {
				class: "editor-toolbar-sep",
				"aria-hidden": "true"
			}, null, -1),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Undo",
				"aria-label": "Undo",
				onMousedown: a[26] ||= d(() => {}, ["prevent"]),
				onClick: a[27] ||= (e) => n("undo")
			}, " ↶ ", 32),
			i("button", {
				type: "button",
				class: "editor-toolbar-btn",
				title: "Redo",
				"aria-label": "Redo",
				onMousedown: a[28] ||= d(() => {}, ["prevent"]),
				onClick: a[29] ||= (e) => n("redo")
			}, " ↷ ", 32)
		], 8, be));
	}
}, Se = ["p", 0], Ce = ["blockquote", 0], we = ["br"], Te = ["li", 0], Ee = ["em", 0], De = ["strong", 0], Oe = ["code", 0], ke = 3, Ae = {
	doc: { content: "block+" },
	paragraph: {
		content: "inline*",
		group: "block",
		parseDOM: [{ tag: "p" }],
		toDOM() {
			return Se;
		}
	},
	blockquote: {
		content: "block+",
		group: "block",
		defining: !0,
		parseDOM: [{ tag: "blockquote" }],
		toDOM() {
			return Ce;
		}
	},
	heading: {
		attrs: { level: { default: 1 } },
		content: "inline*",
		group: "block",
		defining: !0,
		parseDOM: [
			{
				tag: "h1",
				attrs: { level: 1 }
			},
			{
				tag: "h2",
				attrs: { level: 2 }
			},
			{
				tag: "h3",
				attrs: { level: 3 }
			},
			{
				tag: "h4",
				attrs: { level: 3 }
			},
			{
				tag: "h5",
				attrs: { level: 3 }
			},
			{
				tag: "h6",
				attrs: { level: 3 }
			}
		],
		toDOM(e) {
			return ["h" + Math.min(Math.max(e.attrs.level, 1), 3), 0];
		}
	},
	code_block: {
		content: "text*",
		marks: "",
		group: "block",
		code: !0,
		defining: !0,
		attrs: { params: { default: "" } },
		parseDOM: [{
			tag: "pre",
			preserveWhitespace: "full",
			getAttrs: (e) => ({ params: e.getAttribute("data-params") || "" })
		}],
		toDOM(e) {
			return [
				"pre",
				e.attrs.params ? { "data-params": e.attrs.params } : {},
				["code", 0]
			];
		}
	},
	ordered_list: {
		content: "list_item+",
		group: "block",
		attrs: {
			order: { default: 1 },
			tight: { default: !1 }
		},
		parseDOM: [{
			tag: "ol",
			getAttrs(e) {
				return {
					order: e.hasAttribute("start") ? +e.getAttribute("start") : 1,
					tight: e.hasAttribute("data-tight")
				};
			}
		}],
		toDOM(e) {
			return [
				"ol",
				{
					start: e.attrs.order === 1 ? null : e.attrs.order,
					"data-tight": e.attrs.tight ? "true" : null
				},
				0
			];
		}
	},
	bullet_list: {
		content: "list_item+",
		group: "block",
		attrs: { tight: { default: !1 } },
		parseDOM: [{
			tag: "ul",
			getAttrs: (e) => ({ tight: e.hasAttribute("data-tight") })
		}],
		toDOM(e) {
			return [
				"ul",
				{ "data-tight": e.attrs.tight ? "true" : null },
				0
			];
		}
	},
	list_item: {
		content: "paragraph block*",
		defining: !0,
		parseDOM: [{ tag: "li" }],
		toDOM() {
			return Te;
		}
	},
	text: { group: "inline" },
	image: {
		inline: !0,
		attrs: {
			src: {},
			alt: { default: null },
			title: { default: null }
		},
		group: "inline",
		draggable: !0,
		parseDOM: [{
			tag: "img[src]",
			getAttrs(e) {
				return {
					src: e.getAttribute("src"),
					title: e.getAttribute("title"),
					alt: e.getAttribute("alt")
				};
			}
		}],
		toDOM(e) {
			let { src: t, alt: n, title: r } = e.attrs;
			return ["img", {
				src: t,
				alt: n,
				title: r,
				loading: "lazy"
			}];
		}
	},
	hard_break: {
		inline: !0,
		group: "inline",
		selectable: !1,
		parseDOM: [{ tag: "br" }],
		toDOM() {
			return we;
		}
	}
}, je = {
	em: {
		parseDOM: [
			{ tag: "i" },
			{ tag: "em" },
			{ style: "font-style=italic" },
			{
				style: "font-style=normal",
				clearMark: (e) => e.type.name === "em"
			}
		],
		toDOM() {
			return Ee;
		}
	},
	strong: {
		parseDOM: [
			{ tag: "strong" },
			{
				tag: "b",
				getAttrs: (e) => e.style.fontWeight !== "normal" && null
			},
			{
				style: "font-weight=400",
				clearMark: (e) => e.type.name === "strong"
			},
			{
				style: "font-weight",
				getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
			}
		],
		toDOM() {
			return De;
		}
	},
	link: {
		attrs: {
			href: {},
			title: { default: null }
		},
		inclusive: !1,
		parseDOM: [{
			tag: "a[href]",
			getAttrs(e) {
				return {
					href: e.getAttribute("href"),
					title: e.getAttribute("title")
				};
			}
		}],
		toDOM(e) {
			let { href: t, title: n } = e.attrs;
			return [
				"a",
				{
					href: t,
					title: n
				},
				0
			];
		}
	},
	code: {
		code: !0,
		parseDOM: [{ tag: "code" }],
		toDOM() {
			return Oe;
		}
	}
}, Me = new v({
	nodes: Ae,
	marks: je
});
function Ne({ images: e = !0, links: t = !0 } = {}) {
	if (e && t) return Me;
	let n = { ...Ae };
	e || delete n.image;
	let r = { ...je };
	return t || delete r.link, new v({
		nodes: n,
		marks: r
	});
}
//#endregion
//#region ../../node_modules/mdurl/lib/decode.mjs
var Pe = {};
function Fe(e) {
	let t = Pe[e];
	if (t) return t;
	t = Pe[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		t.push(n);
	}
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		t[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
	}
	return t;
}
function D(e, t) {
	typeof t != "string" && (t = D.defaultChars);
	let n = Fe(t);
	return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
		let t = "";
		for (let r = 0, i = e.length; r < i; r += 3) {
			let a = parseInt(e.slice(r + 1, r + 3), 16);
			if (a < 128) {
				t += n[a];
				continue;
			}
			if ((a & 224) == 192 && r + 3 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16);
				if ((n & 192) == 128) {
					let e = a << 6 & 1984 | n & 63;
					e < 128 ? t += "��" : t += String.fromCharCode(e), r += 3;
					continue;
				}
			}
			if ((a & 240) == 224 && r + 6 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16);
				if ((n & 192) == 128 && (i & 192) == 128) {
					let e = a << 12 & 61440 | n << 6 & 4032 | i & 63;
					e < 2048 || e >= 55296 && e <= 57343 ? t += "���" : t += String.fromCharCode(e), r += 6;
					continue;
				}
			}
			if ((a & 248) == 240 && r + 9 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16), o = parseInt(e.slice(r + 10, r + 12), 16);
				if ((n & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
					let e = a << 18 & 1835008 | n << 12 & 258048 | i << 6 & 4032 | o & 63;
					e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), r += 9;
					continue;
				}
			}
			t += "�";
		}
		return t;
	});
}
D.defaultChars = ";/?:@&=+$,#", D.componentChars = "";
//#endregion
//#region ../../node_modules/mdurl/lib/encode.mjs
var Ie = {};
function Le(e) {
	let t = Ie[e];
	if (t) return t;
	t = Ie[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function O(e, t, n) {
	typeof t != "string" && (n = t, t = O.defaultChars), n === void 0 && (n = !0);
	let r = Le(t), i = "";
	for (let t = 0, a = e.length; t < a; t++) {
		let o = e.charCodeAt(t);
		if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
			i += e.slice(t, t + 3), t += 2;
			continue;
		}
		if (o < 128) {
			i += r[o];
			continue;
		}
		if (o >= 55296 && o <= 57343) {
			if (o >= 55296 && o <= 56319 && t + 1 < a) {
				let n = e.charCodeAt(t + 1);
				if (n >= 56320 && n <= 57343) {
					i += encodeURIComponent(e[t] + e[t + 1]), t++;
					continue;
				}
			}
			i += "%EF%BF%BD";
			continue;
		}
		i += encodeURIComponent(e[t]);
	}
	return i;
}
O.defaultChars = ";/?:@&=+$,-_.!~*'()#", O.componentChars = "-_.!~*'()";
//#endregion
//#region ../../node_modules/mdurl/lib/format.mjs
function Re(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region ../../node_modules/mdurl/lib/parse.mjs
function ze() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var Be = /^([a-z0-9.+-]+:)/i, Ve = /:[0-9]*$/, He = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Ue = [
	"%",
	"/",
	"?",
	";",
	"#",
	"'",
	"{",
	"}",
	"|",
	"\\",
	"^",
	"`",
	"<",
	">",
	"\"",
	"`",
	" ",
	"\r",
	"\n",
	"	"
], We = [
	"/",
	"?",
	"#"
], Ge = 255, Ke = /^[+a-z0-9A-Z_-]{0,63}$/, qe = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Je = {
	javascript: !0,
	"javascript:": !0
}, Ye = {
	http: !0,
	https: !0,
	ftp: !0,
	gopher: !0,
	file: !0,
	"http:": !0,
	"https:": !0,
	"ftp:": !0,
	"gopher:": !0,
	"file:": !0
};
function Xe(e, t) {
	if (e && e instanceof ze) return e;
	let n = new ze();
	return n.parse(e, t), n;
}
ze.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = He.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = Be.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Je[o]) && (a = a.substr(2), this.slashes = !0)), !Je[o] && (i || o && !Ye[o])) {
		let e = -1;
		for (let t = 0; t < We.length; t++) r = a.indexOf(We[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Ue.length; t++) r = a.indexOf(Ue[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(Ke)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(Ke)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(qe);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > Ge && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), Ye[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, ze.prototype.parseHost = function(e) {
	let t = Ve.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region ../../node_modules/mdurl/index.mjs
var Ze = /* @__PURE__ */ ye({
	decode: () => D,
	encode: () => O,
	format: () => Re,
	parse: () => Xe
}), Qe = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, $e = /[\0-\x1F\x7F-\x9F]/, et = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, tt = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, nt = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, rt = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, it = /* @__PURE__ */ ye({
	Any: () => Qe,
	Cc: () => $e,
	Cf: () => et,
	P: () => tt,
	S: () => nt,
	Z: () => rt
}), at = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((e) => e.charCodeAt(0))), ot = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((e) => e.charCodeAt(0))), st = new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]), ct = String.fromCodePoint ?? function(e) {
	let t = "";
	return e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | e & 1023), t += String.fromCharCode(e), t;
};
function lt(e) {
	return e >= 55296 && e <= 57343 || e > 1114111 ? 65533 : st.get(e) ?? e;
}
//#endregion
//#region ../../node_modules/markdown-it/node_modules/entities/lib/esm/decode.js
var k;
(function(e) {
	e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_F = 102] = "LOWER_F", e[e.LOWER_X = 120] = "LOWER_X", e[e.LOWER_Z = 122] = "LOWER_Z", e[e.UPPER_A = 65] = "UPPER_A", e[e.UPPER_F = 70] = "UPPER_F", e[e.UPPER_Z = 90] = "UPPER_Z";
})(k ||= {});
var ut = 32, A;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE";
})(A ||= {});
function dt(e) {
	return e >= k.ZERO && e <= k.NINE;
}
function ft(e) {
	return e >= k.UPPER_A && e <= k.UPPER_F || e >= k.LOWER_A && e <= k.LOWER_F;
}
function pt(e) {
	return e >= k.UPPER_A && e <= k.UPPER_Z || e >= k.LOWER_A && e <= k.LOWER_Z || dt(e);
}
function mt(e) {
	return e === k.EQUALS || pt(e);
}
var j;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(j ||= {});
var M;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(M ||= {});
var ht = class {
	constructor(e, t, n) {
		this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = j.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = M.Strict;
	}
	startEntity(e) {
		this.decodeMode = e, this.state = j.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
	}
	write(e, t) {
		switch (this.state) {
			case j.EntityStart: return e.charCodeAt(t) === k.NUM ? (this.state = j.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = j.NamedEntity, this.stateNamedEntity(e, t));
			case j.NumericStart: return this.stateNumericStart(e, t);
			case j.NumericDecimal: return this.stateNumericDecimal(e, t);
			case j.NumericHex: return this.stateNumericHex(e, t);
			case j.NamedEntity: return this.stateNamedEntity(e, t);
		}
	}
	stateNumericStart(e, t) {
		return t >= e.length ? -1 : (e.charCodeAt(t) | ut) === k.LOWER_X ? (this.state = j.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = j.NumericDecimal, this.stateNumericDecimal(e, t));
	}
	addToNumericResult(e, t, n, r) {
		if (t !== n) {
			let i = n - t;
			this.result = this.result * r ** +i + parseInt(e.substr(t, i), r), this.consumed += i;
		}
	}
	stateNumericHex(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (dt(r) || ft(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
		}
		return this.addToNumericResult(e, n, t, 16), -1;
	}
	stateNumericDecimal(e, t) {
		let n = t;
		for (; t < e.length;) {
			let r = e.charCodeAt(t);
			if (dt(r)) t += 1;
			else return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
		}
		return this.addToNumericResult(e, n, t, 10), -1;
	}
	emitNumericEntity(e, t) {
		var n;
		if (this.consumed <= t) return (n = this.errors) == null || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
		if (e === k.SEMI) this.consumed += 1;
		else if (this.decodeMode === M.Strict) return 0;
		return this.emitCodePoint(lt(this.result), this.consumed), this.errors && (e !== k.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
	}
	stateNamedEntity(e, t) {
		let { decodeTree: n } = this, r = n[this.treeIndex], i = (r & A.VALUE_LENGTH) >> 14;
		for (; t < e.length; t++, this.excess++) {
			let a = e.charCodeAt(t);
			if (this.treeIndex = _t(n, r, this.treeIndex + Math.max(1, i), a), this.treeIndex < 0) return this.result === 0 || this.decodeMode === M.Attribute && (i === 0 || mt(a)) ? 0 : this.emitNotTerminatedNamedEntity();
			if (r = n[this.treeIndex], i = (r & A.VALUE_LENGTH) >> 14, i !== 0) {
				if (a === k.SEMI) return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
				this.decodeMode !== M.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
			}
		}
		return -1;
	}
	emitNotTerminatedNamedEntity() {
		var e;
		let { result: t, decodeTree: n } = this, r = (n[t] & A.VALUE_LENGTH) >> 14;
		return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(), this.consumed;
	}
	emitNamedEntityData(e, t, n) {
		let { decodeTree: r } = this;
		return this.emitCodePoint(t === 1 ? r[e] & ~A.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
	}
	end() {
		var e;
		switch (this.state) {
			case j.NamedEntity: return this.result !== 0 && (this.decodeMode !== M.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case j.NumericDecimal: return this.emitNumericEntity(0, 2);
			case j.NumericHex: return this.emitNumericEntity(0, 3);
			case j.NumericStart: return (e = this.errors) == null || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
			case j.EntityStart: return 0;
		}
	}
};
function gt(e) {
	let t = "", n = new ht(e, (e) => t += ct(e));
	return function(e, r) {
		let i = 0, a = 0;
		for (; (a = e.indexOf("&", a)) >= 0;) {
			t += e.slice(i, a), n.startEntity(r);
			let o = n.write(e, a + 1);
			if (o < 0) {
				i = a + n.end();
				break;
			}
			i = a + o, a = o === 0 ? i + 1 : i;
		}
		let o = t + e.slice(i);
		return t = "", o;
	};
}
function _t(e, t, n, r) {
	let i = (t & A.BRANCH_LENGTH) >> 7, a = t & A.JUMP_TABLE;
	if (i === 0) return a !== 0 && r === a ? n : -1;
	if (a) {
		let t = r - a;
		return t < 0 || t >= i ? -1 : e[n + t] - 1;
	}
	let o = n, s = o + i - 1;
	for (; o <= s;) {
		let t = o + s >>> 1, n = e[t];
		if (n < r) o = t + 1;
		else if (n > r) s = t - 1;
		else return e[t + i];
	}
	return -1;
}
var vt = gt(at);
gt(ot);
function yt(e, t = M.Legacy) {
	return vt(e, t);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/common/utils.mjs
var bt = /* @__PURE__ */ ye({
	arrayReplaceAt: () => Et,
	assign: () => Tt,
	escapeHtml: () => P,
	escapeRE: () => zt,
	fromCodePoint: () => Ot,
	has: () => wt,
	isMdAsciiPunct: () => R,
	isPunctChar: () => L,
	isSpace: () => F,
	isString: () => St,
	isValidEntityCode: () => Dt,
	isWhiteSpace: () => I,
	lib: () => Vt,
	normalizeReference: () => Bt,
	unescapeAll: () => N,
	unescapeMd: () => Nt
});
function xt(e) {
	return Object.prototype.toString.call(e);
}
function St(e) {
	return xt(e) === "[object String]";
}
var Ct = Object.prototype.hasOwnProperty;
function wt(e, t) {
	return Ct.call(e, t);
}
function Tt(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		if (t) {
			if (typeof t != "object") throw TypeError(t + "must be object");
			Object.keys(t).forEach(function(n) {
				e[n] = t[n];
			});
		}
	}), e;
}
function Et(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Dt(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function Ot(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var kt = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, At = RegExp(kt.source + "|&([a-z#][a-z0-9]{1,31});", "gi"), jt = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Mt(e, t) {
	if (t.charCodeAt(0) === 35 && jt.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return Dt(n) ? Ot(n) : e;
	}
	let n = yt(e);
	return n === e ? e : n;
}
function Nt(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(kt, "$1");
}
function N(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(At, function(e, t, n) {
		return t || Mt(e, n);
	});
}
var Pt = /[&<>"]/, Ft = /[&<>"]/g, It = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Lt(e) {
	return It[e];
}
function P(e) {
	return Pt.test(e) ? e.replace(Ft, Lt) : e;
}
var Rt = /[.?*+^$[\]\\(){}|-]/g;
function zt(e) {
	return e.replace(Rt, "\\$&");
}
function F(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function I(e) {
	if (e >= 8192 && e <= 8202) return !0;
	switch (e) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return !0;
	}
	return !1;
}
function L(e) {
	return tt.test(e) || nt.test(e);
}
function R(e) {
	switch (e) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Bt(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
var Vt = {
	mdurl: Ze,
	ucmicro: it
};
//#endregion
//#region ../../node_modules/markdown-it/lib/helpers/parse_link_label.mjs
function Ht(e, t, n) {
	let r, i, a, o, s = e.posMax, c = e.pos;
	for (e.pos = t + 1, r = 1; e.pos < s;) {
		if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
			i = !0;
			break;
		}
		if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
			if (o === e.pos - 1) r++;
			else if (n) return e.pos = c, -1;
		}
	}
	let l = -1;
	return i && (l = e.pos), e.pos = c, l;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/helpers/parse_link_destination.mjs
function Ut(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = N(e.slice(t + 1, i)), a.ok = !0, a;
			if (r === 92 && i + 1 < n) {
				i += 2;
				continue;
			}
			i++;
		}
		return a;
	}
	let o = 0;
	for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
		if (r === 92 && i + 1 < n) {
			if (e.charCodeAt(i + 1) === 32) break;
			i += 2;
			continue;
		}
		if (r === 40 && (o++, o > 32)) return a;
		if (r === 41) {
			if (o === 0) break;
			o--;
		}
		i++;
	}
	return t === i || o !== 0 ? a : (a.str = N(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/helpers/parse_link_title.mjs
function Wt(e, t, n, r) {
	let i, a = t, o = {
		ok: !1,
		can_continue: !1,
		pos: 0,
		str: "",
		marker: 0
	};
	if (r) o.str = r.str, o.marker = r.marker;
	else {
		if (a >= n) return o;
		let r = e.charCodeAt(a);
		if (r !== 34 && r !== 39 && r !== 40) return o;
		t++, a++, r === 40 && (r = 41), o.marker = r;
	}
	for (; a < n;) {
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += N(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += N(e.slice(t, a)), o;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/helpers/index.mjs
var Gt = /* @__PURE__ */ ye({
	parseLinkDestination: () => Ut,
	parseLinkLabel: () => Ht,
	parseLinkTitle: () => Wt
}), z = {};
z.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return "<code" + i.renderAttrs(a) + ">" + P(a.content) + "</code>";
}, z.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return "<pre" + i.renderAttrs(a) + "><code>" + P(e[t].content) + "</code></pre>\n";
}, z.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? N(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || P(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", n.langPrefix + s]) : (t[e] = t[e].slice(), t[e][1] += " " + n.langPrefix + s);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, z.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, z.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, z.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, z.text = function(e, t) {
	return P(e[t].content);
}, z.html_block = function(e, t) {
	return e[t].content;
}, z.html_inline = function(e, t) {
	return e[t].content;
};
function B() {
	this.rules = Tt({}, z);
}
B.prototype.renderAttrs = function(e) {
	let t, n, r;
	if (!e.attrs) return "";
	for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += " " + P(e.attrs[t][0]) + "=\"" + P(e.attrs[t][1]) + "\"";
	return r;
}, B.prototype.renderToken = function(e, t, n) {
	let r = e[t], i = "";
	if (r.hidden) return "";
	r.block && r.nesting !== -1 && t && e[t - 1].hidden && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
	let a = !1;
	if (r.block && (a = !0, r.nesting === 1 && t + 1 < e.length)) {
		let n = e[t + 1];
		(n.type === "inline" || n.hidden || n.nesting === -1 && n.tag === r.tag) && (a = !1);
	}
	return i += a ? ">\n" : ">", i;
}, B.prototype.renderInline = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
	}
	return r;
}, B.prototype.renderInlineAsText = function(e, t, n) {
	let r = "";
	for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
		case "text":
			r += e[i].content;
			break;
		case "image":
			r += this.renderInlineAsText(e[i].children, t, n);
			break;
		case "html_inline":
		case "html_block":
			r += e[i].content;
			break;
		case "softbreak":
		case "hardbreak":
			r += "\n";
			break;
		default:
	}
	return r;
}, B.prototype.render = function(e, t, n) {
	let r = "", i = this.rules;
	for (let a = 0, o = e.length; a < o; a++) {
		let o = e[a].type;
		o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t, n) : r += i[o](e, a, t, n, this);
	}
	return r;
};
//#endregion
//#region ../../node_modules/markdown-it/lib/ruler.mjs
function V() {
	this.__rules__ = [], this.__cache__ = null;
}
V.prototype.__find__ = function(e) {
	for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
	return -1;
}, V.prototype.__compile__ = function() {
	let e = this, t = [""];
	e.__rules__.forEach(function(e) {
		e.enabled && e.alt.forEach(function(e) {
			t.indexOf(e) < 0 && t.push(e);
		});
	}), e.__cache__ = {}, t.forEach(function(t) {
		e.__cache__[t] = [], e.__rules__.forEach(function(n) {
			n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));
		});
	});
}, V.prototype.at = function(e, t, n) {
	let r = this.__find__(e), i = n || {};
	if (r === -1) throw Error("Parser rule not found: " + e);
	this.__rules__[r].fn = t, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
}, V.prototype.before = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, V.prototype.after = function(e, t, n, r) {
	let i = this.__find__(e), a = r || {};
	if (i === -1) throw Error("Parser rule not found: " + e);
	this.__rules__.splice(i + 1, 0, {
		name: t,
		enabled: !0,
		fn: n,
		alt: a.alt || []
	}), this.__cache__ = null;
}, V.prototype.push = function(e, t, n) {
	let r = n || {};
	this.__rules__.push({
		name: e,
		enabled: !0,
		fn: t,
		alt: r.alt || []
	}), this.__cache__ = null;
}, V.prototype.enable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !0, n.push(e);
	}, this), this.__cache__ = null, n;
}, V.prototype.enableOnly = function(e, t) {
	Array.isArray(e) || (e = [e]), this.__rules__.forEach(function(e) {
		e.enabled = !1;
	}), this.enable(e, t);
}, V.prototype.disable = function(e, t) {
	Array.isArray(e) || (e = [e]);
	let n = [];
	return e.forEach(function(e) {
		let r = this.__find__(e);
		if (r < 0) {
			if (t) return;
			throw Error("Rules manager: invalid rule name " + e);
		}
		this.__rules__[r].enabled = !1, n.push(e);
	}, this), this.__cache__ = null, n;
}, V.prototype.getRules = function(e) {
	return this.__cache__ === null && this.__compile__(), this.__cache__[e] || [];
};
//#endregion
//#region ../../node_modules/markdown-it/lib/token.mjs
function H(e, t, n) {
	this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
H.prototype.attrIndex = function(e) {
	if (!this.attrs) return -1;
	let t = this.attrs;
	for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
	return -1;
}, H.prototype.attrPush = function(e) {
	this.attrs ? this.attrs.push(e) : this.attrs = [e];
}, H.prototype.attrSet = function(e, t) {
	let n = this.attrIndex(e), r = [e, t];
	n < 0 ? this.attrPush(r) : this.attrs[n] = r;
}, H.prototype.attrGet = function(e) {
	let t = this.attrIndex(e), n = null;
	return t >= 0 && (n = this.attrs[t][1]), n;
}, H.prototype.attrJoin = function(e, t) {
	let n = this.attrIndex(e);
	n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
};
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/state_core.mjs
function Kt(e, t, n) {
	this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;
}
Kt.prototype.Token = H;
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/normalize.mjs
var qt = /\r\n?|\n/g, Jt = /\0/g;
function Yt(e) {
	let t;
	t = e.src.replace(qt, "\n"), t = t.replace(Jt, "�"), e.src = t;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/block.mjs
function Xt(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/inline.mjs
function Zt(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/linkify.mjs
function Qt(e) {
	return /^<a[>\s]/i.test(e);
}
function $t(e) {
	return /^<\/a\s*>/i.test(e);
}
function en(e) {
	let t = e.tokens;
	if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
		if (t[n].type !== "inline" || !e.md.linkify.pretest(t[n].content)) continue;
		let r = t[n].children, i = 0;
		for (let a = r.length - 1; a >= 0; a--) {
			let o = r[a];
			if (o.type === "link_close") {
				for (a--; r[a].level !== o.level && r[a].type !== "link_open";) a--;
				continue;
			}
			if (o.type === "html_inline" && (Qt(o.content) && i > 0 && i--, $t(o.content) && i++), !(i > 0) && o.type === "text" && e.md.linkify.test(o.content)) {
				let i = o.content, s = e.md.linkify.match(i), c = [], l = o.level, u = 0;
				s.length > 0 && s[0].index === 0 && a > 0 && r[a - 1].type === "text_special" && (s = s.slice(1));
				for (let t = 0; t < s.length; t++) {
					let n = s[t].url, r = e.md.normalizeLink(n);
					if (!e.md.validateLink(r)) continue;
					let a = s[t].text;
					a = s[t].schema ? s[t].schema === "mailto:" && !/^mailto:/i.test(a) ? e.md.normalizeLinkText("mailto:" + a).replace(/^mailto:/, "") : e.md.normalizeLinkText(a) : e.md.normalizeLinkText("http://" + a).replace(/^http:\/\//, "");
					let o = s[t].index;
					if (o > u) {
						let t = new e.Token("text", "", 0);
						t.content = i.slice(u, o), t.level = l, c.push(t);
					}
					let d = new e.Token("link_open", "a", 1);
					d.attrs = [["href", r]], d.level = l++, d.markup = "linkify", d.info = "auto", c.push(d);
					let f = new e.Token("text", "", 0);
					f.content = a, f.level = l, c.push(f);
					let p = new e.Token("link_close", "a", -1);
					p.level = --l, p.markup = "linkify", p.info = "auto", c.push(p), u = s[t].lastIndex;
				}
				if (u < i.length) {
					let t = new e.Token("text", "", 0);
					t.content = i.slice(u), t.level = l, c.push(t);
				}
				t[n].children = r = Et(r, a, c);
			}
		}
	}
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/replacements.mjs
var tn = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, nn = /\((c|tm|r)\)/i, rn = /\((c|tm|r)\)/gi, an = {
	c: "©",
	r: "®",
	tm: "™"
};
function on(e, t) {
	return an[t.toLowerCase()];
}
function sn(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(rn, on)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function cn(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && tn.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function ln(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (nn.test(e.tokens[t].content) && sn(e.tokens[t].children), tn.test(e.tokens[t].content) && cn(e.tokens[t].children));
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/smartquotes.mjs
var un = /['"]/, dn = /['"]/g, fn = "’";
function pn(e, t, n) {
	return e.slice(0, t) + n + e.slice(t + 1);
}
function mn(e, t) {
	let n, r = [];
	for (let i = 0; i < e.length; i++) {
		let a = e[i], o = e[i].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= o); n--);
		if (r.length = n + 1, a.type !== "text") continue;
		let s = a.content, c = 0, l = s.length;
		OUTER: for (; c < l;) {
			dn.lastIndex = c;
			let u = dn.exec(s);
			if (!u) break;
			let d = !0, f = !0;
			c = u.index + 1;
			let p = u[0] === "'", m = 32;
			if (u.index - 1 >= 0) m = s.charCodeAt(u.index - 1);
			else for (n = i - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--) if (e[n].content) {
				m = e[n].content.charCodeAt(e[n].content.length - 1);
				break;
			}
			let h = 32;
			if (c < l) h = s.charCodeAt(c);
			else for (n = i + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++) if (e[n].content) {
				h = e[n].content.charCodeAt(0);
				break;
			}
			let g = R(m) || L(String.fromCharCode(m)), _ = R(h) || L(String.fromCharCode(h)), v = I(m), y = I(h);
			if (y ? d = !1 : _ && (v || g || (d = !1)), v ? f = !1 : g && (y || _ || (f = !1)), h === 34 && u[0] === "\"" && m >= 48 && m <= 57 && (f = d = !1), d && f && (d = g, f = _), !d && !f) {
				p && (a.content = pn(a.content, u.index, fn));
				continue;
			}
			if (f) for (n = r.length - 1; n >= 0; n--) {
				let d = r[n];
				if (r[n].level < o) break;
				if (d.single === p && r[n].level === o) {
					d = r[n];
					let o, f;
					p ? (o = t.md.options.quotes[2], f = t.md.options.quotes[3]) : (o = t.md.options.quotes[0], f = t.md.options.quotes[1]), a.content = pn(a.content, u.index, f), e[d.token].content = pn(e[d.token].content, d.pos, o), c += f.length - 1, d.token === i && (c += o.length - 1), s = a.content, l = s.length, r.length = n;
					continue OUTER;
				}
			}
			d ? r.push({
				token: i,
				pos: u.index,
				single: p,
				level: o
			}) : f && p && (a.content = pn(a.content, u.index, fn));
		}
	}
}
function hn(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type !== "inline" || !un.test(e.tokens[t].content) || mn(e.tokens[t].children, e);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_core/text_join.mjs
function gn(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text");
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
//#endregion
//#region ../../node_modules/markdown-it/lib/parser_core.mjs
var _n = [
	["normalize", Yt],
	["block", Xt],
	["inline", Zt],
	["linkify", en],
	["replacements", ln],
	["smartquotes", hn],
	["text_join", gn]
];
function vn() {
	this.ruler = new V();
	for (let e = 0; e < _n.length; e++) this.ruler.push(_n[e][0], _n[e][1]);
}
vn.prototype.process = function(e) {
	let t = this.ruler.getRules("");
	for (let n = 0, r = t.length; n < r; n++) t[n](e);
}, vn.prototype.State = Kt;
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/state_block.mjs
function U(e, t, n, r) {
	this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
	let i = this.src;
	for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
		let s = i.charCodeAt(t);
		if (!o) if (F(s)) {
			n++, s === 9 ? r += 4 - r % 4 : r++;
			continue;
		} else o = !0;
		(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
	}
	this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
U.prototype.push = function(e, t, n) {
	let r = new H(e, t, n);
	return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
}, U.prototype.isEmpty = function(e) {
	return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
}, U.prototype.skipEmptyLines = function(e) {
	for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
	return e;
}, U.prototype.skipSpaces = function(e) {
	for (let t = this.src.length; e < t && F(this.src.charCodeAt(e)); e++);
	return e;
}, U.prototype.skipSpacesBack = function(e, t) {
	if (e <= t) return e;
	for (; e > t;) if (!F(this.src.charCodeAt(--e))) return e + 1;
	return e;
}, U.prototype.skipChars = function(e, t) {
	for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
	return e;
}, U.prototype.skipCharsBack = function(e, t, n) {
	if (e <= n) return e;
	for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
	return e;
}, U.prototype.getLines = function(e, t, n, r) {
	if (e >= t) return "";
	let i = Array(t - e);
	for (let a = 0, o = e; o < t; o++, a++) {
		let e = 0, s = this.bMarks[o], c = s, l;
		for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
			let t = this.src.charCodeAt(c);
			if (F(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
			else if (c - s < this.tShift[o]) e++;
			else break;
			c++;
		}
		e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
	}
	return i.join("");
}, U.prototype.Token = H;
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/table.mjs
var yn = 65536;
function bn(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function xn(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Sn(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !F(s) || o === 45 && F(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !F(t)) return !1;
		a++;
	}
	let c = bn(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = bn(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = xn(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
	let d = l.length;
	if (d === 0 || d !== u.length) return !1;
	if (r) return !0;
	let f = e.parentType;
	e.parentType = "table";
	let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
	m.map = h;
	let g = e.push("thead_open", "thead", 1);
	g.map = [t, t + 1];
	let _ = e.push("tr_open", "tr", 1);
	_.map = [t, t + 1];
	for (let t = 0; t < l.length; t++) {
		let n = e.push("th_open", "th", 1);
		u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
		let r = e.push("inline", "", 0);
		r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
	}
	e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
	let v, y = 0;
	for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
		let r = !1;
		for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
			r = !0;
			break;
		}
		if (r || (c = bn(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = xn(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > yn)) break;
		if (i === t + 2) {
			let n = e.push("tbody_open", "tbody", 1);
			n.map = v = [t + 2, 0];
		}
		let a = e.push("tr_open", "tr", 1);
		a.map = [i, i + 1];
		for (let t = 0; t < d; t++) {
			let n = e.push("td_open", "td", 1);
			u[t] && (n.attrs = [["style", "text-align:" + u[t]]]);
			let r = e.push("inline", "", 0);
			r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
		}
		e.push("tr_close", "tr", -1);
	}
	return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/code.mjs
function Cn(e, t, n) {
	if (e.sCount[t] - e.blkIndent < 4) return !1;
	let r = t + 1, i = r;
	for (; r < n;) {
		if (e.isEmpty(r)) {
			r++;
			continue;
		}
		if (e.sCount[r] - e.blkIndent >= 4) {
			r++, i = r;
			continue;
		}
		break;
	}
	e.line = i;
	let a = e.push("code_block", "code", 0);
	return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/fence.mjs
function wn(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 126 && o !== 96) return !1;
	let s = i;
	i = e.skipChars(i, o);
	let c = i - s;
	if (c < 3) return !1;
	let l = e.src.slice(s, i), u = e.src.slice(i, a);
	if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
	if (r) return !0;
	let d = t, f = !1;
	for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
		f = !0;
		break;
	}
	c = e.sCount[t], e.line = d + +!!f;
	let p = e.push("fence", "code", 0);
	return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/blockquote.mjs
function Tn(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
	if (r) return !0;
	let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
	e.parentType = "blockquote";
	let p = !1, m;
	for (m = t; m < n; m++) {
		let t = e.sCount[m] < e.blkIndent;
		if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
		if (e.src.charCodeAt(i++) === 62 && !t) {
			let t = e.sCount[m] + 1, n, r;
			e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
			let o = t;
			for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
				let t = e.src.charCodeAt(i);
				if (F(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
				else break;
				i++;
			}
			p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
			continue;
		}
		if (p) break;
		let r = !1;
		for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
			r = !0;
			break;
		}
		if (r) {
			e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
			break;
		}
		s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
	}
	let h = e.blkIndent;
	e.blkIndent = 0;
	let g = e.push("blockquote_open", "blockquote", 1);
	g.markup = ">";
	let _ = [t, 0];
	g.map = _, e.md.block.tokenize(e, t, m);
	let v = e.push("blockquote_close", "blockquote", -1);
	v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
	for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
	return e.blkIndent = h, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/hr.mjs
function En(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !F(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/list.mjs
function Dn(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !F(e.src.charCodeAt(r)) ? -1 : r;
}
function On(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
	if (i + 1 >= r) return -1;
	let a = e.src.charCodeAt(i++);
	if (a < 48 || a > 57) return -1;
	for (;;) {
		if (i >= r) return -1;
		if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
			if (i - n >= 10) return -1;
			continue;
		}
		if (a === 41 || a === 46) break;
		return -1;
	}
	return i < r && (a = e.src.charCodeAt(i), !F(a)) ? -1 : i;
}
function kn(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function An(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = On(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Dn(e, c)) >= 0) d = !1;
	else return !1;
	if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
	if (r) return !0;
	let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
	d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
	let g = [c, 0];
	s.map = g, s.markup = String.fromCharCode(m);
	let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
	for (e.parentType = "list"; c < n;) {
		a = p, i = e.eMarks[c];
		let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
		for (; a < i;) {
			let t = e.src.charCodeAt(a);
			if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
			else if (t === 32) r++;
			else break;
			a++;
		}
		let u = a, f;
		f = u >= i ? 1 : r - t, f > 4 && (f = 1);
		let h = t + f;
		s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
		let g = [c, 0];
		s.map = g, d && (s.info = e.src.slice(o, p - 1));
		let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
		if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n, !0), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
		let C = !1;
		for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
			C = !0;
			break;
		}
		if (C) break;
		if (d) {
			if (p = On(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Dn(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && kn(e, h), !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/reference.mjs
function jn(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
	function s(t) {
		let n = e.lineMax;
		if (t >= n || e.isEmpty(t)) return null;
		let r = !1;
		if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
			let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
			e.parentType = "reference";
			let a = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
				a = !0;
				break;
			}
			if (e.parentType = i, a) return null;
		}
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		return e.src.slice(i, a + 1);
	}
	let c = e.src.slice(i, a + 1);
	a = c.length;
	let l = -1;
	for (i = 1; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 91) return !1;
		if (e === 93) {
			l = i;
			break;
		} else if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		}
	}
	if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
	for (i = l + 2; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!F(e)) break;
	}
	let u = e.md.helpers.parseLinkDestination(c, i, a);
	if (!u.ok) return !1;
	let d = e.md.normalizeLink(u.str);
	if (!e.md.validateLink(d)) return !1;
	i = u.pos;
	let f = i, p = o, m = i;
	for (; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!F(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && F(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && F(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Bt(c.slice(1, l));
	return _ ? r ? !0 : (e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
		title: g,
		href: d
	}), e.line = o, !0) : !1;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/common/html_blocks.mjs
var Mn = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Nn = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", Pn = RegExp("^(?:" + Nn + "|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"), Fn = RegExp("^(?:" + Nn + "|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)"), W = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		!0
	],
	[
		/^<!--/,
		/-->/,
		!0
	],
	[
		/^<\?/,
		/\?>/,
		!0
	],
	[
		/^<![A-Z]/,
		/>/,
		!0
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		!0
	],
	[
		RegExp("^</?(" + Mn.join("|") + ")(?=(\\s|/?>|$))", "i"),
		/^$/,
		!0
	],
	[
		RegExp(Fn.source + "\\s*$"),
		/^$/,
		!1
	]
];
function In(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < W.length && !W[s][0].test(o); s++);
	if (s === W.length) return !1;
	if (r) return W[s][2];
	let c = t + 1;
	if (!W[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), W[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let l = e.push("html_block", "", 0);
	return l.map = [t, c], l.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/heading.mjs
function Ln(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !F(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && F(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", "h" + String(s), 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = e.src.slice(i, a).trim(), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", "h" + String(s), -1);
	return d.markup = "########".slice(0, s), !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/lheading.mjs
function Rn(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph");
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let i = e.parentType;
	e.parentType = "paragraph";
	let a = 0, o, s = t + 1;
	for (; s < n && !e.isEmpty(s); s++) {
		if (e.sCount[s] - e.blkIndent > 3) continue;
		if (e.sCount[s] >= e.blkIndent) {
			let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
			if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
				a = o === 61 ? 1 : 2;
				break;
			}
		}
		if (e.sCount[s] < 0) continue;
		let t = !1;
		for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	if (!a) return !1;
	let c = e.getLines(t, s, e.blkIndent, !1).trim();
	e.line = s + 1;
	let l = e.push("heading_open", "h" + String(a), 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", "h" + String(a), -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_block/paragraph.mjs
function zn(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
	for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
		if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
		let t = !1;
		for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	let o = e.getLines(t, a, e.blkIndent, !1).trim();
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/parser_block.mjs
var Bn = [
	[
		"table",
		Sn,
		["paragraph", "reference"]
	],
	["code", Cn],
	[
		"fence",
		wn,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Tn,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		En,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		An,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", jn],
	[
		"html_block",
		In,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Ln,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Rn],
	["paragraph", zn]
];
function Vn() {
	this.ruler = new V();
	for (let e = 0; e < Bn.length; e++) this.ruler.push(Bn[e][0], Bn[e][1], { alt: (Bn[e][2] || []).slice() });
}
Vn.prototype.tokenize = function(e, t, n) {
	let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
	for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
		if (e.level >= a) {
			e.line = n;
			break;
		}
		let t = e.line, c = !1;
		for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
			if (t >= e.line) throw Error("block rule didn't increment state.line");
			break;
		}
		if (!c) throw Error("none of the block rules matched");
		e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
	}
}, Vn.prototype.parse = function(e, t, n, r) {
	if (!e) return;
	let i = new this.State(e, t, n, r);
	this.tokenize(i, i.line, i.lineMax);
}, Vn.prototype.State = U;
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/state_inline.mjs
function G(e, t, n, r) {
	this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
G.prototype.pushPending = function() {
	let e = new H("text", "", 0);
	return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
}, G.prototype.push = function(e, t, n) {
	this.pending && this.pushPending();
	let r = new H(e, t, n), i = null;
	return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
}, G.prototype.scanDelims = function(e, t) {
	let n = this.posMax, r = this.src.charCodeAt(e), i = e > 0 ? this.src.charCodeAt(e - 1) : 32, a = e;
	for (; a < n && this.src.charCodeAt(a) === r;) a++;
	let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32, c = R(i) || L(String.fromCharCode(i)), l = R(s) || L(String.fromCharCode(s)), u = I(i), d = I(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
	return {
		can_open: f && (t || !p || c),
		can_close: p && (t || !f || l),
		length: o
	};
}, G.prototype.Token = H;
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/text.mjs
function Hn(e) {
	switch (e) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Un(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !Hn(e.src.charCodeAt(n));) n++;
	return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/linkify.mjs
var Wn = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function Gn(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = e.pending.match(Wn);
	if (!i) return !1;
	let a = i[1], o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
	if (!o) return !1;
	let s = o.url;
	if (s.length <= a.length) return !1;
	let c = s.length;
	for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
	c !== s.length && (s = s.slice(0, c));
	let l = e.md.normalizeLink(s);
	if (!e.md.validateLink(l)) return !1;
	if (!t) {
		e.pending = e.pending.slice(0, -a.length);
		let t = e.push("link_open", "a", 1);
		t.attrs = [["href", l]], t.markup = "linkify", t.info = "auto";
		let n = e.push("text", "", 0);
		n.content = e.md.normalizeLinkText(s);
		let r = e.push("link_close", "a", -1);
		r.markup = "linkify", r.info = "auto";
	}
	return e.pos += s.length - a.length, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/newline.mjs
function Kn(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 10) return !1;
	let r = e.pending.length - 1, i = e.posMax;
	if (!t) if (r >= 0 && e.pending.charCodeAt(r) === 32) if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
		let t = r - 1;
		for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
		e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
	} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
	else e.push("softbreak", "br", 0);
	for (n++; n < i && F(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/escape.mjs
var qn = [];
for (let e = 0; e < 256; e++) qn.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	qn[e.charCodeAt(0)] = 1;
});
function Jn(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), F(i));) n++;
		return e.pos = n, !0;
	}
	let a = e.src[n];
	if (i >= 55296 && i <= 56319 && n + 1 < r) {
		let t = e.src.charCodeAt(n + 1);
		t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
	}
	let o = "\\" + a;
	if (!t) {
		let t = e.push("text_special", "", 0);
		i < 256 && qn[i] !== 0 ? t.content = a : t.content = o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/backticks.mjs
function Yn(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = n;
	n++;
	let i = e.posMax;
	for (; n < i && e.src.charCodeAt(n) === 96;) n++;
	let a = e.src.slice(r, n), o = a.length;
	if (e.backticksScanned && (e.backticks[o] || 0) <= r) return t || (e.pending += a), e.pos += o, !0;
	let s = n, c;
	for (; (c = e.src.indexOf("`", s)) !== -1;) {
		for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
		let r = s - c;
		if (r === o) {
			if (!t) {
				let t = e.push("code_inline", "code", 0);
				t.markup = a, t.content = e.src.slice(n, c).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
			}
			return e.pos = s, !0;
		}
		e.backticks[r] = c;
	}
	return e.backticksScanned = !0, t || (e.pending += a), e.pos += o, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/strikethrough.mjs
function Xn(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 126) return !1;
	let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
	if (a < 2) return !1;
	let s;
	a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
	for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
		marker: r,
		length: 0,
		token: e.tokens.length - 1,
		end: -1,
		open: i.can_open,
		close: i.can_close
	});
	return e.pos += i.length, !0;
}
function Zn(e, t) {
	let n, r = [], i = t.length;
	for (let a = 0; a < i; a++) {
		let i = t[a];
		if (i.marker !== 126 || i.end === -1) continue;
		let o = t[i.end];
		n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
	}
	for (; r.length;) {
		let t = r.pop(), i = t + 1;
		for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
		i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
	}
}
function Qn(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Zn(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Zn(e, t[r].delimiters);
}
var $n = {
	tokenize: Xn,
	postProcess: Qn
};
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/emphasis.mjs
function er(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 95 && r !== 42) return !1;
	let i = e.scanDelims(e.pos, r === 42);
	for (let t = 0; t < i.length; t++) {
		let t = e.push("text", "", 0);
		t.content = String.fromCharCode(r), e.delimiters.push({
			marker: r,
			length: i.length,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
	}
	return e.pos += i.length, !0;
}
function tr(e, t) {
	let n = t.length;
	for (let r = n - 1; r >= 0; r--) {
		let n = t[r];
		if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
		let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
		s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
		let c = e.tokens[i.token];
		c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
	}
}
function nr(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	tr(e, e.delimiters);
	for (let r = 0; r < n; r++) t[r] && t[r].delimiters && tr(e, t[r].delimiters);
}
var rr = {
	tokenize: er,
	postProcess: nr
};
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/link.mjs
function ir(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), !(!F(n) && n !== 10)); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), !(!F(n) && n !== 10)); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), !(!F(n) && n !== 10)); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), a = e.env.references[Bt(r)], !a) return e.pos = u, !1;
		o = a.href, s = a.title;
	}
	if (!t) {
		e.pos = f, e.posMax = p;
		let t = e.push("link_open", "a", 1), n = [["href", o]];
		t.attrs = n, s && n.push(["title", s]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
	}
	return e.pos = m, e.posMax = d, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/image.mjs
function ar(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), !(!F(n) && n !== 10)); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), !(!F(n) && n !== 10)); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), !(!F(n) && n !== 10)); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), o = e.env.references[Bt(i)], !o) return e.pos = d, !1;
		u = o.href, c = o.title;
	}
	if (!t) {
		r = e.src.slice(p, m);
		let t = [];
		e.md.inline.parse(r, e.md, e.env, t);
		let n = e.push("image", "img", 0), i = [["src", u], ["alt", ""]];
		n.attrs = i, n.children = t, n.content = r, c && i.push(["title", c]);
	}
	return e.pos = a, e.posMax = f, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/autolink.mjs
var or = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, sr = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function cr(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 60) return !1;
	let r = e.pos, i = e.posMax;
	for (;;) {
		if (++n >= i) return !1;
		let t = e.src.charCodeAt(n);
		if (t === 60) return !1;
		if (t === 62) break;
	}
	let a = e.src.slice(r + 1, n);
	if (sr.test(a)) {
		let n = e.md.normalizeLink(a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	if (or.test(a)) {
		let n = e.md.normalizeLink("mailto:" + a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	return !1;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/html_inline.mjs
function lr(e) {
	return /^<a[>\s]/i.test(e);
}
function ur(e) {
	return /^<\/a\s*>/i.test(e);
}
function dr(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function fr(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !dr(i)) return !1;
	let a = e.src.slice(r).match(Pn);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], lr(t.content) && e.linkLevel++, ur(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/entity.mjs
var pr = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, mr = /^&([a-z][a-z0-9]{1,31});/i;
function hr(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(pr);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = Dt(t) ? Ot(t) : Ot(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(mr);
		if (r) {
			let n = yt(r[0]);
			if (n !== r[0]) {
				if (!t) {
					let t = e.push("text_special", "", 0);
					t.content = n, t.markup = r[0], t.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		}
	}
	return !1;
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/balance_pairs.mjs
function gr(e) {
	let t = {}, n = e.length;
	if (!n) return;
	let r = 0, i = -2, a = [];
	for (let o = 0; o < n; o++) {
		let n = e[o];
		if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
		t.hasOwnProperty(n.marker) || (t[n.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		]);
		let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
		for (; c > s; c -= a[c] + 1) {
			let t = e[c];
			if (t.marker === n.marker && t.open && t.end < 0) {
				let r = !1;
				if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
					let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
					a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
					break;
				}
			}
		}
		l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
	}
}
function _r(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	gr(e.delimiters);
	for (let e = 0; e < n; e++) t[e] && t[e].delimiters && gr(t[e].delimiters);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/rules_inline/fragments_join.mjs
function vr(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
//#endregion
//#region ../../node_modules/markdown-it/lib/parser_inline.mjs
var yr = [
	["text", Un],
	["linkify", Gn],
	["newline", Kn],
	["escape", Jn],
	["backticks", Yn],
	["strikethrough", $n.tokenize],
	["emphasis", rr.tokenize],
	["link", ir],
	["image", ar],
	["autolink", cr],
	["html_inline", fr],
	["entity", hr]
], br = [
	["balance_pairs", _r],
	["strikethrough", $n.postProcess],
	["emphasis", rr.postProcess],
	["fragments_join", vr]
];
function K() {
	this.ruler = new V();
	for (let e = 0; e < yr.length; e++) this.ruler.push(yr[e][0], yr[e][1]);
	this.ruler2 = new V();
	for (let e = 0; e < br.length; e++) this.ruler2.push(br[e][0], br[e][1]);
}
K.prototype.skipToken = function(e) {
	let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
	if (a[t] !== void 0) {
		e.pos = a[t];
		return;
	}
	let o = !1;
	if (e.level < i) {
		for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
			if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
			break;
		}
	} else e.pos = e.posMax;
	o || e.pos++, a[t] = e.pos;
}, K.prototype.tokenize = function(e) {
	let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
	for (; e.pos < r;) {
		let a = e.pos, o = !1;
		if (e.level < i) {
			for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
				if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		}
		if (o) {
			if (e.pos >= r) break;
			continue;
		}
		e.pending += e.src[e.pos++];
	}
	e.pending && e.pushPending();
}, K.prototype.parse = function(e, t, n, r) {
	let i = new this.State(e, t, n, r);
	this.tokenize(i);
	let a = this.ruler2.getRules(""), o = a.length;
	for (let e = 0; e < o; e++) a[e](i);
}, K.prototype.State = G;
//#endregion
//#region ../../node_modules/linkify-it/lib/re.mjs
function xr(e) {
	let t = {};
	e ||= {}, t.src_Any = Qe.source, t.src_Cc = $e.source, t.src_Z = rt.source, t.src_P = tt.source, t.src_ZPCc = [
		t.src_Z,
		t.src_P,
		t.src_Cc
	].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");
	let n = "[><｜]";
	return t.src_pseudo_letter = "(?:(?!" + n + "|" + t.src_ZPCc + ")" + t.src_Any + ")", t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = "(?:(?:(?!" + t.src_ZCc + "|[@/\\[\\]()]).)+@)?", t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = "(?=$|" + n + "|" + t.src_ZPCc + ")(?!" + (e["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + t.src_ZPCc + "))", t.src_path = "(?:[/?#](?:(?!" + t.src_ZCc + "|[><｜]|[()[\\]{}.,\"'?!\\-;]).|\\[(?:(?!" + t.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + t.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + t.src_ZCc + "|[}]).)*\\}|\\\"(?:(?!" + t.src_ZCc + "|[\"]).)+\\\"|\\'(?:(?!" + t.src_ZCc + "|[']).)+\\'|\\'(?=" + t.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + t.src_ZCc + "|[.]|$)|" + (e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + t.src_ZCc + "|$)|;(?!" + t.src_ZCc + "|$)|\\!+(?!" + t.src_ZCc + "|[!]|$)|\\?(?!" + t.src_ZCc + "|[?]|$))+|\\/)?", t.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]*", t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + "|" + t.src_pseudo_letter + "{1,63})", t.src_domain = "(?:" + t.src_xn + "|(?:" + t.src_pseudo_letter + ")|(?:" + t.src_pseudo_letter + "(?:-|" + t.src_pseudo_letter + "){0,61}" + t.src_pseudo_letter + "))", t.src_host = "(?:(?:(?:(?:" + t.src_domain + ")\\.)*" + t.src_domain + "))", t.tpl_host_fuzzy = "(?:" + t.src_ip4 + "|(?:(?:(?:" + t.src_domain + ")\\.)+(?:%TLDS%)))", t.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + t.src_domain + ")\\.)+(?:%TLDS%))", t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + t.src_ZPCc + "|>|$))", t.tpl_email_fuzzy = "(^|" + n + "|\"|\\(|" + t.src_ZCc + ")(" + t.src_email_name + "@" + t.tpl_host_fuzzy_strict + ")", t.tpl_link_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + t.src_ZPCc + "))((?![$+<=>^`|｜])" + t.tpl_host_port_fuzzy_strict + t.src_path + ")", t.tpl_link_no_ip_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + t.src_ZPCc + "))((?![$+<=>^`|｜])" + t.tpl_host_port_no_ip_fuzzy_strict + t.src_path + ")", t;
}
//#endregion
//#region ../../node_modules/linkify-it/index.mjs
function Sr(e) {
	return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
		t && Object.keys(t).forEach(function(n) {
			e[n] = t[n];
		});
	}), e;
}
function Cr(e) {
	return Object.prototype.toString.call(e);
}
function wr(e) {
	return Cr(e) === "[object String]";
}
function Tr(e) {
	return Cr(e) === "[object Object]";
}
function Er(e) {
	return Cr(e) === "[object RegExp]";
}
function Dr(e) {
	return Cr(e) === "[object Function]";
}
function Or(e) {
	return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var kr = {
	fuzzyLink: !0,
	fuzzyEmail: !0,
	fuzzyIP: !1
};
function Ar(e) {
	return Object.keys(e || {}).reduce(function(e, t) {
		return e || kr.hasOwnProperty(t);
	}, !1);
}
var jr = {
	"http:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.http || (n.re.http = RegExp("^\\/\\/" + n.re.src_auth + n.re.src_host_port_strict + n.re.src_path, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
	} },
	"https:": "http:",
	"ftp:": "http:",
	"//": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.no_http || (n.re.no_http = RegExp("^" + n.re.src_auth + "(?:localhost|(?:(?:" + n.re.src_domain + ")\\.)+" + n.re.src_domain_root + ")" + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
	} },
	"mailto:": { validate: function(e, t, n) {
		let r = e.slice(t);
		return n.re.mailto || (n.re.mailto = RegExp("^" + n.re.src_email_name + "@" + n.re.src_host_strict, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
	} }
}, Mr = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Nr = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Pr(e) {
	e.__index__ = -1, e.__text_cache__ = "";
}
function Fr(e) {
	return function(t, n) {
		let r = t.slice(n);
		return e.test(r) ? r.match(e)[0].length : 0;
	};
}
function Ir() {
	return function(e, t) {
		t.normalize(e);
	};
}
function Lr(e) {
	let t = e.re = xr(e.__opts__), n = e.__tlds__.slice();
	e.onCompile(), e.__tlds_replaced__ || n.push(Mr), n.push(t.src_xn), t.src_tlds = n.join("|");
	function r(e) {
		return e.replace("%TLDS%", t.src_tlds);
	}
	t.email_fuzzy = RegExp(r(t.tpl_email_fuzzy), "i"), t.link_fuzzy = RegExp(r(t.tpl_link_fuzzy), "i"), t.link_no_ip_fuzzy = RegExp(r(t.tpl_link_no_ip_fuzzy), "i"), t.host_fuzzy_test = RegExp(r(t.tpl_host_fuzzy_test), "i");
	let i = [];
	e.__compiled__ = {};
	function a(e, t) {
		throw Error("(LinkifyIt) Invalid schema \"" + e + "\": " + t);
	}
	Object.keys(e.__schemas__).forEach(function(t) {
		let n = e.__schemas__[t];
		if (n === null) return;
		let r = {
			validate: null,
			link: null
		};
		if (e.__compiled__[t] = r, Tr(n)) {
			Er(n.validate) ? r.validate = Fr(n.validate) : Dr(n.validate) ? r.validate = n.validate : a(t, n), Dr(n.normalize) ? r.normalize = n.normalize : n.normalize ? a(t, n) : r.normalize = Ir();
			return;
		}
		if (wr(n)) {
			i.push(t);
			return;
		}
		a(t, n);
	}), i.forEach(function(t) {
		e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);
	}), e.__compiled__[""] = {
		validate: null,
		normalize: Ir()
	};
	let o = Object.keys(e.__compiled__).filter(function(t) {
		return t.length > 0 && e.__compiled__[t];
	}).map(Or).join("|");
	e.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + t.src_ZPCc + "))(" + o + ")", "i"), e.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + t.src_ZPCc + "))(" + o + ")", "ig"), e.re.schema_at_start = RegExp("^" + e.re.schema_search.source, "i"), e.re.pretest = RegExp("(" + e.re.schema_test.source + ")|(" + e.re.host_fuzzy_test.source + ")|@", "i"), Pr(e);
}
function Rr(e, t) {
	let n = e.__index__, r = e.__last_index__, i = e.__text_cache__.slice(n, r);
	this.schema = e.__schema__.toLowerCase(), this.index = n + t, this.lastIndex = r + t, this.raw = i, this.text = i, this.url = i;
}
function zr(e, t) {
	let n = new Rr(e, t);
	return e.__compiled__[n.schema].normalize(n, e), n;
}
function q(e, t) {
	if (!(this instanceof q)) return new q(e, t);
	t || Ar(e) && (t = e, e = {}), this.__opts__ = Sr({}, kr, t), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = Sr({}, jr, e), this.__compiled__ = {}, this.__tlds__ = Nr, this.__tlds_replaced__ = !1, this.re = {}, Lr(this);
}
q.prototype.add = function(e, t) {
	return this.__schemas__[e] = t, Lr(this), this;
}, q.prototype.set = function(e) {
	return this.__opts__ = Sr(this.__opts__, e), this;
}, q.prototype.test = function(e) {
	if (this.__text_cache__ = e, this.__index__ = -1, !e.length) return !1;
	let t, n, r, i, a, o, s, c, l;
	if (this.re.schema_test.test(e)) {
		for (s = this.re.schema_search, s.lastIndex = 0; (t = s.exec(e)) !== null;) if (i = this.testSchemaAt(e, t[2], s.lastIndex), i) {
			this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + i;
			break;
		}
	}
	return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (c = e.search(this.re.host_fuzzy_test), c >= 0 && (this.__index__ < 0 || c < this.__index__) && (n = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (a = n.index + n[1].length, (this.__index__ < 0 || a < this.__index__) && (this.__schema__ = "", this.__index__ = a, this.__last_index__ = n.index + n[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (l = e.indexOf("@"), l >= 0 && (r = e.match(this.re.email_fuzzy)) !== null && (a = r.index + r[1].length, o = r.index + r[0].length, (this.__index__ < 0 || a < this.__index__ || a === this.__index__ && o > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = a, this.__last_index__ = o))), this.__index__ >= 0;
}, q.prototype.pretest = function(e) {
	return this.re.pretest.test(e);
}, q.prototype.testSchemaAt = function(e, t, n) {
	return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
}, q.prototype.match = function(e) {
	let t = [], n = 0;
	this.__index__ >= 0 && this.__text_cache__ === e && (t.push(zr(this, n)), n = this.__last_index__);
	let r = n ? e.slice(n) : e;
	for (; this.test(r);) t.push(zr(this, n)), r = r.slice(this.__last_index__), n += this.__last_index__;
	return t.length ? t : null;
}, q.prototype.matchAtStart = function(e) {
	if (this.__text_cache__ = e, this.__index__ = -1, !e.length) return null;
	let t = this.re.schema_at_start.exec(e);
	if (!t) return null;
	let n = this.testSchemaAt(e, t[2], t[0].length);
	return n ? (this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + n, zr(this, 0)) : null;
}, q.prototype.tlds = function(e, t) {
	return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(e, t, n) {
		return e !== n[t - 1];
	}).reverse(), Lr(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Lr(this), this);
}, q.prototype.normalize = function(e) {
	e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
}, q.prototype.onCompile = function() {};
//#endregion
//#region ../../node_modules/punycode.js/punycode.es6.js
var J = 2147483647, Y = 36, Br = 1, Vr = 26, Hr = 38, Ur = 700, Wr = 72, Gr = 128, Kr = "-", qr = /^xn--/, Jr = /[^\0-\x7F]/, Yr = /[\x2E\u3002\uFF0E\uFF61]/g, Xr = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, Zr = Y - Br, X = Math.floor, Qr = String.fromCharCode;
function Z(e) {
	throw RangeError(Xr[e]);
}
function $r(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function ei(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(Yr, ".");
	let i = $r(e.split("."), t).join(".");
	return r + i;
}
function ti(e) {
	let t = [], n = 0, r = e.length;
	for (; n < r;) {
		let i = e.charCodeAt(n++);
		if (i >= 55296 && i <= 56319 && n < r) {
			let r = e.charCodeAt(n++);
			(r & 64512) == 56320 ? t.push(((i & 1023) << 10) + (r & 1023) + 65536) : (t.push(i), n--);
		} else t.push(i);
	}
	return t;
}
var ni = (e) => String.fromCodePoint(...e), ri = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Y;
}, ii = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, ai = function(e, t, n) {
	let r = 0;
	for (e = n ? X(e / Ur) : e >> 1, e += X(e / t); e > Zr * Vr >> 1; r += Y) e = X(e / Zr);
	return X(r + (Zr + 1) * e / (e + Hr));
}, oi = function(e) {
	let t = [], n = e.length, r = 0, i = Gr, a = Wr, o = e.lastIndexOf(Kr);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && Z("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = Y;; i += Y) {
			s >= n && Z("invalid-input");
			let o = ri(e.charCodeAt(s++));
			o >= Y && Z("invalid-input"), o > X((J - r) / t) && Z("overflow"), r += o * t;
			let c = i <= a ? Br : i >= a + Vr ? Vr : i - a;
			if (o < c) break;
			let l = Y - c;
			t > X(J / l) && Z("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = ai(r - o, c, o == 0), X(r / c) > J - i && Z("overflow"), i += X(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, si = function(e) {
	let t = [];
	e = ti(e);
	let n = e.length, r = Gr, i = 0, a = Wr;
	for (let n of e) n < 128 && t.push(Qr(n));
	let o = t.length, s = o;
	for (o && t.push(Kr); s < n;) {
		let n = J;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > X((J - i) / c) && Z("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > J && Z("overflow"), n === r) {
			let e = i;
			for (let n = Y;; n += Y) {
				let r = n <= a ? Br : n >= a + Vr ? Vr : n - a;
				if (e < r) break;
				let i = e - r, o = Y - r;
				t.push(Qr(ii(r + i % o, 0))), e = X(i / o);
			}
			t.push(Qr(ii(e, 0))), a = ai(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, ci = {
	version: "2.3.1",
	ucs2: {
		decode: ti,
		encode: ni
	},
	decode: oi,
	encode: si,
	toASCII: function(e) {
		return ei(e, function(e) {
			return Jr.test(e) ? "xn--" + si(e) : e;
		});
	},
	toUnicode: function(e) {
		return ei(e, function(e) {
			return qr.test(e) ? oi(e.slice(4).toLowerCase()) : e;
		});
	}
}, li = {
	default: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 100
		},
		components: {
			core: {},
			block: {},
			inline: {}
		}
	},
	zero: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: ["paragraph"] },
			inline: {
				rules: ["text"],
				rules2: ["balance_pairs", "fragments_join"]
			}
		}
	},
	commonmark: {
		options: {
			html: !0,
			xhtmlOut: !0,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"inline",
				"text_join"
			] },
			block: { rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			] },
			inline: {
				rules: [
					"autolink",
					"backticks",
					"emphasis",
					"entity",
					"escape",
					"html_inline",
					"image",
					"link",
					"newline",
					"text"
				],
				rules2: [
					"balance_pairs",
					"emphasis",
					"fragments_join"
				]
			}
		}
	}
}, ui = /^(vbscript|javascript|file|data):/, di = /^data:image\/(gif|png|jpeg|webp);/;
function fi(e) {
	let t = e.trim().toLowerCase();
	return ui.test(t) ? di.test(t) : !0;
}
var pi = [
	"http:",
	"https:",
	"mailto:"
];
function mi(e) {
	let t = Xe(e, !0);
	if (t.hostname && (!t.protocol || pi.indexOf(t.protocol) >= 0)) try {
		t.hostname = ci.toASCII(t.hostname);
	} catch {}
	return O(Re(t));
}
function hi(e) {
	let t = Xe(e, !0);
	if (t.hostname && (!t.protocol || pi.indexOf(t.protocol) >= 0)) try {
		t.hostname = ci.toUnicode(t.hostname);
	} catch {}
	return D(Re(t), D.defaultChars + "%");
}
function Q(e, t) {
	if (!(this instanceof Q)) return new Q(e, t);
	t || St(e) || (t = e || {}, e = "default"), this.inline = new K(), this.block = new Vn(), this.core = new vn(), this.renderer = new B(), this.linkify = new q(), this.validateLink = fi, this.normalizeLink = mi, this.normalizeLinkText = hi, this.utils = bt, this.helpers = Tt({}, Gt), this.options = {}, this.configure(e), t && this.set(t);
}
Q.prototype.set = function(e) {
	return Tt(this.options, e), this;
}, Q.prototype.configure = function(e) {
	let t = this;
	if (St(e)) {
		let t = e;
		if (e = li[t], !e) throw Error("Wrong `markdown-it` preset \"" + t + "\", check name");
	}
	if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
	return e.options && t.set(e.options), e.components && Object.keys(e.components).forEach(function(n) {
		e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules), e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2);
	}), this;
}, Q.prototype.enable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.enable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.enable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
	return this;
}, Q.prototype.disable = function(e, t) {
	let n = [];
	Array.isArray(e) || (e = [e]), [
		"core",
		"block",
		"inline"
	].forEach(function(t) {
		n = n.concat(this[t].ruler.disable(e, !0));
	}, this), n = n.concat(this.inline.ruler2.disable(e, !0));
	let r = e.filter(function(e) {
		return n.indexOf(e) < 0;
	});
	if (r.length && !t) throw Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
	return this;
}, Q.prototype.use = function(e) {
	let t = [this].concat(Array.prototype.slice.call(arguments, 1));
	return e.apply(e, t), this;
}, Q.prototype.parse = function(e, t) {
	if (typeof e != "string") throw Error("Input data should be a String");
	let n = new this.core.State(e, this, t);
	return this.core.process(n), n.tokens;
}, Q.prototype.render = function(e, t) {
	return t ||= {}, this.renderer.render(this.parse(e, t), this.options, t);
}, Q.prototype.parseInline = function(e, t) {
	let n = new this.core.State(e, this, t);
	return n.inlineMode = !0, this.core.process(n), n.tokens;
}, Q.prototype.renderInline = function(e, t) {
	return t ||= {}, this.renderer.render(this.parseInline(e, t), this.options, t);
};
//#endregion
//#region src/markdown.js
var gi = () => Q("commonmark", { html: !1 });
function _i(e, t) {
	for (; ++t < e.length;) if (e[t].type !== "list_item_open") return e[t].hidden;
	return !1;
}
function vi(e) {
	let t = {
		blockquote: { block: "blockquote" },
		paragraph: { block: "paragraph" },
		list_item: { block: "list_item" },
		bullet_list: {
			block: "bullet_list",
			getAttrs: (e, t, n) => ({ tight: _i(t, n) })
		},
		ordered_list: {
			block: "ordered_list",
			getAttrs: (e, t, n) => ({
				order: +e.attrGet("start") || 1,
				tight: _i(t, n)
			})
		},
		heading: {
			block: "heading",
			getAttrs: (e) => ({ level: Math.min(+e.tag.slice(1), 3) })
		},
		code_block: {
			block: "code_block",
			noCloseToken: !0
		},
		fence: {
			block: "code_block",
			getAttrs: (e) => ({ params: e.info || "" }),
			noCloseToken: !0
		},
		hr: { ignore: !0 },
		hardbreak: { node: "hard_break" },
		em: { mark: "em" },
		strong: { mark: "strong" },
		code_inline: {
			mark: "code",
			noCloseToken: !0
		}
	};
	return e.nodes.image ? t.image = {
		node: "image",
		getAttrs: (e) => ({
			src: e.attrGet("src"),
			title: e.attrGet("title") || null,
			alt: e.children && e.children[0] && e.children[0].content || null
		})
	} : t.image = { ignore: !0 }, e.marks.link ? t.link = {
		mark: "link",
		getAttrs: (e) => ({
			href: e.attrGet("href"),
			title: e.attrGet("title") || null
		})
	} : t.link = { ignore: !0 }, t;
}
function yi(e, t) {
	let n = /`+/g, r, i = 0;
	if (e.isText) for (; r = n.exec(e.text);) i = Math.max(i, r[0].length);
	let a = i > 0 && t > 0 ? " `" : "`";
	for (let e = 0; e < i; e++) a += "`";
	return i > 0 && t < 0 && (a += " "), a;
}
function bi(e, t, n) {
	if (e.attrs.title || !/^\w+:/.test(e.attrs.href)) return !1;
	let r = t.child(n);
	return !r.isText || r.text !== e.attrs.href || r.marks[r.marks.length - 1] !== e ? !1 : n === t.childCount - 1 || !e.isInSet(t.child(n + 1).marks);
}
var xi = {
	blockquote(e, t) {
		e.wrapBlock("> ", null, t, () => e.renderContent(t));
	},
	code_block(e, t) {
		let n = t.textContent.match(/`{3,}/gm), r = n ? n.sort().slice(-1)[0] + "`" : "```";
		e.write(r + (t.attrs.params || "") + "\n"), e.text(t.textContent, !1), e.write("\n"), e.write(r), e.closeBlock(t);
	},
	heading(e, t) {
		e.write(e.repeat("#", t.attrs.level) + " "), e.renderInline(t, !1), e.closeBlock(t);
	},
	bullet_list(e, t) {
		e.renderList(t, "  ", () => (t.attrs.bullet || "*") + " ");
	},
	ordered_list(e, t) {
		let n = t.attrs.order || 1, r = String(n + t.childCount - 1).length, i = e.repeat(" ", r + 2);
		e.renderList(t, i, (t) => {
			let i = String(n + t);
			return e.repeat(" ", r - i.length) + i + ". ";
		});
	},
	list_item(e, t) {
		e.renderContent(t);
	},
	paragraph(e, t) {
		e.renderInline(t), e.closeBlock(t);
	},
	image(e, t) {
		e.write("![" + e.esc(t.attrs.alt || "") + "](" + t.attrs.src.replace(/[()]/g, "\\$&") + (t.attrs.title ? " \"" + t.attrs.title.replace(/"/g, "\\\"") + "\"" : "") + ")");
	},
	hard_break(e, t, n, r) {
		for (let i = r + 1; i < n.childCount; i++) if (n.child(i).type !== t.type) {
			e.write("\\\n");
			return;
		}
	},
	text(e, t) {
		e.text(t.text, !e.inAutolink);
	}
}, Si = {
	em: {
		open: "*",
		close: "*",
		mixable: !0,
		expelEnclosingWhitespace: !0
	},
	strong: {
		open: "**",
		close: "**",
		mixable: !0,
		expelEnclosingWhitespace: !0
	},
	link: {
		open(e, t, n, r) {
			return e.inAutolink = bi(t, n, r), e.inAutolink ? "<" : "[";
		},
		close(e, t, n, r) {
			let { inAutolink: i } = e;
			return e.inAutolink = void 0, i ? ">" : "](" + t.attrs.href.replace(/[()"]/g, "\\$&") + (t.attrs.title ? ` "${t.attrs.title.replace(/"/g, "\\\"")}"` : "") + ")";
		},
		mixable: !0
	},
	code: {
		open(e, t, n, r) {
			return yi(n.child(r), -1);
		},
		close(e, t, n, r) {
			return yi(n.child(r - 1), 1);
		},
		escape: !1
	}
};
function Ci(e = Me) {
	let t = new y(e, gi(), vi(e)), n = new b(xi, Si);
	return {
		parseMarkdown(e) {
			return t.parse(e || "");
		},
		serializeMarkdown(e) {
			return n.serialize(e);
		},
		parser: t,
		serializer: n
	};
}
var wi = Ci(Me), Ti = (e) => wi.parseMarkdown(e), Ei = (e) => wi.serializeMarkdown(e);
//#endregion
//#region src/commands.js
function Di(e, t) {
	let { from: n, $from: r, to: i, empty: a } = e.selection;
	return a ? !!t.isInSet(e.storedMarks || r.marks()) : e.doc.rangeHasMark(n, i, t);
}
function Oi(e, t, n = null) {
	let { $from: r, to: i } = e.selection;
	return r.parent.type === t ? n ? Object.keys(n).every((e) => r.parent.attrs[e] === n[e]) : r.end() >= i : !1;
}
function ki(e) {
	return E(e.marks.strong);
}
function Ai(e) {
	return E(e.marks.em);
}
function ji(e) {
	return E(e.marks.code);
}
function Mi(e) {
	return oe(e.nodes.paragraph);
}
function Ni(e, t) {
	let n = Math.min(Math.max(t | 0, 1), 3);
	return oe(e.nodes.heading, { level: n });
}
function Pi(e, t) {
	let n = Math.min(Math.max(t | 0, 1), 3);
	return (t, r, i) => Oi(t, e.nodes.heading, { level: n }) ? Mi(e)(t, r, i) : Ni(e, n)(t, r, i);
}
function Fi(e) {
	return oe(e.nodes.code_block);
}
function Ii(e) {
	return (t, n, r) => Oi(t, e.nodes.code_block) ? Mi(e)(t, n, r) : Fi(e)(t, n, r);
}
function Li(e) {
	return T((t, n, r) => {
		let { $from: i } = t.selection;
		for (let a = i.depth; a > 0; a--) if (i.node(a).type === e.nodes.blockquote) return re(t, n, r);
		return !1;
	}, ce(e.nodes.blockquote));
}
function Ri(e) {
	return T(le(e.nodes.list_item), fe(e.nodes.bullet_list));
}
function zi(e) {
	return T(le(e.nodes.list_item), fe(e.nodes.ordered_list));
}
function $(e) {
	return typeof e == "string" ? /^https?:\/\/.+/i.test(e.trim()) : !1;
}
function Bi(e) {
	if (typeof window > "u" || !window.prompt) return null;
	for (let t = 0; t < 2; t++) {
		let t = window.prompt(e);
		if (t == null) return null;
		let n = t.trim();
		if ($(n)) return n;
	}
	return null;
}
function Vi(e) {
	return e && e._editorCoreRequests || null;
}
function Hi(e, t, n) {
	if (!e) return;
	let r = e.state, { from: i, to: a, empty: o } = r.selection;
	if (o) return;
	let s = r.tr.addMark(i, a, t.create(n));
	e.dispatch(s);
}
function Ui(e, t, n) {
	if (!e) return;
	let r = t.createAndFill(n);
	if (!r) return;
	let i = e.state;
	e.dispatch(i.tr.replaceSelectionWith(r).scrollIntoView());
}
function Wi(e, t, n) {
	let r = e.marks.link;
	return r ? (e, i, a) => {
		if (Di(e, r)) return E(r)(e, i, a);
		if (t != null) return $(t) ? E(r, {
			href: t,
			title: n || null
		})(e, i, a) : !1;
		let o = Vi(a);
		if (o && typeof o.link == "function") {
			a._editorCoreAsyncPending = !0;
			let t = Array.from(e.selection.$from.marks()).find((e) => e.type === r), n = {
				href: t ? t.attrs.href : void 0,
				text: e.doc.textBetween(e.selection.from, e.selection.to, " ")
			};
			return Promise.resolve(o.link(n)).then((e) => {
				if (!e || typeof e != "object") return;
				let t = e.href;
				$(t) && Hi(a, r, {
					href: t,
					title: e.title || null
				});
			}).catch((e) => {
				console.error("[@editor/core] onRequestLink callback failed:", e);
			}), !0;
		}
		let s = Bi("Link URL");
		return s ? E(r, {
			href: s,
			title: n || null
		})(e, i, a) : !1;
	} : () => !1;
}
function Gi(e, t, n, r) {
	let i = e.nodes.image;
	return i ? (e, a, o) => {
		if (t != null) {
			if (!$(t)) return !1;
			let o = i.createAndFill({
				src: t,
				alt: n || null,
				title: r || null
			});
			return o ? (a && a(e.tr.replaceSelectionWith(o).scrollIntoView()), !0) : !1;
		}
		let s = Vi(o);
		if (s && typeof s.image == "function") return o._editorCoreAsyncPending = !0, Promise.resolve(s.image({})).then((e) => {
			if (!e || typeof e != "object") return;
			let t = e.src;
			$(t) && Ui(o, i, {
				src: t,
				alt: e.alt || null,
				title: e.title || null
			});
		}).catch((e) => {
			console.error("[@editor/core] onRequestImage callback failed:", e);
		}), !0;
		let c = Bi("Image URL");
		if (!c) return !1;
		let l = n;
		l ??= typeof window < "u" && window.prompt && window.prompt("Alt text (optional)") || "";
		let u = i.createAndFill({
			src: c,
			alt: l || null,
			title: r || null
		});
		return u ? (a && a(e.tr.replaceSelectionWith(u).scrollIntoView()), !0) : !1;
	} : () => !1;
}
function Ki() {
	return C;
}
function qi() {
	return S;
}
var Ji = {
	toggleBold: ki,
	toggleItalic: Ai,
	toggleCode: ji,
	setParagraph: Mi,
	setHeading: Ni,
	toggleHeading: Pi,
	setCodeBlock: Fi,
	toggleCodeBlock: Ii,
	toggleBlockquote: Li,
	toggleBulletList: Ri,
	toggleOrderedList: zi,
	toggleLink: Wi,
	insertImage: Gi,
	undo: Ki,
	redo: qi
};
//#endregion
//#region src/plugins.js
function Yi(e, t, n) {
	return new pe(e, (e, r, i, a) => {
		let o = n instanceof Function ? n(r) : n, [, s = "", c, l] = r;
		if (l == null || c == null) return null;
		let u = e.tr, d = i + s.length;
		return u.replaceWith(d, a, e.schema.text(l, [])), u.addMark(d, d + l.length, t.create(o)), u.removeStoredMark(t), u;
	});
}
function Xi(e) {
	let t = [];
	return e.nodes.heading && t.push(he(RegExp("^(#{1,3})\\s$"), e.nodes.heading, (e) => ({ level: e[1].length }))), e.nodes.bullet_list && t.push(_e(/^\s*([-*])\s$/, e.nodes.bullet_list)), e.nodes.ordered_list && t.push(_e(/^(\d+)\.\s$/, e.nodes.ordered_list, (e) => ({ order: +e[1] }), (e, t) => t.childCount + t.attrs.order === +e[1])), e.nodes.blockquote && t.push(_e(/^\s*>\s$/, e.nodes.blockquote)), e.nodes.code_block && t.push(he(/^```$/, e.nodes.code_block)), e.marks.strong && t.push(Yi(/()(\*\*)([^*\s](?:[^*]*[^*\s])?)\*\*$/, e.marks.strong)), e.marks.em && t.push(Yi(/(^|[^*])(\*)([^*\s](?:[^*]*[^*\s])?)\*$/, e.marks.em)), e.marks.code && t.push(Yi(/()(`)([^`\s](?:[^`]*[^`\s])?)`$/, e.marks.code)), me({ rules: t });
}
function Zi(e) {
	let t = {};
	function n(e, n) {
		t[e] = n;
	}
	if (n("Mod-z", T(ge, C)), n("Shift-Mod-z", S), n("Mod-y", S), e.marks.strong && (n("Mod-b", ki(e)), n("Mod-B", ki(e))), e.marks.em && (n("Mod-i", Ai(e)), n("Mod-I", Ai(e))), e.marks.code && n("Mod-`", ji(e)), e.marks.link && (n("Mod-k", Wi(e)), n("Mod-K", Wi(e))), e.nodes.blockquote && n("Ctrl->", Li(e)), e.nodes.bullet_list && n("Shift-Ctrl-8", Ri(e)), e.nodes.ordered_list && n("Shift-Ctrl-9", zi(e)), e.nodes.heading) for (let t = 1; t <= 3; t++) n("Shift-Ctrl-" + t, Ni(e, t));
	return e.nodes.code_block && n("Mod-Enter", ne), e.nodes.hard_break && n("Shift-Enter", T(ne, (t, n) => {
		let r = e.nodes.hard_break;
		return r ? (n && n(t.tr.replaceSelectionWith(r.create()).scrollIntoView()), !0) : !1;
	})), e.nodes.list_item && (n("Enter", T(ae, te, de(e.nodes.list_item), ie, se)), n("Tab", ue(e.nodes.list_item)), n("Shift-Tab", le(e.nodes.list_item))), t;
}
var Qi = new m("editorCorePlaceholder");
function $i(e) {
	return new p({
		key: Qi,
		state: {
			init() {
				return e || "";
			},
			apply(e, t) {
				let n = e.getMeta(Qi);
				return typeof n == "string" ? n : t;
			}
		},
		props: { decorations(e) {
			let t = Qi.getState(e);
			if (!t) return null;
			let { doc: n } = e;
			if (n.childCount !== 1) return null;
			let r = n.firstChild;
			if (!r || r.content.size > 0 || r.type.name !== "paragraph") return null;
			let i = h.node(0, r.nodeSize, {
				class: "editor-placeholder",
				"data-placeholder": t
			});
			return g.create(n, [i]);
		} }
	});
}
function ea({ schema: e, placeholder: t = "", readonly: n = !1 } = {}) {
	if (n) {
		let e = [];
		return t && e.push($i(t)), e;
	}
	return [
		Xi(e),
		w(Zi(e)),
		w(ee),
		x(),
		$i(t)
	];
}
//#endregion
//#region src/Editor.vue
var ta = ["dir"], na = ["data-revision"], ra = {
	__name: "Editor",
	props: {
		modelValue: {
			type: String,
			default: ""
		},
		dir: {
			type: String,
			default: "rtl"
		},
		images: {
			type: Boolean,
			default: !0
		},
		links: {
			type: Boolean,
			default: !0
		},
		placeholder: {
			type: String,
			default: ""
		},
		readonly: {
			type: Boolean,
			default: !1
		},
		toolbar: {
			type: [Boolean, String],
			default: "minimal"
		},
		onRequestLink: {
			type: Function,
			default: null
		},
		onRequestImage: {
			type: Function,
			default: null
		}
	},
	emits: [
		"update:modelValue",
		"change",
		"ready"
	],
	setup(d, { expose: p, emit: m }) {
		let h = d, g = m, v = c(null), y = c(null), b = l(null), x = l(null), S = l(null), C = c(0), w = !1;
		function ee() {
			let e = Ne({
				images: h.images,
				links: h.links
			});
			x.value = e, S.value = Ci(e);
		}
		function T() {
			ee();
			let e = S.value.parseMarkdown(h.modelValue || ""), t = f.create({
				doc: e,
				plugins: ea({
					schema: x.value,
					placeholder: h.placeholder,
					readonly: h.readonly
				})
			});
			b.value = new _(y.value, {
				state: t,
				editable: () => !h.readonly,
				attributes: { class: "editor-content" },
				dispatchTransaction(e) {
					let t = b.value.state.apply(e);
					if (b.value.updateState(t), C.value++, e.docChanged && !w) {
						let e = S.value.serializeMarkdown(t.doc);
						g("update:modelValue", e), g("change", e);
					}
				}
			}), te(), g("ready", b.value);
		}
		function te() {
			b.value && (b.value._editorCoreRequests = {
				link: h.onRequestLink || null,
				image: h.onRequestImage || null
			});
		}
		function ne() {
			b.value &&= (b.value.destroy(), null);
		}
		function re(e) {
			if (!(!b.value || !S.value)) {
				w = !0;
				try {
					let t = S.value.parseMarkdown(e || ""), n = f.create({
						doc: t,
						plugins: b.value.state.plugins,
						selection: void 0
					});
					b.value.updateState(n), C.value++;
				} finally {
					w = !1;
				}
			}
		}
		function ie() {
			return !b.value || !S.value ? h.modelValue || "" : S.value.serializeMarkdown(b.value.state.doc);
		}
		function ae(e, ...t) {
			let n = Ji[e];
			if (!n || !b.value) return !1;
			let r;
			r = n.length >= 1 ? n(x.value, ...t) : n(...t);
			let i = b.value.state, a = r(i, b.value.dispatch, b.value), o = b.value._editorCoreAsyncPending === !0;
			return b.value._editorCoreAsyncPending = !1, o || b.value.focus(), a;
		}
		function oe() {
			b.value && b.value.focus();
		}
		u(() => h.modelValue, (e) => {
			if (!b.value || !S.value || w) return;
			let t = S.value.serializeMarkdown(b.value.state.doc);
			(e || "") !== t && re(e);
		}), u(() => h.readonly, () => {
			b.value && b.value.updateState(b.value.state);
		}), u(() => [h.images, h.links], () => {
			let e = ie();
			ne(), T(), e && re(e);
		}), u(() => h.placeholder, (e) => {
			if (!b.value) return;
			let t = b.value.state.tr.setMeta(Qi, e || "");
			b.value.dispatch(t);
		}), u(() => [h.onRequestLink, h.onRequestImage], () => {
			te();
		}), o(() => {
			T();
		}), a(() => {
			ne();
		});
		let se = {
			focus: oe,
			getMarkdown: ie,
			setMarkdown: re,
			execCommand: ae,
			get view() {
				return b.value;
			}
		};
		p(se);
		let E = e(() => h.toolbar === !0 || h.toolbar === "minimal");
		return (e, a) => (s(), r("div", {
			ref_key: "rootEl",
			ref: v,
			class: "editor-root",
			dir: d.dir
		}, [E.value ? (s(), t(xe, {
			key: 0,
			editor: se,
			dir: d.dir
		}, null, 8, ["dir"])) : n("", !0), i("div", {
			ref_key: "mountEl",
			ref: y,
			class: "editor-mount",
			"data-revision": C.value
		}, null, 8, na)], 8, ta));
	}
};
//#endregion
export { ra as Editor, ke as MAX_HEADING_LEVEL, xe as Toolbar, Ne as buildSchema, Ci as createMarkdownIO, $ as isValidHttpUrl, Ti as parseMarkdown, Me as schema, Ei as serializeMarkdown };

//# sourceMappingURL=editor.js.map