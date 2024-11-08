/* globals d3 pv location */
const svg = d3.select('svg');
const margin = { top: 15, right: 0, bottom: 30, left: 0 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
const axen = g.append('g');
const plot = g.append('g');
const tooltip = g.append('g').attr('class', 'toottip').style('display', 'none');
tooltip.append('rect')
  .attr('height', 60)
  .attr('width', 200);

const x = d3.scaleLinear().range([ 0, width ]);
const y = d3.scaleLinear().range([ 0, height ]);

const axX = axen.append('g')
  .attr('class', 'rule')
  .attr('transform', `translate(${0},${height / 2})`);
axX.append('line')
  .attr('x2', width);
axX.append('text')
  .attr('dy', '-.3em')
  .text('Vinstri');
axX.append('text')
  .attr('dy', '-.3em')
  .attr('x', width)
  .attr('text-anchor', 'end')
  .text('Hægri');

const axY = axen.append('g')
  .attr('class', 'rule')
  .attr('transform', `translate(${width / 2},${0})`);
axY.append('line')
  .attr('y2', height);
axY.append('text')
  .text('Forsjárhyggja')
  .attr('dy', '-.3em')
  .attr('text-anchor', 'middle');
axY.append('text')
  .text('Frjálslyndi')
  .attr('y', height)
  .attr('dy', '1em')
  .attr('text-anchor', 'middle');

const voronoi = d3.voronoi()
  .x(d => x(d.axis_l2r))
  .y(d => y(d.axis_a2l))
  .extent([ [ 0, 0 ], [ width, height ] ]);

const partyId = {
  'Alþýðufylkingin': 'R',
  'Björt Framtíð': 'A',
  'Dögun': 'T',
  'Flokkur heimilanna': 'I',
  'Framsóknarflokkurinn': 'B',
  'Hægri Grænir': 'G',
  'Flokkur Fólksins': 'F',
  'Miðflokkurinn': 'M',
  'Viðreisn': 'C',
  'Píratar': 'P',
  'Regnboginn': 'J',
  'Samfylkingin': 'S',
  'Sjálfstæðisflokkurinn': 'D',
  'Vinstrihreyfingin - Grænt Framboð': 'V',
  'Vinstri græn': 'V'
};

// - is LEFT ** + is RIGHT
const left_to_right = {
  'Allir landsmenn ættu að hafa aðgang að grunnheilbrigðisþjónustu í sinni heimabyggð': 0,
  'Afnema ætti verðtryggingu á nýjum lánum strax': 0,
  'Ríkið á að selja hluti sína í bönkunum á næsta kjörtímabili': 1,
  'Herða ætti refsiramma laga í kynferðis- og heimilisofbeldismálum': 0,
  'Taka ætti upp skólagjöld í opinberum háskólum': 0,
  'Fjármagna ætti uppbyggingu vegakerfisins í nágrenni höfuðborgarsvæðisins með vegtollum': 0,
  'Herða þarf reglur um móttöku hælisleitenda og veita færri hæli': 0,
  'Gjöld fyrir nýtingu náttúruauðlinda ætti að hækka, þar á meðal veiðigjöld': -1,
  'Lögleiða ætti notkun kannabisefna hér á landi': 0,
  'Stjórnvöld eiga að láta markaðinn um að leysa húsnæðisvandann': 1,
  'Taka ætti við fleiri kvótaflóttamönnum hingað til lands': 0,
  'Hækka á örorku- og ellilífeyrisbætur svo þær samsvari lægstu launum hverju sinni': -0.5,
  'Leggja ætti á hátekju- eða eignaskatta til að fjármagna innviðafjárfestingu': -0.5,
  'LÍN ætti að veita háskólanemum námsstyrki frekar en námslán': -0.3,
  'Ísland á að nýta heimild Dyflinnarreglugerðarinnar alltaf þegar það er hægt': 0,
  'Nýtt þing verður að samþykkja breytingar á stjórnarskrá á kjörtímabilinu, byggðar á tillögum stjórnlagaráðs': 0,
  'Hagsmunir náttúrunnar eiga að vega þyngra en fjárhagslegir hagsmunir við ákvarðanatöku stjórnvalda í atvinnuuppbyggingu': 0,
  'Afnema ætti kostnaðarþátttöku sjúklinga í heilbrigðiskerfinu': -1.5,
  'Draga ætti úr fjölda ferðamanna til að verja náttúruna fyrir ágangi': 0,
  'Íslenskir neytendur ættu að fá að kaupa áfengi í matvöruverslunum': 0,
  'Íslenska krónan er framtíðargjaldmiðill Íslands': 0,
  'Mikilvægt er að hið opinbera leysi vanda sauðfjárbænda með fjárframlögum': -0.75,
  'Lækka ætti skatta og gjöld á fyrirtæki': 1,
  'Mikilvægt er að ríkið beiti sér fyrir bættri aðstöðu á ferðamannastöðum í sinni eigu': 0,
  'Það er mikilvægt að neytendur fái að kaupa innflutt, fersk matvæli': 0,
  'Auka ætti einkarekstur í heilbrigðiskerfinu': 1.5,
  'Stjórnvöld ættu að taka hærri gjöld eða skatta af erlendum ferðamönnum sem koma hingað til lands': -0.3,
  'Stjórnvöld og Alþingi ættu að fara að tillögum verkefnastjórnar um rammaáætlun og hreyfa ekki við flokkun hennar á virkjanakostum': 0,
  'Ríkið á að selja hlut sinn í orku- og veitufyrirtækjum': 1,
  'Lækka þarf skuldir ríkissjóðs áður en ráðist er í umfangsmiklar innviðafjárfestingar': 1
};

// - is AUTH ** + is LIB
const auth_to_lib = {
  'Allir landsmenn ættu að hafa aðgang að grunnheilbrigðisþjónustu í sinni heimabyggð': 0,
  'Afnema ætti verðtryggingu á nýjum lánum strax': -1,
  'Ríkið á að selja hluti sína í bönkunum á næsta kjörtímabili': 0,
  'Herða ætti refsiramma laga í kynferðis- og heimilisofbeldismálum': -0.2,
  'Taka ætti upp skólagjöld í opinberum háskólum': 0,
  'Fjármagna ætti uppbyggingu vegakerfisins í nágrenni höfuðborgarsvæðisins með vegtollum': 0,
  'Herða þarf reglur um móttöku hælisleitenda og veita færri hæli': -0.5,
  'Gjöld fyrir nýtingu náttúruauðlinda ætti að hækka, þar á meðal veiðigjöld': 0,
  'Lögleiða ætti notkun kannabisefna hér á landi': 1,
  'Stjórnvöld eiga að láta markaðinn um að leysa húsnæðisvandann': 0,
  'Taka ætti við fleiri kvótaflóttamönnum hingað til lands': 0.5,
  'Hækka á örorku- og ellilífeyrisbætur svo þær samsvari lægstu launum hverju sinni': 0,
  'Leggja ætti á hátekju- eða eignaskatta til að fjármagna innviðafjárfestingu': 0,
  'LÍN ætti að veita háskólanemum námsstyrki frekar en námslán': 0,
  'Ísland á að nýta heimild Dyflinnarreglugerðarinnar alltaf þegar það er hægt': -1,
  'Nýtt þing verður að samþykkja breytingar á stjórnarskrá á kjörtímabilinu, byggðar á tillögum stjórnlagaráðs': 0.25,
  'Hagsmunir náttúrunnar eiga að vega þyngra en fjárhagslegir hagsmunir við ákvarðanatöku stjórnvalda í atvinnuuppbyggingu': -0.25,
  'Afnema ætti kostnaðarþátttöku sjúklinga í heilbrigðiskerfinu': 0,
  'Draga ætti úr fjölda ferðamanna til að verja náttúruna fyrir ágangi': -1,
  'Íslenskir neytendur ættu að fá að kaupa áfengi í matvöruverslunum': 1,
  'Íslenska krónan er framtíðargjaldmiðill Íslands': 0,
  'Mikilvægt er að hið opinbera leysi vanda sauðfjárbænda með fjárframlögum': -1,
  'Lækka ætti skatta og gjöld á fyrirtæki': 0,
  'Mikilvægt er að ríkið beiti sér fyrir bættri aðstöðu á ferðamannastöðum í sinni eigu': 0,
  'Það er mikilvægt að neytendur fái að kaupa innflutt, fersk matvæli': 0,
  'Auka ætti einkarekstur í heilbrigðiskerfinu': 0.25,
  'Stjórnvöld ættu að taka hærri gjöld eða skatta af erlendum ferðamönnum sem koma hingað til lands': 0,
  'Stjórnvöld og Alþingi ættu að fara að tillögum verkefnastjórnar um rammaáætlun og hreyfa ekki við flokkun hennar á virkjanakostum': 0,
  'Ríkið á að selja hlut sinn í orku- og veitufyrirtækjum': 0,
  'Lækka þarf skuldir ríkissjóðs áður en ráðist er í umfangsmiklar innviðafjárfestingar': 0
};

function precalc_axis (population) {
  const data = {
    max_x: 0,
    max_y: 0
  };
  // calculate candidates placement
  population.forEach(cand => {
    if (!cand._answered) { return; }
    const l2r = [];
    const a2l = [];
    Object.keys(cand).forEach(key => {
      const value = cand[key];
      if (left_to_right[key]) {
        l2r.push(value * left_to_right[key]);
      }
      if (auth_to_lib[key]) {
        a2l.push(value * auth_to_lib[key]);
      }
    });
    cand.axis_l2r = d3.mean(l2r.length ? l2r : [ 0 ]);
    cand.axis_a2l = d3.mean(a2l.length ? a2l : [ 0 ]);
    if (Math.abs(cand.axis_l2r) > data.max_x) {
      data.max_x = Math.abs(cand.axis_l2r);
    }
    if (Math.abs(cand.axis_a2l) > data.max_y) {
      data.max_y = Math.abs(cand.axis_a2l);
    }
  });
  return data;
}

function visualize (data) {
  x.domain([ -data.max_x, data.max_x ]).nice();
  y.domain([ -data.max_y, data.max_y ]).nice();

  plot.attr('class', data.hoverTarget ? 'hovering' : '');

  const t = d3.transition()
    .duration(250)
    .ease(d3.easeLinear);

  const cand = plot.selectAll('.point')
    .data(data.table, d => d.id);

  cand.exit().transition(t)
    .style('opacity', 0).remove();

  const candEnter = cand.enter()
    .append('g')
    .attr('id', d => `point_${d.id}`)
    .style('opacity', 0);
  candEnter.append('circle')
    .attr('r', 4);
  candEnter.transition(t)
    .style('opacity', 1);

  cand.merge(candEnter)
    .attr('transform', d => `translate(${x(d.axis_l2r)},${y(d.axis_a2l)})`)
    .attr('class', d => `point ${d === data.hoverTarget ? 'hovered' : ''} x${partyId[d.Flokkur]}`);

  if (data.hoverTarget) {
    const h = data.hoverTarget;
    let hx = x(h.axis_l2r) + 10;
    if (width - ~~hx < 300) { hx = x(h.axis_l2r) - 210; }
    tooltip
      .style('display', '')
      .attr('class', `tooltip x${partyId[h.Flokkur]}`)
      .attr('transform', `translate(${hx},${y(h.axis_a2l) - 10})`);
    const lines = tooltip.selectAll('text')
      .data([ h.Nafn, h.Flokkur, h.Kjördæmi ]);
    const linesEnter = lines.enter().append('text');
    lines.merge(linesEnter)
      .text(d => d)
      .attr('x', 10)
      .attr('dy', '1.3em')
      .style('font-weight', (d, i) => i ? '' : 'bold')
      .attr('y', (d, i) => 3 + i * 16);
  }
  else {
    tooltip.style('display', 'none');
  }
}

d3.json(d3.select('#ruv_survey_json').attr('src'), (err, population) => {
  if (err) throw err;

  population.forEach((d, i) => {
    d.id = `c${i + 1}`;
    if (d.Flokkur === 'Vinstrihreyfingin - Grænt Framboð') {
      d.Flokkur = 'Vinstri græn';
    }
  });

  const data = precalc_axis(population);

  let active = location.hash.replace(/#/, '') || 'ABCDFMPRSTV';

  const label = d3.select('#controls')
      .selectAll('label')
      .data(d3.set(population.map(c => c.Flokkur)).values().sort());

  label.exit().remove();

  const labelEnter = label.enter().append('label');
  labelEnter
    .append('svg')
      .attr('width', 20)
      .attr('height', 20)
    .append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 6);
  labelEnter.append('span').text(String);

  labelEnter.on('click', p => {
    const id = partyId[p];
    const on = active.indexOf(id) > -1;
    const ids = active.split('').filter(d => d !== id);
    if (!on) { ids.push(id); }
    active = ids.sort().join('');
    location.hash = active;
    update();
  });

  function update () {
    label.merge(labelEnter).attr('class', d => {
      const on = active.indexOf(partyId[d]) > -1;
      return `point x${partyId[d]} ${on ? 'active' : 'inactive'}`;
    });
    data.table = population
      .filter(c => {
        return c._answered && active.indexOf(partyId[c.Flokkur]) > -1;
      });
    data.voronoi = null;
    visualize(data);
  }

  svg.on('mousemove', function (e) {
    const p = d3.mouse(this);
    data.voronoi = data.voronoi || voronoi(data.table);
    const site = data.voronoi.find(
      p[0] - margin.left, p[1] - margin.top,
      20 // max distance from point
    );
    data.hoverTarget = site ? site.data : null;
    visualize(data);
  });

  update();

});
