/* globals d3 */
const svg = d3.select('#el2018a svg');
const margin = { top: 30, right: 100, bottom: 20, left: 450 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

var x = d3.scaleLinear().range([ 0, width ]);
var y = d3.scaleBand().range([ 0, height ]).paddingInner(0).paddingOuter(.8);

let questions = [];
let data;

const relabel = [
  [ 'Sveitarfélag', 1 ],
  [ 'Leggja ætti alla áherslu á að lækka álögur og þjónustugjöld', 1 ],
  [ 'Fjölga þarf lóðum í sveitarfélaginu undir íbúðarhúsnæði', 1 ],
  [ 'Tryggja ætti börnum leikskólavist frá því að fæðingarorlofi lýkur', 1 ],
  [ 'Lækka ætti skuldir sveitarfélagsins, þótt álögur þyrftu að hækka', 1 ],
  [ 'Jafna ætti aðstöðu skólabarna með því að útvega þeim námsgögn', 1 ],
  [ 'Sveitarfélagið á að taka þátt í rekstri almenningssamgangna', -1 ],
  [ 'Fjölga ætti rýmum á dvalar- og/eða hjúkrunarheimilum', 1 ],
  [ 'Sýna ætti aðhald frekar en að ráðast í framkvæmdir', 1 ],
  [ 'Uppbygging og rekstur öflugra almenningssamgangna er mikilvæg', 1 ],
  [ 'Alltaf séu nægilega margir menntaðir kennarar að störfum', 1 ],
  [ 'Sveitarfélagið á að vera leiðandi í umhverfismálum', 1 ],
  [ 'Greiða þarf leið nýrra fyrirtækja með fjárhagslegum ívilnunum', 1 ],
  [ 'Útvega á trúfélögum sem þess óska lóðir undir bænahús', 1 ],
  [ 'Sveitafélagið fái fleiri af þeim flóttamönnum sem boðið er til landsins', 1 ],
  [ 'Frekari útvistun verkefna í félagsþjónustu', 1 ],
  [ 'Auka fjárhagsaðstoð við fátæka íbúa', 1 ],
  [ 'Öflugra er að reka færri og stærri skóla', 1 ],
  [ 'Frekar ætti að leggja áherslu á ný hverfi en þéttingu byggðar', 1 ],
  [ 'Fjármunum ætti að forgangsraða til umhverfismála', -1 ],
  [ 'Auka þarf áherslu á uppbyggingu félagslegs húsnæðis', 1 ],
  [ 'Mikilvægt er að stækka og efla sveitarfélagið með sameiningum', 1 ],
  [ 'Auka ætti íbúakosningar', 1 ],
  [ 'Sveitarfélagið á að reka öflugan tónlistarskóla', 1 ],
  [ 'Auka á útvistun verkefna við rekstur leikskóla eða grunnskóla', 1 ],
  [ 'Forgangsatriði er að koma fráveitumálum í lag, þrátt fyrir kostnað', 1 ],
  [ 'Auka á stuðning við íþróttastarf barna með styrkjum', 1 ],
  [ 'Auka ætti þjónustu við íbúa frekar en að lækka álögur', 1 ],
  [ 'Sorphirða þarf að vera með þeim hætti að allt heimilissorp verði flokkað', 1 ],
  [ 'Auka ætti stuðning við menningartengda starfsemi', 1 ],
  [ 'Stjórnsýslan ætti að vera opin (t.d. með birtingu bókhalds)', 1 ]
];

function getOffset (el) {
  let left = 0;
  let top = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    left += el.offsetLeft - el.scrollLeft;
    top += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top, left };
}
function tooltipShow (event, info) {
  d3.select('#tip').style('display', '');
  d3.select('#info').html(
      `<p>Spurt var: ${info.question}</p>` +
      (info.polarity < 0
        ? '<p><small>Spurningunni var snúið úr neitun í játun.</small></p>'
        : '')
    );
  tooltipMove(event);
}
function tooltipMove (event) {
  const elmOffs = getOffset(document.querySelector('#el2018a'));
  const mouse = d3.mouse(document.body);
  let l = (event.pageX - elmOffs.left + 15);
  if (l > (+svg.attr('width') - 300)) {
    l = mouse[0] - 250;
  }
  const h = event.pageY - elmOffs.top + 15;
  d3.select('#info')
    .style('bottom', h > (+svg.attr('height') / 2) ? '0px' : '');
  d3.select('#tip')
    .style('top', h + 'px')
    .style('left', l + 'px');
}
function tooltipHide () {
  d3.select('#tip').style('display', 'none');
}


function getTable () {
  const filterA = +document.getElementById('cand_a').value;
  const filterB = +document.getElementById('cand_b').value;
  const cand_a = data.find(d => d._id === filterA);
  const cand_b = data.find(d => d._id === filterB);
  return questions.filter(d => d.type === 'ney2yay').map((q, i) => {
    const val_a = cand_a[q.label] * relabel[q.index][1];
    const val_b = cand_b[q.label] * relabel[q.index][1];
    return {
      label: relabel[q.index][0] || q.label,
      question: q.label,
      polarity: relabel[q.index][1],
      index: i,
      min: d3.min([ val_a, val_b ]),
      max: d3.max([ val_a, val_b ]),
      a_min: val_a < val_b || (isNaN(val_a) && !isNaN(val_b)),
      a_label: cand_a.Nafn,
      a_value: val_a,
      b_label: cand_b.Nafn,
      b_value: val_b
    };
  });
}

function percent (n) {
  return isNaN(n) ? '' : (Math.floor(Math.abs(n * 100)) + '%')
}

function render () {
  const table = getTable();
  y.domain(table.map(row => row.index));
  x.domain([ -1.2, 1.2 ]);

  plot.html(null);

  const xAxis = d3.axisBottom(x)
    .tickSizeInner(-height)
    .tickSizeOuter(0)
    .tickValues([-1, 0, 1])
    .tickFormat(t => {
      if (t === -1) { return 'Ósammála'; }
      if (t ===  1) { return 'Sammála'; }
      return 'Hlutlaus';
    });
  plot.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  const rsize = 0.4;
  const middle = y.bandwidth() / 2;

  const rowEnter = plot.selectAll('.row')
    .data(table)
    .enter();

  const row = rowEnter.append('g')
    .attr('transform', d => `translate(${0},${y(d.index) + middle})`)
    .attr('pointer-events', 'all')
    .on('mouseover', function (d) {
      d3.select(this).select('.bg').attr('class', 'bg hover');
      tooltipShow(d3.event, d);
    })
    .on('mousemove', function (d) {
      tooltipMove(d3.event);
    })
    .on('mouseout', function (d) {
      d3.select(this).select('.bg').attr('class', 'bg');
      tooltipHide();
    });

  row.append('rect')
    .attr('class', 'bg')
    .attr('rx', 10)
    .attr('y', -middle)
    .attr('height', y.bandwidth())
    .attr('x', -margin.left * 0.95)
    .attr('width', width + (margin.left));

  row.append('text')
    .attr('font-size', 12)
    .attr('text-anchor', 'end')
    .attr('x', -12)
    .attr('dy', '0.3em')
    .text(d => d.label);

  row.append('rect')
    .attr('class', 'band')
    .attr('y', -middle * rsize)
    .attr('height', y.bandwidth() * rsize)
    .attr('x', d => x(d.min))
    .attr('width', d => x(d.max) - x(d.min));

  const points = row.selectAll('circle')
    .data((d, i) => ([
      { id: 'a',
        row: i,
        value: d.a_value,
        isMin: d.a_min },
      { id: 'b',
        row: i,
        value: d.b_value,
        isMin: !d.a_min,
        same: d.a_value === d.b_value }
    ]))
    .enter();

  points.append('circle')
    .attr('class', d => `cand--${d.id}${isNaN(d.value) ? ' null' : ''}${(!d.row ? ' first' : '')}`)
    .attr('cx', d => d.value == null ? 0 : x(d.value))
    .attr('r', d => y.bandwidth() * (!d.same ? 0.3 : 0.15));    

  points.append('text')
    .attr('class', d => `cand--${d.id}`)
    .attr('dy', '0.3em')
    .attr('x', d => x(d.value || 0) + y.bandwidth() * (d.isMin ? -0.4 : 0.4))
    .attr('text-anchor', d => d.isMin ? 'end' : 'start')
    .text(d => percent(d.value));

  // legend
  const row1 = table[0];

  const cand_a = plot.append('g')
    .attr('class', 'legend--cand--a')
    .attr('transform', d => `translate(${isNaN(row1.a_value) ? 0 : x(row1.a_value)},${0})`);

  cand_a.append('line')
    .attr('stroke', "#888")
    .attr('y1', y(row1.index) * 0.2)
    .attr('y2', y(row1.index));

  cand_a.append('text')
    .attr('x', d => (row1.a_min ? 1.2 : -1.2))
    .attr('text-anchor', d => row1.a_min ? 'end' : 'start')
    .text(d => row1.a_label);

  const cand_b = plot.append('g')
    .attr('class', 'legend--cand--b')
    .attr('transform', d => `translate(${x(row1.b_value)},${0})`);

  cand_b.append('line')
    .attr('stroke', '#888')
    .attr('y1', y(row1.index) * 0.2)
    .attr('y2', y(row1.index));

  cand_b.append('text')
    .attr('x', d => (!row1.a_min ? 1.2 : -1.2))
    .attr('text-anchor', d => !row1.a_min ? 'end' : 'start')
    .text(d => row1.b_label);
}

function norm (str) {
  return str && str.toLowerCase().trim();
}

function populateCands () {
  const muni = document.getElementById('muni').value;

  const cand_a = document.getElementById('cand_a');
  cand_a.onchange = render;
  cand_a.innerHTML = '';
  const cand_b = document.getElementById('cand_b');
  cand_b.onchange = render;
  cand_b.innerHTML = '';

  const candlist = data
    .filter(d => d.Sveitarfélag === muni)
    .sort((a, b) => d3.ascending(a.Framboð, b.Framboð) || d3.ascending(a.Nafn, b.Nafn));

  const pop = function (cand, sel) {
    let og;
    candlist.reduce((last, curr, idx) => {
      if (norm(curr.Framboð) !== norm(last.Framboð)) {
        og = document.createElement('optgroup');
        og.label = curr.Framboð;
        cand.appendChild(og);
      }
      og.appendChild(new Option(curr.Nafn, curr._id, sel === idx, sel === idx));
      return curr;
    }, {});
  }
  pop(cand_a, ~~(Math.random() * candlist.length));
  pop(cand_b, ~~(Math.random() * candlist.length));
  document.getElementById('cands').style.display = '';
  render();
}

function populateMuni () {
  const muni = document.getElementById('muni');
  document.getElementById('cands').style.display = 'none';
  muni.innerHTML = '';
  muni.onchange = populateCands;
  d3.set(data.map(d => d.Sveitarfélag).filter(Boolean)).values()
    .forEach(d => muni.appendChild(new Option(d, d, d === 'Reykjavík', d === 'Reykjavík')));
  populateCands();
}

d3.json(d3.select('#el2018a_data').attr('src'))
  .then(d => {
    const unLabel = str => d.labels[str] || str;
    questions = d.questions;
    data = d.data.map(pk => {
      return Object.keys(pk).reduce((fact, key) => {
        return (fact[unLabel(key)] = pk[key] ? unLabel(pk[key]) : pk[key]), fact;
      }, {});
    });
  })
  .then(populateMuni);
