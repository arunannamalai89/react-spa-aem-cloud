import React, { Component } from 'react';
import { MapTo } from '@adobe/aem-react-editable-components';

export const EditConfig = {

  emptyLabel: 'Blog',

  isEmpty: function (props) {
    return !props || !props.src || props.src.trim().length < 1;
  }
};

var Blog = (props) => {

  var imageContent = () => {
    return <img
      className="Image-src"
      src={props.src}
      alt={props.alt}
      title={props.title ? props.title : props.alt} />;
  }

  // display our custom bannerText property!
  var bannerText = () => {
    if (props.bannerText) {
      return <h4>{props.bannerText}</h4>;
    }

    return null;
  }
  var ctaContent = () => {
    if (props.ctaURL && props.ctaLabel) {
      return <a href={props.ctaURL} title={props.ctaTitle}>{props.ctaLabel}</a>
    }
  }
  

  return (
    <div className="Banner">
      <div className="BannerImage">{imageContent()}</div>
      <div className="Banner-text">
        {bannerText()}
      </div>
      <div>{ctaContent()}</div>
    </div>
  );
}

MapTo('wknd-spa-react/components/react_blog')(Blog, EditConfig);
