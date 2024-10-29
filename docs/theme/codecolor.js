(function(undefined){

  var syntax = {

    js : {
      positive : /\b(var|jQuery|\.prototype|\.on(click|load)|alert)\b/,
      negative : /((<|&lt;)script|type="text\/javascript")/i,
      struct : {
        reserved  : /\b(break|continue|do|for|new|void|case|default|else|function|in|return|while|if|switch|var|with|this|throw|try|finally|debugger)\b/,
        string    : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        constructor : /\b[A-Z][a-z0-9_$]+(?=[\[\(\.])/,
        common    : /\b(remove|children|childNodes|parentNode|prototype|document|body|getElementsByTagName|getElementById|value|name|id|className|data|html|text|append(Child)?|length)\b/,
        value     : /\b(false|true|null)\b/,
        number    : /\b[0-9]+\b/,
        comment   : /(\/\*.*?\*\/|\/\/[^\n]*)/
      }
    },

    bash : {
      positive : /(\#\!\/bin\/bash)/,
      struct : {
        reserved  : /\b(\[\[|\]\]|case|do|done|elif|else|esac|fi|for|function|if|in|select|then|time|until|while|\{|\})\b/,
        string    : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        number    : /\b[0-9]+\b/,
        value     : /\b(false|true|null)\b/i,
        comment  : /#[^\n]*/
      }
    },

    vb : {
      positive : /\b(If|Then|Sub|ByVal|ByRef)\b/,
      struct : {
        reserved  : /\b(If|Else|Then|Set|Do|While|Not|And|Or|Lib|Public|Private|Declare|Function|Sub|Long|Integer|As|Single|By(Val|Ref)|End)\b/,
        common    : /\b(right\$?|left\$?|mid\$?|len|val)\b/i,
        string    : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        number    : /\b[0-9]+\b/,
        value     : /\b(false|true|null)\b/i,
        comment  : /#[^\n]*/
      }
    },

    php : {
      positive : /(\$[a-z0-9_]+([\[,.()]|\-\>[a-z0-9_]+))/,
      struct : {
        reserved  : /\b(and|x?or|array|as|break|case|exception|class|const|continue|declare|default|die|do|echo|else(if)?|empty|end(if|switch|declare|while|for(each)?)?|eval|exit|extends|for(each)?|(old_|c)?function|global|if|include(_once)?|isset|list|new|print|require(_once)?|return|static|switch|unset|use|var|while|final|php_user_filter|interface|implements|instanceof|public|private|protected|abstract|clone|try|catch|throw|this|final|namespace|goto)\b/,
        string    : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        common    : /\$[a-z0-9_]+/i,
        number    : /\b[0-9]+\b/,
        value     : /\b(false|true|null)\b/i,
        comment   : /(\/\*.*?\*\/|(\/\/|#)[^\n]*)/
      }
    },

    sql : {
      positive : /\b(INSERT INTO|SELECT|ALTER TABLE|VARCHAR)\b/,
      struct : {
        reserved  : /\b(ALTER|TABLE|MODIFY|COLUMN|LIMIT|ASC|DESC|VARCHAR|INSERT|(INNER|LEFT|RIGHT) JOIN|GROUP BY|UNION|ORDER BY|AND|AS|OR|SELECT|SET|DELETE|INTO|UPDATE|VALUES|WHERE|FROM|MERGE|CREATE|NOT|PRIMARY|KEY|GRANT|ON|TO)\b/i,
        string    : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        property  : /(`.*?`)/,
        common    : /(month|day|year|sum|count)(?=\()/,
        number    : /\b[0-9]+\b/,
        value     : /\b(false|true|null)\b/
      }
    },
    
    python : {
      positive : /(import)/,
      struct : {
        string   : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        reserved : /\b(and|del|from|not|while|as|elif|global|or|with|assert|else|if|pass|yield|break|except|import|print|class|exec|in|raise|continue|finally|is|return|def|for|lambda|try)\b/,
        common   : /\b(len|open|read|sub|replace|findall|append|split|strip|lower|upper|insert|reverse|join)\b/,
        value    : /\b(false|true|null|NaN|Infinity)\b/,
        number    : /\b[0-9]+\b/,
        comment  : /#[^\n]*/
      }
    },

    css : {
      positive : /\b[a-z-_~]+\s*:\s*[^\n;]+;/i,
      negative : /((<|&lt;)style|type="text\/css")/i,
      struct : {
        string   : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        property : /([a-zA-Z\-_~]+)(?=\s*:)/,
        number   : /(#[0-9abcdef]{6}|#[0-9abcdef]{3}|[0-9.]+(em|px|pt|%))/i,
        comment  : /\/\*.*?\*\//,
        value    : /\b([a-z]+)(?=;)/i
      }
    },
    
    html : {
      positive : /(<|&lt;)!?[a-z1-6]+(\s*[a-z]+=(".*?"|'.*?'|[a-z0-9]+))*\s*\/?(&gt;|>)/i,  // tag
//      negative : /(var|prototype|\.[a-z0-9_]+\()/  // js indicates embedded html 
      struct : {
        common   : /\b(DOCTYPE|PUBLIC)\b/i,
        reserved : /((&lt;\/?|<\/?)(address|applet|area|a|base|basefont|big|blockquote|body|br|b|caption|center|cite|code|dd|dfn|dir|div|dl|dt|em|font|form|h1|h2|h3|h4|h5|h6|head|hr|html|img|input|isindex|i|kbd|link|li|map|menu|meta|ol|option|param|pre|p|samp|script|select|small|strike|strong|style|sub|sup|table|td|textarea|th|title|tr|tt|ul|u|var)\b|>|&gt;)/i,
        string   : /('(\\'|[^'\n])*?'|"(\\"|[^"\n])*?")/,
        property : /\b[a-z]+(?==)/i,
        comment  : /(<|&lt;)!--[\s\S]*?--(&gt;|>)/,
        constructor : /(<|&lt;)![\s\S]*?(&gt;|>)/,
      }
    }
  }

  // 
  // tiny tokenizer
  //
  // -- takes a subject string and an object of regular expressions for parsing
  // -- returns an array of token objects
  function tokenize ( text, parsers ) {
    var m, r, tok, type, l;
    var tokens = [];
    while ( text ) {
      type = '';
      m = text.length;
      for (var key in parsers) {
        r = parsers[key].exec( text );
        if ( r && (r.index < m )) {
          tok = r[0];
          type = key;
          m = r.index;
        }
      }
      if ( m ) {
        tokens.push({
          token : text.substr( 0, m ),
          type  : ''
        });
      }
      if ( type ) {
        // add to sequence
        tokens.push({ 
          token : tok,
          type  : type
        }); 
      }
      text = text.substr( m + (tok?tok.length:0) );
    }
    return tokens;
  }
  

  function highLight ( code, type, tag ) {
    var bits = tokenize( code, syntax[type].struct );
    var output = [], lastType = '';
    tag = tag || 'span';
    for (var i=0,l=bits.length; i<l; i++) {
      var itm = bits[i];
      if ( itm.type !== '' ) {
        // save some tags by joining same types
        if ( itm.type === lastType ) {
          var tok = output.pop();
          output.push( tok.substr( 0, tok.length -(tag.length + 3) ) );
          output.push( itm.token + '</' + tag + '>' );
        }
        else {
          output.push( '<'+tag+' class="' + itm.type + '">' + 
                itm.token + '</' + tag + '>' );
        }
      }
      else {
        output.push( itm.token );
      }
      lastType = itm.type;
    }
    return output.join('');
  }


  window.codeColor = function () {
    var codes = document.getElementsByTagName('code');
    for (var c=codes.length;c--;) {
      // don't re-process
      if ( codes[c].codecolor ) { continue; }
      // the code
      var code = ( codes[c].textContent || codes[c].innerText )
                    .replace( /^\s+|\s+$/g, '' )
                    .replace( /</g, '&lt;' );
      for ( var type in syntax ) {
        var stx = syntax[type];
        if ( !stx.classRE ) {
          stx.classRE = new RegExp('(?:\s|^)'+type+'(?:\s|$)');
        }
        if ( stx.classRE.test( codes[c].className ) ) {
          // preselected type
          codes[c].innerHTML = highLight( code, type );
          codes[c].codecolor = type; // flag as done
          break;
        }
        else if ( stx.positive.test( code ) ) {
          // detected type
          if (stx.negative && stx.negative.test( code )) { continue; }
          ;;;console.log( code, type );
          codes[c].innerHTML = highLight( code, type );
          codes[c].codecolor = type; // flag as done
          var cls = codes[c].className;
          codes[c].className = cls 
              ? cls.split(/\s+/).concat([type]).join(' ')
              : type;
          break;
        }
      }
    }
  };

  // autorun the colorizer ...
  // now ...
  codeColor();
  // on domready ...
  function ready ( fn ) { /in/.test( document.readyState ) ? setTimeout(function(){ ready( fn ) }, 9 ) : fn(); }
  ready( codeColor );
  // and onload
  window.addEventListener && window.addEventListener( 'load', codeColor, false );

})();