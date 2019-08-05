// import {EMFJS, RTFJS, WMFJS} from "rtf.js";
//
// const rtf: string =
//         `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
//     {\\*\\generator Msftedit 5.41.21.2510;}\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang9\\f0\\fs22 This \\fs44 is \\fs22 a \\b simple \\ul one \\i paragraph \\ulnone\\b0 document\\i0 .\\par
//     }`;
//
// function stringToArrayBuffer(string: string) {
//     var buffer = new ArrayBuffer(string.length);
//     var bufferView = new Uint8Array(buffer);
//     for (var i=0; i<string.length; i++) {
//         bufferView[i] = string.charCodeAt(i);
//     }
//     return buffer;
// }
//
// RTFJS.loggingEnabled(false);
// WMFJS.loggingEnabled(false);
// EMFJS.loggingEnabled(false);
//
// const doc = new RTFJS.Document(stringToArrayBuffer(rtf), {});
//
// const meta = doc.metadata();
// doc.render().then(function(htmlElements) {
//     console.log(meta);
//     console.log(htmlElements);
// }).catch(error => console.error(error));
// //b