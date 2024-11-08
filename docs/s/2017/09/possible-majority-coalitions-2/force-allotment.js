/* globals d3 elections */

function factTable (depth = 2) {
  const table = {};
  const fact = function (p, c) {
    let t = table;
    for (let i = 0; i < depth; i++) {
      const k = arguments[i];
      if (!t[k]) { t[k] = {}; }
      t = t[k];
    }
    if (t.value == null) {
      t.value = 0;
    }
    return t;
  };
  fact.values = table;
  return fact;
}

const _kjorskra = { NA: 29618, NV: 21516, RN: 46109, RS: 45607, SU: 36154, SV: 69498 };
function allotment (fylgi, kjorskra = _kjorskra, bias = {}) {
  // fylgi = { B: 0.1773, D: 0.3368, F: 0.07382, … }
  // bias = { B: { NV: 0.04, NA: 0.05 … } … }

  const constituencies = Object.keys(kjorskra);
  const parties = Object.keys(fylgi);
  const num_constituencies = constituencies.length;
  const num_parties = parties.length;
  const total_voters = d3.sum(constituencies, c => kjorskra[c]);

  // ensure that the bias table contains all parties:
  parties.forEach(p => {
    if (!bias[p]) {
      // apply an even distribution
      bias[p] = constituencies.reduce((a, c) => {
        a[c] = 1 / num_constituencies;
        return a;
      }, {});
    }
  });

  // a naïve "store" to function as a 2 dim array
  const fact = factTable();
  const sumC = (c) => d3.sum(parties, p => fact(p, c).value);
  const biasPC = () => constituencies.reduce((s, c) => s + Math.abs(kjorskra[c] - sumC(c)), 0);

  // perform initial allotment
  parties.forEach(p => {
    constituencies.forEach(c => {
      fact(p, c).value = total_voters * fylgi[p] * bias[p][c];
    });
  });

  const step = () => {
    // find the constituency with the most
    // difference between voters and votes
    let curr_c = null;
    let curr_v = 0;
    constituencies.forEach(c => {
      const v = Math.abs(kjorskra[c] - sumC(c));
      if (v > curr_v) {
        curr_c = c;
        curr_v = v;
      }
    });
    // the difference is divided evenly between
    // all parties in all other constituencies
    const votes = sumC(curr_c);
    constituencies.forEach(c => {
      const m = votes - kjorskra[curr_c];
      if (c === curr_c) {
        // remove votes from all parties in this constituency
        const v = m / num_parties;
        parties.forEach(p => { fact(p, c).value -= (v * fylgi[p]); });
      }
      else {
        // add votes to all parties in this constituency
        const v = (m / (num_constituencies - 1)) / num_parties;
        parties.forEach(p => { fact(p, c).value += (v * fylgi[p]); });
      }
    });
  };

  if (true) {
    console.time('compute');
    let pre;
    let post;
    let nstep = 0;
    do {
      pre = biasPC();
      step();
      nstep++;
      post = biasPC();
    }
    while ((pre - post) > 2);
    console.timeEnd('compute');
    console.log(`${nstep} steps`);
  }

  const ret = [];
  parties.forEach(p => {
    constituencies.forEach(c => {
      ret.push({
        party: p,
        constituency: c,
        votes: Math.round(fact(p, c).value)
      });
    });
  });
  return ret;
}
