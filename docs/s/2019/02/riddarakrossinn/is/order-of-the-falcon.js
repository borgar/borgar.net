const sexCode = {
  m: 'Karlar',
  f: 'Konur'
};
const levelCode = {
  5: 'Riddarakross',
  4: 'Stórriddarakross',
  3: 'Stórriddarakross með stjörnu',
  2: 'Stórkross',
  1: 'Stórkross með keðju'
};
const categoryCode = {
  '???': '(óþekkt)',
  'art': 'Listir, bókmenntir, og útgáfa',
  'cnc': 'Prestar og hirðfólk',
  'com': 'Verslun og iðnaður',
  'dip': 'Diplómatar og sendiherrar',
  'edu': 'Menntun, Vísindi, Lækningar',
  'gov': 'Opinberir starfsmenn',
  'law': 'Lögfræði og Lögregla',
  'mil': 'Hernaður',
  'org': 'Félagastarf og íþróttir',
  'pol': 'Stjórnmál',
  'rul': 'Ríkjandi valdhafar',
};
const countryCode = {
  "???": "(óþekkt)",
  "ARG": "Argentína",
  "ALA": "Álandseyjar",
  "AUS": "Ástralía",
  "AUT": "Austurríki",
  "USA": "Bandaríkin",
  "BEL": "Belgía",
  "BRA": "Brasilía",
  "GBR": "Bretland",
  "BGR": "Búlgaría",
  "DNK": "Danmörk",
  "EGY": "Egyptaland",
  "EST": "Eistland",
  "FIN": "Finnland",
  "FRA": "Frakkland",
  "FRO": "Færeyjar",
  "GRC": "Grikkland",
  "GRL": "Grænland",
  "NLD": "Holland",
  "IND": "Indland",
  "IRN": "Íran",
  "IRL": "Írland",
  "ISL": "Ísland",
  "ISR": "Ísrael",
  "ITA": "Ítalía",
  "JPN": "Japan",
  "JOR": "Jórdanía",
  "YUG": "Júgóslavía",
  "CAN": "Kanada",
  "CHN": "Kína",
  "COL": "Kólumbía",
  "CUB": "Kúba",
  "CYP": "Kýpur",
  "LVA": "Lettland",
  "LTU": "Litháen",
  "LBN": "Líbanon",
  "LUX": "Lúxemborg",
  "MEX": "Mexíkó",
  "MCO": "Mónakó",
  "NOR": "Noregur",
  "NGA": "Nígería",
  "IRN": "Persía",
  "PER": "Perú",
  "PRT": "Portúgal",
  "POL": "Pólland",
  "RUS": "Rússland",
  "SVN": "Slóvenía",
  "ESP": "Spánn",
  "LKA": "Srí Lanka",
  "KOR": "Suður Kórea",
  "CHE": "Sviss",
  "SWE": "Svíþjóð",
  "CHL": "Síle",
  "TUR": "Tyrkland",
  "THA": "Tæland",
  "CZE": "Tékkland",
  "CSK": "Tékkóslóvakía",
  "HUN": "Ungverjaland",
  "URY": "Úrúgvæ",
  "DEU": "Þýskaland"
};

function renderElements (order) {
  function getWidth (elm) {
    const space = elm.clientWidth;
    if (space >= 980) { return 980; }
    if (space >= 640) { return 640; }
    return space;
  }

  function percent (number) {
    return Math.round(number * 1000) / 10 + '%';
  }

  function setContent (selector, value) {
    document.querySelector(selector).innerHTML = value;
  }

  function barChart (containerSelector, data, margin) {
    const height = data.length * 25 + margin.top + margin.bottom;

    const container = d3.select(containerSelector);
    container.html(null);
    const width = getWidth(container.node());

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([margin.left, width - margin.right]);
    const xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80))
      .call(g => g.select(".domain").remove())

    const y = d3.scaleBand()
      .domain(data.map(d => d.key))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))

    svg.append("g")
        .attr("fill", "#02529C")
      .selectAll("rect")
      .data(data)
      .enter().append("rect")
        .attr("x", x(0))
        .attr("fill", d => d.color ? d.color : null)
        .attr("y", d => y(d.key))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth());
    const minLabel = margin.left + 150;
    svg.append("g").style("font", "13px sans-serif")
      .selectAll("text")
      .data(data)
      .enter().append("text")
        .attr("x", d => {
          const v = x(d.value);
          return v + (v < minLabel ? 4 : -4)
        })
        .attr("text-anchor", d => (x(d.value) < minLabel ? "start" : "end"))
        .attr("fill", d => (x(d.value) < minLabel ? "currentColor" : "white"))
        .attr("fill-opacity", d => (x(d.value) < minLabel ? .7 : 1))
        .attr("y", d => y(d.key) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.value);
    
    svg.append("g").call(xAxis);
    
    svg.append("g").call(yAxis)
      .selectAll('text').style("font", "13px sans-serif");
    
    return svg.node();
  }

  const women = order.filter(d => d.sex === 'f');

  setContent(
    '#ootf-count',
    order.length
  );
  setContent(
    '#ootf-count-wom',
    women.length
  );
  setContent(
    '#ootf-perc-wom',
    percent(women.length / order.length)
  );
  setContent(
    '#ootf-perc-iswom',
    percent(
      women.filter(d => d.nationality === 'ISL').length /
      order.filter(d => d.nationality === 'ISL').length
    )
  );
  setContent(
    '#ootf-perc-othwom',
    percent(
      women.filter(d => d.nationality !== 'ISL').length /
      order.filter(d => d.nationality !== 'ISL').length
    )
  );
  setContent(
    '#ootf-count-isl',
    order.filter(d => d.nationality !== 'ISL').length
  );
  setContent(
    '#ootf-perc-oth',
    percent(order.filter(d => d.nationality !== 'ISL').length / order.length)
  );

  // chart 1
  {
    let others = 0;
    const data = d3.nest()
        .key(d => countryCode[d.nationality])
        .rollup(v => v.length)
        .entries(order)
        .sort((a, b) => b.value - a.value)
        .filter(d => {
          others += d.value < 10 ? d.value : 0;
          return d.value >= 10;
        })
        .concat([{ key: "Annað", value: others, color: 'rgba(128,128,128,.6)' }]);

    barChart('#ootf-chart1', data, { top: 20, left: 180, right: 20, bottom: 0 })
  }

  // chart 2
  {
    const data = d3.nest()
        .key(d => categoryCode[d.category])
        .rollup(v => v.length)
        .entries(order)
        .sort((a, b) => b.value - a.value);
    // return barChart(data, { top: 20, left: 180, right: 20, bottom: 20 })
    barChart('#ootf-chart2', data, { top: 20, left: 180, right: 30, bottom: 0 })
  }

  // chart 3
  {
    const data = d3.nest()
        .key(d => levelCode[d.class])
        .rollup(v => v.length)
        .entries(order.filter(d => d.nationality === 'ISL'))
        .sort((a, b) => b.value - a.value);

    barChart('#ootf-chart3', data, { top: 20, left: 180, right: 20, bottom: 20 })
  }

  // chart 4
  {
    const data = d3.nest()
        .key(d => levelCode[d.class])
        .rollup(v => v.length)
        .entries(order.filter(d => d.nationality !== 'ISL'))
        .sort((a, b) => b.value - a.value);

    barChart('#ootf-chart4', data, { top: 20, left: 180, right: 20, bottom: 20 })
  }

  // chart 5
  {
    const data = d3.nest()
        .key(d => sexCode[d.sex])
        .rollup(v => v.length)
        .entries(order)
        .sort((a, b) => b.value - a.value);

    barChart('#ootf-chart5', data, { top: 20, left: 46, right: 20, bottom: 5 })
  }

  // chart 6
  {
    const decade = d => +d.date.slice(0, 3) * 10;

    const data = d3.nest()
        .key(d => decade(d) + ':' + d.sex)
        .entries(order)
        .map(d => {
          d.decade = decade(d.values[0]);
          d.sex = d.values[0].sex;
          d.value = d.values.length;
          return d;
        });

    const container = d3.select('#ootf-chart6');
    const width = getWidth(container.node());
    container.html(null);

    const margin = { top: 10, left: 46, right: 20, bottom: 30 };
    const height = (width * 0.45) + margin.top + margin.bottom;

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.decade))
      .range([ margin.left, width - margin.right ])
      .paddingInner(0.05)
      .paddingOuter(0.1);
    const x1 = d3.scaleBand()
      .domain(data.map(d => d.sex))
      .rangeRound([ 0, x0.bandwidth() ]);
    const y = d3.scaleLinear()
      .domain([ 0, d3.max(data, d => d.value) ])
      .rangeRound([ height - margin.bottom, margin.top ]);

    const z = d3.scaleOrdinal([ '#02529C', '#DC1E35' ])
      .domain(x1.domain());

    const xAxis = g => g
      .attr("transform", `translate(0,${height-margin.bottom})`)    
      .call(d3.axisBottom(x0).ticks(width / 80))
      .call(g => g.select(".domain").remove())

    const tickSize = -(width - margin.left - margin.right);
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(tickSize));

    svg.append("g").call(yAxis)
      .selectAll('line').attr('stroke-opacity', 0.2);

    svg.append("g")
        .attr("fill", "#02529C")
      .selectAll("rect")
      .data(data)
      .enter().append("rect")
        .attr("x", d => x0(d.decade) + x1(d.sex))
        .attr("y", d => y(d.value >= 0 ? d.value : 0))
        .attr("height", d => Math.abs(y(0) - y(d.value)))
        .attr("width", x1.bandwidth())
        .attr("fill", d => z(d.sex));

    svg.append("g").call(xAxis)
      .selectAll('text').style("font", "13px sans-serif");

    const legendEnter = svg.append("g")
        .style("font", "14px sans-serif")
        .attr("transform", `translate(${margin.left + 10},${margin.top + 10})`)
      .selectAll("g").data([ 'm', 'f' ]).enter();
    legendEnter.append("rect")
        .attr('y', (d, i) => i * 20)
        .attr("height", 10)
        .attr("width", 10)
        .attr("fill", d => z(d));
    legendEnter.append("text")
        .attr('y', (d, i) => i * 20 + 10)
        .attr('x', 15)
        .attr("fill", "currentColor")
        .text(d => sexCode[d]);
  }
}

d3.csv(d3.select('#medalion-data').attr('src'), order => {
  renderElements(order);

  let debounceTimer = null;
  window.addEventListener('resize', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderElements(order);
    }, 50);
  });
});
