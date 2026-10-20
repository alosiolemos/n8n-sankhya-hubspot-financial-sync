// Execute: node tests/validar-codigo.cjs. Sem rede, API, banco ou execução n8n.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const meta=JSON.parse(fs.readFileSync(path.join(__dirname,'inventario-codigo.json'),'utf8'));
const results=[];
function test(name,fn){fn();results.push({teste:name,resultado:'passou'});}
function run(name,options={}){
 const e=meta.codes.find(c=>c.name===name),body=fs.readFileSync(path.join(base,e.path),'utf8');
 const context={$json:options.json||{},$input:{all:()=>options.items||[]},$:options.node||(()=>({first:()=>({json:{}})})),$thisRunIndex:options.runIndex||0,items:options.items||[{json:{after:'cursor-demo'}}],$items:options.history||(()=>{throw Error('fim simulado');}),$item:()=>({$node:{'Paginação HubSpot':{json:{paging:{next:{after:'cursor-next'}}}}}}),Date:options.Date||Date,console:{log:()=>{},error:()=>{}}};
 return vm.runInNewContext('(function(){'+body+'})()',context,{timeout:1000});
}
test('Sintaxe dos corpos JavaScript',()=>{for(const e of meta.codes)new Function(fs.readFileSync(path.join(base,e.path),'utf8'));});
test('Estrutura pública e conexões válidas',()=>{
 const text=fs.readFileSync(path.join(base,'workflows/workflow.template.json'),'utf8'),w=JSON.parse(text);
 assert.equal(w.active,false);assert.deepEqual(w.pinData,{});assert.equal(w.nodes.length,meta.total);assert.equal(w.nodes.filter(n=>n.disabled).length,meta.disabled);assert.equal(w.nodes.filter(n=>n.credentials).length,0);
 const names=new Set(w.nodes.map(n=>n.name));for(const [source,groups]of Object.entries(w.connections)){assert.ok(names.has(source));for(const outputs of Object.values(groups))for(const links of outputs)for(const link of links)assert.ok(names.has(link.node),link.node);}
 for(const n of w.nodes.filter(n=>/gmail|httpRequest|hubspot|webhook|scheduleTrigger|\.cron$/.test(n.type)))assert.equal(n.disabled,true,n.name);
 assert.equal(/pat-[A-Za-z0-9_-]{10,}|AIza[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{15,}\./.test(text),false);
});

test('Cursores de paginação iniciam e avançam',()=>{assert.equal(run('paginacao3').after,0);assert.equal(run('paginacao3',{runIndex:1}).after,'cursor-demo');assert.equal(run('prox_pag3').after,'cursor-next');});
test('Agrega duas páginas de histórico simuladas',()=>{const out=run('all',{history:(name,index,n)=>{if(n>1)throw Error('fim');return [{json:{results:[{id:'pagina-'+n}]}}];}});assert.equal(out.length,2);assert.equal(out[1].id,'pagina-1');});
test('Separa results em itens individuais',()=>{const out=run('Code1',{items:[{json:{results:[{id:'a'},{id:'b'}]}}]});assert.equal(out.length,2);assert.equal(out[1].json.id,'b');});
test('Datas delimitam o mês do relógio simulado',()=>{class Clock extends Date{constructor(...args){super(...(args.length?args:[2026,9,20,12,0,0]));}}const out=run('Datas',{Date:Clock})[0].json;assert.equal(out.first_day_of_month,'01/10/2026');assert.equal(out.last_day_of_month,'31/10/2026');});
for(const name of ['PAGAMENTO ACUMULADO','Pagamento']){
 test(name+': soma arrays e objeto único',()=>{
   const row=(id,value,date)=>({f0:{$:id},f1:{$:value},f2:{$:date},f3:{$:'01/10/2026'}});
   const out=run(name,{items:[{json:{entities:[row('1','10.20','02/10/2026'),row('2','20.30','03/10/2026')]}},{json:{entities:row('3','5','04/10/2026')}}]})[0].json;assert.equal(out.ValorPago,35.5);assert.equal(out.NRUNICO,3);assert.equal(out.UltimoPagamento,'04/10/2026');
 });
 test(name+': entrada vazia retorna zero e referência nula',()=>{const out=run(name,{items:[{json:{}}]})[0].json;assert.equal(out.ValorPago,0);assert.equal(out.NRUNICO,null);});
}
for(const name of ['Cruzar Natureza com Pagamento','Cruzar Natureza com Pagamento1'])test(name+': relaciona nota, produto e natureza',()=>{
 const data={entities:{f1:{$:'100'},f5:{$:'N1'},f6:{$:'NOTA1'}},natureza:{f0:{$:'N1'},f1:{$:'Receita Demo'}},item_nota:[{f1:{$:'100'},f2:{$:'NOTA1'},f4:{$:'RECEITA SAAS - DEMO'}},{f1:{$:'100'},f2:{$:'NOTA1'},f4:{$:'RECEITA SAAS - DEMO'}}]};
 const out=run(name,{node:()=>({first:()=>({json:data})})})[0].json.observacoes;assert.ok(out.includes('Receita Demo'));assert.equal(out.split('(Demo:').length-1,1);assert.ok(out.includes('100,00'));
});

const report={escopo:'Testes locais de JavaScript e estrutura JSON, sem n8n ou sistemas reais',total:results.length,testes:results};
fs.writeFileSync(path.join(__dirname,'resultados-testes.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
