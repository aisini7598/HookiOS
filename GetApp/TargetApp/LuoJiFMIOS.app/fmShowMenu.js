var obj = document.getElementsByClassName('article-body')[0];
var objRect = { y: obj.offsetTop, height: obj.scrollHeight };

document.addEventListener('touchend',touch,false);
function touch (event)
{
   var selection = window.getSelection();
   var noSelectionAvailable = selection.rangeCount == 0;
   if (noSelectionAvailable)
  {
    var popViewInfo = {show : 0};
    window.webkit.messageHandlers.callback.postMessage(popViewInfo);
  }
  else
  {
    var range = selection.getRangeAt(0);
    var rects = range.getClientRects();
    if (rects)
    {
      var y = 0;
      var height = 0;
      if (rects.length > 0)
      {
        var addsScrollOffset = document.body.getClientRects()[0].top < 0;
        if (addsScrollOffset)
        {
          y = document.body.scrollTop;
        }

        var yUp = y + rects[0].top;
        var yBoom =y + rects[rects.length-1].top;
        height = rects[rects.length-1].height;
        var popViewInfo = {show : 1, scrollTopy: yUp, scrollBoomy: yBoom ,scrollTopHeight : height , screen_width : screen.width};
        window.webkit.messageHandlers.callback.postMessage(popViewInfo);
      }
    }
    else
    {
      var popViewInfo = {show : 0};
      window.webkit.messageHandlers.callback.postMessage(popViewInfo);
    }
  }
}


document.addEventListener("selectionchange", function(event)
{
  var selection = window.getSelection();
  var noSelectionAvailable = selection.rangeCount == 0;
  if (noSelectionAvailable)
  {
    var popViewInfo = {show : 0};
    window.webkit.messageHandlers.callback.postMessage(popViewInfo);
  }
  else
  {
    var range = selection.getRangeAt(0);var rects = range.getClientRects();
    if (rects)
    {
      var y = 0;
      var height = 0;
      if (rects.length > 0)
      {

        var addsScrollOffset = document.body.getClientRects()[0].top < 0;
        if (addsScrollOffset)
        {
          y = document.body.scrollTop;
        }

        var yUp = y + rects[0].top;

        var yBoom =y + rects[rects.length-1].top;

        height = rects[rects.length-1].height;
                          var popViewInfo = {show : 1, scrollTopy: yUp, scrollBoomy: yBoom ,scrollTopHeight : height , screen_width : screen.width };

        window.webkit.messageHandlers.callback.postMessage(popViewInfo);
      }
    }
    else
    {
            var popViewInfo = {show : 0};
            window.webkit.messageHandlers.callback.postMessage(popViewInfo);
    }
  }
});
