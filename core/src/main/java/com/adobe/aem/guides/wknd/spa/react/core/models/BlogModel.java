package com.adobe.aem.guides.wkndspa.react.core.models;

import com.adobe.cq.wcm.core.components.models.Image;
import org.osgi.annotation.versioning.ProviderType;

@ProviderType
public interface BlogModel extends Image {

    public String getBannerText();

    public String getCtaURL();

    public String getCtaLabel();

    public String getCtaTitle();

}