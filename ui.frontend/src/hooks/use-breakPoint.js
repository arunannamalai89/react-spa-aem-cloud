import ALAPP from '../modules/platformcommon/js/config/global.config';
var useBreakPoint = ( function ( window, undefined ) {
  function BreakpointModule () {
    var currentBP;
    this.getCurrentBreakpoint = function ( element, options ) {

      if ( window.matchMedia( '(min-width: 1153px)' ).matches ) {
        // the viewport is at least 400 pixels wide
        currentBP = ALAPP.global.breakpoints.desktop;
      } else if ( window.matchMedia( '(min-width: 768px)' ).matches  ) {
        currentBP = ALAPP.global.breakpoints.tabletP;

      } else {  // the viewport is less than 400 pixels wide
        currentBP = ALAPP.global.breakpoints.mobile;
      }

      return currentBP;
    };

    this.isTabletPortrait = function(){
      if (window.matchMedia('(min-width: 768px) and (max-width:1023px)').matches) {
        return true;
      }
      return false;
    }

    this.isTabletLandscape = function () {
      if (window.matchMedia('(min-width: 1024px) and (max-width:1152px)').matches) {
        return true;
      }
      return false;
    }

  }

  return new BreakpointModule();

} )( window );
export default useBreakPoint;
