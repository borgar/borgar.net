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

function loadJSON (url) {
  return new Promise((resolve, reject) => {
    d3.json(url, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

function loadCSV (url) {
  return new Promise((resolve, reject) => {
    d3.csv(url, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}
