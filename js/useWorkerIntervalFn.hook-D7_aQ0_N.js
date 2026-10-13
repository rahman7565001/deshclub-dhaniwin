import{P as m,aj as d,r as v}from"./index-BgAwOX9Q.js";function p(r,o,l={immediate:!1}){const t=v(!1);let e=null;const i=()=>{const n=`
      let intervalId = null;
      self.onmessage = (e) => {
        const { command, interval } = e.data;

        switch (command) {
          case 'start':
            if (!intervalId) {
              intervalId = setInterval(() => postMessage('tick'), interval);
            }
            break;
          case 'pause':
            clearInterval(intervalId);
            intervalId = null;
            break;
        }
      };
    `,u=new Blob([n],{type:"application/javascript"});return new Worker(URL.createObjectURL(u))},a=()=>{e&&(t.value=!0,e.postMessage({command:"start",interval:o}))},s=()=>{e&&(t.value=!1,e.postMessage({command:"pause"}))},c=()=>{t.value||a()};return m(()=>{e=i(),e.onmessage=n=>{n.data==="tick"&&r()},l.immediate&&a()}),d(()=>{s(),e==null||e.terminate(),e=null}),{start:a,pause:s,resume:c,isActive:t}}export{p as u};
