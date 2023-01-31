import $ from 'jquery';
import BreakpointModule from './breakpoint-module';
import ALAPP from '../config/global.config';
let globalDcsUri ='';
var CommonModule = ( function ( window, undefined ) {
  function CommonModule () {

    var self = this;

    var setCookieValue = function ( key, value ) {
      document.cookie = key + '=' + value + ';expires=/;path=/;Secure=true';
    };

    // setting cookie one method
    this.setIndiviualCookie = function ( key, value ) {
      setCookieValue( key, value );
    };

    // setting cookie method
    // function input will be [{cookieName:nameOfCookie,cookieVal:valOfCookie},{}...]
    this.setCookieAsObject = function ( cookieObject ) {
      $( cookieObject ).each( function ( i, item ) {
        setCookieValue( item.cookieName, item.cookieValue );
      } );
    };

    // get cookie method, passing the cookie name
    this.getCookie = function ( cookieName ) {
      var cookieStart, cookieEnd;
      if ( document.cookie.length > 0 ) {
        cookieStart = document.cookie.indexOf( cookieName + '=' );
        if ( cookieStart !== -1 ) {
          cookieStart = cookieStart + cookieName.length + 1;
          cookieEnd = document.cookie.indexOf( ';', cookieStart );
          if ( cookieEnd === -1 ) {
            cookieEnd = document.cookie.length;
          }

          return unescape( document.cookie.substring( cookieStart, cookieEnd ) );
        }
      }

      return '';
    };
    
    this.getFixedHeaderHeight = function () {
      var fixedheaderContainer = 0;
      var fixedheaderChildren = $('.fixed-header-container>div').children().length;
      if(fixedheaderChildren !== 2) {
        $('.component-header').css('clear', 'both');
        $('.header-flyout__component').parent('div').css('clear', 'both');
        $('.fixed-header-container>div, .fixed-header-container>section').each(function (i, k) {
          fixedheaderContainer += $(k).outerHeight(true);
        });
        $('.component-header').css('clear', 'initial');
        $('.header-flyout__component').parent('div').css('clear', 'initial');
      }
      else {
      // this case is specific to marlboro or freshcope or when we have global navigation with sgw     
        $('.fixed-header-container>div').children().each(function (i, k) {
          if($(k).hasClass('globalnavigation')) {
            fixedheaderContainer += $(k).find('.header_container').outerHeight(true)
        } else {
            fixedheaderContainer += $(k).outerHeight(true);
        }
        });
      }
      return fixedheaderContainer;
    };

    /**
     * To remove provided local storage variables
     */
    this.clearLocalStorage = function (keysToRemove) {
      if (keysToRemove && keysToRemove.length) {
        for (var i = 0; i < keysToRemove.length; i++) {
          localStorage.removeItem(keysToRemove[i]);
        }
      }
    };

    // get SGW from header
    this.getSurgeonWarning = function () {
      var sgw = '';
      if($( '.surgeon-warning-component .gtc-sgw-warning-text' ).length) {
        var isEnable = $( '.surgeon-warning-component').data('enable-loadmore');
        var sgwVariation = $( '.surgeon-warning-component').data('sgw-variation');
        if(isEnable) {
          sgw = $( '.surgeon-warning-component .gtc-sgw-warning-text' ).html();
          sgw = '<div class="sgw-scroll-wrapper sgwBlock '+ sgwVariation +'">' + sgw + '</div>';
        }     
      } 
      // for IQOS SGW
      else {
        sgw = $( '.surgeon-warning-component .mobile-loadmore-sgw' ).html();
      }

      return sgw;
    };

    // for scroll SGW
    this.scrollSurgeonWarning = function (alignmentFlag) {
      if($(".sgw-scroll-wrapper").length) {
        var minusVal = 0;
        if(alignmentFlag){          
          if( $(".sgw-scroll-wrapper:last").prev().length){
            minusVal = $(".sgw-scroll-wrapper:last").prev().outerHeight();
          } else {
            minusVal = $(".sgw-scroll-wrapper:last").parent().prev().outerHeight();
          }
          minusVal = Number(minusVal)/2;
        }
        $('body, html').animate({ scrollTop: $(".sgw-scroll-wrapper:last").offset().top - minusVal}, 0);
      }
    };

    // for desktop and tab loadmore click focus on active/new items
    this.desktopLoadmoreActiveItemFocus = function (selName) {
      var minusVal = 0;
      minusVal = $('.'+selName+':last').outerHeight();
      minusVal = Number(minusVal)/2;
      var offset = $('.'+selName+':last').offset();
      if (offset) {
        $('body, html').animate({ scrollTop: offset.top - minusVal}, 0);
      }
    };
    
    // DTM Error Tracking
    this.dtmServiceError = function ( dataElem, status ) {
      var errTxt = '';
      if ( status === 'error' ) {
        errTxt = errTxt + '-' + status;
      }
      var dtmElem = $( '#dtm-error-track' );
      dtmElem.attr( {
        'data-dtm': true,
        'data-dtmclicktext': dataElem.dtmclicktext + errTxt,
        'data-dtmlocation': dataElem.dtmlocation,
        'data-dtmlinktype': dataElem.dtmlinktype,
        'data-dtmlabel': dataElem.dtmlabel
      } );
      dtmElem.trigger( 'click' );
    };

    this.systemError = function (type, wrapper, msg, url) {
      if ( typeof type !== 'undefined' ) {
        var errorType = type.toUpperCase();
        if (errorType === 'OPTIONAL'){
          // wrapper.hide();
          wrapper.remove();
        } else if (errorType === 'MANDATORY'){
          window.location = url;
        } else {
          // $(wrapper+' .system-error').show();
          // $(wrapper+' .system-error').html(msg);
          wrapper.find('.system-error').show();
          wrapper.find('.system-error').html(msg);
        }
      }
    };


    this.xssSanitize = function ( unsafe_str ) {
      var safeParam = unsafe_str.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

      return safeParam;
    };

    this.xsrfSanitize = function ( params ) {
      var isAuthorMode = self.getCookie( 'wcmmode' );
      /* istanbul ignore if */
      if ( !isAuthorMode ) {
        var sanitizedParam = params;
        var myDomain = '.lm.com'; // ToDo Read this value from site config also check if current page has lm.com
        if ( params.indexOf( 'http' ) === 0 ) {
          var tempParam, tempParamArray;
          tempParam = params.replace( '://', '' );
          tempParamArray = tempParam.split( '/' );
          if ( tempParamArray.length && tempParamArray[ 0 ].indexOf( myDomain ) !== -1 ) {
            var tempLMArray = tempParamArray[ 0 ].split( myDomain );
            if ( tempLMArray[ 1 ] ) {
              console.log( 'Security Threat in URL' );

              return '';
            } else {
              return sanitizedParam;
            }
          } else {
            console.log( 'Security Threat in URL' );

            return '';
          }
        } else {
          return sanitizedParam;
        }
      } else {
        return params;
      }
    };

    this.logText = function (param){
      console.log(param);
    };

    /* istanbul ignore next */
    this.ajaxCall = function (){

    };

    this.fontSizing = function(ourText, max, minFontPixels, maxFontPixels) {
      while (minFontPixels < (Math.floor(maxFontPixels) - 1)) {
        let fontSize = Math.floor((minFontPixels + maxFontPixels) / 2);
        $(ourText).css('font-size', fontSize + 'px');
        let curSize = $(ourText).height();
        if (curSize <= max) {
          minFontPixels = fontSize;
          if (curSize === max) {
            maxFontPixels = fontSize;
            break;
          }
        }
        else {
          maxFontPixels = fontSize;
        }
      }
      $(ourText).css('font-size', maxFontPixels + 'px');
      let newCurrSize = $(ourText).height();
      if (newCurrSize <= max) {
        minFontPixels = maxFontPixels;
      }
      return minFontPixels;
    }

    this.setHeightForRewardsSGW = function(element, ourText, parsysHeight) {
      var defaultFontSize = $(element).data('min-font-size');
      var maxHeight = $(element).height() - (parseInt($(element).css('padding-top'), 10) * 2);
      var minFontPixels = parseInt(defaultFontSize, 10);
      var maxFontPixels = maxHeight < minFontPixels ? minFontPixels : maxHeight;
      var fontSizeHeight = this.fontSizing(ourText, maxHeight, minFontPixels, maxFontPixels);
      $(ourText).css('font-size', fontSizeHeight + 'px');
      parsysHeight = parsysHeight == 0 ? 70 : (parsysHeight * 0.2) - 2;
      // Set height to the element
      $(element).css('min-height', parsysHeight + 'px');
      $(element).css('height', parsysHeight + 'px');
      if ($(ourText).height() > maxHeight) {
        if ($(ourText).css('font-size') === defaultFontSize) {
            $(element).css('height', 'auto');
        }
        else {
            parsysHeight = (parsysHeight * 0.2) - 2;
            $(element).css('min-height', parsysHeight + 'px');
            $(element).css('height', parsysHeight + 'px');
            $(ourText).css('font-size', fontSizeHeight - 1 + 'px');
        }
      }
    }

    this.setHeightForRewardsSGWViewPort = function(element, ourText) {
      let hasAutoHeight;
      let defaultFontSize = $(element).data('min-font-size');
      var maxHeight = $(element).height() - (parseInt($(element).css('padding-top'), 10) * 2);
      let minFontPixels = parseInt(defaultFontSize, 10);
      let maxFontPixels = maxHeight < minFontPixels ? minFontPixels : maxHeight;
      let fontSizeHeight = this.fontSizing(ourText, maxHeight, minFontPixels, maxFontPixels);
      $(ourText).css('font-size', fontSizeHeight + 'px');
      if ($(ourText).height() >= maxHeight) {
        if ($(ourText).css('font-size') === defaultFontSize) {
          $(element).css('height', 'auto');
          hasAutoHeight = true;
        }
        else {
          $(element).css('height', '20.5vh');
          $(ourText).css('font-size', fontSizeHeight -1 + 'px');
        }
      }
      return hasAutoHeight;
    }
  };

  return CommonModule;

} )( window );

var LoadJSConfig = {};
var LoadJS = (function (window, undefined) {

  function LoadJS () {

    this.scriptLoad = function ( componentName ) {

      var componentScriptStatus = true;
      /* istanbul ignore else */
      if ( componentName ) {
        /* istanbul ignore else */
        if ( !LoadJSConfig[componentName] ) {
            LoadJSConfig[componentName] = componentName;
        } else {
            componentScriptStatus = false;
        }
    }

      return componentScriptStatus;
    };
  };

  return LoadJS;

} )( window );



// Callback from GTC S058 inline form modal
function DisplayPopUp (){
  if ($('#gtc-ma-loyalty-popup:visible')){
    var brkpoint = new BreakpointModule();
    var wrapperEle = $('#gtc-ma-loyalty-popup');
    var modalEle = $('#gtc-ma-loyalty-popup #inline-form-modal');
    var offset = $('.fixed-header-container').outerHeight();
    var subNav = $('.sub-navigation-container');
    var subNavHeight = subNav.length ? subNav.outerHeight() : 0;
    // add 32px of space between modal window and header per creative direction
    // check for subnav and calculate the height accordingly
    if (brkpoint.getCurrentBreakpoint() === ALAPP.global.breakpoints.mobile) {
      let mainNav = $('.main-navigation .header-mobile-container').length ? $('.main-navigation .header-mobile-container').outerHeight() : 0;
      modalEle.css('top', mainNav + 32);
    } else {
      var offsetHeight = subNavHeight ? (offset + subNavHeight) : (offset + 32);
      modalEle.css('top', offsetHeight);

    }
    $('#gtc-ma-loyalty-popup #inline-form-modal .modal-content').click( function (e) {
      e.stopPropagation();
    });

    $('#Container01 .gtc-ma-loyalty-popup #inline-form-modal .modal-content .no-thanks').off('click').on('click', function (event) {
      event.preventDefault();
      //var dtmModuleObj = new DTMTrackingModule();
      var compName = $(event.target).closest('[data-comp-identifier]').attr('data-comp-identifier') + '';
      var digitalDataLink = {
        link: {
          category: 'content',
          section: compName,
          label: 'address-prompt',
          text: 'close'
        },
        page: {
          dcsuri: globalDcsUri+':address-prompt:close'
        }
      };
      //dtmModuleObj.dtmTracking ('internal-link-event', digitalDataLink);
    });
    $('#Container01 .gtc-ma-loyalty-popup #inline-form-modal .modal-content .modal-close').off('click').on('click', function (event) {
      //var dtmModuleObj = new DTMTrackingModule();
      var compName = $(event.target).closest('[data-comp-identifier]').attr('data-comp-identifier') + '';
      var digitalDataLink = {
        link: {
          category: 'content',
          section: compName,
          label: 'address-prompt',
          text: 'close-icon'
        },
        page: {
          dcsuri: globalDcsUri+':address-prompt:close-icon'
        }
      };
      //dtmModuleObj.dtmTracking ('internal-link-event', digitalDataLink);
    });
    // wrapperEle.off('click').on('click', function (){
    //   inlineForm.CloseLoyaltyPopUpEvent();
    // });
  }
  //var dtmModuleObj = new DTMTrackingModule();
  // For Modal opening
  var digitalDataOverlay = {
    page: {
      dcsuri: globalDcsUri+':address-prompt'
    },
    overlay: {
      overlayName: 'address-prompt'
    }
  };
  //dtmModuleObj.dtmTracking ('overlay-tracking', digitalDataOverlay);


};

export default CommonModule;
