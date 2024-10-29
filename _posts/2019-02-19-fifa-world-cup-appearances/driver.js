/* globals d3 */
const svg = d3.select('#fifa svg');
const margin = { top: 10, right: 0, bottom: 0, left: 0 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
const plot = g.append('g').attr('transform', `translate(${margin.left},${margin.top + 100})`);
const table = g.append('g').attr('transform', `translate(${margin.left},${margin.top + 100})`);

g.append('text')
  .attr('class', 'hint')
  .text('Hover the mouse cursor on a country code to see the history of the country\'s World Cup participation. Click to compare two countries.')
  .attr('y', height - 5);

const parseRow = row => {
  row.host = row.host.split(' ');
  row.tags = row.tags.split(' ');
  row.year = +row.year;
  row.place = +row.place;
  return row;
};

function updatePanels (team1, team2) {
  const teams = g.selectAll('.team')
      .data([ team1, team2 ], d => d ? d.team : '--');

  teams.exit().remove();

  const teamsEnter = teams.enter()
    .append('g')
      .attr('class', 'team')
      .attr('transform', (d, i) => `translate(${i * width / 2},0)`);

  teamsEnter.append('image')
      .attr('x', 1)
      .attr('height', 50)
      .attr('width', 76);

  teams.merge(teamsEnter)
      .transition()
        .attr('transform', (d, i) => `translate(${i * width / 2},0)`)
    .selectAll('image')
      .attr('href', d => {
        return d ? `https://upload.wikimedia.org/wikipedia/commons${d.flag}` : '';
      });

  const textLines = teamsEnter.merge(teams)
      .selectAll('text')
      .data(d => {
        if (d) {
          return [
            { text: d.name, size: 24, y: 0 },
            { text: `${d.year} – ${d._tied ? 'Joint ' : ''}${d.place}. place`, size: 18, y: 28 }
          ].concat(
            d.note
              ? d.note.split('\n').map((t, i) => ({ text: t, y: 52 + i * 15 }))
              : []
          );
        }
        return [];
      });

  textLines.exit().remove();

  textLines.enter()
    .append('text')
      .attr('font-size', d => d.size)
      .attr('dy', '.8em')
      .attr('y', d => d.y)
      .attr('x', 85)
    .merge(textLines)
      .text(d => d.text);
}

const teamsUrl = d3.select('#teams_json').attr('src');
const fifaUrl = d3.select('#fifa_csv').attr('src');
d3.json(teamsUrl, (err, teamList) => {
  if (err) { throw err; }
  d3.csv(fifaUrl, parseRow, (err, allResults) => {
    if (err) { throw err; }

    // console.log(allResults);
    allResults.forEach(d => {
      Object.assign(d, teamList.find(s => d.team === s.id));
      // turn all "formerly" props into arrays to simplify things later on
      if (!Array.isArray(d.formerly)) {
        d.formerly = [ d.formerly ].filter(Boolean);
      }
    });

    // order entries but shuffle tied teams
    const ties = d3.nest()
        .key(d => [ d.year, d.place ].join('/'))
        .entries(allResults)
        .filter(d => d.values.length > 1);
    ties.forEach(g => g.values.forEach(d => { d._tied = true; }));

    const byYear = d3.nest()
        .key(d => d.year)
        .entries(d3.shuffle(allResults));
    byYear.forEach(d => {
      d.values = d.values.sort((a, b) => a.place - b.place);
      d.values.forEach((d, i) => { d.rowIndex = i; });
    });

    const maxPlaces = d3.max(byYear, d => d.values.length);
    const places = d3.range(maxPlaces);
    const years = Array.from(new Set(allResults.map(d => d.year))).sort(d3.ascending);

    const x = d3.scaleBand()
        .domain(years)
        .range([ 0, width ]);

    const tableHeight = 426;
    const cellHeight = tableHeight / maxPlaces;
    const cellWidth = width / years.length;

    const y = d3.scaleBand()
        .domain(places)
        .range([ 18, 18 + tableHeight ]);

    const xBand = x.bandwidth() / 2;

    const last_year = d3.max(years);

    // current champion starts selected
    let selected_item = allResults.find(d => d.year === last_year && d.place === 1);
    let current_item = null;

    const path = d3.line()
        .curve(d3.curveCardinal.tension(0.5))
        .y(d => y(d.rowIndex))
        .x(d => x(d.year) + xBand);

    const current_line = plot.append('g').attr('stroke', 'rgba(150,40,0,0.3)');
    const selected_line = plot.append('g').attr('stroke', 'rgba(0,50,150,0.3)');

    const xAx = table.append('g')
        .attr('class', 'axis x');
    xAx.selectAll('text')
        .data(years).enter()
      .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', d => x(d) + xBand)
        .text(String);

    table.selectAll('.tie')
        .data(ties).enter()
      .append('rect')
        .attr('class', 'tie')
        .attr('rx', 3)
        .attr('x', d => x(d.values[0].year) + cellWidth * 0.05)
        .attr('y', d => y(d3.min(d.values, d => d.rowIndex)) - cellHeight / 2 - 1)
        .attr('width', cellWidth * 0.9)
        .attr('height', d => cellHeight * d.values.length);

    function update () {
      updateLine(current_line, current_item);
      updateLine(selected_line, selected_item);
      updateTable(current_item, selected_item);
      updatePanels(current_item, selected_item);
    }

    let leaveTimer;

    const column = table.selectAll('.cell')
        .data(allResults).enter()
      .append('g')
        .attr('class', 'cell')
        .attr('transform', d => `translate(${x(d.year) + xBand},${y(d.rowIndex)})`)
        .on('mouseenter', d => {
          clearTimeout(leaveTimer);
          if (selected_item && d.team === selected_item.team) {
            current_item = null;
            update();
          }
          else {
            current_item = d;
            update();
          }
        })
        .on('mouseleave', () => {
          clearTimeout(leaveTimer);
          leaveTimer = setTimeout(() => {
            current_item = null;
            update();
          }, 50);
        })
        .on('click', d => {
          if (current_item) {
            selected_item = current_item;
            current_item = null;
          }
          update();
        });

    column.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(d => d.team);

    function updateTable (team1, team2) {
      const tags = new Set((team1 ? team1.tags : []).concat(team2 ? team2.tags : []));
      table.selectAll('.cell').attr('class', d => `cell ${tags.has(d.team) ? 'active' : ''}`);
    }

    function updateLine (line, team) {
      line.html(null);
      if (!team) { return; }
      const tags = new Set(team.tags);

      const relevant = allResults
        .filter(d => tags.has(d.team))
        .sort((a, b) => d3.ascending(a.year, b.year) || d3.ascending(a.place, b.place));

      const lines = [];

      function link (prev, next) {
        if (!prev || !next) { return; }
        // can connect to a prior line?
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line[line.length - 1] === prev) {
            line.push(next);
            return;
          }
        }
        // start a new one
        lines.push([ prev, next ]);
      }

      years.forEach(year => {
        // this year's teams
        const dt = relevant.filter(d => d.year === year);
        if (!dt.length) { return; } // skip non-present years
        dt.forEach(item => {
          const teamId = item.team;
          const former = new Set([ item.team ].concat(item.formerly));
          // find what passed items we can link to
          const prior = relevant.reduce((a, c) => {
            if (c.year < year && former.has(c.team) && (!a[c.team] || a[c.team].year < c.year)) {
              a[c.team] = c;
            }
            return a;
          }, {});
          // if we have a more recent occurence of "former" than latest of team, preclude linking to team again
          if (teamId in prior) {
            for (const key in prior) {
              if (key !== teamId && prior[key].year >= prior[teamId].year) {
                delete prior[teamId];
                break;
              }
            }
          }
          const opts = Object.keys(prior);
          // can link to a prior occurence of team
          if (teamId in prior) {
            link(prior[teamId], item);
          }
          else if (opts.length) {
            opts.forEach(key => link(prior[key], item));
          }
        });
      });

      line.selectAll('.track')
          .data(lines).enter()
        .append('path')
          .attr('class', 'track')
          .attr('d', path);
    }

    update();

  });
});
