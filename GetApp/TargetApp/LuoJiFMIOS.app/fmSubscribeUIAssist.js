
getYCaretInfo = function()
{
    var caretInfo = { y: 0, height: 0 };
    var selection = window.getSelection();
    var noSelectionAvailable = selection.rangeCount == 0;
    if (noSelectionAvailable)
    {
      window.webkit.messageHandlers.callback.postMessage(caretInfo);
    }
    var y = 0;
    var height = 0;
    var range = selection.getRangeAt(0);

    var needsToWorkAroundNewlineBug = (range.getClientRects().length == 0);
    if (needsToWorkAroundNewlineBug)
    {
      window.webkit.messageHandlers.callback.postMessage(caretInfo);
    }
    else
     {
        if (range.getClientRects) {
            var rects = range.getClientRects();
            if (rects.length > 0)
            {
                var addsScrollOffset = document.body.getClientRects()[0].top < 0;
                if (addsScrollOffset) {
                    y = document.body.scrollTop;
                }
                y += rects[0].top;
                height = rects[0].height;
            }
        }
    }
    caretInfo.y = y;
    caretInfo.height = height;
    window.webkit.messageHandlers.callback.postMessage(caretInfo);
};

getYCaretInfo();
