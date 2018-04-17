fmDoubleCilck = function(x,y)
{
    var element = document.elementFromPoint(x, y);
    var caretInfo = { isShow:false, text: 0 };

    if(element)
    {
        if(element.className == 'comments-user-post')
        {
            caretInfo.isShow = true;
            caretInfo.text = element.textContent;
        }
        else
        {
            caretInfo.isShow = false;
            caretInfo.text = '';
        }
    }
    else
    {
        caretInfo.isShow = false;
        caretInfo.text = '';
    }
 
    return caretInfo;
};
