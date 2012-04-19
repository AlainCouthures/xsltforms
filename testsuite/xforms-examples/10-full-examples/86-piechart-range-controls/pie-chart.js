
/* PieChart */

var kXMLSelText = "./"+"/text()";
var gbIsGecko=true;

function xmlSelectSingleNode(oNode, sPat)
{
	if( !gbIsGecko ) {
		return oNode.selectSingleNode(sPat);
	} else {
		if( !window.$XE ) $XE=new XPathEvaluator();
		var oXPathResult = $XE.evaluate(sPat, oNode, $XE.createNSResolver(oNode), 9 /*FIRST_ORDERED_NODE_TYPE*/, null);

		return oXPathResult.singleNodeValue;
	}
}

function xmlSelectNodes(oNode, sPat)
{
	if( !gbIsGecko ) {
		return oNode.selectNodes(sPat);
	} else {
		if( !window.$XE ) $XE=new XPathEvaluator();
		var oXPathResult = $XE.evaluate(sPat, oNode, $XE.createNSResolver(oNode), 7 /*ORDERED_NODE_SNAPSHOT_TYPE*/, null);
		var aNodes = [];

		for (var i = 0; i < oXPathResult.snapshotLength; i++) {
			aNodes[i] = oXPathResult.snapshotItem(i);
		}

		return aNodes;
	}
}

function xmlGetText(oNode,sJoinChar)
{
	if( !oNode ) return '';
	if( !gbIsGecko && !sJoinChar ) {
		return oNode.text;
	} else {
		var a0=xmlSelectNodes(oNode, kXMLSelText); //"descendant::text()"  IE can't handle "descendant" format
		if( a0 ){
			for( var i=0,n=0,a1=[]; i<a0.length; i++ ){
				if('\n'!=a0[i].nodeValue) a1[n++]=a0[i].nodeValue;
			}
			return a1.join(sJoinChar?sJoinChar:'');
		}
		return '';
	}
}

// Make pie slices array global so we can access in mouse event handlers
var ps;

function showChart(id)
{
	var pi=3.14159;
	var twoPi=2*pi;
	var nFirstSliceArg=1; //0-based offset
	var i;
	// Colors for slices (will keep alternating if more slices)
	var aColors=["red","orange","yellow","green"];
	var aLabels=["Red","Orange","Yellow","Green"];

	var oChart = document.getElementById(id);
	var nWidth = oChart.offsetHeight ? Math.min(oChart.offsetWidth,oChart.offsetHeight) : oChart.offsetWidth;
	var nHeight = nWidth;
	var r=(nWidth*.9)/2; // Don't take up full width (leave room for drop shadow)
	var rOffs=r*.027; // Offset the dropshadow circle
	var cx=nWidth/2,cy=nHeight/2;
	var x,y;

	var aArgs;
	var bNoCircle=false;
	if(arguments.length==1)
	{
		// Calculate pie slice percentages
		var modelElem = document.getElementById("theModel");
		var instDoc = modelElem.getInstanceDocument("theData");
		modelElem.recalculate();
		var oS2L1 = xmlSelectSingleNode(instDoc.documentElement,"/charts/piechart/wedge01");
		var nS2L1 = +xmlGetText(oS2L1);
		var oS2L2 = xmlSelectSingleNode(instDoc.documentElement,"/charts/piechart/wedge02");
		var nS2L2 = +xmlGetText(oS2L2);
		var oS2L3 = xmlSelectSingleNode(instDoc.documentElement,"/charts/piechart/wedge03");
		var nS2L3 = +xmlGetText(oS2L3);
		var oS2L4 = xmlSelectSingleNode(instDoc.documentElement,"/charts/piechart/wedge04");
		var nS2L4 = +xmlGetText(oS2L4);
		
		// The code is setup to pass in the pie fractions, build similar array
		aArgs=[];
		aArgs[0]=id;
		aArgs[1]=nS2L4?nS2L1/nS2L4:0;
		aArgs[2]=nS2L4?nS2L2/nS2L4:0;
		aArgs[3]=nS2L4?nS2L3/nS2L4:0;
		if(!nS2L4) bNoCircle=true;
	}
	else
		aArgs = arguments;

	var a=[],n=0;
	a[n++]='<svg:svg xmlns="http://www.w3.org/2000/svg" id="'+ id +'Svg" width="'+nWidth+'" height="'+(nHeight+20)+'">';
	a[n++]='<defs>';
	a[n++]='<filter id="dropshadow" width="120%" height="120%">';
	a[n++]='<feGaussianBlur stdDeviation="4"/>';
	a[n++]='</filter>';
	a[n++]='</defs>';
	a[n++]='<circle cx="'+(cx+rOffs)+'" cy="'+(cy+rOffs)+'" r="'+r+'" style="fill:black;fill-opacity:0.6;stroke:none;filter:url(#dropshadow)"/>';
	
	// calc slice percentages and add a last slice for remainder of pie if necessary
	var nTotal=0;
	ps=[];
	for(i=nFirstSliceArg;i<aArgs.length;i++)
	{
		ps[ps.length]={percentage:aArgs[i],cumPercent:aArgs[i] + nTotal};
		nTotal+=aArgs[i];
	}
	if(!bNoCircle && nTotal<1)
		ps[ps.length]={percentage:1-nTotal,cumPercent:1};

	// calc critical angles
	var nFullCircle=-1;
	for(i=0;i<ps.length;i++)
	{
		ps[i].angle = twoPi*ps[i].percentage;
		ps[i].cumAngle = twoPi*ps[i].cumPercent;
		if(ps[i].percentage==1)
			nFullCircle=i;
		ps[i].color = aColors[i%aColors.length];
		ps[i].label = aLabels[i%aLabels.length];
	}

	// calc signficant points on circle
	var pts=[];
	pts[0] = {x:cx-r,y:cy,nLA:0};
	for(i=0;i<ps.length;i++)
	{
		// nLA (LongArc)
		pts[i+1] = {x:cx-(Math.cos(ps[i].cumAngle)*r),y:cy-(Math.sin(ps[i].cumAngle)*r),nLA:ps[i].angle<pi?0:1,bEmpty:ps[i].percentage==0};
	}

	if(nFullCircle!=-1)
	{
		a[n++]='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="fill:'+ps[nFullCircle].color+';stroke:black;stroke-width:2" onmouseover="showInfo(true,'+nFullCircle+')" onmouseout="showInfo(false)"/>';
//		x=cx-20,y=cy-10;
//		a[n++]='<text x="'+x+'" y="'+y+'" class="chart-label">'+aLabels[nFullCircle%aLabels.length]+'</text>';
	}
	else
	{
		// draw slice from each point we identified in circle
		for(i=0;i<pts.length-1;i++)
		{
			if(!pts[i+1].bEmpty) {
				// alert(pts[i].x + ',' + pts[i].y + ' to ' + pts[i+1].x + ',' + pts[i+1].y);
				// For each slice starting at center, draw line to first point on circle, draw arc to second point and line back to center
				a[n++]='<path id="slice1" d="M'+cx+','+cy+' L'+pts[i].x+','+pts[i].y+' A'+r+','+r+' 0 '+pts[i+1].nLA+',1 '+pts[i+1].x+','+pts[i+1].y+' Z" style="fill:'+ps[i].color+'; stroke:black; stroke-width:2" onmouseover="showInfo(true,'+i+')" onmouseout="showInfo(false)"/>';
			}
		}
	}

	// draw labels
	a[n++]='<g id="legend">';
	x=0;
	y=cy+r+5;
	var nRowCnt=0;
	for(i=0;i<pts.length-1;i++)
	{
		if(!pts[i+1].bEmpty||nFullCircle==i) {
			a[n++]='<rect x="'+x+'" y="'+y+'" width="15" height="15" style="stroke-linejoin:mitre;stroke-width:1;stroke:black;fill:'+aColors[i%aColors.length]+'"/>';
			x+=17;
			a[n++]='<text x="'+x+'" y="'+(y+15)+'" style="font-family:verdana,arial,sans-serif;font-size:10pt;fill:black:stroke:none">'+aLabels[i%aLabels.length]+'</text>';
			x+=50;
		}
	}
	a[n++]='</g>';

	a[n++]='<text x="'+cx+'" y="'+(y+15)+'" width="'+nWidth+'" id="infotext" style="font-size:13;font-weight:bold;text-anchor:middle;visibility:hidden">some text</text>';

	a[n++]='</svg:svg>';

	oChart.innerHTML = a.join();
}

function showInfo(bShow,nSlice)
{
	var oLegend = document.getElementById("legend");
	var oInfo = document.getElementById("infotext");
	oLegend.style.visibility = bShow?"hidden":"visible";
	if(bShow) {
		var sText = ps[nSlice].label + " : (" + Math.round(ps[nSlice].percentage * 10000) / 100 + "%)";
		oInfo.replaceChild(document.createTextNode(sText), oInfo.firstChild)
	}
	oInfo.style.visibility = bShow?"visible":"hidden";
}

function updateChart(id)
{
	var oChartSvg = document.getElementById(id+'Svg');
	if( oChartSvg )
		showChart(id);
}