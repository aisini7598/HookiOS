function fmPstr(element)
{
    var pText = element.innerHTML;
    var pLength =  element.childNodes.length
    if(pLength > 1)
    {
        element.innerHTML=element.innerHTML.replace(/<\/?.*?>/g,'');
    }
    return pText;
}
function fmSearchString(element,keyword,parent)
{
    if (element)
    {
        if (element.nodeType == 3)
        {
            while (true) {
                var value = element.nodeValue;
                var idx = value.toLowerCase().indexOf(keyword);
                if (idx < 0 )
                {
                    return false;
                }
                else
                {
                    if(parent.nodeName.toLowerCase() != 'u')
                    {
                        if(parent.nodeName.toLowerCase() == 'span')
                        {
                            parent.style.backgroundColor= "#FFEACE";
                             return getToPosittion(span);
                        }
                        else
                        {
                            var span = document.createElement("span");
                            var text = document.createTextNode(value.substr(idx,keyword.length));
                            span.appendChild(text);
                            span.setAttribute("class","SearchString");
                            span.style.backgroundColor= "#FFEACE";
                            text = document.createTextNode(value.substr(idx+keyword.length));
                            element.deleteData(idx, value.length - idx);
                            var next = element.nextSibling;
                            element.parentNode.insertBefore(span, next);
                            element.parentNode.insertBefore(text, next);
                            element = text;
                             return getToPosittion(span);
                        }
                    }
                    else
                    {
                        return  getToPosittion(parent);
                    }
                }
            }
        }
        else if (element.nodeType == 1)
        {
            if (element.style.display != "none" && element.nodeName.toLowerCase() != 'select')
            {
                if(element.nodeName.toLowerCase() != 'u')
                {
                    for (var i = 0 ; i < element.childNodes.length ; i++)
                    {
                        var top =  fmSearchString(element.childNodes[i],keyword,element);
                        if(top)
                        {
                            return top;
                        }
                    }
                    if(element.nodeName.toLowerCase() == 'p')
                    {
                        var pLength =  element.childNodes.length
                        if(pLength > 1)
                        {
                            var pText =  fmPstr(element);
                            var top =  fmSearchString(element.childNodes[0],keyword,element);
                            if(top)
                            {
                                return top;
                            }
                            else
                            {
                                element.innerHTML = pText;
                            }
                            
                        }
                    }
                     return 0;
                }
                else
                {
                    for (var i = 0 ; i < element.childNodes.length ; i++)
                    {
                        var top =  fmSearchString(element.childNodes[i],keyword,element);
                        if(top)
                        {
                            return top;
                        }
                    }
                     return 0;
                }
            }
        }
    }
}


function getToPosittion(e)
{
    var offset=e.offsetTop;
    if(e.offsetParent != null)
    {
        offset += getToPosittion(e.offsetParent);
    }
    
    return offset;
}

function searchString(keyword)
{
    recovery();
    if(keyword)
    {
        return fmSearchString(document.body, keyword.toLowerCase(),false);
    }
}

function supplement(keyword)
{
    
    if(keyword)
    {
        return fmSearchString(document.body, keyword.toLowerCase(),false);
    }
}

function fmRecovery(element)
{
    if (element) {
        if (element.nodeType == 1) {
            if (element.getAttribute("class") == "SearchString") {
                var text = element.removeChild(element.firstChild);
                element.parentNode.insertBefore(text,element);
                element.parentNode.removeChild(element);
                return true;
            } else {
                var normalize = false;
                for (var i=element.childNodes.length-1; i>=0; i--) {
                    if (fmRecovery(element.childNodes[i])) {
                        normalize = true;
                    }
                }
                if (normalize) {
                    element.normalize();
                }
            }
        }
    }
    return false;
}
function recovery()
{
    fmRecovery(document.body);
}
