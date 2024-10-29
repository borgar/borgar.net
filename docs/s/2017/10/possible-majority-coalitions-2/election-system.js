/* globals d3 */

function dhont (parties, total_seats) {
  const list = [];
  const partySeats = {};
  const quot = (d) => d.votes / (partySeats[d.party] + 1);
  parties.forEach(d => { partySeats[d.party] = 0; });
  for (let round = 0; round < total_seats; round++) {
    const top = parties.sort((a, b) => quot(b) - quot(a))[0];
    partySeats[top.party]++;
    list.push({
      party: top.party,
      constituency: top.constituency || '',
      seat: partySeats[top.party],
      q: quot(top)
    });
  }
  return list;
}


function getConstituencies (year) {
  const constituencies = {
    2003: { NV: [ 9, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 9, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] },
    2007: { NV: [ 8, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 10, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] },
    2009: { NV: [ 8, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 10, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] },
    2013: { NV: [ 7, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 11, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] },
    2016: { NV: [ 7, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 11, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] },
    2017: { NV: [ 7, 1 ], NA: [ 9, 1 ], SU: [ 9, 1 ], SV: [ 11, 2 ], RS: [ 9, 2 ], RN: [ 9, 2 ] }
  };
  return Object.keys(constituencies[year]).map(c => {
    return {
      id: c,
      fixed: constituencies[year][c][0],
      level: constituencies[year][c][1]
    };
  });
}


// eslint-disable-next-line
function elections (data, year = 2017, debug = false) {
  /* expects data as a list of objects in the format of:
    [ { party: 'D', votes: 1234, constituency: 'NE' },
      { party: 'G', votes: 2341, constituency: 'NE' },
      ...
  */
  const constituencies = getConstituencies(year);
  const seats_fixed = {};
  const seats_level = {};
  const seats_alotted = {};
  const seats_runup = {};
  const seats_by_party = {};
  const min_percent = 0.05;
  const total_votes = d3.sum(data, d => d.votes);

  const votes_by_area = data.reduce((c, d) => {
    c[d.constituency] = (c[d.constituency] || 0) + d.votes;
    return c;
  }, {});

  constituencies.forEach(d => {
    seats_fixed[d.id] = d.fixed;
    seats_level[d.id] = d.level;
    seats_alotted[d.id] = [];
    seats_runup[d.id] = [];
  });

  const d1 = d3.nest().key(d => d.constituency).entries(data);
  d1.forEach(d => {
    const constituency = d.key;
    d.sum_votes = d3.sum(d.values, d => d.votes);
    d.uniq_party = d3.set(d.values.map(d => d.party)).values();
    // FIXME: need a better system for excluding
    const votes = d.values.filter(d => d.party !== '_' && d.party !== '?');
    const res = dhont(votes, seats_fixed[constituency] + 200);
    seats_alotted[constituency] = res.slice(0, seats_fixed[constituency]);
    seats_runup[constituency] = res.slice(seats_fixed[constituency]);
  });

  const seats_table = [];
  d1.forEach(d => {
    const constituency = d.key;
    d.uniq_party.forEach(p => {
      const seats = seats_alotted[constituency].filter(f => f.party === p).length;
      const votes = d.values.filter(f => f.party === p)[0].votes;
      seats_by_party[p] = (seats_by_party[p] || 0) + seats;
      seats_table.push({
        constituency: constituency,
        party: p,
        seats: seats,
        votes: votes
      });
    });
  });

  // Ef flokkur hefur hlotið minna en 5% atkvæða kemur
  // hann ekki til greina við úthlutun jöfnunarsæta.
  const parties = d3.set(data.map(d => d.party)).values()
    .map(p => ({ party: p, votes: d3.sum(data, d => d.party === p ? d.votes : 0) }))
    .filter(p => (p.votes / total_votes) >= min_percent)
    // FIXME: need a better system for excluding parties
    .filter(d => d.party !== '_' && d.party !== '?');

  const valid_parties = d3.set(parties.map(d => d.party));

  // Fyrir aðra flokka er tekinn saman listi yfir svokallaðar landstölur flokksins.
  // Fyrsta talan á þeim lista er heildaratkvæðafjöldi flokksins á landsvísu deilt með
  // fjölda kjördæmissæta hans að viðbættum einum; önnur talan er atkvæðafjöldinn deilt
  // með kjördæmissætum að viðbættum tveimur, o.s.frv.
  const num_level_seats = d3.sum(constituencies.map(d => seats_level[d.id]));

  let level_table = [];
  parties.forEach(p => {
    for (let i = 1; i < num_level_seats + 1; i++) {
      const level = p.votes / (seats_by_party[p.party] + i);
      level_table.push({ party: p.party, level: level });
    }
  });
  level_table = level_table
    .sort((a, b) => b.level - a.level)
    .slice(0, num_level_seats);

  // Taka skal saman skrá um þau tvö sæti hvers framboðslista sem næst
  // komust því að fá úthlutun í kjördæmi skv. 107. gr. Við hvert þessara
  // sæta skal skrá hlutfall útkomutölu sætisins skv. 1. tölul. 107. gr.
  // af öllum gildum atkvæðum í kjördæminu. 
  function ratioTable (baselist, numrows) {
    const list = [];
    d3.range(numrows).forEach(i => {
      baselist.forEach(d => {
        const q = d.votes / (d.seats + 1 + i);
        list.push({
          party: d.party,
          ratio: (q / votes_by_area[d.constituency]) * 100,
          constituency: d.constituency,
          votes: d.votes,
          seats: d.seats,
          quot: q,
          index: i
        });
      });
    });
    return list;
  }

  let totelist = constituencies.reduce((list, c) => {
    const r = seats_table.filter(d => d.constituency === c.id);
    const tab = ratioTable(r, c.level);
    return list.concat(tab);
  }, []);
  totelist = totelist
    .filter(d => valid_parties.has(d.party))
    .sort((a, b) => b.ratio - a.ratio);

  const have_seats = constituencies.reduce((t, c) => { t[c.id] = c.level; return t; }, {});

  const level_seats = level_table.map((lev, i) => {
    const p = totelist.filter(d => d.party === lev.party && have_seats[d.constituency] && !d.used);
    const seat = p[0];

    // mark this leveling seat used
    seat.used = true;
    have_seats[seat.constituency]--;

    seats_by_party[seat.party] = (seats_by_party[seat.party] || 0) + 1;
    return {
      seat: i + 1,
      level: lev.level,
      ratio: seat.ratio,
      party: seat.party,
      constituency: seat.constituency
    };
  });

  // prepare a final list of allotments
  let seats_final = [];
  const sbp = {};
  seats_table.forEach(d => {
    for (let i = 0; i < d.seats; i++) {
      sbp[d.party] = (sbp[d.party] || 0) + 1;
      seats_final.push({
        constituency: d.constituency,
        party: d.party,
        seat: sbp[d.party],
        fixed: true
      });
    }
  });
  seats_final = seats_final.concat(level_seats.map(d => {
    sbp[d.party] = (sbp[d.party] || 0) + 1;
    return {
      constituency: d.constituency,
      party: d.party,
      seat: sbp[d.party],
      level: true
    };
  }));

  return {
    seats: seats_final,
    seats_by_party: seats_by_party,
    seats_fixed: seats_table.filter(d => d.seats),
    seats_level: level_seats
  };
}
