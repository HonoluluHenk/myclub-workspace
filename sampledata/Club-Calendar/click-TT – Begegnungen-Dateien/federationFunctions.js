function fedBanner100() { 
  if(fedBannerList100.length > 0) { 
    //place your code here... 
    //f.ex.: 
    document.write('<li class="banner">' + fedBannerList100[new Date().getMinutes() % fedBannerList100.length] + '</li>');
  }
}

function arrayIsUndefined(arrName, region, contestType, group) { 
   try { 
       return typeof eval(arrName)[region][contestType][group] == "undefined";   } catch(e) { 
      return true; 
   } 
} 

function arrayIsUndefinedContestType(arrName, region, contestType) { 
   try { 
       return typeof eval(arrName)[region][contestType] == "undefined";   } catch(e) { 
      return true; 
   } 
} 

function arrayIsUndefinedChmpBanner(arrName, region, youngOld, league, group) { 
   try { 
       return typeof eval(arrName)[region][youngOld][league][group] == "undefined";   } catch(e) { 
      return true; 
   } 
} 

function splitRegion(region)	{ 
    var splitRegion = region.split("."); 
	splitRegion.pop(); 
	return splitRegion.join(".") 
} 

