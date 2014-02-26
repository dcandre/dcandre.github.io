NAT.lteie9 = {};

NAT.lteie9.InputTextPlaceholder = function(placeholderText, inputTextElement)
{
    var self = this;

    self.placeHolderText = placeholderText;
    self.inputTextElement = inputTextElement;
    
    self.onFocus = function()
    {
        self.inputTextElement.value = "";
    };

    self.onBlur = function()
    {
        if(NAT.isStringNullOrEmpty(self.inputTextElement.value))
        {
            self.inputTextElement.value = self.placeHolderText;
        }
    };
    
    if(null != self.inputTextElement)
    {
        self.inputTextElement.onblur = self.onBlur;
        self.inputTextElement.onfocus = self.onFocus;

        self.inputTextElement.value = self.placeHolderText;
    }
};

//Add placeholder functionality to all input elements on the page
NAT.Page.Controllers.InputTextPlaceHoldersLTEIE9 = new Array();

var inputElements = $(document).find("input[placeholder]").each(function( index ) 
{    
    NAT.Page.Controllers.InputTextPlaceHoldersLTEIE9.push( new NAT.lteie9.InputTextPlaceholder( $(this).attr("placeholder"), this ) );

});