// (c) 2016 Borgar Þorsteinsson
// This code is licensed under MIT license (see https://opensource.org/licenses/MIT for details)
(function(){

  function _accessor (s) {
    return typeof s === 'function' ? s : d => d[s];
  }

  function crunch (data, min_needed_dist, get_x, get_y, get_j) {
    min_needed_dist = min_needed_dist || 0.5;

    // step 1: group the values
    const rollup_rows = Object.create(null);
    const rollup_cols = Object.create(null);
    let xs = [];
    const js = [];
    const values = [];

    for (let di=0, dl=data.length; di < dl; di++) {
      const item = data[di];
      const x = get_x(item);
      const j = get_j(item);

      item.y = get_y(item);

      rollup_rows[j] = rollup_rows[j] || {};
      rollup_rows[j][x] = item;

      rollup_cols[x] = rollup_cols[x] || [];
      rollup_cols[x].push(item);

      xs.push(x);
      js.push(j);
    }

    xs = d3.set(xs).values().sort(d3.ascending);
    const facts = d3.set(js).values().map(j => xs.map(x => rollup_rows[j][x]));

    // step 2: "fan out" label positions to remove overlaps
    for (let col_id in rollup_cols) {
      const column = rollup_cols[col_id].sort((a, b) => {
        const r = get_y(a) - get_y(b);
        if (r === 0) {
          if (get_j(a) > get_j(b)) {
            return -1;
          }
          if (get_j(a) < get_j(b)) {
            return 1;
          }
        }
        return r;
      });

      let improoving = true;
      let steps = 0;

      while (improoving) {
        let last_gap_size = null;
        let smallest_gap = null;
        let smallest_gap_size = -Infinity;

        // compute distances
        for (var i=0,l=column.length; i<l; i++) {
          let item = column[i];
          let prev = column[i - 1];
          let next = column[i + 1];
          // space above
          if (!prev) {
            item._top = Infinity;
          }
          else {
            item._top = item.y - prev.y;
            // remember it if it was important
            if (!smallest_gap || smallest_gap_size > item._top) {
              smallest_gap = [ item, prev ];
              smallest_gap_size = item._top;
            }
          }
          // space below
          if (!next) {
            item._bottom = Infinity;
          }
          else {
            item._bottom = next.y - item.y;
            // remember it if it was important
            if (!smallest_gap || smallest_gap_size > item._bottom) {
              smallest_gap = [ next, item ];
              smallest_gap_size = item._bottom;
            }
          }
        }
        // find the smallest gap
        if (
          smallest_gap_size >= min_needed_dist || // no overlaps present
          steps > 1000 // we're going nowhere fast
        ) {
          break;
        }
        steps++;

        // push items apart, aiming toward empty spaces
        const t = smallest_gap[0]._bottom + smallest_gap[1]._top;
        const a = isFinite(t) ? smallest_gap[0]._bottom / t : 1;
        const b = isFinite(t) ? smallest_gap[1]._top    / t : 1;
        const force = min_needed_dist / 4;

        smallest_gap[0].y += force * a;
        smallest_gap[1].y -= force * b;

        // stop doing this when labels stop overlapping
        improoving = smallest_gap_size >= (last_gap_size || 0);

        last_gap_size = smallest_gap_size;
      }
    }

    return facts;
  }


  d3.layout.slopegraph = function () {
    let get_x = _accessor('x');
    let get_y = _accessor('y');
    let get_j = _accessor(Number);
    let data = [];
    let cached;
    let min_needed_dist;

    const layout = function (d) {
      if (arguments.length) {
        cached = undefined;
        data = d;
        return layout;
      }
      return data;
    };

    layout.data = layout;

    layout.j = function (d) {
      if (arguments.length) {
        get_j = _accessor(d);
        return this;
      }
      return get_j;
    };

    layout.x = function (d) {
      if (arguments.length) {
        get_x = _accessor(d);
        return this;
      }
      return get_x;
    };

    layout.y = function (d) {
      if (arguments.length) {
        get_y = _accessor(d);
        return this;
      }
      return get_y;
    };

    layout.textHeight = function (h) {
      if (arguments.length) {
        min_needed_dist = h;
        cached = undefined;
        return this;
      }
      return min_needed_dist;
    };

    layout.left = function (d) {
      return [];
    };

    layout.right = function (d) {
      return [];
    };

    layout.pairs = function (d) {
      return cached || (cached = crunch(data, min_needed_dist, get_x, get_y, get_j));
    };

    return layout;

  };

})();
