/* Personal Startpage — backend bridge
   This file is the single communication layer between the GitHub Pages frontend
   and the Render backend. It keeps the backend reachable, exposes health state,
   and gives the app one safe place for API requests.
*/
(function(){
  const DEFAULT_API='https://personal-startpage.onrender.com';
  const STORAGE_KEY='personal-startpage-api';
  const HEARTBEAT_MS=4*60*1000;

  function base(){
    return (localStorage.getItem(STORAGE_KEY)||DEFAULT_API).trim().replace(/\\/$/,'');
  }

  async function request(path, options={}){
    const url=path.startsWith('http')?path:base()+(path.startsWith('/')?path:'/'.concat(path));
    const headers=Object.assign({'Accept':'application/json'},options.body?{'Content-Type':'application/json'}:{},options.headers||{});
    const response=await fetch(url,Object.assign({},options,{headers}));
    const type=response.headers.get('content-type')||'';
    const data=type.includes('application/json')?await response.json():await response.text();
    if(!response.ok){
      const message=(data&&typeof data==='object'&&(data.message||data.error))||('Backend returned HTTP '+response.status);
      const error=new Error(message);
      error.status=response.status;
      error.data=data;
      throw error;
    }
    return data;
  }

  async function health(){
    try{
      const data=await request('/health',{method:'GET',cache:'no-store'});
      window.dispatchEvent(new CustomEvent('backend:status',{detail:{online:true,data}}));
      return {online:true,data};
    }catch(error){
      window.dispatchEvent(new CustomEvent('backend:status',{detail:{online:false,error}}));
      return {online:false,error};
    }
  }

  async function ai(message,context){
    const payload={message,prompt:message,context};
    const routes=['/api/ai/chat','/api/chat','/api/assistant/chat'];
    let lastError;
    for(const path of routes){
      try{
        const data=await request(path,{method:'POST',body:JSON.stringify(payload)});
        window.dispatchEvent(new CustomEvent('backend:status',{detail:{online:true,data}}));
        return data;
      }catch(error){
        lastError=error;
        if(error.status!==404) break;
      }
    }
    throw lastError||new Error('AI endpoint not available');
  }

  function startHeartbeat(){
    health();
    setInterval(()=>{if(document.visibilityState!=='hidden')health()},HEARTBEAT_MS);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')health()});
  }

  window.PersonalBackend={base,request,health,ai,startHeartbeat};
  startHeartbeat();
})();