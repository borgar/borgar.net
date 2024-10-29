// no margins
const svg = d3.select('#vpage svg');
const width = 1000;
const height = 1480;
const pad = { top: 138, right: 50, bottom: 150, left: 50 };
const plotWidth = width - pad.left - pad.right;
const plotHeight = height - pad.top - pad.bottom;

const DEBUG = false;
const dash = '−';
const fontSize = 16;
let rowHeight = 18;
const colGroupH = 40;
const headHeight = 138;
const nameColWidth = 190;
const gutter = 6;

const defs = svg.append('defs');

const table = svg.append('g')
  .attr('transform', `translate(${pad.left},${pad.top})`);

const rules = [
  { y: -5, width: 2, range: 0 },
  { y: 0, width: 1, range: 0 },
  { y: headHeight, width: 2, range: nameColWidth },
  { y: plotHeight, width: 2, range: 0 }
];

const colWidth = (plotWidth - nameColWidth) / 14;
const colOffs = (i) => 190 + i * colWidth;

const columns = [
  { x: 0, w: nameColWidth - 60, align: 'start', },
  { x: nameColWidth - 60, w: 60,  align: 'end' },
  { x: colOffs(0), w: colWidth }, 
  { x: colOffs(1), w: colWidth },
  { x: colOffs(2), w: colWidth },
  { x: colOffs(3), w: colWidth, group: 1, y: 1 },
  { x: colOffs(4), w: colWidth, group: 1, y: 1 },
  { x: colOffs(5), w: colWidth, group: 1 },
  { x: colOffs(6), w: colWidth, group: 2, y: 1 },
  { x: colOffs(7), w: colWidth, group: 2, y: 1 },
  { x: colOffs(8), w: colWidth, group: 2 },
  { x: colOffs(9), w: colWidth },
  { x: colOffs(10), w: colWidth, group: 3, y: 1 },
  { x: colOffs(11), w: colWidth, group: 3, y: 1 },
  { x: colOffs(12), w: colWidth, group: 3 },
  { x: colOffs(13), w: colWidth },
];

function print (text, attr) {
  const t = table.append('text').text(text);
  t.attr('transform', `translate(${attr.x},${attr.y})` +
                  (attr.r ? `rotate(${-attr.r})` : ''));
  t.attr('text-anchor', attr.align || 'middle');
  attr.size && t.attr('font-size', attr.size * fontSize);
  attr.spacing && t.attr('letter-spacing', attr.spacing);
  attr.bold && t.attr('font-weight', 600);
  attr.italic && t.attr('font-style', 'italic');
  if (DEBUG) {
    table.append('line')
      .attr('x1', attr.x - 5)
      .attr('x2', attr.x + 5)
      .attr('y1', attr.y)
      .attr('y2', attr.y)
      .attr('stroke', 'red')
      .attr('stroke-width', 1);
    table.append('line')
      .attr('x1', attr.x)
      .attr('x2', attr.x)
      .attr('y1', attr.y - 5)
      .attr('y2', attr.y + 5)
      .attr('stroke', 'red')
      .attr('stroke-width', 1);
  }
  return t.node().getComputedTextLength();
}

function colHead (n, txt_is, txt_en) {
  const col_cx = (columns[n].x + columns[n].w / 2) + 4;
  const y = columns[n].group ? 90 : 70;
  print(txt_is, { x: col_cx - 8, y: y, size: .9, r: 90 });
  print(txt_en, { x: col_cx + 8, y: y, size: .84, r: 90, italic: 1 });
}

function colGroup (n, txt_is, txt_en) {
  const grp = columns.filter(c => c.group == n);
  const x = grp[0].x;
  const w = grp.reduce((a, c) => a + c.w, 0);
  print(txt_is, { x: x + w/2, y: 18, size: 1, bold: 1, spacing: 1 });
  print(txt_en, { x: x + w/2, y: 34, size: .84, italic: 1 });
  table.append('line')
    .attr('x1', x)
    .attr('x2', x + w)
    .attr('y1', colGroupH)
    .attr('y2', colGroupH)
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
}

print('Ágúst', { x: 0, y: -37, size: 1.4, align: 'start' });
print('Veðráttan', { x: plotWidth / 2, y: -37, size: 1.7, bold: 1 });
print('1947', { x: plotWidth, y: -37, size: 1.4, align: 'end' });
print('(30)', { x: plotWidth/2, y: plotHeight + 60, size: 1.4 });

print('Stöðvar:', { x: columns[2].x / 2, y: 105, spacing: 2, bold: 1 });
print('Stations:', { x: columns[2].x / 2, y: 124, size: .92, italic: 1 });
colHead(2, 'Loftvægi 700 mm+', 'Pressure');
colHead(3, 'Meðalhiti °C', 'Mean temperature');
colHead(4, 'Vik frá meðallagi', 'Deviation f. normal');
colHead(5, 'Meðaltal', 'Mean');
colHead(6, 'Hæst', 'Highest');
colHead(7, 'Dag', 'Date');
colHead(8, 'Meðaltal', 'Mean');
colHead(9, 'Hæst', 'Highest');
colHead(10, 'Dag', 'Date');
colHead(11, 'Sjávarhiti', 'Sea temperature');
colHead(12, 'Alls', 'Total');
colHead(13, 'Mest á dag', 'Most per 24h.');
colHead(14, 'Dag', 'Date');
colHead(15, 'Skýjahula', 'Cloudiness');
colGroup(1, 'Hámark hitans', 'Maximum temp.');
colGroup(2, 'Lágmark hitans', 'Minimum temp.');
colGroup(3, 'Úrkoma mm', 'Percipitation');

const hr = table.append('g');
rules.forEach(r => {
  hr.append('line')
    .attr('x1', r.range)
    .attr('x2', plotWidth)
    .attr('y1', r.y)
    .attr('y2', r.y)
    .attr('stroke', 'black')
    .attr('stroke-width', r.width);
});
columns.slice(1).forEach(r => {
  hr.append('line')
    .attr('x1', r.x + r.w)
    .attr('x2', r.x + r.w)
    .attr('y1', (r.y ? colGroupH : 0))
    .attr('y2', plotHeight)
    .attr('stroke', 'black')
    .attr('stroke-width', r.y ? 1 : 2);
});


function fmt (n, f=1) {
  if (n == null) { return dash; }
  return n.toFixed(f);
}

function alignOffs (col) {
  const align = col.align || 'middle';
  if (align === 'end') {
    return col.w - gutter;
  }
  else if (align === 'middle') {
    return (col.w - gutter * 2) / 2 + gutter;
  }
  return col.x && gutter;
}

function renderTable (data) {
  const rowAxis = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([ headHeight, plotHeight ])
    .paddingOuter(.7)
    .paddingInner(.05);

  const cell = (row, col, text) => {
    return print(text, {
      align: columns[col].align,
      y: rowAxis(row) + rowAxis.bandwidth() * .8,
      x: columns[col].x + alignOffs(columns[col]),
    })
  };

  data.forEach((fact, y) => {
    if (!fact) { return; }

    table.append('rect')
      .attr('x', 0)
      .attr('y', rowAxis(y))
      .attr('width', plotWidth)
      .attr('height', rowAxis.bandwidth())
      .attr('fill', 'rgba(200,0,0,0)');

    let a = cell(y,  0, fact.station);
    let b = cell(y,  1, fact.masl + ' m');
    cell(y,  2, fmt(fact.pressure));
    cell(y,  3, fmt(fact.mean_temp));
    cell(y,  4, fmt(fact.dev_norm));
    cell(y,  5, fmt(fact.max_temp_mean));
    cell(y,  6, fmt(fact.max_temp_high));
    cell(y,  7, fact.max_temp_date || dash);
    cell(y,  8, fmt(fact.min_temp_mean));
    cell(y,  9, fmt(fact.min_temp_high));
    cell(y, 10, fact.min_temp_date || dash);
    cell(y, 11, fmt(fact.sea_temp));
    cell(y, 12, fmt(fact.precip_total, 0));
    cell(y, 13, fmt(fact.precip_max, 0));
    cell(y, 14, fact.precip_date || dash);
    cell(y, 15, fmt(fact.cloudcov));

    if (nameColWidth - (a + b) > 30) {
      const baseline = rowAxis(y) + rowAxis.bandwidth() * .8;
      defs.append('path')
        .attr('id', 'elli_' + y)
        .attr('stroke', 'none')
        .attr('d', `
          M ${a + 6},${baseline}
          L ${nameColWidth - gutter - b - 6},${baseline}
        `);
      table.append('text')
        .attr('letter-spacing', 4)
          .append('textPath')
          .attr('href', '#elli_' + y)
          .text('............................');
    }

  });
}

Promise
  .all([
    d3.json(d3.select('#vpage_data').attr('src')),
    document.fonts && document.fonts.ready ? document.fonts.ready : new Promise(r => setTimeout(() => r(), 200))
  ])
  .then(a => renderTable(a[0]));
