var fm_js_editor = {};

fm_js_editor.currentEditingLink;
fm_js_editor.currentEditingImage;
fm_js_editor.currentSelection;
fm_js_editor.contentHeight = 244;
fm_js_editor.updateScrollOffset = false;
fm_js_editor.isDragging = false;
fm_js_editor.caretInfo = { y: 0, height: 0 };
fm_js_editor.currentCaretInfo = { y: 0, height: 0 };
fm_js_editor.editableFields = {};
fm_js_editor.savedSelection;
fm_js_editor.savedFocusedField = null;
// Log to Obj_c
fm_js_editor.log = function (e)
{
    if(window.webkit.messageHandlers && window.webkit.messageHandlers.log)
    {
        window.webkit.messageHandlers.log.postMessage(e);
    }
}
fm_js_editor.init = function()
{
  $('#editor_content').on('touchend',function(e)
  {
    fm_js_editor.enabledEditingItems(e);
  });
  $(document).on('selectionchange',function(e)
  {
    fm_js_editor.viewScroll();
    fm_js_editor.enabledEditingItems(e);
  });

  $(window).on('scroll',function(e){
  });
  $(window).on('touchmove',function(e){
    fm_js_editor.isDragging = true;
    fm_js_editor.updateScrollOffset = true;
    fm_js_editor.enabledEditingItems(e);
  });
  $(window).on('touchstart',function(e){
    fm_js_editor.isDragging = false;
  });
  $(window).on('touchend',function(e)
  {
    if (!fm_js_editor.isDragging && (e.target.id == "editor_footer"||e.target.nodeName.toLowerCase() == "html" ||e.target.nodeName.toLowerCase() == "body" ))
    {
      fm_js_editor.focusEditor();
    }

  });
    $('[contenteditable]').on('paste',function(e)
    {
                              e.preventDefault();
                              var clipboardData = (e.originalEvent || e).clipboardData;
                              var url = clipboardData.getData('text/uri-list');
                              var plainText = clipboardData.getData('text/plain');
                              if (url.length > 0) {
                              document.execCommand('insertText', false, url);
                              } else if (plainText.length > 0) {
                              document.execCommand('insertText', false, plainText);
                              } else {
                               fm_js_editor.log("callback-paste");
                              }


    });

}



fm_js_editor.editorContentText = function()
{
  return $('#editor_content').text();
}


fm_js_editor.setHTML = function(html)
{
    var editor = $('#editor_content')
    editor.html(html);
}

fm_js_editor.getHTML = function ()
{
  var img = $('img');
  if (img.length != 0)
  {
    $('img').removeClass('img_focus');
    $('img').each(function(index, e){
      var image = $(this);
      var fm_class = image.attr('class');
      if (typeof(fm_class) != 'undefined')
      {
        if (fm_class == '')
        {
          image.removeAttr('class');
        }
      }
    });
  }
  var blockquote = $('blockquote');
  if (blockquote.length != 0)
  {
    blockquote.each(function ()
    {
      var b = $(this);
      if (b.css('border').indexOf('none') != -1)
      {
        b.css({'border': ''});
      }
      if (b.css('padding').indexOf('0px') != -1)
      {
        b.css({'padding': ''});
      }
    });
  }
  var h = document.getElementById('editor_content').innerHTML;
  return h;
}

fm_js_editor.insertHTML = function(html) {
    document.execCommand('insertHTML', false, html);
    fm_js_editor.enabledEditingItems();
}


fm_js_editor.closerParentNode = function() {
    var parentNode = null;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0).cloneRange();

    var currentNode = range.commonAncestorContainer;

    while (currentNode) {
        if (currentNode.nodeType == document.ELEMENT_NODE) {
            parentNode = currentNode;

            break;
        }

        currentNode = currentNode.parentElement;
    }

    return parentNode;
};

fm_js_editor.closerParentNodeWithName = function(nodeName) {

    var parentNode = null;
    var selection = window.getSelection();
    if (selection.rangeCount < 1)
    {
        return null;
    }
    var range = selection.getRangeAt(0).cloneRange();
    var referenceNode = range.commonAncestorContainer;

    return fm_js_editor.closerParentNodeWithNameRelativeToNode(nodeName, referenceNode);
};

fm_js_editor.closerParentNodeWithNameRelativeToNode = function(nodeName, referenceNode) {

    nodeName = nodeName.toUpperCase();

    var parentNode = null;
    var currentNode = referenceNode;

    while (currentNode) {

        if (currentNode.nodeName == document.body.nodeName) {
            break;
        }

        if (currentNode.nodeName == nodeName
            && currentNode.nodeType == document.ELEMENT_NODE) {
            parentNode = currentNode;

            break;
        }

        currentNode = currentNode.parentElement;
    }

    return parentNode;
};

fm_js_editor.getCaretYPosition = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var span = document.createElement("span");
     span.appendChild( document.createTextNode("\u200b") );
    range.insertNode(span);
    var y = span.offsetTop;
    var spanParent = span.parentNode;
    spanParent.removeChild(span);
    spanParent.normalize();
    return y;
}

fm_js_editor.getYCaretInfo = function()
{
    var selection = window.getSelection();
    var noSelectionAvailable = selection.rangeCount == 0;

    if (noSelectionAvailable)
    {
        return null;
    }

    var y = 0;
    var height = 0;
    var range = selection.getRangeAt(0);
    var needsToWorkAroundNewlineBug = (range.getClientRects().length == 0);

    if (needsToWorkAroundNewlineBug)
    {
        var closerParentNode = fm_js_editor.closerParentNode();
        var closerDiv = fm_js_editor.closerParentNodeWithName('div');

        var fontSize = $(closerParentNode).css('font-size');
        var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5);

        y = this.getCaretYPosition();
        height = lineHeight;
    }
    else
     {
        if (range.getClientRects) {
            var rects = range.getClientRects();
            if (rects.length > 0) {

                var addsScrollOffset = document.body.getClientRects()[0].top < 0;

                if (addsScrollOffset) {
                    y = document.body.scrollTop;
                }

                y += rects[0].top;
                height = rects[0].height;
            }
        }
    }



    this.caretInfo.y = y;
    this.caretInfo.height = height;
    return this.caretInfo;
};

fm_js_editor.viewScroll = function()
{
  fm_js_editor.getYCaretInfo();
  if (this.caretInfo.y !=  this.currentCaretInfo.y || this.caretInfo.height != this.currentCaretInfo.height)
  {
     this.currentCaretInfo.y = this.caretInfo.y;
     this.currentCaretInfo.height =  this.caretInfo.height;
     window.webkit.messageHandlers.scrollTo.postMessage(this.currentCaretInfo);
  }
}

fm_js_editor.setPlaceholder = function (placeholder)
{
  var editor = $('#editor_content');
    editor.attr("placeholder",placeholder);
    $('#editor_content').focusout();
}

fm_js_editor.getSelectedNode = function ()
{
  var node;
  var selection;
  if (window.getSelection)
  {
    selection = getSelection();
    node = selection.anchorNode;
  }
  if (!node && document.selection)
  {
    selection = document.selection;
    var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange()
    node = range.commonAncestorContainer ? range.commonAncestorContainer :
        range.parentElement ? range.parentElement() : range.item(0);
  }
  if(node)
  {
    return (node.nodeName == '#text' ? node.parentNode : node)
  }
}

fm_js_editor.isCommandEnabled = function(commandID)
{
  return document.queryCommandState(commandID);
}

fm_js_editor.enabledEditingItems =  function(e)
{
  var items = [];
  if (fm_js_editor.isCommandEnabled('bold'))
  {
    items.push('bold');
  }
  if (fm_js_editor.isCommandEnabled('italic'))
  {
    items.push('italic');
  }
  if (fm_js_editor.isCommandEnabled('subscript'))
  {
    items.push('subscript');
  }
  if (fm_js_editor.isCommandEnabled('superscript'))
  {
    items.push('superscript');
  }
  if (fm_js_editor.isCommandEnabled('strikeThrough'))
  {
    items.push('strikeThrough');
  }
  if (fm_js_editor.isCommandEnabled('underline'))
  {
    items.push('underline');
  }
  if (fm_js_editor.isCommandEnabled('insertOrderedList'))
  {
    items.push('orderedList');
  }
  if (fm_js_editor.isCommandEnabled('insertUnorderedList'))
  {
    items.push('unorderedList');
  }
  if (fm_js_editor.isCommandEnabled('justifyCenter'))
  {
    items.push('justifyCenter');
  }
  if (fm_js_editor.isCommandEnabled('justifyFull'))
  {
    items.push('justifyFull');
  }
  if (fm_js_editor.isCommandEnabled('justifyLeft'))
  {
    items.push('justifyLeft');
  }
  if (fm_js_editor.isCommandEnabled('justifyRight'))
  {
    items.push('justifyRight');
  }
  if (fm_js_editor.isCommandEnabled('insertHorizontalRule'))
  {
    items.push('horizontalRule');
  }



  if (typeof(e) != 'undefined')
  {
    var selectedNode = fm_js_editor.getSelectedNode();
    var t = $(selectedNode);
    var nodeName = e.target.nodeName.toLowerCase();

    var bgColor = t.css('backgroundColor');
    if (bgColor)
    {
      if (bgColor.length != 0 && bgColor != 'rgba(0, 0, 0, 0)' && bgColor != 'rgb(0, 0, 0)' && bgColor != 'transparent')
      {
        items.push('backgroundColor');
      }
    }

    var textColor = t.css('color');
    if (textColor)
    {
      if (textColor.length != 0 && textColor != 'rgba(0, 0, 0, 0)' && textColor != 'rgb(0, 0, 0)' && textColor != 'transparent')
      {
        items.push('textColor');
      }
    }

    var font = t.css('font-family');
    if (font)
    {
      if (font.length != 0 && font != 'Arial, Helvetica, sans-serif')
      {
        items.push('fonts');
      }
    }

    var nodeName = e.target.nodeName.toLowerCase();
    if (nodeName == 'a')
    {
      fm_js_editor.currentEditingLink = t;
      items.push('link:'+t.attr('href'));
      if (t.attr('title') !== undefined)
      {
        items.push('link-title:'+t.attr('title'));
      }
    }
    else
    {
      fm_js_editor.currentEditingLink = null;
    }

    if (nodeName == 'blockquote')
    {
      items.push('indent');
    }

    if (nodeName == 'img')
    {
      fm_js_editor.currentEditingImage = t;
      items.push('image:' + t.attr('src'));
      if (t.attr('alt') !== undefined)
      {
        items.push('image-alt:' + t.attr('alt'));
      }
    }
    else
    {
      fm_js_editor.currentEditingImage = null;
    }
  }
  if (window.webkit.messageHandlers)
  {
    window.webkit.messageHandlers.callback.postMessage(items);
  }
}


fm_js_editor.focusEditor = function ()
{
  var editor = $('#editor_content');
  var range = document.createRange();
  range.selectNodeContents(editor.get(0));
  range.collapse(false);
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus();
}

fm_js_editor.blurEditor = function ()
{
  $('#editor_content').blur();
}

fm_js_editor.setCustomCss = function (customCSS)
{
  document.getElementsByTagName('style')[0].innerHTML = customCSS;
}

fm_js_editor.closerParentNodeStartingAtNode = function(nodeName, startingNode) {

    nodeName = nodeName.toLowerCase();

    var parentNode = null;
    var currentNode = startingNode.parentElement;

    while (currentNode) {

        if (currentNode.nodeName == document.body.nodeName) {
            break;
        }

        if (currentNode.nodeName.toLowerCase() == nodeName
            && currentNode.nodeType == document.ELEMENT_NODE) {
            parentNode = currentNode;

            break;
        }

        currentNode = currentNode.parentElement;
    }

    return parentNode;
};



fm_js_editor.isSelection = function()
{
    var selection = window.getSelection();
    return selection.rangeCount;
}



fm_js_editor.backupRange = function()
{
   var selection = window.getSelection();
   var range = selection.getRangeAt(0);
   this.currentSelection = {"startContainer": range.startContainer, "startOffset":range.startOffset,"endContainer":range.endContainer, "endOffset":range.endOffset};
}
fm_js_editor.restoreRange = function(){
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(this.currentSelection.startContainer, this.currentSelection.startOffset);
    range.setEnd(this.currentSelection.endContainer, this.currentSelection.endOffset);
    selection.addRange(range);
}



fm_js_editor.undo = function()
{
  document.execCommand('undo', false, null);
  fm_js_editor.enabledEditingItems();
}

fm_js_editor.redo = function() {
    document.execCommand('redo', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setOrderedList = function() {
    document.execCommand('insertOrderedList', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setUnorderedList = function() {
    document.execCommand('insertUnorderedList', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setJustifyFull = function() {
    document.execCommand('justifyFull', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setIndent = function() {
    document.execCommand('indent', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setOutdent = function() {
    document.execCommand('outdent', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setBold = function() {
    document.execCommand('bold', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setItalic = function() {
    document.execCommand('italic', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setSubscript = function() {
    document.execCommand('subscript', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setSuperscript = function() {
    document.execCommand('superscript', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setUnderline = function() {
    document.execCommand('underline', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.removeFormating = function() {
    document.execCommand('removeFormat', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setHorizontalRule = function() {
    document.execCommand('insertHorizontalRule', false, null);
    fm_js_editor.enabledEditingItems();
}

fm_js_editor.setFontFamily = function(fontFamily)
{
	fm_js_editor.restoreRange();
	document.execCommand("styleWithCSS", null, true);
	document.execCommand("fontName", false, fontFamily);
	document.execCommand("styleWithCSS", null, false);
	fm_js_editor.enabledEditingItems();
}

fm_js_editor.insertImageBase64String = function(imageBase64String,idKey)
{
   fm_js_editor.restoreRange();
   var html = '<img src="data:image/jpeg;base64,'+imageBase64String+'" class= "imageReplace" id = "'+idKey+'" /><br/>';
   fm_js_editor.insertHTML(html);
   fm_js_editor.enabledEditingItems();

   $(document.getElementById(idKey)).bind('DOMNodeRemoved',function(e)
   {
        window.webkit.messageHandlers.deleteImage.postMessage(idKey);
   }
 );
}

fm_js_editor.imageBase64StringToUrl = function(url,idKey)
{
    if( document.getElementById(idKey))
    {
        document.getElementById(idKey).src=url;
    }
}

fm_js_editor.isImage = function(idKey)
{
   if( document.getElementById(idKey))
   {
       return true;
   }
   else
   {
       return false;
   }
}


fm_js_editor.insertImage = function(url,idkey)
{
    fm_js_editor.restoreRange();
    var html = '<img src="'+url+'"/>';
    fm_js_editor.insertHTML(html);
    fm_js_editor.enabledEditingItems();
}


fm_js_editor.alltext = function()
{
    var element = document.getElementById('editor_content');
    return element.textContent.trim();
}
