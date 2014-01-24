var NAT = {};
NAT.Page = {};
NAT.Page.Controllers = {};
NAT.Main = {};

NAT.Event = function(eventString, domObject)
{
    var self = this;

    self.eventObject = domObject;
    self.eventString = eventString;

    self.AddHandler = function(handler)
    {
        if(null != self.eventObject && null != self.eventString && null != handler)
        {
            $(self.eventObject).bind(self.eventString, handler);
        }
    }

    self.RemoveHandler = function(handler)
    {
        if(null != self.eventObject && null != self.eventString && null != handler)
        {
            $(self.eventObject).unbind(self.eventString, handler); 
        }
    }

    self.Trigger = function(dataArray)
    {        
        if(null != self.eventObject && null != self.eventString && null != dataArray)
        {
            $(self.eventObject).trigger(self.eventString, dataArray); 
        }
    };
};

NAT.getElementsByClassName = function(node, className)
{
    //Check and see if the getElementsByClassName is undefined
    if(document.getElementsByClassName)
    {
        return node.getElementsByClassName(className);
    }
    else
    {
       return $(node).find("." + className).get();
    }
};

NAT.isStringNullOrEmpty = function(stringObj)
{
    return (null != stringObj && stringObj.search(/\S/gi) > -1) ? false : true;
};

NAT.Main.ImageCarouselImage = function(imageCarouselImageElement)
{
    var self = this;

    self.isSelected = false;
    self.imageCarouselImageElement = imageCarouselImageElement;
    self.imageElement = null;
    self.captionElement = null;
    self.title = "";
    self.description = "";
    self.imageSourceURL = null;
    self.linkURL = null;
    self.selectedCSSClassName = "nat_main__imageCarousel___thumbnailSelected";
    self.deselectedCSSClassName = "";
    self.onClickEvent = new NAT.Event("NAT.Main.ImageCarouselImage_onClickEvent", self.imageCarouselImageElement);
    self.onMouseOutEvent = new NAT.Event("NAT.Main.ImageCarouselImage_onMouseOutEvent", self.imageCarouselImageElement);
    self.onMouseOverEvent = new NAT.Event("NAT.Main.ImageCarouselImage_onMouseOverEvent", self.imageCarouselImageElement);

    self.onClick = function()
    {        
        self.onClickEvent.Trigger([self]);
    };

    self.onMouseOver = function()
    {
        self.onMouseOverEvent.Trigger([self]);
    };

    self.onMouseOut = function()
    {
        self.onMouseOutEvent.Trigger([self]);
    };

    self.select = function()
    {
        if(!self.isSelected && null != self.imageCarouselImageElement && null != self.imageElement && null != self.captionElement)
        {
            self.isSelected = true;

            self.imageCarouselImageElement.className = self.selectedCSSClassName;
        }
    }

    self.deselect = function()
    {
        if(null != self.imageCarouselImageElement && null != self.imageElement && null != self.captionElement)
        {
            self.imageCarouselImageElement.className = self.deselectedCSSClassName;

            self.isSelected = false;
        }
    }

    if(null != self.imageCarouselImageElement)
    {
        self.imageCarouselImageElement.onclick = self.onClick;
        self.imageCarouselImageElement.onmouseover = self.onMouseOver;
        self.imageCarouselImageElement.onmouseout = self.onMouseOut;

        self.imageElement = self.imageCarouselImageElement.getElementsByTagName("img")[0];
        self.captionElement = self.imageCarouselImageElement.getElementsByTagName("figcaption")[0];

        if(null != self.imageElement)
        {
            self.title = self.imageElement.getAttribute("title");
            self.description = self.imageElement.getAttribute("data-description");
            self.imageSourceURL = self.imageElement.getAttribute("data-mainImageURL");
            self.linkURL = self.imageElement.getAttribute("data-linkURL");
        }
    }
};

NAT.Main.ImageCarouselPresentationImage = function(imageCarouselPresentationImageElement)
{
    var self = this;

    self.imageCarouselPresentationImageElement = imageCarouselPresentationImageElement;
    self.imageElement = null;
    self.captionElement = null;

    self.display = function(imageSourceURL, title, description, linkURL)
    {
        if(null != self.imageElement && null != self.captionElement)
        {
            if(null != imageSourceURL && null != title && null != description)
            {
                self.imageElement.setAttribute("src", imageSourceURL);
                self.imageElement.setAttribute("alt", title);
                self.imageElement.setAttribute("title", title);

                self.captionElement.innerHTML = "<span>" + title + "</span><br />" + description;

                self.imageElement.onclick = function()
                {
                    location.href = linkURL;
                };
            }
        }
    };

    if(null != self.imageCarouselPresentationImageElement)
    {
        self.imageElement = self.imageCarouselPresentationImageElement.getElementsByTagName("img")[0];
        self.captionElement = self.imageCarouselPresentationImageElement.getElementsByTagName("figcaption")[0];
    }
};

NAT.Main.ImageCarousel = function(imageCarouselElement)
{
    var self = this;

    self.imageCarouselElement = imageCarouselElement;
    self.isAnimating = false;
    self.currentImageIndex = -1;
    self.maxImageCount = 4;
    self.presentationImage = null;
    self.imageList = new Array();
    self.imageIndexBySourceURL = new Object();
    self.imageCarouselImageHolderCSSClassName = "nat_main__imageCarousel___navigation";
    self.imageCarouselPresentationImageCSSClassName = "nat_main__imageCarousel___mainImage";
    self.animationTimeout = null;    

    self.selectNextImage = function()
    {
        var nextImageIndex = self.currentImageIndex + 1;

        if(nextImageIndex >= self.imageList.length)
        {
            nextImageIndex = 0;
        }
        
        self.selectImageByIndex(nextImageIndex);
    };

    self.selectImageByIndex = function(imageIndex)
    {
        if(self.currentImageIndex != imageIndex && imageIndex >=0 && imageIndex < self.imageList.length)
        {
            var nextImage = self.imageList[imageIndex];
            nextImage.select();

            if(self.currentImageIndex >= 0 && self.currentImageIndex < self.imageList.length)
            {
                var previousImage = self.imageList[self.currentImageIndex];
                previousImage.deselect();
            }

            self.currentImageIndex = imageIndex;

            if(null != self.presentationImage)
            {
                self.presentationImage.display(nextImage.imageSourceURL, nextImage.title, nextImage.description, nextImage.linkURL);
            }
        }
    };

    self.start = function()
    {
        if(!self.isAnimating)
        {
            self.isAnimating = true;

            self.animationTimeout = setTimeout(self.onAnimationTimeout, 1000 * 5);
        }
    };

    self.stop = function()
    {
        clearTimeout(self.animationTimeout);

        self.isAnimating = false;
    };
    
    self.onAnimationTimeout = function()
    {
        self.selectNextImage();
        self.isAnimating = false;
        self.start();
    };

    self.onImageClick = function(eventObj, imageCarouselImage)
    {
        self.stop();

        var imageIndex = self.imageIndexBySourceURL[imageCarouselImage.imageSourceURL];

        self.selectImageByIndex(imageIndex);
    };

    self.onImageOver = function(eventObj, imageCarouselImage)
    {
        var imageIndex = self.imageIndexBySourceURL[imageCarouselImage.imageSourceURL];

        self.selectImageByIndex(imageIndex);
    }

    self.onImageOut = function(eventObj, imageCarouselImage)
    {
        var imageIndex = self.imageIndexBySourceURL[imageCarouselImage.imageSourceURL];

        self.selectImageByIndex(imageIndex);
    }

    self.onMouseOver = function()
    {
        self.stop();
    };

    self.onMouseOut = function()
    {
        self.start();
    }

    if(null != self.imageCarouselElement)
    {
        self.imageCarouselElement.onmouseover = self.onMouseOver;
        self.imageCarouselElement.onmouseout = self.onMouseOut;
        
        //Get images from the nav
        var imageHolders = NAT.getElementsByClassName(self.imageCarouselElement, self.imageCarouselImageHolderCSSClassName);

        if(null != imageHolders && imageHolders.length > 0)
        {
            var imageHolder = imageHolders[0];

            var imageCarouselImageElements = imageHolder.getElementsByTagName("figure");

            if(null != imageCarouselImageElements && imageCarouselImageElements.length > 0)
            {
                var imageCount = (imageCarouselImageElements.length < self.maxImageCount) ? imageCarouselImageElements.length : self.maxImageCount;

                for(var imageIndex = 0; imageIndex < imageCount; imageIndex++)
                {                    
                    var imageCarouselImage = new NAT.Main.ImageCarouselImage(imageCarouselImageElements[imageIndex]);
                    
                    imageCarouselImage.onClickEvent.AddHandler(self.onImageClick);
                    imageCarouselImage.onMouseOverEvent.AddHandler(self.onImageOver);
                    imageCarouselImage.onMouseOutEvent.AddHandler(self.onImageOut);

                    self.imageIndexBySourceURL[imageCarouselImage.imageSourceURL] = self.imageList.length;
                    self.imageList.push(imageCarouselImage);                    
                }
            }
        }

        //Get the main image that will display the selected images
        var presentationImages = NAT.getElementsByClassName(self.imageCarouselElement, self.imageCarouselPresentationImageCSSClassName);

        if(null != presentationImages && presentationImages.length > 0)
        {
            var presentationImageElement = presentationImages[0];

            self.presentationImage = new NAT.Main.ImageCarouselPresentationImage(presentationImageElement);
        }
    }
};



//Image Carousel 
var imageCarouselElement = null;
var imageCarouselElements = NAT.getElementsByClassName(document, "nat_main__imageCarousel");

if(null != imageCarouselElements && imageCarouselElements.length > 0)
{        
    NAT.Page.Controllers.imageCarousel = new NAT.Main.ImageCarousel(imageCarouselElements[0]);
    var imageCarousel = NAT.Page.Controllers.imageCarousel;
    imageCarousel.selectImageByIndex(0);
    imageCarousel.start();
}