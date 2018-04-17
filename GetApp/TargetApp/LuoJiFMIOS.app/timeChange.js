function timeChange(text)
{
     fmTimeChange(document.body,text);
}
function fmTimeChange(element,text)
{
    if (element) {
        if (element.nodeType == 1) {
            if (element.getAttribute("class") == "time")
            {
                element.innerHTML = text;
                return true;
            }
            else
            {
                var normalize = false;
                for (var i=element.childNodes.length-1; i>=0; i--)
                {
                    if (fmTimeChange(element.childNodes[i],text))
                    {
                        normalize = true;
                    }
                }
                if (normalize)
                {
                    element.normalize();
                }
            }
        }
    }
}
