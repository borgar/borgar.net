d3.comb = function ( arr ) {
  function _cmb ( active, rest, comb ) {
    if ( active.length && !rest.length ) {
      comb.push( active );
    }
    else if ( active.length || rest.length ) {
      var _rest = rest.slice( 1 );
      _cmb( active.concat([ rest[0] ]), _rest, comb );
      _cmb( active, _rest, comb );
    }
    return comb;
  }
  return _cmb( [], arr, [] );
};


function dhont ( parties, total_seats ) {
  var quot = d => d.percent / ( d.seats + 1 );
  parties.forEach(d => { d.seats = 0; });
  for (var round=0; round<total_seats; round++) {
    var top = parties.sort((a, b) => quot(b) - quot(a) )[0];
    top.seats++;
  }
}

function obj ( k, acc ) {
  var r = {};
  k.forEach(d => r[d] = acc ? acc.call(k,d) : true);
  return r;
}
