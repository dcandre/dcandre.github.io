//This will add any missing semantic tags to the DOM, so older versions of IE can render them.
var missingTags = ["header", "section", "nav", "footer", "figure", "figcaption", "article", "aside"];

for(var tagIndex = 0; tagIndex < missingTags.length; tagIndex++)
{
    document.createElement(missingTags[tagIndex]);
}

