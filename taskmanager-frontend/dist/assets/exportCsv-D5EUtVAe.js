import{c as u}from"./index-DuABDF-H.js";/**
 * @license lucide-react v0.408.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=u("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);function h(o,s="export"){if(!o||o.length===0)return;const t=Object.keys(o[0]),r=o.map(d=>t.map(a=>{const p=d[a]??"",n=String(p).replace(/"/g,'""');return n.includes(",")||n.includes('"')||n.includes(`
`)?`"${n}"`:n}).join(",")),l=[t.join(","),...r].join(`
`),i=new Blob([l],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(i),e=document.createElement("a");e.href=c,e.download=`${s}.csv`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(c)}export{y as D,h as e};
