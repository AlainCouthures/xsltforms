/* Global vars */
var oFCKeditor1 = null;
var model = null;
    
function associateRTE(textareaID, xformsModel) {
  if (oFCKeditor1 == null) {
    oFCKeditor1 = new FCKeditor(textareaID) ;
    model = xformsModel
    oFCKeditor1.BasePath= 'FCKeditor/' ;
    oFCKeditor1.Config['ToolbarStartExpanded'] = true ;
    oFCKeditor1.ToolbarSet	= 'Basic' ;
    oFCKeditor1.ReplaceTextarea() ;
 }
}

function closeTextDiv() {
  var textDiv = document.getElementById('floatingText');
  textDiv.style.display='none';
}

function saveTextToNode() {
  var editor = FCKeditorAPI.GetInstance('testA');
  var parser = new DOMParser();
  var xhtml = '<body xmlns="http://www.w3.org/1999/xhtml">' + 
              editor.GetXHTML(true) + "</body>";
  //alert("getXTHML="+xhtml);
  
  var htmlNode = parser.parseFromString(xhtml, "text/xml"); 

  // First clear the contents of the boundNode
  var boundNode = editor.xformsNode.getBoundNode();
  while (boundNode.firstChild != null){
    boundNode.removeChild(boundNode.firstChild);
  }
  
  // Now repopulate the contents of boundNode. Note, we need
  // to dereference the *text* node that is returned.
  for (var i=0; i<htmlNode.firstChild.childNodes.length; i++) {
  	var n=htmlNode.firstChild.childNodes[i];
    boundNode.appendChild(boundNode.ownerDocument.importNode(n, true)); 
  }

  model.rebuild();
  model.refresh();  
  closeTextDiv();
}
