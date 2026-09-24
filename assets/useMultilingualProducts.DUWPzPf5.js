import{u as g,d as c,e as l}from"./data.BXqlF9SM.js";import{u as m,s as i}from"./index.i9wpllDo.js";const y=()=>{const{currentLanguage:o}=m();return g({queryKey:["multilingual_products",o],queryFn:async()=>{const{data:t,error:r}=await i.from("products").select(`
          id,
          category_id,
          image_url,
          price,
          is_new,
          is_featured,
          created_at,
          updated_at,
          product_translations!inner(
            id,
            name,
            description,
            slug,
            language_code
          ),
          categories(
            id,
            name,
            slug
          )
        `).eq("product_translations.language_code",o).order("created_at",{ascending:!1});if(r)throw console.error("Error fetching products:",r),r;return(t==null?void 0:t.map(n=>{var a,s,u,e,d,p;return{...n,name:((s=(a=n.product_translations)==null?void 0:a[0])==null?void 0:s.name)||"",description:((e=(u=n.product_translations)==null?void 0:u[0])==null?void 0:e.description)||"",slug:((p=(d=n.product_translations)==null?void 0:d[0])==null?void 0:p.slug)||""}}))||[]},enabled:!!o})},w=()=>{const o=c();return l({mutationFn:async({productData:t,translations:r})=>{const{data:n,error:a}=await i.from("products").insert(t).select().single();if(a)throw console.error("Error creating product:",a),a;const s=Object.entries(r).map(([u,e])=>e.name?i.from("product_translations").insert({product_id:n.id,language_code:u,name:e.name,description:e.description||"",slug:e.slug||e.name.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}):null).filter(Boolean);return await Promise.all(s),n},onSuccess:()=>{o.invalidateQueries({queryKey:["multilingual_products"]})}})},q=()=>{const o=c();return l({mutationFn:async({productId:t,productData:r,translations:n})=>{const{error:a}=await i.from("products").update(r).eq("id",t);if(a)throw console.error("Error updating product:",a),a;const s=Object.entries(n).map(([u,e])=>e.name?i.from("product_translations").upsert({product_id:t,language_code:u,name:e.name,description:e.description||"",slug:e.slug||e.name.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),updated_at:new Date().toISOString()},{onConflict:"product_id,language_code"}):null).filter(Boolean);await Promise.all(s)},onSuccess:()=>{o.invalidateQueries({queryKey:["multilingual_products"]})}})},C=()=>{const o=c();return l({mutationFn:async t=>{const{error:r}=await i.from("products").delete().eq("id",t);if(r)throw console.error("Error deleting product:",r),r},onSuccess:()=>{o.invalidateQueries({queryKey:["multilingual_products"]})}})};export{w as a,q as b,C as c,y as u};
