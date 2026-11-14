/* Tax ID check-digit validators (own implementation). Each entry: v(s) gets the cleaned number (no country prefix, upper case, no spaces or dashes) and returns
   {ok:true} | {ok:false, why:'...'} | {ok:null, why:'...'} (null = format of this variant is not checked here).  Used by the site and by verify.js (node). */
(function (root) {
  'use strict';
  function dg(s) { return s.split('').map(Number); }
  function sw(ws, ds) { var t = 0; for (var i = 0; i < ws.length; i++) t += ws[i] * ds[i]; return t; }
  function luhn(s) { var t = 0, d = dg(s).reverse(); for (var i = 0; i < d.length; i++) { var x = d[i]; if (i % 2) { x *= 2; if (x > 9) x -= 9; } t += x; } return t % 10 === 0; }
  function iso7064(ds) { var p = 10; for (var i = 0; i < ds.length; i++) { var s = (ds[i] + p) % 10; if (s === 0) s = 10; p = (2 * s) % 11; } return (11 - p) % 10; }
  var BAD = { ok: false, why: 'The check digit does not match the other digits.' };
  var OK = { ok: true };
  function fmt(re, what) { return function (s) { return re.test(s) ? OK : { ok: false, why: 'Wrong format: ' + what + '.' }; }; }
  function chain(re, what, fn) { return function (s) { if (!re.test(s)) return { ok: false, why: 'Wrong format: ' + what + '.' }; return fn(s); }; }
  var V = {};
  V.AT = { name: 'Austria', kind: 'VAT number (UID)', pre: 'AT', v: chain(/^U\d{8}$/, 'the letter U and 8 digits', function (s) {
    var d = dg(s.slice(1)), t = 0, w = [1, 2, 1, 2, 1, 2, 1]; for (var i = 0; i < 7; i++) { var x = d[i] * w[i]; t += Math.floor(x / 10) + x % 10; }
    return (10 - (t + 4) % 10) % 10 === d[7] ? OK : BAD; }) };
  V.BE = { name: 'Belgium', kind: 'VAT / company number', pre: 'BE', v: chain(/^[01]?\d{9}$/, '10 digits starting with 0 or 1 (a leading 0 may be left out)', function (s) {
    if (s.length === 9) s = '0' + s; if (!/^[01]/.test(s)) return { ok: false, why: 'Wrong format: 10 digits starting with 0 or 1.' };
    return (parseInt(s.slice(0, 8), 10) + parseInt(s.slice(8), 10)) % 97 === 0 ? OK : BAD; }) };
  V.DE = { name: 'Germany', kind: 'VAT number (USt-IdNr.)', pre: 'DE', v: chain(/^[1-9]\d{8}$/, '9 digits, not starting with 0', function (s) {
    var d = dg(s); return iso7064(d.slice(0, 8)) === d[8] ? OK : BAD; }) };
  V.DK = { name: 'Denmark', kind: 'VAT number (CVR)', pre: 'DK', v: chain(/^[1-9]\d{7}$/, '8 digits, not starting with 0', function (s) {
    return sw([2, 7, 6, 5, 4, 3, 2, 1], dg(s)) % 11 === 0 ? OK : BAD; }) };
  V.FI = { name: 'Finland', kind: 'VAT number (ALV)', pre: 'FI', v: chain(/^\d{8}$/, '8 digits', function (s) {
    var d = dg(s), c = 11 - sw([7, 9, 10, 5, 8, 4, 2], d) % 11; if (c === 11) c = 0; return c === d[7] ? OK : BAD; }) };
  V.FR = { name: 'France', kind: 'VAT number (TVA)', pre: 'FR', v: chain(/^[0-9A-HJ-NP-Z]{2}\d{9}$/, '2 characters and the 9-digit SIREN', function (s) {
    if (!/^\d{2}/.test(s)) return { ok: null, why: 'Keys with letters (used for some companies) are not checked here.' };
    var siren = s.slice(2); if (!luhn(siren)) return { ok: false, why: 'The 9-digit SIREN part fails its own check.' };
    return (12 + 3 * (parseInt(siren, 10) % 97)) % 97 === parseInt(s.slice(0, 2), 10) ? OK : BAD; }) };
  V.IT = { name: 'Italy', kind: 'VAT number (Partita IVA)', pre: 'IT', v: chain(/^\d{11}$/, '11 digits', function (s) {
    if (/^0{7}/.test(s)) return { ok: false, why: 'The first seven digits cannot all be zero.' };
    var p = parseInt(s.slice(7, 10), 10); if (p > 100 && p !== 120 && p !== 121 && p !== 888 && p !== 999) return { ok: false, why: 'Digits 8 to 10 (the tax office code) are not a valid code.' };
    return luhn(s) ? OK : BAD; }) };
  V.LU = { name: 'Luxembourg', kind: 'VAT number', pre: 'LU', v: chain(/^\d{8}$/, '8 digits', function (s) {
    return parseInt(s.slice(0, 6), 10) % 89 === parseInt(s.slice(6), 10) ? OK : BAD; }) };
  V.PL = { name: 'Poland', kind: 'VAT number (NIP)', pre: 'PL', v: chain(/^\d{10}$/, '10 digits', function (s) {
    var d = dg(s), c = sw([6, 5, 7, 2, 3, 4, 5, 6, 7], d) % 11; return c !== 10 && c === d[9] ? OK : BAD; }) };
  V.PT = { name: 'Portugal', kind: 'VAT number (NIF)', pre: 'PT', v: chain(/^[1-9]\d{8}$/, '9 digits, not starting with 0', function (s) {
    var d = dg(s), c = 11 - sw([9, 8, 7, 6, 5, 4, 3, 2], d) % 11; if (c >= 10) c = 0; return c === d[8] ? OK : BAD; }) };
  V.SE = { name: 'Sweden', kind: 'VAT number (momsnummer)', pre: 'SE', v: chain(/^\d{10}01$/, '10 digits followed by 01', function (s) { return luhn(s.slice(0, 10)) ? OK : BAD; }) };
  V.CZ = { name: 'Czechia', kind: 'VAT number (DIČ)', pre: 'CZ', v: function (s) {
    if (!/^\d{8,10}$/.test(s)) return { ok: false, why: 'Wrong format: 8 to 10 digits.' };
    if (s.length !== 8) return { ok: null, why: 'Only the 8-digit company form is checked here, not the 9 and 10-digit personal forms.' };
    if (s[0] === '9') return { ok: false, why: 'An 8-digit number cannot start with 9.' };
    var d = dg(s), c = (11 - sw([8, 7, 6, 5, 4, 3, 2], d)) % 11; c = ((c % 11 + 11) % 11 || 1) % 10; return c === d[7] ? OK : BAD; } };
  V.HU = { name: 'Hungary', kind: 'VAT number (ANUM)', pre: 'HU', v: chain(/^\d{8}$/, '8 digits', function (s) { return sw([9, 7, 3, 1, 9, 7, 3, 1], dg(s)) % 10 === 0 ? OK : BAD; }) };
  V.RO = { name: 'Romania', kind: 'VAT number (CUI)', pre: 'RO', v: function (s) {
    if (!/^\d{2,13}$/.test(s)) return { ok: false, why: 'Wrong format: 2 to 10 digits (13 for individuals).' };
    if (s.length > 10) return { ok: null, why: 'The 13-digit personal number is not checked here.' };
    if (s[0] === '0') return { ok: false, why: 'The number cannot start with 0.' };
    var p = ('0000000000' + s).slice(-10), d = dg(p), c = (sw([7, 5, 3, 2, 1, 7, 5, 3, 2], d) * 10 % 11) % 10; return c === d[9] ? OK : BAD; } };
  function birthNo(s) { // Slovak / Czech birth number, 10 digits: date YYMMDD (month +50 women, +20 extra) and a check digit
    var yy = +s.slice(0, 2), mm = +s.slice(2, 4), dd = +s.slice(4, 6); mm = mm % 50 % 20;
    var y = yy < 54 ? 2000 + yy : 1900 + yy, dt = new Date(Date.UTC(y, mm - 1, dd)); if (mm < 1 || mm > 12 || dt.getUTCMonth() !== mm - 1 || dt.getUTCDate() !== dd) return false;
    return String(parseInt(s.slice(0, 9), 10) % 11 % 10) === s[9]; }
  V.SK = { name: 'Slovakia', kind: 'VAT number (IČ DPH)', pre: 'SK', v: chain(/^[1-9]\d{9}$/, '10 digits, not starting with 0', function (s) {
    var good = parseInt(s, 10) % 11 === 0 && '234789'.indexOf(s[2]) > -1;
    if (good) return OK;
    if (birthNo(s)) return { ok: null, why: 'This passes the Slovak birth-number test, which is also accepted in place of a VAT number; it is not checked as a VAT number here.' };
    return parseInt(s, 10) % 11 !== 0 ? BAD : { ok: false, why: 'The third digit must be 2, 3, 4, 7, 8 or 9.' }; }) };
  V.SI = { name: 'Slovenia', kind: 'VAT number (ID za DDV)', pre: 'SI', v: chain(/^[1-9]\d{7}$/, '8 digits, not starting with 0', function (s) {
    var d = dg(s), c = 11 - sw([8, 7, 6, 5, 4, 3, 2], d) % 11; if (c === 10) c = 0; return c === d[7] ? OK : BAD; }) };
  V.HR = { name: 'Croatia', kind: 'VAT number (OIB)', pre: 'HR', v: chain(/^\d{11}$/, '11 digits', function (s) { var d = dg(s); return iso7064(d.slice(0, 10)) === d[10] ? OK : BAD; }) };
  V.LV = { name: 'Latvia', kind: 'VAT number', pre: 'LV', v: function (s) {
    if (!/^\d{11}$/.test(s)) return { ok: false, why: 'Wrong format: 11 digits.' };
    if (+s[0] <= 3) return { ok: null, why: 'Numbers of individuals (starting 0 to 3) are not checked here.' };
    return sw([9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1], dg(s)) % 11 === 3 ? OK : BAD; } };
  V.MT = { name: 'Malta', kind: 'VAT number', pre: 'MT', v: chain(/^[1-9]\d{7}$/, '8 digits, not starting with 0', function (s) {
    return sw([3, 4, 6, 7, 8, 9, 10, 1], dg(s)) % 37 === 0 ? OK : BAD; }) };
  V.EE = { name: 'Estonia', kind: 'VAT number (KMKR)', pre: 'EE', v: chain(/^10\d{7}$/, '9 digits starting with 10', function (s) {
    var d = dg(s); return (10 - sw([3, 7, 1, 3, 7, 1, 3, 7], d) % 10) % 10 === d[8] ? OK : BAD; }) };
  V.GR = { name: 'Greece', kind: 'VAT number (AFM)', pre: 'EL', alt: ['GR'], v: chain(/^\d{9}$/, '9 digits', function (s) {
    var d = dg(s), t = 0; for (var i = 0; i < 8; i++) t += d[i] * Math.pow(2, 8 - i); return (t % 11) % 10 === d[8] ? OK : BAD; }) };
  V.GB = { name: 'United Kingdom', kind: 'VAT number', pre: 'GB', v: function (s) {
    if (!/^\d{9}(\d{3})?$/.test(s)) return { ok: null, why: 'Only the 9 and 12-digit forms are checked here (not GD/HA numbers).' };
    var n = s.slice(0, 9); if (/^000/.test(n)) return { ok: false, why: 'The number cannot start with 000.' };
    var r = sw([8, 7, 6, 5, 4, 3, 2, 10, 1], dg(n)) % 97, big = parseInt(n.slice(0, 3), 10) >= 100; return (r === 0 || (big && (r === 42 || r === 55))) ? OK : BAD; } };
  V.NO = { name: 'Norway', kind: 'VAT number (organisasjonsnummer + MVA)', pre: 'NO', v: function (s) {
    s = s.replace(/MVA$/, ''); if (!/^\d{9}$/.test(s)) return { ok: false, why: 'Wrong format: 9 digits, usually followed by MVA.' };
    var d = dg(s), c = 11 - sw([3, 2, 7, 6, 5, 4, 3, 2], d) % 11; if (c === 11) c = 0; return c !== 10 && c === d[8] ? OK : BAD; } };
  V.CH = { name: 'Switzerland', kind: 'VAT number (UID, MWST)', pre: 'CHE', v: function (s) {
    s = s.replace(/(MWST|TVA|IVA)$/, ''); if (!/^\d{9}$/.test(s)) return { ok: false, why: 'Wrong format: CHE and 9 digits, usually followed by MWST, TVA or IVA.' };
    var d = dg(s), c = 11 - sw([5, 4, 3, 2, 7, 6, 5, 4], d) % 11; if (c === 11) c = 0; return c !== 10 && c === d[8] ? OK : BAD; } };
  var B36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  V.GSTIN = { name: 'India', kind: 'GSTIN (GST number)', pre: '', v: function (s) {
    if (!/^\d{2}[A-Z]{3}[ABCFGHLJPT][A-Z]\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(s)) return { ok: false, why: 'Wrong format: 2 digits, a 10-character PAN, one more character, Z and a check character.' };
    var st = parseInt(s.slice(0, 2), 10); if (st < 1 || (st > 38 && st !== 97 && st !== 99)) return { ok: false, why: 'The first two digits are not a valid state or union territory code.' };
    var t = 0; for (var i = 0; i < 14; i++) { var v = B36.indexOf(s[i]) * (i % 2 ? 2 : 1); t += Math.floor(v / 36) + v % 36; }
    return B36[(36 - t % 36) % 36] === s[14] ? OK : BAD; } };
  V.PAN = { name: 'India', kind: 'PAN (income-tax number)', pre: '', v: fmt(/^[A-Z]{3}[ABCFGHLJPT][A-Z]\d{4}[A-Z]$/, '5 letters, 4 digits and 1 letter, the fourth letter being the holder type (P, C, H, F, A, T, B, L, J or G)') };
  V.ABN = { name: 'Australia', kind: 'ABN', pre: '', v: chain(/^\d{11}$/, '11 digits', function (s) {
    if (parseInt(s.slice(0, 2), 10) < 11) return { ok: false, why: 'The first two digits (the check digits) cannot be below 11.' };
    var d = dg(s); d[0] -= 1; return sw([10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19], d) % 89 === 0 ? OK : BAD; }) };
  V.CNPJ = { name: 'Brazil', kind: 'CNPJ', pre: '', v: chain(/^\d{14}$/, '14 digits', function (s) {
    var d = dg(s), a = sw([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], d) % 11; a = a < 2 ? 0 : 11 - a;
    var b = sw([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], d.slice(0, 12).concat([a])) % 11; b = b < 2 ? 0 : 11 - b; return a === d[12] && b === d[13] ? OK : BAD; }) };
  function clean(raw, key) {
    var s = String(raw).toUpperCase().replace(/[\s.\-\/]/g, ''), e = V[key];
    if (e && e.pre && s.indexOf(e.pre) === 0) s = s.slice(e.pre.length);
    else if (e && e.alt) for (var i = 0; i < e.alt.length; i++) if (s.indexOf(e.alt[i]) === 0) { s = s.slice(2); break; }
    return s;
  }
  function check(key, raw) { var s = clean(raw, key); if (!s) return { ok: false, why: 'Nothing to check.' }; return V[key].v(s); }
  var api = { V: V, check: check, clean: clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TAXID = api;
})(typeof window !== 'undefined' ? window : this);
