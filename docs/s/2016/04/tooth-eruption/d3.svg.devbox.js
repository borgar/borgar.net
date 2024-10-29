d3.svg.devbox = function devbox () {

  var scale = d3.scale.linear(),
      height = 1,
      sym = d3.svg.symbol().type( 'square' ).size( 30 ),
      mean = function ( d ) { return d.mean; },
      deviation = function ( d ) { return d.deviation; },
      devs = [ -2, -1, 1, 2 ],
      tickfmt = function () { return ''; };

  var area = d3.svg.area()
      .x(function (d) { return scale( d.x ) })
      .y0(function (d) { return height * 0.5 - height * 0.5 * d.y })
      .y1(function (d) { return height * 0.5 + height * 0.5 * d.y })
      .interpolate( 'step' );

  function fn ( g ) {
    g.each(function() {
      var g = d3.select( this );

      // "candle"
      g.append( 'path' )
          .attr( 'class', 'box' )
          .attr( 'd', d => {
            var m = mean(d), s = deviation(d);
            return area([
              { x: m - s * 3, y: 0.0 },
              { x: m - s * 2, y: 0.05 },
              { x: m - s * 1, y: 0.2 },
              { x: m + s * 0, y: 0.55 },
              { x: m + s * 1, y: 0.2 },
              { x: m + s * 2, y: 0.05 },
              { x: m + s * 3, y: 0.0 },
            ]);
          });

      // average
      g.append( 'path' )
          .attr( 'd', sym )
          .attr( 'class', 'mean' )
          .attr( 'transform', function ( d ) {
            var pos = [ scale( mean( d ) ), height * 0.5 ];
            return "translate(" + pos + ") rotate(45)";
          });

      // deviations
      var devticks = g.append( 'g' ).selectAll( 'deviation' )
          .data(function ( d ) {
            var m = mean( d ), s = deviation( d );
            return devs.map(function ( d ) { return d * s + m; });
          })
          .enter();

      devticks.append( 'rect' )
          .attr( 'class', 'deviation' )
          .attr( 'x', scale )
          .attr( 'y', height * .375 )
          .attr( 'width', .5 )
          .attr( 'height', height * .25 );

      devticks.append( 'text' )
          .attr( 'x', scale )
          .attr( 'y', height )
          .attr( 'dy', '.32em' )
          .style( 'text-anchor', 'middle' )
          .text(function ( d, i ) {
            return tickfmt( devs[ i ] );
          });

    });
  };

  fn.scale = function ( _ ) {
    if ( !arguments.length ) return scale;
    scale = _;
    return fn;
  };

  fn.height = function ( _ ) {
    if ( !arguments.length ) return height;
    height = _;
    return fn;
  };

  fn.mean = function ( _ ) {
    if ( !arguments.length ) return mean;
    mean = _;
    return fn;
  };

  fn.deviation = function ( _ ) {
    if ( !arguments.length ) return deviation;
    deviation = _;
    return fn;
  };

  fn.smooth = function ( _ ) {
    if ( !arguments.length ) return area.interpolate() === 'basis';
    area.interpolate( !!_ ? 'basis' : 'step' );
    return fn;
  };

  fn.tickFormat = function ( _ ) {
    if ( !arguments.length ) return tickfmt;
    tickfmt = _;
    return fn;
  };

  return fn;
}