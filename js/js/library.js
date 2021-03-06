//----------
// scrollTo
ACMS.Library.scrollTo   = function ( x, y, m, k, offset, callback )
{
    y = y + offset;
    callback = callback || function(){};

    var left = Math.floor(document.body.scrollLeft || document.documentElement.scrollLeft);
    var top  = Math.floor(document.body.scrollTop  || document.documentElement.scrollTop);
    var remainX = x - left;
    var remainY = y - top;
    var calc = function ()
    {
        var h = parseInt(x - remainX);
        var v = parseInt(y - remainY);
        remainX = remainX*(1-k);
        remainY = remainY*(1-k);
        if(parseInt(remainX) != 0 || parseInt(remainY) != 0){
            window.scrollTo(h, v);
            setTimeout(calc,m);
        }else{
            window.scrollTo(x,y);
            callback();
        }
    };
    setTimeout(calc, m);
};

//-------------
// scrollToElm
ACMS.Library.scrollToElm    = function ( elm, setting )
{
    if ( elm && $(elm).size() ) {
        var xy  = $(elm).offset();
    } else {
        var xy  = { left : 0, top : 0 };
    }

    setting = $.extend({
        x   : xy['left'],
        y   : xy['top'],
        m   : ACMS.Config.scrollToI,
        k   : ACMS.Config.scrollToV,
        offset      : 0,
        callback    : null
    }, setting);

    ACMS.Library.scrollTo(setting['x'], setting['y'], setting['m'], setting['k'], setting['offset'], setting['callback']);
};

//------------
// dl2object
ACMS.Library.dl2object  = function ( dl )
{
    var ret = {};
    $('dt', dl).each(function ( )
    {
        var $dt = $(this);
        var $dd = $dt.next();
        if( $dt.text() == '' ) {
            return false;
        }
        if( $dd[0].tagName.toUpperCase() != 'DD' ) {
            return false;
        }
        ret[ $.trim($dt.text().replace('&', '%26')) ] = $.trim($dd.text().replace('&', '%26'));
    });

    return ret;
};

//-------------
// switchStyle
ACMS.Library.switchStyle    = function ( styleName, $link )
{
    $link.each(function ( )
    {
        this.disabled   = true;
        if ( styleName == this.title ) {
            this.disabled = false;
            $.cookie('styleName', styleName, {'path':'/'});
        }
    });
};

//-----------------
// googleLoadProxy
ACMS.Library.googleLoadProcessing = false;
ACMS.Library.googleLoadCompleted  = {};
ACMS.Library.googleLoadProxy      = function (api, ver, params)
{
    var _load = function() {
        var callbackOrg = params.callback;

        params.callback = function() {
            ACMS.Library.googleLoadProcessing       = false;
            ACMS.Library.googleLoadCompleted[ident] = true;
            callbackOrg();
        };
        params.other_params = 'key='+ACMS.Config.googleApiKey;
        google.load(api, ver, params);
    };
    var ident = api+ver,
        timer;

    // apiが既に読み込まれていれば即時実行
    if ( !!ACMS.Library.googleLoadCompleted[ident] && $.isFunction(params.callback) ) {
        return params.callback();
    }

    // 先行してgoogle loadが実行中であれば、完了を待ってから再度自身を呼び出す
    if ( ACMS.Library.googleLoadProcessing ) {
        timer = setInterval(function() {
            if (!ACMS.Library.googleLoadProcessing) {
                clearInterval(timer);
                ACMS.Library.googleLoadProxy(api, ver, params);
            }
        }, 50);
    } else {
         ACMS.Library.googleLoadProcessing = true;
        _load();
    }
};

//-----------------
// yahooLoadProxy
ACMS.Library.yahooLoadProcessing = false;
ACMS.Library.yahooLoadCompleted  = false;
ACMS.Library.yahooLoadProxy      = function ( params )
{
    var _load = function() {
        var callbackOrg = params.callback;
        params.callback = function() {
            ACMS.Library.yahooLoadProcessing    = false;
            ACMS.Library.yahooLoadCompleted     = true;
            callbackOrg();
        };
        if ( ACMS.Config.yahooApiKey ) {
            $.ajax({
                'url'           : ACMS.Config.yahoo_api_url,
                'dataType'      : 'script',
                'complete'      : function ( )
                {
                    params.callback();
                }
            });
        } else {
            ACMS.Library.yahooLoadProcessing    = false;
            ACMS.Library.yahooLoadCompleted     = true;
            params.error();
        }
    },
    timer;

    // apiが既に読み込まれていれば即時実行
    if ( !!ACMS.Library.yahooLoadCompleted && $.isFunction(params.callback) ) {
        return params.callback();
    }

    // 先行してyahoo loadが実行中であれば、完了を待ってから再度自身を呼び出す
    if ( ACMS.Library.yahooLoadProcessing ) {
        timer = setInterval(function() {
            if (!ACMS.Library.yahooLoadProcessing) {
                clearInterval(timer);
                ACMS.Library.yahooLoadProxy(params);
            }
        }, 50);
    } else {
        ACMS.Library.yahooLoadProcessing = true;
        _load();
    }
};

//-------------
// getPostData
ACMS.Library.getPostData    = function ( context )
{
    var data    = {};
    var cnt     = {};

    $(':input:not(disabled):not(:radio:not(:checked)):not(:checkbox:not(:checked))', context).each( function ( )
    {
        var name    = this.name.replace(/\[\]$/, '');
        var val     = $(this).val();
        var isAry   = (name != this.name);
        var vali;

        if ( isAry && 'undefined' == typeof(cnt[name]) ) {
            cnt[name]   = 0;
        }
        if ( 'string' == typeof(val) ) {
            if ( $(this).is(ACMS.Config.postIncludeEvalValueMark) ) {
                val = eval(val).toString();
            }
            if ( isAry ) {
                data[name + '[' + cnt[name]++ + ']']   = val;
            } else {
                data[name]    = val;
            }
        } else {
            for ( var i in val ) {
                vali = $(this).is(ACMS.Config.postIncludeEvalValueMark) ? eval(val[i]) : val[i];
                data[name + '[' + cnt[name]++ + ']'] = vali;
            }
        }
    });

    return data;
};

//--------------------
// getParameterByName
ACMS.Library.getParameterByName = function ( name, query )
{
    var search = query || location.search;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

//----------------------
// google code prettify
ACMS.Library.googleCodePrettifyPost = function ( )
{
    $('pre').addClass(ACMS.Config.googleCodePrettifyClass);
    if ( !$('pre').hasClass('prettyprinted') && !$('pre').hasClass('acms-admin-customfield-maker') ) {
        if ( typeof prettyPrint === 'function' ) {
            prettyPrint();
        } else {
            ACMS.Library.googleCodePrettify();
        }
    }
};

//----------
// acmsLink
ACMS.Library.acmsLink   = function ( Uri, inherit )
{
    var Config  = ACMS.Config,
        session_name = Config.session || 'sid';

    //-----------------
    // inherit context
    if ( inherit ) {
        if ( empty(Uri.cid) ) { Uri.cid = Config.cid; }
        if ( empty(Uri.eid) ) { Uri.eid = Config.eid; }
        if ( empty(Uri.admin) ) { Uri.admin = Config.admin; }
        if ( empty(Uri.keyword) ) { Uri.keyword = Config.keyword; }
    }

    var url = Config.scriptRoot;
    url += (Uri.bid ? ('bid/' + Uri.bid) : ('bid/' + Config.bid));
    if ( Uri[session_name] ) {
        url += ('/'+session_name+'/' + Uri[session_name]);
    }
    if ( Uri.cid ) { url += ('/cid/' + Uri.cid); }
    if ( Uri.eid ) { url += ('/eid/' + Uri.eid); }
    if ( Uri.utid ) { url += ('/utid/' + Uri.utid); }
    if ( Uri.admin ) { url += ('/admin/' + Uri.admin) }
    if ( Uri.keyword ) { url += ('/keyword/' + Uri.keyword) }
    if ( Uri.page ) { url += ('/page/' + Uri.page); }
    if ( Uri.tpl ) { url += ('/tpl/' + Uri.tpl); }
    url += '/';
    if ( Uri.Query ) {
        var query   = [];
        $.each(Uri.Query, function ( key )
        {
            var pair    = '';
            pair        += key;
            if ( true !== this ) { pair += ('=' + this); }
            query.push(pair);
        });
        if ( query.length ) {
            url += ('?' + query.join('&'));
        }
    }

    return url;

    function empty ( value )
    {
        return ('undefined' == typeof(value) || 'null' == typeof(value));
    }
};

ACMS.Library.exFeature = function ( )
{
    return true === ACMS.Config.experimentalFeature || ('on' === $.cookie('acms_ex'));
};

ACMS.Library.queryToObj = function ( str )
{
    str = str || location.search;
    var result = {}, hash;
    var param = str.substring(str.indexOf('?')+1).split('&');
    for ( var i=0; i<param.length; i++ ) {
        hash = param[i].split('=');
        result[hash[0]] = hash[1];
    }
    return result;
};

/**
 *
 * @param {String} name
 * @param {Object} [options]
 */
ACMS.Library.toggleNotify = function ( name, options )
{
    options || (options = {});

    var ident    = 'js-notify-'+name,
        $notify  = $('#'+ident),

        message      = options.message      || '',
        preCallback  = options.preCallback  || false,
        postCallback = options.postCallback || false,
        style        = options.style        || false;

    if (!$notify.length) {
        $notify = $($.parseHTML('<div id="'+ident+'" class="js-notify">'+message+'</div>'));
        $notify.appendTo('body');
    }

    // スタイルの上書き
    style && $notify.css(style);

    if ($notify.css('display') === 'none') {
        preCallback && preCallback($notify);
        $notify.fadeIn(300, function() {
            postCallback && postCallback($notify);
        });
    } else {
        preCallback && preCallback($notify);
        $notify.fadeOut(200, function() {
            $notify.hide();
            postCallback && postCallback($notify);
        });
    }
};

if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisp */) {
        "use strict";
        if (this == null) throw new TypeError();

        var t = Object(this),
        len = t.length >>> 0;

        if (typeof fun != "function") throw new TypeError();

        var thisp = arguments[1];

        for (var i = 0; i < len; i++) {
          if (i in t && fun.call(thisp, t[i], i, t))
            return true;
        }

        return false;
    };
}
