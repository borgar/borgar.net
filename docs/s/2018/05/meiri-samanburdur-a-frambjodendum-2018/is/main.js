/* globals d3 */
const svg = d3.select('svg');
const margin = { top: 164, right: 1, bottom: 1, left: 164 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

var x = d3.scaleBand().range([ 0, width ]).padding(0);
var y = d3.scaleBand().range([ 0, height ]).padding(0);

svg.append('defs')
  .append('pattern')
    .attr('id', 'stripes')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4)
  .append('path')
    .attr('d', "M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2")
    .attr('stroke-width', 1)
    .attr('shape-rendering', 'auto')
    .attr('stroke', '#aaa')
    .attr('stroke-linecap', 'square');

let questions = [];
let candById = {};
let data;

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
  if (info.row._id === info.col._id) {
    if (info.col.Kyn === 'Karl') {
      pro = 'Hann';
    }
    if (info.col.Kyn === 'Kona') {
      pro = 'Hún';
    }
    d3.select('#info').html(
      `<p><small>Röð / Dálkur</small> <em>${info.row.Nafn}</em> (${info.row.Framboð})</p>` +
      `<p>${pro} er ${Math.round(100 * info.row.agreeableness)}% sammála öllum öðrum.</p>`
    );
  }
  else {
    let pro = 'Þau';
    if (info.col.Kyn === 'Karl' && info.row.Kyn === info.col.Kyn) {
      pro = 'Þeir';
    }
    if (info.col.Kyn === 'Kona' && info.row.Kyn === info.col.Kyn) {
      pro = 'Þær';
    }
    d3.select('#info').html(
      `<p><small>Röð:</small> <em>${info.row.Nafn}</em> (${info.row.Framboð})</p>` +
      `<p><small>Dálkur:</small> <em>${info.col.Nafn}</em> (${info.col.Framboð})</p>` + 
      `<p>${pro} eru ${Math.round(100 * info.value)}% sammála, byggt á ${info.num} spurningum.</p>`
    );
  }
  d3.select('#tip').style('display', '');
  tooltipMove(event);
}
function tooltipMove (event) {
  const elmOffs = getOffset(document.querySelector('#el2018b'));
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

const _cache = {};
function compare (a, b) {
  const cid = a._id + ':' + b._id;
  if (!_cache[cid]) {
    let sum = 0;
    let num = 0;
    let v = [];
    questions.forEach(q => {
      if (q.label === 'Sveitarfélag') { return; }
      const a_val = a[q.label];
      const b_val = b[q.label];
      if (a_val != null && b_val != null) {
        sum += Math.abs(a_val - b_val);
        num++;
        v.push(a_val - b_val);
      }
    })
    _cache[cid] = {
      row: a,
      col: b,
      sum: sum,
      num: num,
      value: num ? 1 - (sum / num) * 0.5 : null
    };
  }
  return _cache[cid];
}


function norm (str) {
  return str && str.toLowerCase().trim();
}

const orderBy = {
  party: (a, b) => d3.ascending(norm(a.Framboð), norm(b.Framboð)) || d3.ascending(a._seat, b._seat),
  name: (a, b) => d3.ascending(norm(a.Nafn), norm(b.Nafn)) || d3.ascending(a._seat, b._seat),
  agree: (a, b) => d3.descending(a.agreeableness, b.agreeableness)
};

function render () {
  const muni = document.getElementById('muni').value;
  const order = document.getElementById('order').value || 'party';

  const numByParty = {};
  const cands = data.filter(d => {
    if (d.Sveitarfélag === muni) {
      if (d._answers < 5) {
        // sorry, this cand is going to ruin the chart for everyone
        return false;
      }
      const nth = numByParty[norm(d.Framboð)] || 1;
      if (nth <= 4) {
        d._seat = nth;
        numByParty[norm(d.Framboð)] = nth + 1;
        return true;
      }
    }
    return false;
  });

  cands.forEach(d => {
    d.agreeableness = cands.reduce((a, c) => a + compare(d, c).value, 0) / cands.length;
  });

  cands.sort(orderBy[order]);

  y.domain(cands.map(d => d._id));
  x.domain(cands.map(d => d._id));
  plot.html(null);

  const yAxis = d3.axisLeft(y)
    .tickSize(0)
    .tickFormat(t => candById[t].Nafn);
  plot.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);

  const xAxis = d3.axisTop(x)
    .tickSize(0)
    .tickFormat(t => candById[t].Nafn);
  plot.append('g')
    .attr('class', 'axis axis--x')
    .call(xAxis)
    .attr('text-anchor', 'start')
    .selectAll('text')
      .attr('x', 2)
      .attr('y', 0)
      .attr('dy', '.3em')
      .attr('transform', 'rotate(-90)');

  const matrix = d3.cross(cands, cands, compare);
  const ext = d3.extent(matrix.map(d => d.value));

  const color = d3.scaleLinear()
    .domain(ext)
    .range(['#eee', '#044'])
    .interpolate(d3.interpolateLab); //interpolateHsl interpolateHcl interpolateRgb

  const cellEnter = plot.selectAll('.cell')
    .data(matrix)
    .enter();

  cellEnter.append('rect')
    .attr('class', d => 'cell' + (d.col._id === d.row._id ? ' self' : ''))
    .attr('x', d => x(d.col._id))
    .attr('y', d => y(d.row._id))
    .attr('width', x.bandwidth() - 0.75)
    .attr('height', y.bandwidth() - 0.75)
    .attr('fill', d => d.col._id === d.row._id ? 'url(#stripes)': color(d.value))
    .on('mouseover', d => tooltipShow(d3.event, d))
    .on('mousemove', () => tooltipMove(d3.event))
    .on('mouseout', () => tooltipHide(d3.event));
}

function populateMuni () {
  const muni = document.getElementById('muni');
  muni.innerHTML = '';
  muni.onchange = render;
  d3.set(data.map(d => d.Sveitarfélag).filter(Boolean)).values()
    .forEach(d => muni.appendChild(new Option(d, d, d === 'Reykjavík', d === 'Reykjavík')));

  const order = document.getElementById('order');
  order.onchange = render;

  render();
}

// d3.json('/borgar/raw/94335ee85a951b9a212efacb68e3706f/data.json')
d3.json(d3.select('#el2018b_data').attr('src'))
  .then(d => {
    const unLabel = str => d.labels[str] || str;
    data = d.data.map(pk => {
      return Object.keys(pk).reduce((fact, key) => {
        return (fact[unLabel(key)] = pk[key] ? unLabel(pk[key]) : pk[key]), fact;
      }, {});
    });
    questions = d.questions;
    data.forEach(d => {
      d._answers = questions.reduce((a, q) => (a + (q.label in d ? 1 : 0)), 0)
    })
    candById = data.reduce((a, c) => ((a[c._id] = c), a), {});
  })
  .then(populateMuni);
