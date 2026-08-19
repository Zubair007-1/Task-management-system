import{c as d,r as x,j as e,g as l}from"./index-DuABDF-H.js";/**
 * @license lucide-react v0.408.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=d("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),j=x.forwardRef(function({label:n,error:a,options:t=[],placeholder:r="Select…",className:c,wrapperClassName:i,...o},u){return e.jsxs("div",{className:l("w-full",i),children:[n&&e.jsx("label",{className:"form-label",children:n}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{ref:u,className:l("input appearance-none pr-10 cursor-pointer",a&&"input-error",c),...o,children:[r&&e.jsx("option",{value:"",disabled:!0,children:r}),t.map(s=>typeof s=="string"?e.jsx("option",{value:s,children:s},s):e.jsx("option",{value:s.value,children:s.label},s.value))]}),e.jsx(m,{className:"absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"})]}),a&&e.jsx("p",{className:"form-error",children:a})]})});export{m as C,j as S};
