

const DATA_SOURCES = [
  {
    name:"ClimateScanner / Painel ClimaBrasil",
    url:"https://climatescanner.org/pt/panorama-local-do-brasil/",
    role:"Fonte principal",
    covers:"Governança climática, políticas públicas e finanças climáticas — metodologia aplicada aos estados e municípios brasileiros."
  },
  {
    name:"CEMADEN",
    url:"https://www.gov.br/cemaden/",
    role:"Fonte complementar",
    covers:"Monitoramento de seca e alertas de desastres."
  },
  {
    name:"ANA",
    url:"https://www.ana.gov.br/",
    role:"Fonte complementar",
    covers:"Disponibilidade hídrica e níveis de reservatórios."
  },
  {
    name:"INPE — Queimadas",
    url:"https://queimadas.dgi.inpe.br/",
    role:"Fonte complementar",
    covers:"Focos de calor e área queimada por satélite."
  },
  {
    name:"INMET",
    url:"https://portal.inmet.gov.br/",
    role:"Fonte complementar",
    covers:"Precipitação, temperatura e previsão sazonal."
  }
];

const CLIMATE_SCANNER_PILLARS = [
  "Leis ambiciosas","Instituições fortes","Combate às causas","Ajuste aos efeitos",
  "Orçamento para o clima","Justiça climática","Mapear riscos","Atuação coordenada",
  "Acesso a recursos","Engajamento amplo","Proteger de desastres","Manter acesso à água",
  "Garantir boa saúde","Planejar seu território","Transporte sustentável"
];

const CLIMATE_SCANNER_AXES = {
  governanca:["Quadro legal e regulatório","Estrutura governamental","Gestão de riscos","Coordenação horizontal e vertical","Engajamento das partes interessadas","Justiça climática","Atuação do Legislativo e Judiciário"],
  politicas:["Estratégias de mitigação","Estratégias de adaptação","Políticas públicas e mitigação","Políticas públicas e adaptação","Defesa civil e risco de desastre"],
  financas:["Finanças e gastos públicos","Captação de recursos","Mobilização de investimentos privados"]
};

const COLORS={critico:"#e32b25",alto:"#ec912b",medio:"#EAC917",baixo:"#7fbd66",muitobaixo:"#2f6f37"};
const REGIOES={
 norte:{nome:"Norte Piauiense",alerta:"Alerta Crítico",nivel:"critico",risco:"Risco Crítico",sub:"Nível de ameaça muito alto",persistencia:"> 95%",seca:"Severa/Extrema",agua:"Baixa disponibilidade",focos:"Elevado",culturas:"Arroz, Feijão, Milho",deficit:"-50% volume",familias:"18.230",perda:"R$ 96 Mi",acao:"Priorizar resposta hídrica e monitoramento",disp:"Prioridade alta",governanca:"Quase",politicas:"Iniciando",financas:"Iniciando",sobre:"A leitura territorial considera a capacidade de resposta governamental do Painel ClimaBrasil e cruza essa leitura com os sinais operacionais de seca, água, focos de calor e meteorologia.",municipios:"32",afetadas:"+135 mil",chuvas:"Muito abaixo da média"},
 centronorte:{nome:"Centro-Norte Piauiense",alerta:"Atenção",nivel:"alto",risco:"Risco Alto",sub:"Nível de ameaça elevado",persistencia:"> 95%",seca:"Moderada/Severa",agua:"Atenção",focos:"Moderado",culturas:"Soja, Milho",deficit:"-30% volume",familias:"8.200",perda:"R$ 54 Mi",acao:"Reforçar monitoramento hídrico e agroclimático",disp:"Prioridade média",governanca:"Quase",politicas:"Iniciando",financas:"Iniciando",sobre:"A leitura territorial considera a capacidade de resposta governamental do Painel ClimaBrasil e cruza essa leitura com os sinais operacionais de seca, água, focos de calor e meteorologia.",municipios:"28",afetadas:"+70 mil",chuvas:"Abaixo da média"},
 sudeste:{nome:"Sudeste Piauiense",alerta:"Alerta Crítico",nivel:"critico",risco:"Risco Crítico",sub:"Nível de ameaça muito alto",persistencia:"> 95%",seca:"Severa",agua:"Baixa disponibilidade",focos:"Elevado",culturas:"Feijão, Milho",deficit:"-45% volume",familias:"12.500",perda:"R$ 85 Mi",acao:"Acionar medidas emergenciais de adaptação",disp:"Prioridade alta",governanca:"Quase",politicas:"Iniciando",financas:"Iniciando",sobre:"A leitura territorial considera a capacidade de resposta governamental do Painel ClimaBrasil e cruza essa leitura com os sinais operacionais de seca, água, focos de calor e meteorologia.",municipios:"35",afetadas:"+120 mil",chuvas:"Muito abaixo da média"},
 sudoeste:{nome:"Sudoeste Piauiense",alerta:"Monitoramento",nivel:"medio",risco:"Risco Moderado",sub:"Nível de ameaça intermediário",persistencia:"85–95%",seca:"Moderada",agua:"Regular",focos:"Moderado",culturas:"Soja, Milho, Feijão",deficit:"-38% volume",familias:"8.230",perda:"R$ 62 Mi",acao:"Manter monitoramento e prevenção",disp:"Monitoramento",governanca:"Quase",politicas:"Iniciando",financas:"Iniciando",sobre:"A leitura territorial considera a capacidade de resposta governamental do Painel ClimaBrasil e cruza essa leitura com os sinais operacionais de seca, água, focos de calor e meteorologia.",municipios:"45",afetadas:"+92 mil",chuvas:"Abaixo da média"}
};
const DEFAULT_STATE={view:"macro",page:"painel",region:"centronorte",producerPeriod:"30 dias",producerLocation:"Valença do Piauí - PI"};
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem("scd-state")||"{}");
    return {...DEFAULT_STATE,...saved};
  }catch(_){ return {...DEFAULT_STATE}; }
}
let state=loadState();
function saveState(){
  try{ localStorage.setItem("scd-state",JSON.stringify(state)); }catch(_){}
}
function setState(patch,{renderNow=true,hash=true}={}){
  state={...state,...patch};
  saveState();
  if(hash){
    const next=`#${state.view}/${state.page}/${state.region}`;
    if(location.hash!==next) history.replaceState(null,"",next);
  }
  if(renderNow) render();
}
function hydrateFromHash(){
  const parts=location.hash.replace(/^#/,"").split("/");
  if(parts[0]==="macro"||parts[0]==="micro") state.view=parts[0];
  if(["painel","risco","impacto","recursos","relatorios","alertas","config"].includes(parts[1])) state.page=parts[1];
  if(REGIOES[parts[2]]) state.region=parts[2];
}
hydrateFromHash();
const root=document.getElementById("pageRoot");
const tooltip=document.createElement("div");tooltip.className="map-tooltip";document.body.appendChild(tooltip);

function mapSVG(selected=state.region){
 return `<div class="piaui-map-wrap">
 <svg class="piaui-map" viewBox="${MAP_VIEWBOX}" role="img" aria-label="Mapa vetorial clicável das mesorregiões do Piauí" preserveAspectRatio="xMidYMid meet">
   <path class="state-shadow" d="${PIAUI_OUTLINE}"/>
   ${Object.entries(MAP_PATHS).map(([id,d])=>`
      <path class="region ${selected===id?'selected':''}" data-region="${id}" d="${d}" fill="${COLORS[REGIOES[id].nivel]}"
        tabindex="0" role="button" aria-pressed="${selected===id?'true':'false'}"
        aria-label="${REGIOES[id].nome}: ${REGIOES[id].risco}. Pressione Enter para selecionar."></path>
   `).join("")}
   <path class="state-outline" d="${PIAUI_OUTLINE}"/>
 </svg>
 </div>`;
}
function legend(){return `<div class="legend">
 <span><i class="dot" style="background:${COLORS.critico}"></i>Muito Alto</span>
 <span><i class="dot" style="background:${COLORS.alto}"></i>Alto</span>
 <span><i class="dot" style="background:${COLORS.medio}"></i>Médio</span>
 <span><i class="dot" style="background:${COLORS.baixo}"></i>Baixo</span>
 <span><i class="dot" style="background:${COLORS.muitobaixo}"></i>Muito Baixo</span></div>`}
function metric(icon,label,value,cls=""){return `<div class="card metric"><div class="metric__icon">${icon}</div><div><span class="sub">${label}</span><strong class="${cls}">${value}</strong></div></div>`}
function statsCard(r){
 return `<div class="card"><h3>🛡 Capacidade de Resposta Climática</h3>
 <div class="climate-primary">
   <div class="source-kicker">FONTE PRINCIPAL — CLIMATESCANNER / PAINEL CLIMABRASIL</div>
   <div class="axis-row"><span>Governança</span><b>${r.governanca}</b></div>
   <div class="axis-row"><span>Políticas públicas</span><b>${r.politicas}</b></div>
   <div class="axis-row"><span>Finanças</span><b>${r.financas}</b></div>
 </div>
 <div class="risk-box risk-${r.nivel}"><b style="font-size:24px">${r.risco}</b><div>${r.sub}</div></div>
 <div class="statrow"><span>Índice de Seca <small class="source-tag">CEMADEN</small></span><b>${r.seca}</b></div>
 <div class="statrow"><span>Disponibilidade hídrica <small class="source-tag">ANA</small></span><b>${r.agua}</b></div>
 <div class="statrow"><span>Focos de calor <small class="source-tag">INPE — Queimadas</small></span><b>${r.focos}</b></div>
 <div class="statrow"><span>Cenário meteorológico <small class="source-tag">INMET</small></span><b>${r.persistencia}</b></div>
 </div>`}

function impactCard(r){
 return `<div class="card"><h3>📊 Projeção de Impacto</h3>
 <div class="statrow"><span>Culturas Ameaçadas</span><b>${r.culturas}</b></div>
 <div class="statrow"><span>Déficit Hídrico <small class="source-tag">CEMADEN / ANA / INMET</small></span><b class="danger">${r.deficit}</b></div>
 <div class="statrow"><span>Famílias em Risco</span><b>${r.familias}</b></div>
 <div class="fund" style="margin-top:18px;background:#faf7ea;border-color:var(--yellow)">
   <span class="sub">Perda Financeira Estimada</span>
   <div class="danger" style="font-size:28px;font-weight:800">${r.perda}</div>
 </div></div>`;
}

function resourceCard(r){
 return `<div class="card"><h3>🤝 Matchmaking de Recursos</h3>
 <p class="sub">Recomendação interna a partir dos indicadores das fontes autorizadas.</p>
 <div class="fund"><small>AÇÃO RECOMENDADA</small><h3>${r.acao}</h3></div>
 <div class="statrow"><span>Prioridade</span><b class="positive">${r.disp}</b></div>
 <button class="btn btn-primary action-resource" style="width:100%;margin-top:14px">Ver recomendação →</button></div>`;
}

function macroPanel(){
 const r=REGIOES[state.region];
 return `<section class="page">
 <div class="grid grid-2">
   <div>
     <div class="hero hero-polished">
       <div class="hero-main">
         <div class="hero-eyebrow">Mesorregião de Análise</div>
         <div class="hero-title-row">
           <h2>${r.nome}</h2>
           <span class="badge hero-status">${r.alerta}</span>
         </div>
         <label class="hero-region-picker">
           <span>Alterar região analisada</span>
           <select id="heroRegionSelect" aria-label="Selecionar mesorregião do Piauí">
             ${Object.entries(REGIOES).map(([id,x])=>`<option value="${id}" ${id===state.region?'selected':''}>${x.nome}</option>`).join("")}
           </select>
         </label>

         <div class="hero-source-block">
           <div class="hero-source-primary">
             <span class="hero-source-dot"></span>
             <span><b>Fonte principal</b> ClimateScanner / Painel ClimaBrasil</span>
           </div>
           <div class="hero-source-secondary">
             Complementares: CEMADEN · ANA · INPE Queimadas · INMET
           </div>
         </div>
       </div>

       <div class="scenario scenario-polished">
         <div class="scenario-top">
           <div class="scenario-icon">⛅</div>
           <div>
             <small>Cenário climático</small>
             <h3>El Niño 2026</h3>
           </div>
         </div>
         <div class="scenario-divider"></div>
         <div class="scenario-persistence">
           <span>Persistência estimada</span>
           <b>${r.persistencia}</b>
         </div>
       </div>
     </div>

     <div class="grid grid-3 section-gap">
       ${statsCard(r)}
       ${impactCard(r)}
       ${resourceCard(r)}
     </div>
   </div>

   <div class="card map-card">
     <h3>Mapa de Risco — Piauí</h3>
     <p class="sub">Clique em uma região do estado para atualizar todo o painel.</p>
     <div class="map-area">
       ${mapSVG()}
       ${legend()}
     </div>
     <p class="sub">ⓘ O clique é recortado pelo contorno do Piauí. Passe o mouse para identificar a região.</p>
   </div>
 </div>

 <div class="card about section-gap">
   <h3>Sobre a Mesorregião</h3>
   <p>${r.sobre}</p>
   <div class="about-stats">
     <div class="about-stat"><b>${r.municipios}</b><small>Municípios</small></div>
     <div class="about-stat"><b>${r.afetadas}</b><small>Famílias afetadas</small></div>
     <div class="about-stat"><b>${r.chuvas}</b><small>Chuvas</small></div>
   </div>
 </div>

 <div class="card section-gap climate-method-card">
   <div class="page-title" style="margin-bottom:12px">
     <div>
       <span class="primary-source-badge">Fonte principal</span>
       <h3 style="margin-top:8px">ClimateScanner / Painel ClimaBrasil</h3>
       <p class="sub">A leitura institucional do Sistema de Capacidade do Território segue a metodologia do Painel ClimaBrasil: Governança, Políticas Públicas e Finanças. O sistema não cria ranking nem nota única; cada eixo é apresentado separadamente.</p>
     </div>
     <a class="btn btn-outline" href="https://climatescanner.org/pt/panorama-local-do-brasil/" target="_blank" rel="noopener">Abrir Painel ClimaBrasil ↗</a>
   </div>
   <div class="climate-axes">
     <div class="axis-card"><small>01</small><h4>Governança</h4><b>${r.governanca}</b><p>Leis, estruturas, gestão de riscos, coordenação, participação e justiça climática.</p></div>
     <div class="axis-card"><small>02</small><h4>Políticas Públicas</h4><b>${r.politicas}</b><p>Mitigação, adaptação, políticas setoriais e defesa civil/risco de desastre.</p></div>
     <div class="axis-card"><small>03</small><h4>Finanças</h4><b>${r.financas}</b><p>Gastos públicos, captação de recursos e mobilização de investimentos privados.</p></div>
   </div>
   <div class="pillars-wrap"><b>15 pilares da ação climática</b><div class="pillars">${CLIMATE_SCANNER_PILLARS.map((p,i)=>`<span>${i+1}. ${p}</span>`).join("")}</div></div>
 </div>
 <div class="card section-gap sources-card">
   <h3>Fontes de dados utilizadas</h3>
   <p class="sub">O Sistema de Capacidade do Território utiliza somente estas bases de dados.</p>
   <div class="source-grid">
     ${DATA_SOURCES.map((s,i)=>`<a class="source-item ${i===0?'source-primary':''}" href="${s.url}" target="_blank" rel="noopener"><small>${s.role}</small><b>${s.name}</b><span>${s.covers}</span></a>`).join("")}
   </div>
 </div>
 </section>`;
}

function riskPage(){
 const r=REGIOES[state.region];
 const rows=Object.entries(REGIOES).map(([id,x])=>`<tr class="clickable" data-pick="${id}"><td><b>${x.nome}</b></td><td><span class="dot" style="background:${COLORS[x.nivel]};margin-right:7px"></span>${x.risco}</td><td>${x.persistencia}</td><td>${x.deficit}</td><td>${x.familias}</td><td>👁</td></tr>`).join("");
 return `<section class="page"><div class="page-title"><div><h2>Mapa de Risco — Piauí</h2><p>Explore o nível de risco climático por mesorregião e acesse indicadores e recomendações.</p></div><button class="btn btn-outline" id="exportCsv">Exportar CSV</button></div>
 <div class="kpi-grid">${metric("🛡","Risco da região",r.risco,r.nivel==="critico"?"danger":"warn")}${metric("💧","Déficit hídrico",r.deficit,"danger")}${metric("👥","Famílias em risco",r.familias)}${metric("🌱","Culturas",r.culturas)}</div>
 <div class="grid grid-2 section-gap"><div class="card map-card"><div class="map-area">${mapSVG()}${legend()}</div></div>
 <div class="card"><h3>${r.nome}</h3><div class="risk-box risk-${r.nivel}"><b style="font-size:24px">${r.alerta}</b><p>${r.sub}</p></div><div class="statrow"><span>Persistência El Niño</span><b>${r.persistencia}</b></div><div class="statrow"><span>Perda estimada</span><b class="danger">${r.perda}</b></div><h3 style="margin-top:20px">Recomendações</h3><div class="reco-list"><div class="reco"><i>💧</i><div><b>Distribuição de água</b><p class="sub">Priorizar consumo humano e dessedentação animal.</p></div></div><div class="reco"><i>🌱</i><div><b>Diversificação</b><p class="sub">Apoiar variedades mais resistentes à seca.</p></div></div><div class="reco"><i>🛡</i><div><b>Monitoramento</b><p class="sub">Intensificar alertas preventivos.</p></div></div></div></div></div>
 <div class="card section-gap"><div class="page-title"><div><h3>Todas as Mesorregiões</h3></div><div class="filters"><input id="regionSearch" placeholder="Buscar região" aria-label="Buscar região"><select id="riskFilter" aria-label="Filtrar por risco"><option value="">Todos os riscos</option><option value="critico">Muito Alto</option><option value="alto">Alto</option><option value="medio">Médio</option></select><button class="btn btn-outline" id="clearRegionFilters">Limpar</button></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th><button class="table-sort" data-sort="name">Mesorregião ↕</button></th><th><button class="table-sort" data-sort="risk">Nível ↕</button></th><th>El Niño</th><th>Déficit</th><th><button class="table-sort" data-sort="families">Famílias ↕</button></th><th>Ação</th></tr></thead><tbody id="regionRows">${rows}</tbody></table></div></div>
 <div class="card section-gap sources-card"><h3>Fontes de dados utilizadas</h3><p class="sub">O Sistema de Capacidade do Território utiliza exclusivamente as bases abaixo para alimentar os indicadores do painel.</p><div class="source-grid">${DATA_SOURCES.map((s,i)=>`<a class="source-item ${i===0?'source-primary':''}" href="${s.url}" target="_blank" rel="noopener"><small>${s.role}</small><b>${s.name}</b><span>${s.covers}</span></a>`).join("")}</div></div>
 </section>`;
}
function impactoPage(){
 return `<section class="page"><div class="page-title"><div><h2>Impacto Climático</h2><p>Comparativo de exposição econômica e social.</p></div></div><div class="kpi-grid">${metric("💰","Perda estimada total","R$ 297 Mi","danger")}${metric("👥","Famílias em risco","47.160")}${metric("🌽","Culturas críticas","Milho e Feijão")}${metric("💧","Déficit médio","-41%","danger")}</div><div class="grid grid-2 section-gap"><div class="card"><h3>Perda financeira por região</h3>${Object.values(REGIOES).map(r=>`<div class="statrow"><span>${r.nome}</span><b>${r.perda}</b></div>`).join("")}</div><div class="card"><h3>Culturas mais expostas</h3><div class="reco-list"><div class="reco"><i>🌽</i><div><b>Milho</b><p class="sub">Alta dependência de chuva regular.</p></div></div><div class="reco"><i>🫘</i><div><b>Feijão</b><p class="sub">Sensível a estiagens prolongadas.</p></div></div><div class="reco"><i>🌱</i><div><b>Soja</b><p class="sub">Risco em polos de produção do sul do estado.</p></div></div></div></div></div></section>`;
}
const resources=[
 ["Pronaf Seca Emergencial","Apoio financeiro para produtores afetados pela seca.","Disponível"],
 ["Garantia Safra","Proteção de renda em caso de perdas por estiagem ou excesso de chuvas.","Disponível"],
 ["Crédito Rural Especial","Linhas de crédito com condições especiais para produção.","Disponível"],
 ["Assistência Técnica","Apoio técnico para manejo e produtividade.","Contínuo"]
];
function recursosPage(){
 return `<section class="page"><div class="page-title"><div><h2>Recursos e Fundos Disponíveis</h2><p>Encontre apoio financeiro e técnico adequado ao risco identificado.</p></div></div><div class="filters"><input id="resourceSearch" placeholder="Buscar programa" aria-label="Buscar programa"><select id="resourceStatus" aria-label="Status do recurso"><option value="">Todos</option><option>Disponível</option><option>Contínuo</option></select><button class="btn btn-outline" id="clearResourceFilters">Limpar</button></div><div class="resource-grid section-gap" id="resourceGrid">${resources.map((x,i)=>`<div class="resource" data-resource="${x[0].toLowerCase()}" data-status="${x[2]}"><div style="font-size:26px">${["💰","🪙","🌱","📘"][i]}</div><h4>${x[0]}</h4><p class="sub">${x[1]}</p><span class="status">${x[2]}</span><br><button class="btn btn-outline resource-detail" data-index="${i}" style="margin-top:14px">Ver detalhes</button></div>`).join("")}</div></section>`;
}
function relatoriosPage(){
 return `<section class="page"><div class="page-title"><div><h2>Relatórios e Dados</h2><p>Consolide informações e exporte análises.</p></div><button class="btn btn-primary" id="generateReport">Gerar relatório</button></div><div class="filters"><select><option>Impacto financeiro</option><option>Risco hídrico</option><option>Famílias afetadas</option></select><select><option>Últimos 12 meses</option><option>Últimos 6 meses</option></select><select><option>Todo o Piauí</option>${Object.values(REGIOES).map(r=>`<option>${r.nome}</option>`).join("")}</select></div><div class="grid grid-3 section-gap">${metric("💰","Perda estimada","R$ 297 Mi","danger")}${metric("🏘","Municípios analisados","140")}${metric("👥","Famílias em risco","47.160")}</div><div class="card section-gap"><h3>Evolução do déficit hídrico</h3><div class="chart"><svg viewBox="0 0 800 250"><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EAC917" stop-opacity=".25"/><stop offset="100%" stop-color="#EAC917" stop-opacity="0"/></linearGradient></defs>${[45,90,135,180].map(y=>`<line class="chart-grid" x1="40" y1="${y}" x2="780" y2="${y}"/>`).join("")}<path class="chart-fill" d="M40 170 L140 160 L240 145 L340 122 L440 135 L540 110 L640 88 L760 78 L760 210 L40 210 Z"/><path class="chart-line" d="M40 170 L140 160 L240 145 L340 122 L440 135 L540 110 L640 88 L760 78"/></svg></div></div></section>`;
}
function alertasPage(){
 const alerts=[
  {icon:"🔴",title:"Alerta de Seca Severa",region:"Sudeste Piauiense",time:"Hoje 08:30",type:"unread",desc:"Persistência de condições secas e redução de disponibilidade hídrica."},
  {icon:"🟠",title:"Baixa Umidade do Ar",region:"Centro-Norte Piauiense",time:"20/08 14:15",type:"unread",desc:"Umidade relativa em níveis que exigem atenção para lavouras e saúde."},
  {icon:"🟡",title:"Temperaturas Elevadas",region:"Sudoeste Piauiense",time:"19/08 11:20",type:"info",desc:"Temperaturas acima da média podem elevar a evapotranspiração."},
  {icon:"🟢",title:"Boletim Agroclimático",region:"Todo o estado",time:"18/08 09:00",type:"info",desc:"Resumo demonstrativo de condições agroclimáticas e tendências."}
 ];
 return `<section class="page"><div class="page-title"><div><h2>Alertas e Notificações</h2><p>Acompanhe os principais eventos climáticos.</p></div><button class="btn btn-outline" id="markAllRead">Marcar tudo como lido</button></div><div class="card"><div class="tabs alert-tabs" id="alertTabs"><button class="active" data-alert-filter="all">Todos</button><button data-alert-filter="unread">Não lidos</button><button data-alert-filter="info">Informativos</button></div><div class="alert-list" id="alertList">${alerts.map((a,i)=>`<button class="alert-item alert-button" data-alert-type="${a.type}" data-alert-index="${i}" type="button"><div>${a.icon}</div><div><b>${a.title}</b><div class="sub">${a.region}</div></div><small>${a.time}</small><span class="alert-description">${a.desc}</span></button>`).join("")}</div></div></section>`;
}
function configPage(){
 return `<section class="page"><div class="page-title"><div><h2>Configurações</h2><p>Gerencie preferências e dados do usuário.</p></div></div><div class="card"><div class="tabs config-tabs" id="configTabs"><button class="active" data-config-tab="perfil">Perfil</button><button data-config-tab="notificacoes">Notificações</button><button data-config-tab="preferencias">Preferências</button><button data-config-tab="seguranca">Segurança</button></div><div id="configContent"></div></div></section>`;
}
function microPanel(){
 return `<section class="page"><div class="page-title"><div><h2>Olá, Produtor! 🌿</h2><p>Acompanhe os riscos climáticos da sua propriedade e receba recomendações personalizadas.</p></div><div class="card producer-location" style="padding:12px 16px">📍 <b>${state.producerLocation}</b><br><button class="btn btn-outline" id="changeLocation" style="margin-top:8px">Alterar localização</button></div></div>
 <div class="card" style="background:var(--yellow-soft);border-color:#f2df78"><b>🔔 Alerta Ativo</b><span class="sub" style="margin-left:8px">Risco de seca severa na sua região nas próximas 4 semanas.</span><button class="btn btn-yellow" id="alertDetails" style="float:right">Ver detalhes</button></div>
 <div class="grid grid-4 section-gap">${metric("🛡","Nível de Risco Atual","Alto","warn")}${metric("💧","Déficit Hídrico Previsto","-42%","danger")}${metric("🌱","Cultura Monitorada","Milho","positive")}${metric("👥","Famílias na região","12.500")}</div>
 <div class="grid grid-2 section-gap"><div class="card"><h3>Risco Climático na Sua Localidade</h3><div class="tabs" id="riskPeriods"><button>7 dias</button><button class="active">30 dias</button><button>90 dias</button></div><div class="chart" id="producerChart"></div><div class="fund" style="background:var(--yellow-soft);border-color:var(--yellow)"><b>Principais ameaças</b><div class="grid grid-3" style="margin-top:10px"><div>☀️ <b>Seca prolongada</b></div><div>🌡️ <b>Temperaturas elevadas</b></div><div>💨 <b>Ventos fortes</b></div></div></div></div>
 <div class="grid"><div class="card"><h3>Recomendações para Você</h3><div class="reco-list"><button type="button" class="reco reco-button" data-reco="water"><i>💧</i><div><b>Manejo da Água</b><p class="sub">Adote técnicas de irrigação eficiente.</p></div><span>›</span></button><button type="button" class="reco reco-button" data-reco="crops"><i>🌿</i><div><b>Diversificação de Culturas</b><p class="sub">Reduza riscos diversificando sua produção.</p></div><span>›</span></button><button type="button" class="reco reco-button" data-reco="insurance"><i>🛡</i><div><b>Seguro Agrícola</b><p class="sub">Proteja sua produção contra perdas climáticas.</p></div><span>›</span></button></div></div><div class="card"><div class="section-heading-row"><h3>Previsão do Tempo</h3><button type="button" class="text-action" id="fullWeather">Ver completa →</button></div><div class="weather-row">${[["Hoje","☀️","34°","0%"],["Sex","☀️","35°","10%"],["Sáb","🌤️","36°","10%"],["Dom","☀️","36°","0%"],["Seg","☁️","33°","20%"]].map(w=>`<div class="weather-day"><small>${w[0]}</small><div class="icon">${w[1]}</div><b>${w[2]}</b><small>💧 ${w[3]}</small></div>`).join("")}</div></div></div></div>
 <div class="card section-gap"><h3>Programas e Recursos para Produtores</h3><div class="resource-grid">${resources.map((x,i)=>`<div class="resource"><div style="font-size:24px">${["💰","🪙","🌱","📘"][i]}</div><h4>${x[0]}</h4><p class="sub">${x[1]}</p><span class="status">${x[2]}</span><br><button type="button" class="btn btn-outline resource-detail" data-index="${i}" style="margin-top:12px">Saiba mais</button></div>`).join("")}</div></div></section>`;
}
function drawProducerChart(period="30 dias"){
 const sets={"7 dias":[155,130,110,125,98,116,132],"30 dias":[170,148,126,94,120,143,165],"90 dias":[175,150,135,120,112,105,96]};
 const ys=sets[period]||sets["30 dias"];const pts=ys.map((y,i)=>`${45+i*110},${y}`).join(" ");
 const html=`<svg viewBox="0 0 760 230"><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EAC917" stop-opacity=".28"/><stop offset="100%" stop-color="#EAC917" stop-opacity="0"/></linearGradient></defs>${[50,90,130,170].map(y=>`<line class="chart-grid" x1="40" y1="${y}" x2="730" y2="${y}"/>`).join("")}<polyline class="chart-line" points="${pts}"/>${ys.map((y,i)=>`<circle class="chart-point" cx="${45+i*110}" cy="${y}" r="5"/>`).join("")}</svg>`;
 const el=document.getElementById("producerChart");if(el)el.innerHTML=html;
}
function render(){
 document.querySelectorAll(".sidebar__item").forEach(b=>b.classList.toggle("is-active",b.dataset.page===state.page));
 document.querySelectorAll("#viewToggle button").forEach(b=>b.classList.toggle("is-active",b.dataset.view===state.view));
 root.classList.remove("is-visible"); root.classList.add("page-transition");
 if(state.view==="micro" && state.page==="painel"){
   root.innerHTML=microPanel();
   bindDynamic();
   requestAnimationFrame(()=>{drawProducerChart(state.producerPeriod);root.classList.add("is-visible")});
   return;
 }
 const pages={painel:macroPanel,risco:riskPage,impacto:impactoPage,recursos:recursosPage,relatorios:relatoriosPage,alertas:alertasPage,config:configPage};
 root.innerHTML=(pages[state.page]||macroPanel)();
 bindDynamic();
 requestAnimationFrame(()=>root.classList.add("is-visible"));
}
function bindDynamic(){
 document.querySelectorAll(".region").forEach(el=>{
  const id=el.dataset.region;
  const selectRegion=()=>setState({region:id});
  el.addEventListener("click",selectRegion);
  el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectRegion();}});
  el.addEventListener("mousemove",e=>{
    tooltip.style.display="block";
    tooltip.style.left=Math.min(e.clientX+14,window.innerWidth-235)+"px";
    tooltip.style.top=Math.min(e.clientY+14,window.innerHeight-90)+"px";
    tooltip.innerHTML=`<b>${REGIOES[id].nome}</b><br>${REGIOES[id].risco}<br><small>Clique para atualizar o painel</small>`;
  });
  el.addEventListener("focus",()=>{
    tooltip.style.display="block";const box=el.getBoundingClientRect();
    tooltip.style.left=Math.min(box.right+10,window.innerWidth-235)+"px";tooltip.style.top=Math.max(10,box.top)+"px";
    tooltip.innerHTML=`<b>${REGIOES[id].nome}</b><br>${REGIOES[id].risco}<br><small>Enter para selecionar</small>`;
  });
  el.addEventListener("mouseleave",()=>tooltip.style.display="none");
  el.addEventListener("blur",()=>tooltip.style.display="none");
 });
 document.getElementById("heroRegionSelect")?.addEventListener("change",e=>setState({region:e.target.value}));
 document.querySelectorAll("[data-pick]").forEach(tr=>tr.addEventListener("click",()=>setState({region:tr.dataset.pick})));

 const search=document.getElementById("regionSearch"),filter=document.getElementById("riskFilter");
 function filterRows(){
   const q=(search?.value||"").trim().toLowerCase();
   document.querySelectorAll("#regionRows tr").forEach(tr=>{
     const id=tr.dataset.pick;
     tr.hidden=!((!q||REGIOES[id].nome.toLowerCase().includes(q))&&(!filter?.value||REGIOES[id].nivel===filter.value));
   });
 }
 search?.addEventListener("input",filterRows);filter?.addEventListener("change",filterRows);
 document.getElementById("clearRegionFilters")?.addEventListener("click",()=>{if(search)search.value="";if(filter)filter.value="";filterRows();search?.focus();});

 let sortAsc=true;
 document.querySelectorAll(".table-sort").forEach(btn=>btn.addEventListener("click",()=>{
   const tbody=document.getElementById("regionRows");if(!tbody)return;
   const key=btn.dataset.sort, rows=[...tbody.querySelectorAll("tr")],riskOrder={critico:4,alto:3,medio:2,baixo:1,muitobaixo:0};
   rows.sort((a,b)=>{
     const ra=REGIOES[a.dataset.pick],rb=REGIOES[b.dataset.pick];
     let va=key==="name"?ra.nome:key==="risk"?riskOrder[ra.nivel]:Number(ra.familias.replace(/\D/g,""));
     let vb=key==="name"?rb.nome:key==="risk"?riskOrder[rb.nivel]:Number(rb.familias.replace(/\D/g,""));
     return (typeof va==="string"?va.localeCompare(vb,"pt-BR"):va-vb)*(sortAsc?1:-1);
   });
   sortAsc=!sortAsc;rows.forEach(r=>tbody.appendChild(r));
 }));

 document.getElementById("exportCsv")?.addEventListener("click",downloadCSV);
 document.getElementById("generateReport")?.addEventListener("click",downloadReport);

 document.querySelector(".action-resource")?.addEventListener("click",()=>{
   const r=REGIOES[state.region];
   openModal(`<div class="modal-kicker">Recomendação priorizada</div><h2>${r.acao}</h2><p>Para <b>${r.nome}</b>, a orientação combina a capacidade institucional do <b>ClimateScanner / Painel ClimaBrasil</b> com sinais complementares do CEMADEN, ANA, INPE Queimadas e INMET.</p><div class="modal-stat-grid"><div><small>Prioridade</small><b>${r.disp}</b></div><div><small>Risco</small><b>${r.risco}</b></div></div><p class="sub">Os valores deste protótipo são demonstrativos até a integração oficial das bases.</p><button class="btn btn-primary modal-done" type="button">Entendi</button>`);
   document.querySelector(".modal-done")?.addEventListener("click",closeModal);
 });

 document.querySelectorAll(".resource-detail").forEach(b=>b.addEventListener("click",()=>{
   const r=resources[+b.dataset.index];
   openModal(`<div class="modal-kicker">Recurso</div><h2>${r[0]}</h2><p>${r[1]}</p><p><b>Status:</b> ${r[2]}</p><p class="sub">Neste protótipo, o botão demonstra o fluxo de consulta. A integração final deve apontar para o sistema oficial correspondente.</p><button class="btn btn-primary modal-done" type="button">Fechar</button>`);
   document.querySelector(".modal-done")?.addEventListener("click",closeModal);
 }));
 const rs=document.getElementById("resourceSearch"),st=document.getElementById("resourceStatus");
 function filterRes(){
   const q=(rs?.value||"").trim().toLowerCase();
   document.querySelectorAll("#resourceGrid .resource").forEach(c=>c.hidden=!((!q||c.dataset.resource.includes(q))&&(!st?.value||c.dataset.status===st.value)));
 }
 rs?.addEventListener("input",filterRes);st?.addEventListener("change",filterRes);
 document.getElementById("clearResourceFilters")?.addEventListener("click",()=>{if(rs)rs.value="";if(st)st.value="";filterRes();rs?.focus();});

 document.getElementById("changeLocation")?.addEventListener("click",()=>{
   const options=["Valença do Piauí - PI","Picos - PI","Bom Jesus - PI","Floriano - PI"];
   openModal(`<div class="modal-kicker">Propriedade</div><h2>Alterar localização</h2><form id="locationForm" class="modal-form"><label>Município<select id="locationSelect">${options.map(o=>`<option ${o===state.producerLocation?'selected':''}>${o}</option>`).join("")}</select></label><button class="btn btn-primary" type="submit">Salvar localização</button></form>`);
   document.getElementById("locationForm")?.addEventListener("submit",e=>{e.preventDefault();const value=document.getElementById("locationSelect")?.value;if(value){state.producerLocation=value;saveState();closeModal();render();showToast("Localização atualizada.");}});
 });

 document.getElementById("alertDetails")?.addEventListener("click",()=>openAlertDetail({title:"Alerta de Seca Severa",region:state.producerLocation,time:"Atual",desc:"Probabilidade elevada de persistência de condições secas nas próximas 4 semanas. Priorize manejo eficiente da água e acompanhe os boletins oficiais."}));

 document.querySelectorAll("#riskPeriods button").forEach(b=>{
   b.classList.toggle("active",b.textContent.trim()===state.producerPeriod);
   b.addEventListener("click",()=>{state.producerPeriod=b.textContent.trim();saveState();document.querySelectorAll("#riskPeriods button").forEach(x=>x.classList.toggle("active",x===b));drawProducerChart(state.producerPeriod);});
 });

 const recoText={water:["Manejo da Água","Priorize horários de menor evaporação, monitore umidade do solo e ajuste a irrigação à necessidade real da cultura."],crops:["Diversificação de Culturas","Distribuir a produção entre culturas e ciclos diferentes reduz a exposição a uma única janela climática."],insurance:["Seguro Agrícola","Avalie mecanismos de proteção compatíveis com sua atividade e consulte as regras oficiais antes da contratação."]};
 document.querySelectorAll(".reco-button").forEach(b=>b.addEventListener("click",()=>{const [title,text]=recoText[b.dataset.reco];openModal(`<div class="modal-kicker">Recomendação</div><h2>${title}</h2><p>${text}</p><p class="sub">Recomendação demonstrativa baseada no contexto climático apresentado.</p>`);}));
 document.getElementById("fullWeather")?.addEventListener("click",()=>openModal(`<div class="modal-kicker">Previsão demonstrativa</div><h2>Próximos 7 dias</h2><div class="weather-modal-grid">${[["Hoje","☀️","34° / 22°","0%"],["Sex","☀️","35° / 23°","10%"],["Sáb","🌤️","36° / 24°","10%"],["Dom","☀️","36° / 24°","0%"],["Seg","☁️","33° / 22°","20%"],["Ter","🌤️","34° / 22°","15%"],["Qua","☀️","35° / 23°","10%"]].map(w=>`<div><b>${w[0]}</b><span>${w[1]}</span><strong>${w[2]}</strong><small>Chuva ${w[3]}</small></div>`).join("")}</div><p class="sub">Exibição de protótipo. A implementação final deve utilizar os dados do INMET.</p>`));

 document.querySelectorAll("[data-alert-filter]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-alert-filter]").forEach(x=>x.classList.toggle("active",x===btn));const f=btn.dataset.alertFilter;document.querySelectorAll(".alert-button").forEach(item=>item.hidden=!(f==="all"||item.dataset.alertType===f));}));
 document.querySelectorAll(".alert-button").forEach(item=>item.addEventListener("click",()=>{const title=item.querySelector("b")?.textContent||"Alerta",region=item.querySelector(".sub")?.textContent||"",time=item.querySelector("small")?.textContent||"",desc=item.querySelector(".alert-description")?.textContent||"";item.dataset.alertType="info";item.classList.add("is-read");openAlertDetail({title,region,time,desc});}));
 document.getElementById("markAllRead")?.addEventListener("click",()=>{document.querySelectorAll(".alert-button").forEach(i=>{i.dataset.alertType="info";i.classList.add("is-read")});showToast("Todos os alertas foram marcados como lidos.");});

 if(document.getElementById("configContent")){
   renderConfigTab("perfil");
   document.querySelectorAll("[data-config-tab]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-config-tab]").forEach(x=>x.classList.toggle("active",x===btn));renderConfigTab(btn.dataset.configTab);}));
 }
}
function downloadCSV(){
 const lines=["Região,Nível,El Niño,Déficit,Famílias"].concat(Object.values(REGIOES).map(r=>`"${r.nome}","${r.risco}","${r.persistencia}","${r.deficit}","${r.familias}"`));
 const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="scd-regioes.csv";a.click();URL.revokeObjectURL(a.href);
}

function downloadReport(){
 const r=REGIOES[state.region];
 const body=["SISTEMA DE CAPACIDADE DO TERRITÓRIO — RELATÓRIO DEMONSTRATIVO",`Região: ${r.nome}`,`Risco: ${r.risco}`,`Governança (ClimateScanner): ${r.governanca}`,`Políticas públicas (ClimateScanner): ${r.politicas}`,`Finanças (ClimateScanner): ${r.financas}`,`Seca (CEMADEN): ${r.seca}`,`Disponibilidade hídrica (ANA): ${r.agua}`,`Focos de calor (INPE): ${r.focos}`,`Cenário meteorológico (INMET): ${r.persistencia}`,"","Observação: valores demonstrativos até integração oficial das bases."].join("\n");
 const blob=new Blob([body],{type:"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`scd-${state.region}.txt`;a.click();URL.revokeObjectURL(a.href);showToast("Relatório exportado.");
}
function openAlertDetail(a){
 openModal(`<div class="modal-kicker">Alerta climático</div><h2>${a.title}</h2><div class="modal-meta">${a.region} · ${a.time}</div><p>${a.desc}</p><div class="source-note"><b>Fontes operacionais:</b> CEMADEN, ANA, INPE Queimadas e INMET.</div>`);
}
function renderConfigTab(tab){
 const host=document.getElementById("configContent");if(!host)return;
 let prefs={};try{prefs=JSON.parse(localStorage.getItem("scd-prefs")||"{}")}catch(_){}
 const checked=v=>v?"checked":"";
 if(tab==="perfil"){
  host.innerHTML=`<form class="form" id="settingsForm"><label>Nome<input name="name" value="${prefs.name||"João da Silva"}"></label><label>E-mail<input name="email" type="email" value="${prefs.email||"joao@email.com"}"></label><label>Telefone<input name="phone" value="${prefs.phone||"(89) 99999-0000"}"></label><label>Tipo de usuário<select name="type"><option>Produtor Rural</option><option>Gestor Público</option></select></label><label class="full">Localização<select name="location"><option>${state.producerLocation}</option><option>Picos - PI</option><option>Bom Jesus - PI</option></select></label><label class="full">Cultura monitorada<select name="crop"><option>Milho</option><option>Feijão</option><option>Soja</option></select></label><div class="full"><button class="btn btn-primary">Salvar alterações</button></div></form>`;
  host.querySelector("form")?.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));try{localStorage.setItem("scd-prefs",JSON.stringify(data))}catch(_){}showToast("Perfil salvo com sucesso.");});
 }else if(tab==="notificacoes"){
  host.innerHTML=`<div class="settings-stack"><label class="switch-row"><span><b>Alertas críticos</b><small>Receber avisos de risco alto e muito alto.</small></span><input type="checkbox" data-pref="critical" ${checked(prefs.critical!==false)}></label><label class="switch-row"><span><b>Boletim semanal</b><small>Resumo semanal das condições climáticas.</small></span><input type="checkbox" data-pref="weekly" ${checked(prefs.weekly!==false)}></label><label class="switch-row"><span><b>Novos recursos</b><small>Informações sobre linhas e programas adicionados.</small></span><input type="checkbox" data-pref="resources" ${checked(!!prefs.resources)}></label></div>`;
  host.querySelectorAll("[data-pref]").forEach(i=>i.addEventListener("change",()=>{prefs[i.dataset.pref]=i.checked;try{localStorage.setItem("scd-prefs",JSON.stringify(prefs))}catch(_){}showToast("Preferência atualizada.");}));
 }else if(tab==="preferencias"){
  host.innerHTML=`<form class="form" id="prefForm"><label>Região inicial<select name="initialRegion">${Object.entries(REGIOES).map(([id,r])=>`<option value="${id}" ${id===state.region?"selected":""}>${r.nome}</option>`).join("")}</select></label><label>Período padrão do produtor<select name="period">${["7 dias","30 dias","90 dias"].map(p=>`<option ${p===state.producerPeriod?"selected":""}>${p}</option>`).join("")}</select><div class="full"><button class="btn btn-primary">Aplicar preferências</button></div></form>`;
  host.querySelector("form")?.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget);state.region=d.get("initialRegion");state.producerPeriod=d.get("period");saveState();showToast("Preferências aplicadas.");});
 }else{
  host.innerHTML=`<div class="security-box"><h3>Segurança do protótipo</h3><p class="sub">Este front-end não possui autenticação real nem envia credenciais. Em produção, login, sessão e permissões devem ser tratados no backend.</p><button type="button" class="btn btn-outline" id="clearLocalData">Limpar dados locais do protótipo</button></div>`;
  document.getElementById("clearLocalData")?.addEventListener("click",()=>{try{localStorage.removeItem("scd-state");localStorage.removeItem("scd-prefs")}catch(_){}state={...DEFAULT_STATE};showToast("Dados locais limpos.");setTimeout(render,350);});
 }
}
let lastFocused=null;
function openModal(html){
 const backdrop=document.getElementById("modalBackdrop"),content=document.getElementById("modalContent");
 lastFocused=document.activeElement;content.innerHTML=html;backdrop.classList.add("show");backdrop.setAttribute("aria-hidden","false");
 requestAnimationFrame(()=>{(content.querySelector("button,input,select,a")||document.getElementById("modalClose"))?.focus()});
}
function closeModal(){
 const backdrop=document.getElementById("modalBackdrop");backdrop.classList.remove("show");backdrop.setAttribute("aria-hidden","true");
 if(lastFocused&&document.contains(lastFocused))lastFocused.focus();
}
window.closeModal=closeModal;
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
document.getElementById("sidebarNav").addEventListener("click",e=>{const b=e.target.closest(".sidebar__item");if(!b)return;document.getElementById("sidebar").classList.remove("open");setState({page:b.dataset.page});});
document.getElementById("viewToggle").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;setState({view:b.dataset.view,page:"painel"});});
document.getElementById("bellBtn").addEventListener("click",e=>{
 e.stopPropagation();const p=document.getElementById("bellPanel"),r=REGIOES[state.region];
 p.innerHTML=`<div class="bell-head"><b>Central de alertas</b><button type="button" id="bellClose">×</button></div><button type="button" class="bell-alert"><span>🔴</span><span><b>${r.risco}</b><small>${r.nome}</small></span></button><button type="button" class="text-action bell-view-all">Ver todos os alertas →</button>`;p.classList.toggle("show");
 p.querySelector("#bellClose")?.addEventListener("click",()=>p.classList.remove("show"));p.querySelector(".bell-view-all")?.addEventListener("click",()=>{p.classList.remove("show");setState({page:"alertas"});});
});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("modalClose").addEventListener("click",closeModal);
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
document.addEventListener("click",e=>{const p=document.getElementById("bellPanel");if(p?.classList.contains("show")&&!e.target.closest("#bellPanel")&&!e.target.closest("#bellBtn"))p.classList.remove("show");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();document.getElementById("bellPanel")?.classList.remove("show");document.getElementById("sidebar")?.classList.remove("open");}});
window.addEventListener("hashchange",()=>{hydrateFromHash();saveState();render();});
document.getElementById("logoutBtn")?.addEventListener("click",()=>openModal(`<div class="modal-kicker">Sessão</div><h2>Sair do Sistema de Capacidade do Território?</h2><p>Como este é um protótipo, nenhuma sessão real será encerrada.</p><button class="btn btn-primary modal-done" type="button">Entendi</button>`));
render();
