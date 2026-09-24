import{u as y,d as u,e as c}from"./data.BXqlF9SM.js";import{u as m,s as n}from"./index.i9wpllDo.js";const q=()=>{const{currentLanguage:r}=m();return y({queryKey:["multilingual_articles",r],queryFn:async()=>{const{data:a,error:i}=await n.from("articles").select(`
          id,
          author,
          category,
          image_url,
          is_featured,
          published_at,
          created_at,
          updated_at,
          article_translations!inner(
            id,
            title,
            excerpt,
            content,
            slug,
            language_code
          )
        `).eq("article_translations.language_code",r).order("published_at",{ascending:!1});if(i)throw console.error("Error fetching articles:",i),i;return(a==null?void 0:a.map(e=>{var s,l,o,t,g,d,_,p;return{...e,title:((l=(s=e.article_translations)==null?void 0:s[0])==null?void 0:l.title)||"",excerpt:((t=(o=e.article_translations)==null?void 0:o[0])==null?void 0:t.excerpt)||"",content:((d=(g=e.article_translations)==null?void 0:g[0])==null?void 0:d.content)||"",slug:((p=(_=e.article_translations)==null?void 0:_[0])==null?void 0:p.slug)||""}}))||[]},enabled:!!r})},S=()=>{const r=u();return c({mutationFn:async({articleData:a,translations:i})=>{const{data:e,error:s}=await n.from("articles").insert(a).select().single();if(s)throw console.error("Error creating article:",s),s;const l=Object.entries(i).map(([o,t])=>t.title?n.from("article_translations").insert({article_id:e.id,language_code:o,title:t.title,excerpt:t.excerpt||"",content:t.content||"",slug:t.slug||t.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}):null).filter(Boolean);return await Promise.all(l),e},onSuccess:()=>{r.invalidateQueries({queryKey:["multilingual_articles"]})}})},h=()=>{const r=u();return c({mutationFn:async({articleId:a,articleData:i,translations:e})=>{const{error:s}=await n.from("articles").update(i).eq("id",a);if(s)throw console.error("Error updating article:",s),s;const l=Object.entries(e).map(([o,t])=>t.title?n.from("article_translations").upsert({article_id:a,language_code:o,title:t.title,excerpt:t.excerpt||"",content:t.content||"",slug:t.slug||t.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),updated_at:new Date().toISOString()},{onConflict:"article_id,language_code"}):null).filter(Boolean);await Promise.all(l)},onSuccess:()=>{r.invalidateQueries({queryKey:["multilingual_articles"]})}})},x=()=>y({queryKey:["site_settings"],queryFn:async()=>{const{data:r,error:a}=await n.from("site_settings").select("*").order("key");if(a)throw a;const i={};return r==null||r.forEach(e=>{i[e.key]=e.value}),i}}),C=()=>{const r=u();return c({mutationFn:async({key:a,value:i})=>{const{error:e}=await n.from("site_settings").update({value:i,updated_at:new Date().toISOString()}).eq("key",a);if(e)throw e},onSuccess:()=>{r.invalidateQueries({queryKey:["site_settings"]})}})};export{x as a,S as b,h as c,C as d,q as u};
