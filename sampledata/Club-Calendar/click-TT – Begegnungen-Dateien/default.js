/* check or unckeck all checkboxes in the SAME form than checkbox AND the name of which start with the ckecboxes name. */
function checkAllSiblings(checkbox) {
  var myForm = checkbox.form;
  var myLength = checkbox.name.length;
  for (var i=0; i < myForm.length; i++) {
    var elem = myForm[i];
    if (elem.type == 'checkbox' && elem.name.substring(0, myLength) == checkbox.name) elem.checked = checkbox.checked;
  }
}

/* validiere ob maximale anzahl an zeichen fuer z.b. textarea erreicht */
function validateMaxlength(textObj, maxlength) { 
	if (textObj.value.length > maxlength) {
		alert("Maximale Anzahl an Zeichen (" + maxlength + ") erreicht!");
		textObj.value = textObj.value.substring(0,maxlength);
	}
}

/* email encoding */
function encodeEmail(topLevelDomain, m1, domain, m2) {
	var prefix = 'ma' + 'il' + 'to';
	var path = 'hr' + 'ef' + '=';
	var delimiter1 = '&#'+'64;';
	var delimiter2 = '&#'+'46;';
		
	if(m2 != '') {
		var concatString = m1+delimiter2+m2+delimiter1+domain+delimiter2+topLevelDomain;
	} else {
		var concatString = m1+delimiter1+domain+delimiter2+topLevelDomain;
	}
	document.write('<a '+path+'"'+prefix+':'+concatString+'">'+concatString+'</a>');
}

function checkboxWithRadioBehavior (checkbox) {
 	var form = checkbox.form;
  	for (var i=0; i < form.length; i++) {
    	var elem = form[i];
    	if (elem.type == 'checkbox' && elem.name == checkbox.name && elem != checkbox) elem.checked = false;
  	}
}

function disableElement(element) {
	if (element) {
		element.setAttribute('disabled','disabled');
		
		if (element.children) {
			for (var i = 0; i < element.children.length; i++) {
				disableElement(element.children[i]);
			}
		}
	}
}


/* banderole */
var timerlen = 5;
var slideAniLen = 500;
var timerID=new Array();
var startTime=new Array();
var obj=new Array();
var endWidth=new Array();
var moving=new Array();
var dir=new Array();
function slidedown(objname){
  if(moving[objname])
  return;
    if(document.getElementById(objname).style.display!="none")
      return;
      moving[objname]=true;
      dir[objname]="down";
      startslide(objname);
      document.getElementById('banderole_start_img').style.display = "none";
}
function slideup(objname){
  if(moving[objname])
    return;
  if(document.getElementById(objname).style.display=="none")
    return;
  moving[objname]=true;
  dir[objname]="up";
  window.setTimeout("startslide('formular_slide')", 1000);


}
function startslide(objname){
  obj[objname]=document.getElementById(objname);
  endWidth[objname]=window.document.body.clientWidth;
  startTime[objname]=(new Date()).getTime();
  if(dir[objname]=="down"){
    obj[objname].style.width="1px";
}
obj[objname].style.display = "block";
timerID[objname] = setInterval('slidetick(\'' + objname + '\');',timerlen);
}
function slidetick(objname){
  var elapsed=(new Date()).getTime()-startTime[objname];
  if (elapsed>slideAniLen)
  endSlide(objname)
else{
  var d=Math.round(elapsed/slideAniLen*endWidth[objname]);
  if(dir[objname]=="up")
  d=endWidth[objname]-d;
  obj[objname].style.width=d+"px";
}
return;
}
function endSlide(objname){	
  clearInterval(timerID[objname]);
  
  if(dir[objname]=="up")
  document.getElementById('banderole_start_img').style.display = "block";
  
  if(dir[objname]=="up")
  obj[objname].style.display="none";
  obj[objname].style.width=endWidth[objname]+"px";
  delete(moving[objname]);
  delete(timerID[objname]);
  delete(startTime[objname]);
  delete(endWidth[objname]);
  delete(obj[objname]);
  delete(dir[objname]);
  return;
}

