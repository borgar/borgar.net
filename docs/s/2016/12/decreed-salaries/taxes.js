function percent ( n ) { return n / 100; }

function Dt ( y, m, d ) {
  return new Date(Date.UTC(y, m, d));
}

var tax_history = [
  { timebase: Dt( 2006, 0, 1 )
  , steps: [ [ Infinity, 36.72 ] ]
  , discount: 29029
  },
  { timebase: Dt( 2007, 0, 1 )
  , steps: [ [ Infinity, 35.72 ] ]
  , discount: 32150
  },
  { timebase: Dt( 2008, 0, 1 )
  , steps: [ [ Infinity, 35.72 ] ]
  , discount: 34034
  },
  { timebase: Dt( 2009, 0, 1 )
  , steps: [ [ Infinity, 37.2 ] ]
  , discount: 42205
  },
  { timebase: Dt( 2010, 0, 1 )
  , steps: [
      [ 200000,   37.22 ],
      [ 650000,   40.12 ],
      [ Infinity, 46.12 ]]
  , discount: 44205
  },
  { timebase: Dt( 2011, 0, 1 )
  , steps: [
      [ 209400,   37.31 ],
      [ 680550,   40.21 ],
      [ Infinity, 46.21 ]]
  , discount: 44205
  },
  { timebase: Dt( 2012, 0, 1 )
  , steps: [
      [ 230000,   37.34 ],
      [ 704366,   40.24 ],
      [ Infinity, 46.24 ]]
  , discount: 46532
  },
  { timebase: Dt( 2013, 0, 1 )
  , steps: [
      [ 241475,   37.32 ],
      [ 739509,   40.22 ],
      [ Infinity, 46.22 ]]
  , discount: 48485
  },
  { timebase: Dt( 2014, 0, 1 )
  , steps: [
      [ 290000,   37.30 ],
      [ 784619,   39.74 ],
      [ Infinity, 46.24 ]]
  , discount: 50498
  },
  { timebase: Dt( 2015, 0, 1 )
  , steps: [
      [ 309140,   37.30 ],
      [ 527264,   39.74 ],
      [ Infinity, 46.24 ]]
  , discount: 50902
  },
  { timebase: Dt( 2016, 0, 1 )
  , steps: [
      [ 336035,   37.13 ],
      [ 836990,   38.35 ],
      [ Infinity, 46.25 ]]
  , discount: 51920
  }
];

function calc_taxes ( brutto, date, _debug ) {

  if ( !date ) { date = new Date(); }
  if ( typeof date === 'number' ) { date = Dt( date, 0, 1 ); }

  // tax_year
  var tax_year = date.getUTCFullYear();
  var tax_settings = tax_history.filter(function ( d ) {
    return d.timebase.getUTCFullYear() === tax_year;
  })[ 0 ];
  if ( !tax_settings ) {
    throw new Error( 'No tax-rules for year ' + tax_year );
  }

  // finna tekjustofn:
  var pension_amt = brutto * percent(4);
  var taxable_amt = brutto - pension_amt;
  _debug && console.info( 'tekjuskattsstofn', taxable_amt );

  var taxed = 0;
  var taxes_due = 0;

  var steps = tax_settings.steps;
  var tax_discount = tax_settings.discount;

  var row = {
    brutto: brutto
  , taxable: taxable_amt
  , taxes: 0
  , netto: 0
  , steps: 0
  , discount: tax_discount
  };

  row.steps = steps.map(function ( r, i ) {
    var step_high = r[0]
      , step_tax  = percent( r[1] )
      , step_amt  = 0
      , step_base = 0
      ;
    if ( taxed < taxable_amt ) {
      var remainder = taxable_amt - taxed;
      step_base = ( remainder > step_high )
              ? step_high
              : remainder
              ;
      step_amt = Math.round( step_base * step_tax ); // rounding?
      taxed += step_base;
      taxes_due += step_amt;
    }

    _debug && console.info( 'step', i+1, step_amt, 'from a tax base of', step_base );

    return [ step_base, step_amt, step_tax ];
  });

  row.year = tax_year;
  row.taxes = taxes_due - tax_discount;
  row.netto = taxable_amt - row.taxes;

  _debug && console.info( 'total taxes', taxes_due );
  _debug && console.info( 'discounted', -tax_discount );
  _debug && console.info( 'taxes due', taxes_due - tax_discount );

  return row;
}

function pay_taxes ( /* dynamic */ ) {
  var r = calc_taxes.apply( null, arguments );
  return Math.round( r.netto );
}
