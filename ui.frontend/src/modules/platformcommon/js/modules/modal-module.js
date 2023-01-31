import BreakpointModule from "./breakpoint-module";
import $ from 'jquery';
import ALAPP from "../config/global.config";
var ModalModule = (function (window, undefined) {
    function ModalModule() {
      var modalConatiner,
        contentText,
        linkElemWithModalSpan,
        linkModalClickLive,
        CONST_MODAL_CLASS = 'modal',
        bodyConatiner,
        dtmModuleObj,
        loaderTemplate,
        brkpoint,
        modalFetchContent = '#modal-container',
        windowScroll = null,
        globalDcsUri = "";
  
      var initializeElements = function () {
        //dtmModuleObj = new DTMTrackingModule();
        brkpoint = new BreakpointModule();
  
        modalConatiner = $('.modal-conatiner');
        bodyConatiner = $('body');
        contentText = $('.modal-conatiner .content-text');
        linkElemWithModalSpan = $('a span.' + CONST_MODAL_CLASS);
        linkModalClickLive = 'a span.' + CONST_MODAL_CLASS+ ', button.' + CONST_MODAL_CLASS;
  
        var template = '<div class="modal-overlay-module"></div><div class="modal-conatiner hide" aria-modal="true" role="dialog" aria-labelledby="modal-content"><div class="modal-conatiner-content msg" aria-expanded="true"><span tabindex="0" role="button" aria-label="close" class="close"><i class="icon icon-overlay-window-close-x"></i></span><div id="modal-content" class="content-text" style="max-height: 100%;"></div></div></div>';
        loaderTemplate = '<div class="loadertext"><img src="/content/dam/alcs/pmusa/marlboro/images/loyaltyenrollnow/enrollmentform/loadingicon.gif" alt="Loading"></div>';
  
        if ($('.modal-conatiner').length) {
          $('.modal-conatiner').remove();
        }
  
        $('#spa-root').append(template);
      };
  
      var initializeComponent = function () {
        // linkElemWithModalSpan.on ('click.ModalModule', onLinkClickHandler);
        $(document).off('click', linkModalClickLive).on('click', linkModalClickLive, onLinkClickHandler);
    
        // for button style model click handle
        $(document).off('click', 'a.modal').on('click', 'a.modal', function(event) {
          event.preventDefault();
          if($(this).find('span.modal').length) {
            $(this).find('span.modal').trigger("click");
          }
        });
        $(document).off('click.ModalModule', '.modal-conatiner .close, .modal-conatiner .close-btn, .modal-conatiner .close-btn-modal').on('click.ModalModule', '.modal-conatiner .close, .modal-conatiner .close-btn, .modal-conatiner .close-btn-modal', onCloseBtnHandler);
        /* istanbul ignore next */
        $('.template-header-wrapper, .modal-overlay-module').on('click', function () {
          closeModal();
        });
    
        $(document).on('click', function (e) {
          /* istanbul ignore if */
          if ($(e.target).hasClass('modal-conatiner hide')) {
            closeModal();
          }
        });
      };

      /* istanbul ignore next */
      var setCloseIconColor = function (modalClassName) {
        var $close = $('.modal-conatiner-content').find('.close');
  
        var colorType = (modalClassName === '.template-content-wrapper') ? (($('.content-text').find('.v-light').length > 0) && ($('.content-text').find('.v-dark').length < 1)) : ($('.content-text').find('.v-light').length > 0);
  
        if (colorType) {
          $close.css('color', '#000');
        }
        else {
          $close.css('color', '#fff');
        }
      };
  
      /* istanbul ignore next */
      var onLinkClickHandler = function (event, dynamicParam) {
        event.preventDefault();
        // trigger dtmModuleObj
        var currentEle = event.target || event.srcElement;
        var scrollPostion = null;
        currentEle = $(currentEle);
        if (currentEle.attr('data-dtm') && currentEle.attr('data-rte')) {
          //dtmModuleObj.triggerRteDtm(currentEle);
        }
        else if (currentEle.parent().attr('data-dtm') && currentEle.parent().attr('data-rte')) {
         // dtmModuleObj.triggerRteDtm(currentEle.parent());
        }
        // stop propagation
  
        var overlayName = currentEle.parent().attr('data-dtm-overlay-name') || '';
        event.stopPropagation();
  
        /* istanbul ignore else */
        var shouldNotScroll = false;
  
        if (dynamicParam === 'NOSCROLL') {
          shouldNotScroll = true;
        }
  
        if (dynamicParam === 'TAKE-CLASS') {
          modalFetchContent = '.template-content-wrapper';
          overlayName = 'explore-place-map-overlay';
        }
  
        $('.modal-conatiner .content-text').html(loaderTemplate);
        if ($(this).hasClass(CONST_MODAL_CLASS)) {
          event.preventDefault();
  
          if (brkpoint.getCurrentBreakpoint() === ALAPP.global.breakpoints.mobile && !shouldNotScroll) {
            scrollPostion = $('.surgeon-warning-component').outerHeight();
            if ($('.sgwWithNicotine').length) {
              scrollPostion = (+$('body').css('padding-top').slice(0, -2) - $('.sgw-top-wrapper').outerHeight());
            }
            scrollWindowToPosition({
              position: scrollPostion,
              hasEasing: true,
            });
          }
  
          openModal(shouldNotScroll, overlayName);
  
          $('.modal-overlay-module').addClass('modal-gradeout');
          if (overlayName) {
            $ ('.modal-conatiner-content').attr('data-dtm-overlay-name', overlayName);
          }
  
          var targetUrl = $(this).parent().attr('href');
          if (targetUrl === '' || targetUrl === undefined) {
            targetUrl = $(this).attr('data-modalurl');
          }
          var referrerUrl = $(this).parent().data('referrerurl');
          if (referrerUrl!=='' && referrerUrl!==undefined && referrerUrl!==null) {
            $('.modal-overlay-module').attr('data-referrerurl', referrerUrl);
          }
          if ((targetUrl !== '#') && (targetUrl !== undefined) && (targetUrl !== null) && (targetUrl !== '')) {
  
            $.ajax({
              url: targetUrl,
              dataType: 'html',
              success: function (html) {
                var div;
                if (dynamicParam === 'DIRECT') {
                  div = $(html);
                }
                else {
                  div = $(html).find(modalFetchContent);
                }
  
                $('.modal-conatiner .content-text')
                  .html(div)
                  .promise()
                  .done(function () {
  
                    setCloseIconColor(modalFetchContent);
                    //COMMENT TEMP
                    // picturefill();
                    // lazyModule().init();
                    setTimeout(function () {
                      var bpoint = brkpoint.getCurrentBreakpoint();
  
                      if ($('.vari-width').width() && bpoint === ALAPP.global.breakpoints.desktop) {
                        $('.modal-conatiner-content').css({ width: '600px', });
                      }
                      $ ('.modal-conatiner .close').focus();
                    }, 900);
                  });
              },
            });
          }
          else {
            setTimeout(function () {
              contentText = $('.modal-conatiner .content-text');
              contentText.html($('.' + event.target.getAttribute('data-targetconatiner')).clone());
              console.log('-----cloned content')
              $('.modal-conatiner').css({ 'background-color': 'transparent', });
              setCloseIconColor();
              var bpoint = brkpoint.getCurrentBreakpoint();
              if ($('.vari-width').width() && bpoint === ALAPP.global.breakpoints.desktop) {
                $('.modal-conatiner-content').css({ 'width': '600px', });
              }
            }, 900);
          }
        }
      };
  
      var onCloseBtnHandler = function (event) {
        var currentEle = event.target || event.srcElement;
        var overlayName = $(currentEle).parent().attr('data-dtm-overlay-name') || $(currentEle).parent().parent().attr('data-dtm-overlay-name') || '';
        var trackingJson = {
          link: {
            category: 'internal',
            section: 'overlay',
            label: 'modal',
            text: 'close',
          },
          page: {
            dcsuri: globalDcsUri + ':close',
          },
        };
        if (overlayName) {
          trackingJson.overlay = {overlayName: overlayName};
        }
       // dtmModuleObj.dtmTracking('internal-link-event', trackingJson, 'link');
        closeModal();
      };
  
      var setModalTopPosition = function () {
        var fixedheaderContainer = 0;
        var fixedheaderChildren = $('.fixed-header-container>div').children().length;
        var offset = 0;
        if(fixedheaderChildren !== 2) {
          $('.component-header').css('clear', 'both');       
          $('.fixed-header-container>div, .fixed-header-container>section').each(function (i, k) {
            fixedheaderContainer += $(k).outerHeight(true);
          });
          $('.component-header').css('clear', 'initial');
        }
        else {
        // this case is specific to marlboro or freshcope or when we have global navigation with sgw     
          $('.fixed-header-container>div').children().each(function (i, k) {
            fixedheaderContainer += $(k).outerHeight(true);
          });
        } 

        // Set offset case is to handle when we have nicotine warning in marlboro with wrappper component
        // Else is fallback for all other cases
        if ($('.sgwWithNicotine').parents('.sgwwrapper-component').length) {
          offset = fixedheaderContainer
        } else {
          offset = $('.sgwWithNicotine').length ? +$('body').css('padding-top').slice(0, -2) : fixedheaderContainer;
        }

        var subNav = $('.sub-navigation-container');
        var subNavHeight = subNav.length ? subNav.outerHeight() : 0;
        // add 32px of space between modal window and header per creative direction
        // check for subnav and calculate the height accordingly
        var offsetHeight = subNavHeight ? (offset + subNavHeight) : (offset + 32);
        $('.modal-conatiner').css('top', offsetHeight);
      };
  
      var setStaticModalTopPosition = function () {
        setTimeout(function () {
  
          windowScroll = windowScroll || $(window).scrollTop();
          var windowHeight = $(window).height();
          var modalHeight = $('.modal-conatiner').height();
  
          modalHeight = (modalHeight < 20) ? modalHeight = 400 : modalHeight;
  
          var topval = (windowScroll + (windowHeight / 2)) - (modalHeight / 2) + 10;
  
          var navHeight = $('.template-siteheader-wrapper').height();
          var subnavHeight = $('.sub-navigation-container').height() || 0;
          var expectedHeight = navHeight + subnavHeight;
  
          topval = (topval < expectedHeight) ? topval = expectedHeight + 30 : topval;
  
          $('.modal-conatiner').css('top', topval);
  
        }, 120);
      };
  
      var openModal = function (shouldNotScroll, overlayName) {
        var resizeTimer;
        var dtmJson = {};
        if (!shouldNotScroll) {
          $(window).scrollTop(0);
        }
  
        if ($('.tab-wrapper').length > 0) {
          $('.tab-wrapper').css('z-index', 1);
        }
  
        modalConatiner.show();
  
        $(window).on('resize.modal', function (e) {
          clearTimeout(resizeTimer);
  
          resizeTimer = setTimeout(function () {
            if (!shouldNotScroll) {
              setModalTopPosition();
            }
            else {
              setStaticModalTopPosition();
            }
          }, 250);
        });
  
        $('.modal-conatiner').css({ display: 'block', });
  
        if (!shouldNotScroll) {
          setModalTopPosition();
        }
        else {
          setStaticModalTopPosition();
        }
  
        if (overlayName) {
          dtmJson = {
            overlay:{
              overlayName: overlayName
            },
            page: {
              dcsuri: globalDcsUri
            }
          }
        }
          
       // dtmModuleObj.dtmTracking('overlay-tracking', dtmJson, 'page');
      };
  
      var closeModal = function () {
        $('.modal-overlay-module').removeClass('modal-gradeout');
        if(  $("#modal-container .rewarddetail").length > 0 
             || $("#modal-container .order-review").length > 0
             || $("#modal-container .shipping-information").length > 0
             || $("#modal-container .reward-confirmation").length > 0
           ) {
            localStorage.removeItem('rewardModalInfo')
        }
        $('.tab-wrapper').css('z-index', 1000);
        $('.modal-conatiner').hide();
        setTimeout(function(){
          $ ('.modal-conatiner-content').removeAttr('data-dtm-overlay-name');
        }, 100);
  
        $(window).off('resize.modal');
        windowScroll = null;
      };
  
      var scrollWindowToPosition = function (options) {
        if (typeof options === 'undefined') {
          return;
        }
  
        var scrollElem = $('html, body');
        var windowElem = $(document);
  
        if (typeof options.element !== 'undefined') {
          scrollElem = options.element;
        }
  
        if (typeof options.position === 'undefined' || isNaN(options.position)) {
          options.position = 0;
        }
  
        windowElem.ready(function () {
          try {
            if (options.hasEasing) {
              scrollElem.stop().animate({ scrollTop: options.position, }, 1000);
            }
            else {
              scrollElem.scrollTop(options.position);
            }
          }
          catch (error) {
            console.warn(error.message);
          }
        });
      };
  
      this.init = function () {
        console.log('init modal module')
        initializeElements();
        initializeComponent();
      };
    }
  
    return ModalModule;
  })(window);
  
  export default ModalModule;
