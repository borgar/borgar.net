const height = 371;
const pad = 56;
let hel_rgn;

const classData = [
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'A', fare: 120 },
  { class: 'B', fare: 150 },
  { class: 'B', fare: 150 },
  { class: 'B', fare: 150 },
  { class: 'B', fare: 150 },
  { class: 'B', fare: 150 },
  { class: 'C', fare: 160 },
  { class: 'C', fare: 160 },
  { class: 'C', fare: 160 },
  { class: 'C', fare: 160 },
  { class: 'D', fare: 130 },
  { class: 'D', fare: 130 },
  { class: 'E', fare: 90 },
  { class: 'F', fare: 60 }
];

function fetchJSON (url) {
  return fetch(url).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(`Can't fetch ${url}`);
  });
}

function getWidth (elm) {
  const space = elm.clientWidth;
  if (space >= 980) { return 980; }
  if (space >= 640) { return 640; }
  return space;
}

function getSvg (containerSelector) {
  const container = d3.select(containerSelector);
  const w = getWidth(container.node());
  return d3.select(containerSelector)
    .html(null)
    .append('svg')
      .attr('viewBox', `0 0 ${w} ${170}`)
      .attr('width', w)
      .attr('height', 170);
}

function getMapContext (containerSelector) {
  const container = d3.select(containerSelector);
  const width = getWidth(container.node());
  const z = window.devicePixelRatio;
  const canvas = container
    .html(null)
    .append('canvas')
      .attr('width', width * z)
      .attr('height', height * z)
      .style('width', width + 'px');
  const ctx = canvas.node().getContext('2d');
  ctx.scale(2,2);

  ctx.projection = d3.geoConicConformal()
    .translate([ width / 2, height / 2 ])
    .parallels([ -12, -6 ])
    .rotate([ -73, -23, 0 ])
    .fitExtent([[ pad, pad ], [ width - pad, height - pad ]], hel_rgn)
    .precision(0.1);

  return ctx;
}

const render = (context, what, stroke, fill, lineWidth = 1) => {
  context.beginPath();
  const path = d3.geoPath(context.projection, context).pointRadius(3);
  path(what);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.lineWidth = lineWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }
};

const label = (context, what) => {
  context.beginPath();
  context.fillStyle = 'black';
  what.features.forEach(d => {
    const [x, y] = context.projection(d.geometry.coordinates);
    context.fillText(d.properties.name, x + 4, y - 1);
  });
}

const filter = (data, fn) => {
  return { type: data.type, features: data.features.filter(fn, data) }
};

const combine = (dataA, dataB, dataC) => {
  const f = {};
  dataA.features.forEach(d => f[d.properties.code] = d);
  dataB && dataB.features.forEach(d => f[d.properties.code] = d);
  dataC && dataC.features.forEach(d => f[d.properties.code] = d);
  return { type: dataA.type, features: Object.values(f) }
};

const intersect = (dataA, dataB) => {
  const keys = {};
  dataA.features.forEach(d => keys[d.properties.code] = true);
  return { type: dataA.type, features: dataB.features.filter(d => d.properties.code in keys) }
};

Promise.all([
  fetchJSON('https://unpkg.com/world-atlas@1/world/50m.json'),
  fetchJSON(d3.select('#networks-json').attr('src')),
])
.then(([ world, networks ]) => {
  const { simpleAirNetwork, tigressAirNetwork } = networks;
  const graticule = d3.geoGraticule10();
  const land = topojson.feature(world, world.objects.land);
  hel_rgn = filter(
    combine(simpleAirNetwork, tigressAirNetwork),
    d => /^(RGN|HEL)$/.test(d.properties.code)
  );

  function renderElements () {
    {
      const ctx = getMapContext('#wdaf-map1');
      render(ctx, graticule, "#eee");
      render(ctx, land, null, "#ddd");
      render(ctx, simpleAirNetwork, null, "#377eb8", .5);
      render(ctx, filter(simpleAirNetwork, d => d.properties.code === 'HEL'), "black", "white", 1);
    }

    {
      const ctx = getMapContext('#wdaf-map2');
      render(ctx, graticule, "#eee");
      render(ctx, land, null, "#ddd");
      render(ctx, tigressAirNetwork, null, "#e41a1c", .5);
      render(ctx, filter(tigressAirNetwork, d => d.properties.code === 'RGN'), "black", "white", 1);
    }

    {
      const ctx = getMapContext('#wdaf-map3');
      render(ctx, graticule, "#eee");
      render(ctx, land, null, "#ddd");
      render(ctx, simpleAirNetwork, null, "#377eb8", .5);
      render(ctx, tigressAirNetwork, null, "#e41a1c", .5);
      const hel = filter(simpleAirNetwork, d => d.properties.code === 'HEL');
      const rgn = filter(tigressAirNetwork, d => d.properties.code === 'RGN');
      const stops = intersect(simpleAirNetwork, tigressAirNetwork);
      stops.features.forEach(stop => {
        ctx.beginPath();
        ctx.strokeStyle = '#377eb8';
        // leg 1
        const [x1, y1] = ctx.projection(hel.features[0].geometry.coordinates);
        const [x2, y2] = ctx.projection(stop.geometry.coordinates);
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(
          x1+((x2-x1)*0.5), y1+((y2-y1)*0.2),
          x2, y2
        );
        ctx.stroke();
        ctx.closePath();
        // leg 2
        ctx.beginPath();
        ctx.strokeStyle = '#e41a1c';
        const [x3, y3] = ctx.projection(rgn.features[0].geometry.coordinates);
        ctx.moveTo(x2, y2);
        ctx.quadraticCurveTo(
          x2+((x3-x2)*0.5), y2+((y3-y2)*0.2),
          x3, y3
        );
        ctx.stroke();
        ctx.closePath();
      });
      render(ctx, combine(stops, hel, rgn), "black", "white", 1);
      label(ctx, combine(stops, hel, rgn));
    }

    {
      const svg = getSvg('#wdaf-chart1');
      const g = svg.selectAll("g").data(classData).enter().append("g")
        .attr('transform', (d, i) => `translate(${i * 24}, 0)`)
        .attr('fill', 'gray')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('font-size', '15px');
      g.append('rect')
        .attr('y', d => 170 - d.fare)
        .attr('height', d => d.fare)
        .attr('width', 20);
      g.append('text')
        .attr('fill', '#eee')
        .attr('text-anchor', 'middle')
        .attr('dy', '.32em')
        .attr('x', 10)
        .attr('y', 160)
        .text(d => d.class);
    }

    {
      const svg = getSvg('#wdaf-chart2');
      const g = svg.selectAll("g").data(classData).enter().append("g")
        .attr('transform', (d, i) => `translate(${i * 24}, 0)`)
        .attr('fill', (d, i) => i === 6 ? "green" : "gray")
        .attr('fill-opacity', (d, i) => i > 5 ? 1 : .4)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('font-size', '15px');
      g.append('rect')
        .attr('y', d => 170 - d.fare)
        .attr('height', d => d.fare)
        .attr('width', 20);
      g.append('text')
        .attr('fill', '#eee')
        .attr('text-anchor', 'middle')
        .attr('dy', '.32em')
        .attr('x', 10)
        .attr('y', 160)
        .text(d => d.class);
    }

    {
      const svg = getSvg('#wdaf-chart3');
      const g = svg.selectAll("g").data(classData).enter().append("g")
        .attr('transform', (d, i) => `translate(${i * 24}, 0)`)
        .attr('fill', (d, i) => i === 7 ? "crimson" : i === 6 ? "green" : "gray")
        .attr('fill-opacity', (d, i) => i > 6 ? 1 : .4)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('font-size', '15px');
      g.append('rect')
        .attr('y', d => 170 - d.fare)
        .attr('height', d => d.fare)
        .attr('width', 20);
      g.append('text')
        .attr('fill', '#eee')
        .attr('text-anchor', 'middle')
        .attr('dy', '.32em')
        .attr('x', 10)
        .attr('y', 160)
        .text(d => d.class);
    }
  }

  renderElements();

  let debounceTimer = null;
  window.addEventListener('resize', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderElements();
    }, 50);
  });
});

