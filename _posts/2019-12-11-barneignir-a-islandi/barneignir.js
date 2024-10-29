const table = `-;Jan;Feb;Mar;Apr;Maí;Jún;Júl;Ágú;Sep;Okt;Nóv;Des
1;1005;945;969;1001;1005;1031;1030;986;1019;1060;933;954
2;987;1007;925;903;1011;1019;1001;1014;1022;1063;945;930
3;978;962;954;955;1006;977;1026;1056;973;1034;958;920
4;1025;1010;951;961;1021;964;1000;999;939;1096;945;900
5;966;928;955;978;1070;1016;998;1061;973;1035;926;917
6;964;865;976;994;1025;1003;1021;994;1002;990;936;952
7;938;979;959;963;1057;963;1060;1082;990;1018;963;935
8;923;971;932;970;998;957;961;1059;1013;1016;971;950
9;890;946;1013;929;957;1016;992;1038;1001;1021;948;882
10;934;977;1009;998;1015;942;993;1040;955;1042;988;950
11;974;982;947;975;1001;994;998;1017;1008;1006;1013;928
12;998;1020;1011;1025;1055;960;1016;965;1044;964;897;899
13;926;903;971;885;988;981;1023;975;979;932;919;912
14;926;959;995;997;983;1054;977;1015;951;977;934;973
15;963;925;1030;994;1031;970;960;1000;1029;920;986;930
16;967;955;965;948;997;1014;1104;1003;1040;942;977;978
17;915;987;950;959;1001;991;1052;1033;1019;985;914;969
18;970;985;974;995;1023;1067;1027;1087;1029;942;948;995
19;909;968;995;1009;950;1049;984;1044;1038;942;953;894
20;956;961;978;982;958;1047;1057;978;1082;940;961;934
21;939;1028;958;943;935;1021;1029;1001;1078;918;953;869
22;931;1013;1010;1010;1024;989;1018;984;1021;933;999;896
23;908;1015;1036;961;997;1015;989;939;1054;897;910;856
24;910;923;928;970;1019;980;1021;1003;1024;922;926;791
25;957;973;944;979;960;1036;993;1011;1074;912;971;724
26;890;899;972;989;1067;1060;1008;958;1071;897;904;803
27;888;939;946;992;1014;967;1025;1107;1123;947;867;913
28;897;1001;937;1080;962;1044;1034;988;1057;956;906;917
29;946;217;944;990;935;1025;967;970;1056;919;914;893
30;959;;1013;980;1018;1005;1039;932;1063;945;928;955
31;865;;967;;1014;;956;932;;938;;783`
.split('\n')
.map((r, y) => {
  return r.split(';').map((c, x) => {
    return ((x && y && c) ? +c : c || null)
  });
});

const months = 'Jan Feb Mar Apr Maí Jún Júl Ágú Sep Okt Nóv Des'.split(' ');;

const daysPerMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

const margin = {
  top: 4,
  right: 100,
  bottom: 20,
  left: 40
};

const notLeapDay = d => {
  return !(
    d.date.getUTCMonth() === 1 &&
    d.date.getUTCDate() === 29
  );
};

const stat = data => {
  const arr = d3.range(12)
    .map(d => ({ month: d, values: [] }));
  data.filter(notLeapDay).forEach(d => {
    const m = d.date.getUTCMonth();
    arr[m].values.push(d.value);
  });
  arr.forEach(d => {
    d.mean = d.values.reduce((a, c) => a + c, 0) / d.values.length;
    d.std = Math.sqrt(d.values.reduce((a, c) => a + Math.pow(c - d.mean, 2), 0) / d.values.length);
  });
  return arr;
};

const color = d3.scaleLinear()
  .domain([ 700, 950, 1200 ])
  .range([ '#d73027', '#fee08b', '#1a9850' ])
  .clamp(true)
  .interpolate(d3.interpolateHcl);

function dotPlot (containerSelector, data, domain = [ 850, 1100 ]) {
  const container = d3.select(containerSelector);
  container.html(null);
  const width = Math.min(640, getWidth(container.node()));
  const height = Math.min(250, width * 0.4);
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  const svg = container.append('svg')
      .attr('viewBox', [ 0, 0, width, height ]);
  const plot = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().domain(d3.range(12))
    .range([ 0, w ]).padding(.4);
  const y = d3.scaleLinear().domain(domain)
    .range([ h, 0 ]).nice();

  plot.append('g')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(x).tickFormat(d => months[d]))
    .attr('font-size', 12)
    .selectAll('path,line').remove();

  plot.append('g')
    .attr('transform', `translate(0,0)`)
    .call(d3.axisLeft(y).ticks(5))
    .attr('font-size', 12)
    .selectAll('path').remove();
 
  const enter = plot.append('g')
    .selectAll('circle')
      .data(data).enter();
  
  enter.append('circle')
    .attr('cy', d => y(d.mean))
    .attr('cx', d => x(d.month) + x.bandwidth() / 2)
    .attr('r', 3)
    .attr('fill', '#4D4D4D');

  enter.append('line')
    .attr('y1', d => y(d.mean + d.std))
    .attr('y2', d => y(d.mean - d.std))
    .attr('x1', d => x(d.month) + x.bandwidth() / 2)
    .attr('x2', d => x(d.month) + x.bandwidth() / 2)
    .attr('stroke', '#4D4D4D');
}

function heatMap (containerSelector, data) {
  const container = d3.select(containerSelector);
  const width = getWidth(container.node());
  const height = width / 2;
  const w = (width - margin.left - margin.right);
  const h = (height - margin.top - margin.bottom);

  const y = d3.scaleBand()
    .domain(d3.range(12))
    .range([ 0, h ]);

  const x = d3.scaleBand()
    .domain(d3.range(1, 32))
    .range([ 0, w ]);

  const yAxis = svg => svg
     .call(d3.axisLeft(y).tickFormat(d => months[d]))
     .attr('font-size', 14)
     .selectAll('path,line').remove();

  const xAxis = svg => svg
     .attr("transform", `translate(0,${h})`)
     .call(d3.axisBottom(x).tickFormat(String))
     .attr('font-size', 12)
     .selectAll('path,line').remove();

  const svg = getSvg(containerSelector);
  const plot = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  plot.append('g').call(xAxis);
  plot.append('g').call(yAxis);

  // plot
  plot.append('g')
    .selectAll('rect')
      .data(data)
    .enter().append('rect')
      .attr('y', d => y(d.date.getUTCMonth()))
      .attr('x', d => x(d.date.getUTCDate()))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.value));
  // legend
  const scale = [ 700, 1200 ];
  const le = d3.range(scale[0], scale[1]+1, 10)
    .reverse();
  const cs = d3.scaleBand()
    .domain(le)
    .range([ 0, h ]);
  const legend = plot.append('g')
     .attr('transform', `translate(${w + 20},${0})`)
  legend
    .selectAll('rect')
      .data(le)
    .enter().append('rect')
      .attr('y', cs)
      .attr('width', 30)
      .attr('height', cs.bandwidth() + 0.5)
      .attr('fill', d => color(d));
  legend
    .append('g')
     .attr('transform', `translate(${30},${0})`)
     .call(d3.axisRight(cs).tickValues(le.filter(d => (d % 50 ? '' : d))))
     .attr('font-size', 14)
     .selectAll('path').remove();
}

function getWidth (elm) {
  const space = elm.clientWidth;
  if (space >= 980) { return 980; }
  if (space >= 640) { return 640; }
  return space;
}

function getSvg (containerSelector, w, h) {
  const container = d3.select(containerSelector);
  const width = w || getWidth(container.node());
  const height = width / 2;
  container.html('');
  const svg = container.append('svg')
    .attr('viewBox', [ 0, 0, width, h || height ])
    .attr('width', width)
    .attr('height', h || height);
  return svg;
}

const slider = document.querySelector('#gestation_slider');
const slider_val = document.querySelector('#gestation_value');

function render () {
  slider_val.value = slider.value + ' dagar';
  const gestation = slider.value * 1;

  const data = d3.range(366).map(i => {
    const dt = new Date(1980, 0, 1 + i);
    const m = dt.getUTCMonth();
    const d = dt.getUTCDate();
    return { date: dt, value: table[d][m + 1] };
  });
  const data2 = d3.range(365).map(i => {
    const dt1 = new Date(1982, 0, (1 + i)); // pull data from...
    const dt2 = new Date(1982, 0, (1 + i - gestation)); // set data to...
    return { date: dt2, value: table[dt1.getUTCDate()][dt1.getUTCMonth() + 1] };
  });

  heatMap(
    '#barneignir_chart1',
    data
  );

  dotPlot(
    '#barneignir_chart2',
    stat(data)
  );

  heatMap(
    '#barneignir_chart3',
    data2
  );

  dotPlot(
    '#barneignir_chart4',
    stat(data2)
  );

  dotPlot(
    '#barneignir_chart5',
    stat(data2),
    [0, 1200]
  );
}

render();

slider.addEventListener('input', render);
let debounceTimer = null;
window.addEventListener('resize', e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    render();
  }, 50);
});
