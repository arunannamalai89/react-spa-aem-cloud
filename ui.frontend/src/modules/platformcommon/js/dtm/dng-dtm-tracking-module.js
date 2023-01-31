import CommonModule from '../modules/common-module';
var digitalData = {};
var dtmData = {};
dtmData.page = {};
dtmData.link = {};
dtmData.wt = {};
var globalDcsUri='';
var DTMTrackingModule = ( function ( window, undefined ) {

  var pageBrand = '',
    _self,
    flavorId = '',
    primarySection,
    secondarySection,
    tertiarySection,
    additionalSection,
    dtmLinkType,
    dtmClickText,
    pageTitle,
    pageReferrer,
    pathName,
    thisElement,
    docList,
    visitorId = '',
    errorCode,
    language = '',
    country = '',
    blogID,
    blogTitle,
    sessionId,
    sessionModule = new SessionStorageModule(),
    commonModule = new CommonModule();

  function DTMTrackingModule () {
    _self = this;
    var dtmStr = function ( str ) {
      if ( typeof str !== 'undefined' && typeof str.replace === 'function' ) {
        // str = str.replace( /^\s+|\s+$/g, '' ); moved to down
        str = str.toLowerCase();
        str = str.replace( /(\r\n|\n|\r)/g, '');
        str = str.replace(/(<([^>]+)>)/ig, '');
        str = str.replace( /&amp;+/g, '&' );
        str = str.replace( /®+/g, '-' );
        str = str.replace( /([★⚠⚹⚑«])+/g, '' );
        // str = str.replace( /([~!@#$%^&*()_+='’–`{}\[\]\|\\:;'<>,.\/? ])+/g, '-' );
        str = str.replace( /([~!@#$%^&*()_+='’–`{}\[\]\\\;'<>,.\/? ])+/g, '-' );
        str = str.replace( /-+/g, '-' ); // replacing multiple hyphone to single
        str = str.replace( /^(-)+|(-)+$/g, '' );
        str = str.replace( /^\s+|\s+$/g, '' );
      }

      return str;
    };

    var getPageUrlForAnalytics = function(){
      if (window.analyticsPageUrl){
        return window.analyticsPageUrl + window.location.search;
      }
      else {
        return window.location.href;
      }
    };

    var reqStr = function ( str ) {
      if ( typeof str === 'undefined' || str === '' || typeof str === 'number' || typeof str === 'object') {
        return '';
      }
      else {
        return dtmStr( str );
      }
    };
    var onloadDcsUriCreation = function (url) {
      var newUrl = '';
      if ( url !== '' ) {
        var uriArr = url.split('/');
        $.each(uriArr, function (i, v){
          uriArr[i] = reqStr(v);
        });

        newUrl = uriArr.join('/');
      }

      return newUrl;
    };
    var initializeVariables = function () {

      pageTitle = $( 'title' ).html(); // $('meta[name="analytics:title"]').attr('content');
      if (typeof pageTitle === 'undefined'){
        pageTitle = '';
      }

      /* istanbul ignore else*/
      if ( commonModule.getCookie( 'BrandName' ) ) {
        pageBrand = commonModule.getCookie( 'BrandName' );
      }
      else if ( $( 'meta[name="analytics:brand"]' ).attr( 'content' ) ) {
        pageBrand = $( 'meta[name="analytics:brand"]' ).attr( 'content' );
      }
      else if ( typeof siteConfigProps !== 'undefined' && siteConfigProps.brandName ) {
        pageBrand = siteConfigProps.brandName;
      }
      else {
        pageBrand = '';
      }
      /* istanbul ignore else*/
      if ( commonModule.getCookie( 'CCN' ) ) {
        visitorId = commonModule.getCookie( 'CCN' );
      }
      /* istanbul ignore else*/
      if ( commonModule.getCookie( 'FlavorID' ) ) {
        flavorId = commonModule.getCookie( 'FlavorID' );
      }


      if ( typeof siteConfigProps !== 'undefined' && typeof siteConfigProps.locale !== 'undefined' ) {
        var pageLang = siteConfigProps.locale;
        if (pageLang.split('-').length === 2){
          language = pageLang.split('-')[0];
          country = pageLang.split('-')[1];
        }
        else if (pageLang.split('-').length === 1) {
          language = pageLang.split('-')[0];
        }
        else {
          // if...elseif should have an else block. else logic goes here
        }
      }
      primarySection = $( 'meta[name="analytics:primary-section"]' ).attr( 'content' );
      secondarySection = $( 'meta[name="analytics:secondary-section"]' ).attr( 'content' );
      tertiarySection = $( 'meta[name="analytics:tertiary-section"]' ).attr( 'content' );

      blogID = $( 'meta[name="analytics:ugcid"]' ).attr( 'content' );
      blogTitle = $( 'meta[name="analytics:ugctitle"]' ).attr( 'content' );

      if (typeof primarySection === 'undefined'){
        primarySection = '';
      }
      else {
        globalDcsUri = primarySection;
      }
      if (typeof secondarySection === 'undefined'){
        secondarySection = '';
      }
      else if (secondarySection !== ''){
        globalDcsUri = globalDcsUri+':'+secondarySection;
      }
      else {
        // if...elseif should have an else block. else logic goes here
      }
      if (typeof tertiarySection === 'undefined'){
        tertiarySection = '';
      }
      else if (tertiarySection !== ''){
        globalDcsUri = globalDcsUri+':'+tertiarySection;
      }
      else {
        // if...elseif should have an else block. else logic goes here
      }

      primarySection = reqStr(primarySection);
      secondarySection = reqStr(secondarySection);
      tertiarySection = reqStr(tertiarySection);
      blogID = reqStr(blogID);
      blogTitle = reqStr(blogTitle);
       // console.log(reqStr('Dave’s craft ---    ---  blends'));

      pathName = getPageUrlForAnalytics();
      pathName = pathName.replace( /^.*\/\/[^\/]+/, '' ).replace( '.html', '' );

      sessionModule.setReferrerUrl();
      if ( document.referrer ){
        pageReferrer = document.referrer;
      }
      else {
        pageReferrer = sessionModule.getReferrerUrl();
      }

      // pageReferrer = onloadDcsUriCreation(pageReferrer);
      pathName = onloadDcsUriCreation(pathName);


      // pathName = '/error/404';
      if (typeof pathName !== 'undefined' && pathName.search('error') !== -1){
        errorCode = pathName.split('/').pop();
        dtmData.page.pageType = 'errorPage';
        dtmData.page.errorCode = errorCode;
        dtmData.page.errorURL = pageReferrer;
      }
      else if (primarySection === 'errors') {
        dtmData.page.pageType = 'errorPage';
        dtmData.page.errorCode = secondarySection;
        dtmData.page.errorURL = getPageUrlForAnalytics();
      }
      else {
        // if...elseif should end with else
      }

      pageTitle = reqStr(pageTitle);
      pageBrand = reqStr(pageBrand);
      language = reqStr(language);
      country = reqStr(country);

      // creating page object
      if (blogID !== ''){
        dtmData.page.blogId = blogID;
        dtmData.page.blogTitle = blogTitle;
      }
      dtmData.page.title = pageTitle;
      dtmData.page.primarySection = primarySection;
      dtmData.page.secondarySection = secondarySection;
      dtmData.page.tertiarySection = tertiarySection;
      dtmData.page.brand = pageBrand;
      dtmData.page.language = language;
      dtmData.page.country = country;
      dtmData.page.visitorid = visitorId;
      dtmData.page.flavourid = flavorId;
      dtmData.page.dcsuri = pathName;
      dtmData.page.additionalSection = getAdditionalSection(tertiarySection);
      digitalData = {};
      digitalData.page = dtmData.page;
      // digitalData.wt = dtmData.wt;

      // console.log( 'digitalData in dtm module', digitalData );

      initializeEvents();

      // ACT-3319 to handle async scenario
      if (window._satellite && window.s) {
        _satellite.track('globalpageview');
      }
      else {
        var t = setInterval(function () {
          if (window._satellite && window.s) {
            _satellite.track('globalpageview');
            clearInterval(t);
          }
        }, 10);
      }
    };

    this.triggerRteDtm = function (thisElement) {
      // check if the click is done by user
      if ( sessionModule.getClickType() === 'trigger' ) {
        sessionModule.setClickType( 'user' );

        return;
      }

      docList = ['pdf', 'docx', ];
      // parentElement = thisElement.parents('[data-dtmparent]');
      var dtmLabel = thisElement.attr('data-analytics-label') || thisElement.attr('title');;
      var linkHref = thisElement.attr('href');
      if ( thisElement.children().length !== 0){
        var clickedEleType = thisElement.children().first().prop('tagName').toLowerCase();
        if (clickedEleType === 'img' || clickedEleType === 'picture'){
          if (thisElement.find('img').attr('alt')){
            dtmClickText = reqStr(thisElement.find('img').attr('alt'));
          }
          else {
            var imgSrc = thisElement.find('img').attr('src');
            imgSrc = (imgSrc)?imgSrc.replace(/^.*[\\\/]/, ''):'no-image.jpg';
            dtmClickText = imgSrc.slice(0, -4);
          }

        }
        else {
          dtmClickText = reqStr(thisElement.text());
        }
      }
      else {
        dtmClickText = reqStr(thisElement.text());
      }
      // dtmLocation = reqStr(thisElement.parents('.rte-component').attr('data-dtm-rte'))+ ':';
      var extention = '';
      /* istanbul ignore else*/
      if ( typeof thisElement.attr('href') !== 'undefined'){
        extention = reqStr(thisElement.attr('href').split('.')[1]);
      }
      var linkEvent, rteDcsuri;
      rteDcsuri = globalDcsUri+':'+dtmClickText;

      if (docList.indexOf(extention)!== -1){
        linkEvent = 'download-link-event';
        dtmLinkType = 'download';
      }
      else if ( _self.isExternalLink(linkHref) ){
        linkEvent = 'external-link-event';
        dtmLinkType = 'external';
        rteDcsuri = 'external-link:'+dtmClickText;
      }
      else {
        linkEvent = 'internal-link-event';
        dtmLinkType = 'internal';
      }

      // calling dtm tracking if RTE link clicks
      var compJson = {};
      compJson.category = dtmLinkType;
      compJson.section = 'rte';
      compJson.label = (dtmLabel)?dtmLabel:'';
      compJson.text = dtmClickText;
      compJson.dcsuri = rteDcsuri;
      _self.dtmTracking(linkEvent, compJson, 'link');
    };


    var initializeEvents = function () {
      $( 'body' ).on( 'click', '.textEditor [data-rte="true"]', function ( e ) {
        _self.triggerRteDtm($(this));
      } );
    };

    // global function for passing dtm-event,component-json, dtm-location
    this.dtmTracking = function (eventName, componentJson, category){
      // check if the click is done by user
      if ( sessionModule.getClickType() === 'trigger' ) {
        sessionModule.setClickType( 'user' );

        return;
      }
      digitalData = {};

      dtmData.page = {};
      dtmData.page.title = pageTitle;
      dtmData.page.primarySection = primarySection;
      dtmData.page.secondarySection = secondarySection;
      dtmData.page.tertiarySection = tertiarySection;
      dtmData.page.brand = pageBrand;
      dtmData.page.language = language;
      dtmData.page.country = country;
      dtmData.page.visitorid = visitorId;
      dtmData.page.flavourid = commonModule.getCookie( 'FlavorID' ) || '';
      dtmData.page.additionalSection = getAdditionalSection(tertiarySection);

      if (blogID !== ''){
        dtmData.page.blogId = blogID;
        dtmData.page.blogTitle = blogTitle;
      }

      sessionId = commonModule.getCookie('visitorProfileId');
      if (sessionId){
        dtmData.page.sessionID = sessionId;
      }
      // attr string validation
      var jsonKey = '',
        newJsonObject={},
        finalJsonObj={};
      $.each(componentJson, function (key, value){
        jsonKey = key;
        newJsonObject={};
        if (typeof value === 'object'){
          $.each(value, function (k, val){
            if ( typeof val !== 'undefined' ) {
              if (k === 'dcsuri' && typeof val !== 'undefined'){
                var dcsuriArry = val.split(':');
                $.each(dcsuriArry, function (i, v){
                  dcsuriArry[i] = reqStr(v);
                });
                newJsonObject[k] = dcsuriArry.join(':');
              }
              else if (k === 'name' && val.indexOf('carousel:') === 0){
                var cNameArr = val.split(':');
                newJsonObject[k] = cNameArr[0] +':'+ reqStr(cNameArr[1]);
              }
              else {
                newJsonObject[k] = reqStr(val);
              }
            }
          });
          finalJsonObj[jsonKey] = newJsonObject;
        }
        else {
          if (key === 'dcsuri' && typeof value !== 'undefined'){
            var dcsuriArr = value ? value.split(':'): '';
            $.each(dcsuriArr, function (i, v){
              dcsuriArr[i] = reqStr(v);
            });
            componentJson[key] = dcsuriArr ? dcsuriArr.join(':'): '';
            dtmData.page.dcsuri = componentJson.dcsuri;
            delete componentJson.dcsuri;
          }
          else {
            componentJson[key] = reqStr(value);
          }
          digitalData[category] = componentJson;
        }
      });

      if (category === 'page') {
        pathName = getPageUrlForAnalytics();
        pathName = pathName.replace( /^.*\/\/[^\/]+/, '' ).replace( '.html', '' );
        pathName = onloadDcsUriCreation(pathName);
        dtmData.page.dcsuri = pathName;
      }

      if (!$.isEmptyObject(finalJsonObj) && typeof finalJsonObj.page !== 'undefined'){
        if (eventName !== 'virtual-page-load'){
          dtmData.page.dcsuri = finalJsonObj.page.dcsuri;
        }
        else {
          dtmData.page.dcsuri = pathName;
        }

        delete finalJsonObj.page.dcsuri;
        digitalData = finalJsonObj;
      }
      // Global page tracking assignment
      digitalData.page = dtmData.page;

      var clickText= findDtmClickedText(componentJson);

      if ( typeof _satellite !== 'undefined' ) {
        _satellite.track( eventName );
      }

      // console.log( 'digitalData for '+clickText+ ':', digitalData );

    };

    this.clickDTM = function (element, dtmObjValues = {}, noLinkParameter = false, customLinkCategory = '') {
      const href = element.attr('href') || '';
      const dtmLabel = element.attr('data-dtmlabel') || '';
      const clickedText = element.attr('data-dtmtext') || '';
      const linkCategory = this.isExternalLink(href) ? 'external' : 'internal';
      const category = element.attr('data-category');
      let section = element.attr('data-section') || '';
      if (element.parents('section[data-dtmcontainer]').length > 0) {
        section = element.parents('section[data-dtmcontainer]').attr('data-dtmcontainer');
      }
      const dcsuri = linkCategory === 'external' ? 'external-link' :  globalDcsUri;
      const clickDtmTrackingObj = {
        page: {
          dcsuri: dcsuri + ':' + clickedText,
        }
      }

      if(!noLinkParameter) {
        clickDtmTrackingObj['link'] = Object.assign({
          category: category? category : linkCategory,
          section,
          label: (typeof dtmLabel !== 'undefined') ? dtmLabel : '',
          text: clickedText,
        }, dtmObjValues.link);
      }
      delete dtmObjValues.link;
      // console.log( 'digitalData for '+clickedText+ ':', {...clickDtmTrackingObj, ...dtmObjValues} );
      this.dtmTracking(customLinkCategory ? customLinkCategory : `${linkCategory}-link-event`, {...clickDtmTrackingObj, ...dtmObjValues}, 'link');
    }

    // finding DTM clickText from JsonObj
    var findDtmClickedText = function (componentJson){
      var text = '';
      $.each(componentJson, function (jKey, jVal){
        if (typeof jVal === 'object'){
          $.each(jVal, function (inKey, inVal) {
            if (inKey === 'text'){
              text = inVal;

              return false;
            }
            else if (inKey === 'query'){
              text = inVal;

              return false;
            }
            else if (inKey === 'name'){
              text = inVal;

              return false;
            }
            else {
              // if...elseif should have an else block. else logic goes here
            }
          });
        }
        else if (typeof componentJson.text !== 'undefined'){
          text = componentJson.text;
        }
        else if (typeof componentJson.query !== 'undefined'){
          text = componentJson.query;
        }
        else if (typeof componentJson.name !== 'undefined'){
          text = componentJson.name;
        }
        else {
            // if...elseif should have an else block. else logic goes here
        }
      });

      return reqStr(text);
    };
    /** *
    * This function will add additionalSection key
    * to dtmData if page path is exceeding tertiarySection
    * @param {string} tertiarySection
    * */
    var getAdditionalSection = function (tertiarySection){
      var locationName = getPageUrlForAnalytics();
      locationName = locationName.split('?')[0].replace( /^.*\/\/[^\/]+/, '' ).replace( '.html', '' );
      var pathArr = locationName.toLowerCase().split('/'),
        additionalArr = '',
        additionalSubArr = '';
      if (tertiarySection !== '' && pathArr.indexOf(tertiarySection) > -1){
        additionalArr = pathArr.slice(pathArr.indexOf(tertiarySection)+1, pathArr.length);
        if (additionalArr.length === 1){
          additionalSection = additionalArr[0];
        }
        else {
          for (var i = 0; i < additionalArr.length; i++) {
            additionalSubArr = additionalArr[0];
            additionalSubArr += ':'+additionalArr[i];
          }
          additionalSection = additionalSubArr;
        }
      }
      else {
        additionalSection = '';
      }

      return additionalSection;
    };
    // Checking href url is external or internal
    // function will return true or false
    this.isExternalLink = function (linkUrl){
      if (typeof linkUrl === 'undefined' || linkUrl === '' || linkUrl === null) {

        return false;
      }
      var urlSplit = linkUrl.split('://');
      var comp = new RegExp(location.host);
      var isExternal = false;
      /* istanbul ignore else*/
      if (urlSplit.length >= 2){
        if (!comp.test(urlSplit[1])){
          isExternal = true;
        }
        else {
          isExternal = false;
        }
      }
      // console.log(isExternal);

      return isExternal;
    };
    this.init = function () {
      // _self.isExternalLink('http://te/alcs-aem-frontend-dng/views/templates/DNG/imagewithcta.html');
      /* istanbul ignore else*/
      if ( typeof dtmData !== 'undefined' ) {
        initializeVariables();
      }
    };
  }

  return DTMTrackingModule;

} )( window );

// ACT-1946 Added null check for dtm variable

if (!dtmTrackingModule) {
  var dtmTrackingModule = new DTMTrackingModule();
  $( document ).ready( function () {
    dtmTrackingModule.init();
  });
}
export default DTMTrackingModule;

