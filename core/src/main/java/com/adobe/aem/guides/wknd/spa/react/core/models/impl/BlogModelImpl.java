package com.adobe.aem.guides.wkndspa.react.core.models.impl;

import com.adobe.aem.guides.wkndspa.react.core.models.BlogModel;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Image;
import org.apache.sling.models.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { BlogModel.class,ComponentExporter.class},
    resourceType = BlogModelImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
    )
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class BlogModelImpl implements BlogModel {

    // points to the the component resource path in ui.apps
    static final String RESOURCE_TYPE = "wknd-spa-react/components/react_blog";

    @Self
    private SlingHttpServletRequest request;

    // With sling inheritance (sling:resourceSuperType) we can adapt the current resource to the Image class
    // this allows us to re-use all of the functionality of the Image class, without having to implement it ourself
    // see https://github.com/adobe/aem-core-wcm-components/wiki/Delegation-Pattern-for-Sling-Models
    @Self
    @Via(type = ResourceSuperType.class)
    private Image image;

    // map the property saved by the dialog to a variable named `bannerText`
    @ValueMapValue
    private String bannerText;

    @ValueMapValue
    private String ctaUrl;

    @ValueMapValue
    private String ctaLabel;
    
    @ValueMapValue
    private String ctaTitle;

    // public getter to expose the value of `bannerText` via the Sling Model and JSON output
    @Override
    public String getBannerText() {
        return bannerText;
    }

    @Override
    public String getCtaURL() {
        return ctaUrl;
    }

    @Override
    public String getCtaLabel() {
        return ctaLabel;
    }

    @Override
    public String getCtaTitle() {
        return ctaTitle;
    }

    // Re-use the Image class for all other methods:

    @Override
    public String getSrc() {
        return null != image ? image.getSrc() : null;
    }

    @Override
    public String getAlt() {
        return null != image ? image.getAlt() : null;
    }

    @Override
    public String getTitle() {
        return null != image ? image.getTitle() : null;
    }


    // method required by `ComponentExporter` interface
    // exposes a JSON property named `:type` with a value of `wknd-spa-react/components/banner`
    // required to map the JSON export to the SPA component props via the `MapTo`
    @Override
    public String getExportedType() {
        return BlogModelImpl.RESOURCE_TYPE;
    }

}