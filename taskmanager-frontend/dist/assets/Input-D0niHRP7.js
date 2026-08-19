import{c as i,r as n,j as s,g as x,f as y}from"./index-DuABDF-H.js";/**
 * @license lucide-react v0.408.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=i("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.408.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=i("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),v=n.forwardRef(function({label:r,error:e,hint:c,icon:t,type:o="text",className:p,wrapperClassName:d,...h},m){const[l,j]=n.useState(!1),a=o==="password",u=a?l?"text":"password":o;return s.jsxs("div",{className:x("w-full",d),children:[r&&s.jsx("label",{className:"form-label",children:r}),s.jsxs("div",{className:"relative",children:[t&&s.jsx("span",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",children:s.jsx(t,{className:"w-4 h-4"})}),s.jsx("input",{ref:m,type:u,className:x("input",t&&"pl-10",a&&"pr-10",e&&"input-error",p),...h}),a&&s.jsx("button",{type:"button",onClick:()=>j(w=>!w),className:"absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",tabIndex:-1,"aria-label":l?"Hide password":"Show password",children:l?s.jsx(f,{className:"w-4 h-4"}):s.jsx(N,{className:"w-4 h-4"})}),e&&!a&&s.jsx("span",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-red-400",children:s.jsx(y,{className:"w-4 h-4"})})]}),e&&s.jsx("p",{className:"form-error",children:e}),c&&!e&&s.jsx("p",{className:"text-xs text-slate-500 mt-1",children:c})]})});export{N as E,v as I};
