var FOG=FOG||{};  //FOG = Friend of Gamers// 
  FOG.OPTS = function(){
      var _set=function(key,val){ 
        var _ind = FOG.OPTS.LIST.findIndex(x => x.key == key); 
        var _obj = {key:key,val:val};
        if (_ind<0){FOG.OPTS.LIST.push(_obj);}
        else{FOG.OPTS.LIST.splice(_ind, 1, _obj);}
      };
      var _get=function(key){
        var getval = FOG.OPTS.LIST.find(x => x.key == key);
        try{return getval.val;} catch(ex){
          FOG.CORE.LOG("unassigned VAL,",key);
          return key;
        }
      };
      var _list=[], _chars=[];      
          
      return {
        SET:_set,GET:_get,LIST:_list,CHAR:_chars
      };
  }();
  FOG.CORE = function(){
    var _log = function(msg,opts){
      if (FOG.OPTS.GET("debug")!=false){
        console.log(msg,opts);
      }
    }
    var _data = function(){
      var _svgload = function(url){
        var xhr = new XMLHttpRequest();
        // not needed if your server delivers SVG with correct MIME type
        xhr.overrideMimeType("image/svg+xml");
        xhr.open("GET",url,false);
        xhr.send("");
        return xhr.responseXML.documentElement; 
      }
      var _jsonload = function(url){
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open("GET",url,false);
        xhr.send("");
        var full = xhr.responseText;
        return JSON.parse(full);
      }
      var _store=function(key,val){
        localStorage.setItem(key,JSON.stringify(val));
      };
      var _retrieve=function(key){
        return JSON.parse(localStorage.getItem(key));
      };
      var _delete=function(key){
        var deleted = FOG.CORE.DATA.GET(key);
        localStorage.removeItem(key);
        return deleted;
      }
      var _clear=function(){localStorage.clear();}
      var _toggleDebug = function(){
        var togg = FOG.OPTS.GET("debug");
        if (togg){
          FOG.OPTS.SET("debug",false); 
          FOG.SCREEN.XCSS("debug",screen);
        }
        else {
          FOG.OPTS.SET("debug",true); 
          FOG.CORE.DATA.CLEAR();  
          FOG.OPTS.SET("been",[]);
        }
        
      }
      var _zero = new Date().getTime();
      var _start = new Date().getTime();
      var _lap = function (){FOG.CORE.DATA.START=FOG.CORE.DATA.NOW();};
      var _time = function(){return new Date().getTime();}
      var _dedupe= function (arr) {
      	var hashTable = {};
      
      	return arr.filter(function (el) {
      		var key = JSON.stringify(el);
      		var match = Boolean(hashTable[key]);
      
      		return (match ? false : hashTable[key] = true);
      	});
      };
      var _xdupe=function(sArr,lArr){
            var fArr = [];
            for (var i = 0; i < sArr.length; i++) {
                for (var j = 0; j < lArr.length; j++) {
                    if (sArr[i].x != lArr[j].x && sArr[i].y != lArr[j].y) {
                        fArr.push(sArr[i]);
                    }
                }
                if(lArr.length==0) {fArr.push(sArr[i]);}
            }
            return fArr;
      };
      var _xdupself=function(sArr){
            return FOG.CORE.DATA.DEDUPE(sArr); 
      };
      return{SVG:_svgload,JSON:_jsonload,SET:_store,GET:_retrieve,DEL:_delete,CLEAR:_clear,ZERO:_zero,START:_start,LAP:_lap,NOW:_time,DEBUG:_toggleDebug,DEDUPE:_dedupe,XDUPE:_xdupe,XDS:_xdupself}
    }();
    var _char = function(){
      var _charAt=function(index){
        index = index || FOG.OPTS.GET("active");
        return FOG.OPTS.CHAR[index];
        
      };
      var _allspow=function(){
          var arclight = {
            name:"arclight"
          },
          flame_chakra = {
            name:"flame_chakra"
          },
          alchemy = {
            name:"alchemy"
          },
          charms = {
            name:"charms"
          },
          infra = {
            name:"infra"
          }         
          ;          
          FOG.OPTS.SET("specials", [arclight,flame_chakra,charms,infra]);
      }();
      var _specials=function(byname){
        var all=FOG.OPTS.GET("specials");
          if (byname!=null){
            function checkName(spec) {
              return spec.name==byname;
            }
            var by =  all.find(checkName);
            if (by!=null){
              return by;
            }
          }
          return FOG.OPTS.GET("specials");
        }
      
      var _checkSpecial=function(key,index){
        index=index||FOG.OPTS.GET("active");
        if(FOG.OPTS.CHAR[index].special && FOG.OPTS.CHAR[index].special.includes(key)){return true;}
        return false;
      }
      var _placeall=function(){
        var chars = [];
        for (c=FOG.OPTS.CHAR.length-1;c>=0;c--){
          chars.push(_place(c));
        }
        FOG.SCREEN.GRID.BEEN(FOG.SCREEN.GRID.SVGNEAR(FOG.OPTS.CHAR[0].pos)); 
        return chars;
      } 
      // returns [imgs]
      var _place = function(index){
        var cc= FOG.OPTS.CHAR[index];
          function fromto(){
            var orient = cc.face;
            var face = FOG.CORE.DATA.GET("face");
            var deg = 0; var dstep=90;
            if (orient==face){}
            else {
              switch (face){
                case "N": 
                  if (orient=="S"){deg=dstep*2;}
                  else if (orient=="E"){deg=dstep*-1;}
                  else if (orient=="W"){deg=dstep*1;}
                  break;
                case "S": 
                  if (orient=="N"){deg=dstep*2;}
                  else if (orient=="E"){deg=dstep*1;}
                  else if (orient=="W"){deg=dstep*-1;}
                  break;
                case "E": 
                  if (orient=="S"){deg=dstep*-1;}
                  else if (orient=="N"){deg=dstep*1;}
                  else if (orient=="W"){deg=dstep*2;}
                  break;
                case "W": 
                  if (orient=="S"){deg=dstep*-1;}
                  else if (orient=="E"){deg=dstep*2;}
                  else if (orient=="N"){deg=dstep*1;}
                  break;
              }
            }
            cc.orient=face;
            return 'rotate('+deg+'deg)';
          }
          var img = document.createElement('img');
          img.classList+="char";
          img.width= img.height= cc.square*2;
          img.style.left= cc.pos.x+"px";
          img.style.top= cc.pos.y+"px";
          img.pos={x:cc.pos.x,y:cc.pos.y};
          try{
          img.id = cc.name.replace(/ /g, '');}catch(x){};
          img.src =cc.src;
          img.style.transform= fromto();
          return img;
      } // returns img elements
      
        //  add all characters
      var _charJSON = function(){
        var charPath = FOG.CORE.DATA.GET("char") || "/js/char.json";
        var charJ = FOG.CORE.DATA.JSON(charPath); 
        FOG.CORE.DATA.SET("charpath",charPath);
        FOG.CORE.CHAR.BUILD(charJ);
        
      };
      var _charBuild = function(cArr){
        var startPos = FOG.OPTS.GET("cpos");
                
        var cw = parseInt(startPos.x,10); 
        var ch = parseInt(startPos.y,10);
        
        var face = FOG.CORE.DATA.GET("face");
        for(var c=0;c<cArr.length;c++){
          var cc = cArr[c];
          var ccxy = {x:cw,y:ch}; var fogxy=FOG.CORE.DATA.GET(cc.name); if (fogxy!=null){ccxy.x=fogxy.pos.x;ccxy.y=fogxy.pos.y; if(c==0){FOG.OPTS.SET("cpos",ccxy);}}
          cc.pos=ccxy; 
          cc.lights=[]; 
          if(cc.special!=null && cc.special.includes("infra")){
            cc.lights.push(FOG.SCREEN.CHAR.INFRA());
          }else{ 
            cc.lights.push(FOG.SCREEN.CHAR.TORCH());
          }
          cc.id=cc.name;
          cc.orient=cc.face; 
          cc.moves=FOG.OPTS.GET("moves");    // to do feature: from sheet.dex
          cc.torches=3;
          cc.march=FOG.OPTS.GET("march");
          
          FOG.OPTS.CHAR.push(cc);
        }
      };
      
      
      return{AT:_charAt,SPECIAL:_checkSpecial,PLACECHARS:_placeall,PLACE:_place,LOAD:_charJSON,BUILD:_charBuild,SPOW:_specials}
    }();
    var _init = function(){
        //  set options
      var _initopts=function(){ 
        
        FOG.OPTS.SET("mode",null); 
        FOG.OPTS.SET("active",0);
        FOG.OPTS.SET("speed",10);
        FOG.OPTS.SET("scale",1);
        FOG.OPTS.SET("zoom",1);
        FOG.OPTS.SET("fogsize",20);
        FOG.OPTS.SET("lradius",Math.round(60/FOG.OPTS.GET("fogsize")));  //light radius is a function of Fog Size
        FOG.OPTS.SET("zoomstep",1);
        FOG.OPTS.SET("cpos",{});   // this is the Centerpos searched for by FOG.SCREEN.MAP.FIND 
        FOG.OPTS.SET("been",FOG.CORE.DATA.GET("been")||[]);
        FOG.OPTS.SET("seen",[]);
        FOG.OPTS.SET("seenlast",[]);
        FOG.OPTS.SET("instr","v: map mode<br/>z/x: zoom in/out<br/>Arrows: pan<br/><br/>c: character mode<br/>click: step <br/>b/n: prev/next char<br/>&lt; - &gt;: rotate<br/>i: char info<br/><br/>SPACE: escape");
        FOG.OPTS.SET("litclass","lit");
        FOG.OPTS.SET("beamclass","beam");
        FOG.OPTS.SET("fogclass","been");
        FOG.OPTS.SET("infraclass","infra");
        FOG.OPTS.SET("moves",2); // time tracker minimum
        FOG.OPTS.SET("time",0); // time tracker
        FOG.OPTS.SET("march",true);
        FOG.OPTS.SET("beamoff",true);
        
        FOG.OPTS.SET("debug",true);
      }
      var _initmap=function(){        
        var _structure = function(){
          var _debug="screen"; if (!!FOG.OPTS.GET("debug")){_debug+=" debug"};
          var ourscreen=FOG.SCREEN.HTML("div", "screen",document.body,_debug);
          var mapEl=FOG.SCREEN.HTML("div","map",ourscreen,"map");
          
          var ourout = FOG.SCREEN.HTML("div","outputdiv",ourscreen,"output");
          FOG.SCREEN.HTML("div","output",ourout,"x");
          FOG.SCREEN.HTML("div","output2",ourout,"x");
          
          var regions = FOG.SCREEN.HTML("div","regions",ourscreen,"regions");
            
          window.addEventListener("keydown", FOG.KEY.PRESS);
          window.addEventListener("resize", FOG.SCREEN.MAP.RESIZE);
        }();
        var _svg = function(){
          var sPath;                                                                  /////// TO DO: Repathing (Entry)
            if (window.location.href.indexOf("neocities.org")>-1){
              sPath = "/i/fog/hcourt_n.svg";
            }
            else if (window.location.href.indexOf("plnkr.co")>-1){
              sPath = "currMap.svg";
            }
            else { sPath="/img/hcourt_n.svg";FOG.CORE.LOG("No SVG!! using ",sPath);}
          FOG.SCREEN.MAP.SVG(FOG.CORE.DATA.SVG(FOG.CORE.DATA.GET("svg")||sPath));
          
        }();
        FOG.SCREEN.FOG.SETFOG();
        FOG.CORE.CHAR.LOAD();
        FOG.SCREEN.FULL(FOG.CORE.CHAR.PLACECHARS(),map);
        
        FOG.SCREEN.MAP.FIND();
        FOG.SCREEN.MAP.LIGHTS();
        
        FOG.SCREEN.OUT(FOG.OPTS.GET("instr")); 
        FOG.SCREEN.XCSS("preload",currMap);
      }
      _initopts();
      _initmap();
      FOG.CORE.LOG("FOG: Finished loading.", FOG.CORE.DATA.NOW()-FOG.CORE.DATA.ZERO + "ms");
      FOG.TEST.ALL();
    }; 
    return{LOG:_log,DATA:_data,CHAR:_char,INIT:_init};
  }();  

  FOG.KEY = function(){
    var _press = function(event){
      FOG.KEY.CHK(event.key.toLowerCase()); 
    }
    var _check = function(press){  
      function CheckMode(key){
            function startMapMode(){FOG.OPTS.SET("mode","map");    FOG.SCREEN.OUT("Map Mode");}
            function startCharMode(){FOG.OPTS.SET("mode","char");  FOG.SCREEN.MAP.FIND(FOG.OPTS.CHAR[FOG.OPTS.GET("active")]);  FOG.SCREEN.OUT("Char Mode");}
            function startNullMode(){FOG.OPTS.SET("mode",null);    FOG.SCREEN.OUT(FOG.OPTS.GET("instr"));}
            function startEditMode(){FOG.OPTS.SET("mode","edit"); FOG.SCREEN.OUT("Editing<br/>t: torch<br/>a: arclight (where applicable)");}
            function startBeamMode(){
              if (FOG.CORE.CHAR.SPECIAL("arclight")){
              FOG.OPTS.SET("mode","beam"); FOG.SCREEN.OUT("Editing<br/>Click the character to toggle a beam to "+FOG.OPTS.GET("beamoff"));
              }
            }
            function startTorchMode(){FOG.OPTS.SET("mode","torch"); FOG.SCREEN.OUT("Editing<br/>Click to light a torch");}
          if (key=='v'){startMapMode();}
          else if (key=='c'){startCharMode();}
          else if (key==' '){startNullMode();}
          else if (key=="q"){startEditMode();}
          else if (key=="a"){startBeamMode();}
          else if (key=="t"){startTorchMode();}
        
      }
      function CheckZoom(key){
        if (key=="z" && FOG.OPTS.GET("zoom")<(10*FOG.OPTS.GET("zoomstep"))){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")+FOG.OPTS.GET("zoomstep")); }
        if (key=="x"&&FOG.OPTS.GET("zoom")>(FOG.OPTS.GET("zoomstep"))){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")-FOG.OPTS.GET("zoomstep"));}
        FOG.SCREEN.MAP.ZOOM();
      }
      function CheckPan(key){ 
        var npos = {x:FOG.OPTS.GET("cpos").x,y:FOG.OPTS.GET("cpos").y},sp=FOG.OPTS.GET("speed")*40;
        if (key=="arrowleft"){
          npos.x-=sp;
        }
        if (key=="arrowright"){
          npos.x+=sp;
        }
        if (key=="arrowup"){ 
          npos.y-=sp;
        }
        if (key=="arrowdown"){ 
          npos.y+=sp;
        }
        
        FOG.OPTS.SET("cpos",npos);
        FOG.SCREEN.MAP.FIND();  
      }
      function CheckActiveChar(key){
        var testIndex=FOG.OPTS.GET("active"), up=null; 
        function _loopList(dir){
          if (!dir){testIndex++;}
          else if (dir){testIndex--;}
          if (testIndex>=FOG.OPTS.CHAR.length){testIndex=0;}
          else if (testIndex<0){testIndex=FOG.OPTS.CHAR.length-1;}
        }
        if (key=="n"){up=false;_loopList(up);}
        if (key=="b"){up=true;_loopList(up);}
        //skip Torches
        var march=FOG.OPTS.GET("march")
        while (FOG.OPTS.CHAR[testIndex].name=="torch" || (!march && FOG.OPTS.CHAR[testIndex].moves<=0)){
          _loopList(up);
        }
        FOG.OPTS.SET("active",testIndex);
        var chr = FOG.OPTS.CHAR[FOG.OPTS.GET("active")];
        FOG.OPTS.SET("cpos",chr.pos); var spc=""; if (chr.special&&chr.special.name!="infra"){spc="* "+chr.special.name;}
        FOG.SCREEN.OUT("Char: <br/>"+chr.name+"<br/>");
        if(FOG.OPTS.GET("active")==testIndex)
        {FOG.SCREEN.MAP.FIND();}
      }
      function CheckStep(key){ 
        function _steppoint(key){
          var cclick = FOG.SCREEN.GRID.OFFSET(newpos);
          var pclick = {x:cclick.x-newpos.x,y:cclick.y-newpos.y};
          FOG.CORE.LOG(cclick,pclick);
          if(FOG.SCREEN.MAP.HIT(newpos)){
            FOG.SCREEN.CHAR.MOVE(oldpos,newpos);
            return true;
          }
          return false;
        }
        var step = FOG.OPTS.GET("speed"), 
          times = 1,
          oldpos = FOG.OPTS.CHAR[FOG.OPTS.GET("active")].pos, 
          newpos = {x:oldpos.x,y:oldpos.y};
        if (key=="i"||key=="j"||key=="k"||key=="m"){times=4;}
        for (var n=0;n<times;n++){
          var cont=true;
          if (key=="arrowleft"||key=="j"){ 
            newpos.x-=step; 
          }
          if (key=="arrowright"||key=="k"){
            newpos.x+=step;
          }
          if (key=="arrowup"||key=="i"){ 
            newpos.y-=step;
          }
          if (key=="arrowdown"||key=="m"){ 
            newpos.y+=step; 
          }
          
          if(oldpos.x!=newpos.x || oldpos.y!=newpos.y){
            cont = _steppoint(key); 
            FOG.CORE.LOG(["Checkstep "+n,newpos,oldpos,FOG.SCREEN.GRID.OFFSET(newpos)]);
          }
          if (!cont){break;}
        }
        
      } 
      function CheckMarch(key){
        
        if(key=="w"){ 
            
            if (FOG.OPTS.GET("active")==0){
          var mm = !FOG.OPTS.GET("march");FOG.OPTS.SET("march",mm);}
          else {var chr = FOG.CORE.CHAR.AT(FOG.OPTS.GET("active"));
            chr.march=!chr.march
          }
        }
        var onoff="OFF"; var leader="ORDER"; if (FOG.OPTS.GET("active")==0){leader="LEADER";}
        if(FOG.CORE.CHAR.AT(FOG.OPTS.GET("active")).march&&FOG.OPTS.GET("march")){onoff="ON";        }
 
          FOG.SCREEN.OUT("[MARCH "+leader+" "+onoff+"]w",false,output2); 
      }
      function CheckRotate(key){
        var rot = 0, amt = 90;
        if (key==","||key=="l"){rot= -1;} //counterclockwise
        else if (key=="."||key==";"){rot=1;} //clockwise
        //if (key=="l"||key==";"){amt=30;} doesn't generate a Cardinal for Arclight
        if(rot!=0){Rotate(rot,amt);}
      }
      function Rotate(dir,amt){
        function rFromTo(facing,direction){  //from "S" to "E" 
          var rface=facing;
          switch(facing){
            case "S":
              if (direction>0){rface="W";}else{rface="E";}
              break;
            case "N":
              if (direction>0){rface="E";}else{rface="W";}
              break;
            case "E":
              if (direction>0){rface="S";}else{rface="N";}
              break;
            case "W":
              if (direction>0){rface="N";}else{rface="S";}
              break;
          }
          return rface;
        }
        var currfacing = FOG.OPTS.CHAR[FOG.OPTS.GET("active")].orient;
        FOG.OPTS.CHAR[FOG.OPTS.GET("active")].orient = rFromTo(currfacing,dir);
        amt=amt||90;
        
        var img = document.getElementById(FOG.OPTS.CHAR[FOG.OPTS.GET("active")].id);
        var angleArr = img.style.transform||0;
         if(angleArr!=0){
           angleArr = angleArr.split("(")[1].replace("deg)","")
         }
        var newangle = ((dir*amt) + parseInt(angleArr,10))%360; 
        
        img.style.transform = 'rotate('+newangle+'deg)';
        FOG.SCREEN.MAP.LIGHTS();
        FOG.SCREEN.MAP.FIND();
      }
      function CheckInfo(key){
          //get info; stats, bio; from config file
      }
      
      CheckMode(press);
      if (FOG.OPTS.GET("mode")=="map"){
        CheckZoom(press);
        CheckPan(press);
      }
      else if(FOG.OPTS.GET("mode")=="char") { 
        CheckActiveChar(press);
        CheckRotate(press);
        CheckMarch(press);
        CheckInfo(press);
      }
      else if (FOG.OPTS.GET("mode")=="edit"){
        
      }              
    }
    return{PRESS:_press,CHK:_check} 
  }();
  FOG.SCREEN = function(){
    var _out = function(txt,append,div){
        div=div||output;
        if (append){div.innerHTML+=txt;}
        else {div.innerHTML=txt;}
        div.innerHTML += "<br/>";
      }
    var _css = function(css){
            var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
            style.type = 'text/css';
            head.appendChild(style);
            style.appendChild(document.createTextNode(css));            
          };
    var _makeel=function(tag,id,tgt,classes,pos){
      var el =  document.createElement(tag);
      el.id=id; el.classList=classes; 
      if (pos!=null&&pos.x!=null){
        el.style.left=pos.x+"px"; el.style.top=pos.y+"px";
      }
      tgt.appendChild(el);
      return el;
    }
    var _makesvgtag=function(tag,id,classes,attrs,target){
      target=document.getElementsByTagName(target)[0] || document.getElementById(target) ||currMap;
      var st = document.createElementNS('http://www.w3.org/2000/svg',tag);
      st.id=id;
      st.classList+=classes;
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            st.setAttribute(key,attrs[key]);
        }
    }
      if (classes=="fog"){
        target.insertBefore(st,target.childNodes[0]);
      }else {
        target.appendChild(st);
      }
    }
    var _fullElementArray=function(eArr,tgt,pos){ 
      if (!Array.isArray(eArr)){
        tgt.appendChild(eArr);
      }
      else{
        for(var e=0;e<eArr.length;e++){
          tgt.appendChild(eArr[e]);
        }
          
      }
    }
    var _imgHTML=function(src,pos){
          var img = document.createElement('img');
          img.src =src;
          return img;
    }
    var _rmClass=function(str,tgt){
      try{tgt.classList.remove(str);return true;}
      catch(ex){FOG.CORE.LOG(ex);}
    }
    
    var _regions=function(){
      var region1 = {corners:{},region:{src:"https://fredhawk.neocities.org/i/fog/tunnel1.jpg",text:"Dark tunnel beneath Highcourt Castle"}};
      var region2 = {corners:{},region:{src:"https://fredhawk.neocities.org/i/fog/tunnel2.jpg",text:"Further dark tunnels"}};
      var region3 = {corners:{},region:{src:"https://fredhawk.neocities.org/i/fog/tunnel3.jpg",text:"Dark tunnel near a collapse; Centipedes"}};
      var region4 = {corners:{},region:{src:"https://fredhawk.neocities.org/i/fog/tunnel4.jpg",text:"Yet further dark tunnels"}};
      var _new = function(rObj){
          var region = FOG.SCREEN.HTML("div","region",regions,"region");
          var eimg = FOG.SCREEN.HTML("div","eimg",region,"eimg");
          var etxt = FOG.SCREEN.HTML("div","etxt",region,"etxt");
          etxt.innerHTML=rObj.region.text; 
          
          FOG.SCREEN.FULL(FOG.SCREEN.IMG(rObj.region.src),eimg);
      };
              
      return{NEW:_new,R1:region1,R2:region2,R3:region3,R4:region4}
    }();
    
    var _fog = function(){
      // this function creates the Fog of War
      var _setfog=function (fogOn){
       if(fogOn!=false){   
         FOG.SCREEN.SVG('rect',null,"fog");
        };
        var oldLights = FOG.OPTS.GET("been");
       if(oldLights!=null &&oldLights.length>0){
          //build oldlights
          for (i=0;i<oldLights.length;i++){
            FOG.SCREEN.SVG('circle',null," been",{"r":FOG.OPTS.GET("lradius"),"cx":oldLights[i].x,"cy":oldLights[i].y},"mask");
          }  
       }
      }      
      var _lights = function (){
        ///To turn on Lights, we find the characters, and draw a circle centered on the character

        var lts=[];
        //// this function builds an array of lights for the character
        function setLight(chIndex){    
          var character = FOG.OPTS.CHAR[chIndex];
          for(var l=0;l<character.lights.length;l++){    //  FOG.SCREEN.GRID.NEAR(pt.x,shift)
            lts.push({x:FOG.SCREEN.GRID.NEAR(character.pos.x,20),y:FOG.SCREEN.GRID.NEAR(character.pos.y,20),radius:character.lights[l].radius,type:character.lights[l].type}) ;
          }
        }
        //// this function setLight's from the CharArray
        function shineLights(){
          for(var s=0;s<FOG.OPTS.CHAR.length;s++){
            setLight(s);
          }
          //Sort lit over infra
          lts=FOG.CORE.DATA.XDS(lts.sort((a, b) => (a.type < b.type) ? 1 : -1 ));
          //Push to Seen array
          FOG.SCREEN.GRID.SEEN(lts);
        }
          shineLights();
          // then Defog drops Circles to mask Fog
          FOG.SCREEN.FOG.DEFOG(lts);  
      };
      // this function turns off all the current player lights by deleting current player lights and changing underlights to the 'been' status
      var _nolights=function(){        
        function resetLit(){
          var litup = document.querySelectorAll("svg > circle"); 
          while (litup && litup.length && litup.length>0){          
            litup.forEach(function (){
              litup[0].remove();
            });
            litup = resetLit();
          } 
        }
        //Extinguish the player lights
        resetLit(); 
        //Clear the data array
        FOG.OPTS.SET("seen",[]);
      }; 
      // this function builds circles for the char lights
      var _defog = function (lights){ 
          for (i=0;i<lights.length;i++){
            var svgpt = FOG.SCREEN.GRID.SVGNEAR(lights[i]);
            //adds the visible light
            /////// Good point to add data-owner="{charname}" if needed
            FOG.SCREEN.SVG('circle',null,lights[i].type+" seen",{"r":lights[i].radius,"cx":svgpt.x,"cy":svgpt.y});
            //adds the underlight
            FOG.SCREEN.SVG('circle',null,lights[i].type+" seen been",{"r":lights[i].radius,"cx":svgpt.x,"cy":svgpt.y},"mask");
          } 
      };

      var _linefromto=function(from,to,tgt){ 
        var w = 1.5; tgt=tgt||"mask";
      // create a "path" quadrilateral; x1=pt-w  y1=pt-w etc.
        FOG.SCREEN.SVG('polygon',null,"been",{"points":(from.x-w)+ " " + (from.y-w) + " " 
          + (from.x+w) + " " + (from.y-w) + " "
          + (to.x+w) + " " + (to.y+w) + " "
          + (to.x-w) + " " + (to.y+w)},tgt);
      };
      return{SETFOG:_setfog,DEFOG:_defog,LIGHT:_lights,NOLIGHT:_nolights,LINE:_linefromto};
    }();
    var _grid = function(){
      //  [functions for point generation & manipulation]
      
      var _centeroffset=function(pt){
          var w = window.innerWidth-40;
          var h = window.innerHeight-160;
          var sc = FOG.OPTS.GET("zoom");
          var fz = FOG.OPTS.GET("fogsize");
          var mw = Math.floor((- pt.x + (w/2)));
          var mh = Math.floor((- pt.y  + (h/2)));
          mw = FOG.SCREEN.GRID.NEAR(mw*sc,fz);
          mh = FOG.SCREEN.GRID.NEAR(mh*sc,fz);
          FOG.CORE.LOG([{x:mw,y:mh},pt],"MAP._centeroffset");
          return {x:mw,y:mh};
      };
      var _beenpush=function(pt){
        FOG.SCREEN.GRID.UNIQUE(pt,"been");
        FOG.CORE.DATA.SET("been",FOG.CORE.DATA.XDS(FOG.OPTS.GET("been")));
      };
      var _seenpush=function(pt){ 
          FOG.SCREEN.GRID.UNIQUE(pt,"seen");
      };
      var _uniquepush=function(pt,arrN){
        //get the array from RAM by name
        var _arr= FOG.OPTS.GET(arrN); 
        //if pt is an array, push individually
        if (Array.isArray(pt)){
          for(i=0;i<pt.length;i++){
            _arr.push(pt[i]);
          }
        }else{
          _arr.push(pt);
        }
        _arr = FOG.CORE.DATA.XDS(_arr);
        FOG.OPTS.SET(arrN,_arr);
      };
      var _roundnearest=function(x,n){ //this function rounds X to the nearest N
        n=n||FOG.OPTS.GET("fogsize");
        return (x % n) >= n/2 ? parseInt(x / n) * n + n : parseInt(x / n) * n;
      };
      
      var _svgnear = function (pt){
        ///// 20 = scale, char radius
            var cR = 20;
            var dMap = document.getElementById("map"); 
            var px = dMap.style.left; var py = dMap.style.top;
            var dx = parseInt(px.substring(0,px.length-2));
            var dy = parseInt(py.substring(0,py.length-2));
            var scale = FOG.OPTS.GET("scale"); var r = FOG.OPTS.GET("lradius")/2;
              var cx=Math.floor((pt.x)/scale) + 2*(cR) - (r) +.5;
              var cy=Math.floor((pt.y)/scale) + (cR - r)-1; 
          return {x:cx,y:cy};
        }
      return{OFFSET:_centeroffset,BEEN:_beenpush,SEEN:_seenpush,UNIQUE:_uniquepush,NEAR:_roundnearest,SVGNEAR:_svgnear};
    }();
    var _map = function(){
      var _svginit=function(elem){
        elem.id="currMap";elem.classList+="preload";
        map.appendChild(elem);
        var start=elem.getAttribute("fog-start");
        var svgScale=elem.getAttribute("fog-scale");
        var mult=1;
        if (svgScale!=null){ //
          FOG.OPTS.SET("scale",svgScale);
          mult=svgScale; 
          var charW = 40; var factor = mult; if (factor<=1){factor=0;}if (factor>5){factor=factor/(factor/5);}
          var pLeft = factor * charW; var pTop = factor * (charW/2); 
          FOG.OPTS.SET("scaleL",pLeft); FOG.OPTS.SET("scaleT",pTop);
          var css = "svg{transform:scale("+mult+");padding-left:"+pLeft+"px;padding-top:"+pTop+"px}"; 
          FOG.SCREEN.CSS(css);
        }
        var cpos=FOG.CORE.DATA.GET("pos")||{};
        if(start!=null){
          var spl=start.split(",");
          try{
            var x=spl[0]; var y = spl[1];
            cpos.x=x;cpos.y=y;
          }catch(ex){}
            
          if (cpos.x!=null){            
            cpos={x:cpos.x*mult,y:cpos.y*mult};
            FOG.OPTS.SET("cpos",cpos);
            FOG.CORE.DATA.SET("pos",cpos);
          }
        } else{FOG.ENTRY.POS();}
        FOG.CORE.LOG("_svg init: setting CPOS",cpos);
        var facing = elem.getAttribute("fog-face");
        var face = "N";
        if (facing!=null){
          face = facing;
          FOG.CORE.DATA.SET("face",face);
        }
        var thepath = elem.getElementsByTagName("path");
        thepath[0].id="mappath";
        mappath.onclick=FOG.SCREEN.MAP.CLICKING;
        function _initMask(){
          FOG.SCREEN.SVG("defs","defs",''); 
          FOG.SCREEN.SVG("mask","mask",null,null,"defs"); 

          FOG.SCREEN.SVG("radialGradient","litColorGrad",null,null,"defs");
          FOG.SCREEN.SVG("stop",null,null,{"offset":0,"stop-color":"grey","stop-opacity":1},"litColorGrad"); 
          FOG.SCREEN.SVG("stop",null,null,{"offset":.8,"stop-color":"grey","stop-opacity":.2},"litColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":1,"stop-color":"white","stop-opacity":0},"litColorGrad");
          
          FOG.SCREEN.SVG("radialGradient","infraGrad",null,null,"defs");
          FOG.SCREEN.SVG("stop",null,null,{"offset":0,"stop-color":"red","stop-opacity":1},"infraGrad"); 
          FOG.SCREEN.SVG("stop",null,null,{"offset":.5,"stop-color":"red","stop-opacity":1},"infraGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":1,"stop-color":"red","stop-opacity":0},"infraGrad");

          FOG.SCREEN.SVG("radialGradient","infraColorGrad",null,null,"defs");
          FOG.SCREEN.SVG("stop",null,null,{"offset":0,"stop-color":"red","stop-opacity":.3},"infraColorGrad"); 
          FOG.SCREEN.SVG("stop",null,null,{"offset":.5,"stop-color":"red","stop-opacity":.2},"infraColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":1,"stop-color":"red","stop-opacity":0},"infraColorGrad");
        }
        _initMask();
      };
      var _center=function(){  
        var pt=FOG.OPTS.GET("cpos");  
        var zm=FOG.OPTS.GET("zoom"); 
        
        map.style.left=-pt.x*zm+"px"; 
        map.style.top=-pt.y*zm+"px";
      };
      var _lights=function(){        
          FOG.SCREEN.FOG.NOLIGHT();
          FOG.SCREEN.FOG.LIGHT(); 
      }
      var _resize=function(){
        FOG.SCREEN.MAP.FIND();}
      var _scale=function(){ var zm=FOG.OPTS.GET("zoom");
        map.style.transform="scale("+zm+", "+zm+")"; 
        //center on active character
        FOG.SCREEN.MAP.FIND();
      };
      var _clickfunction=function(e){
          FOG.SCREEN.MAP.ONPATH=true;
            FOG.SCREEN.MAP.MODE(e);
            var mode=FOG.OPTS.GET("mode")
          //FOG.CORE.LOG({x:e.clientX,y:e.clientY}, "SVG Clicked");
      };
      var _clickmode=function(e){
            var mode=FOG.OPTS.GET("mode");
            var zm=FOG.OPTS.GET("zoom");
            var pLeft = window.innerWidth; var pTop = window.innerHeight;
            var cpos=FOG.OPTS.GET("cpos");
        if (mode=="char"||mode=="torch"){
            var char = FOG.CORE.CHAR.AT();
            var sq = char.square;
            var cbox = document.getElementById(char.name).getBoundingClientRect();
            var px = e.clientX - cbox.left- sq*zm;
            var py = e.clientY - cbox.top- sq*zm;
            var pt = {x:px+char.pos.x,y:py+char.pos.y}; 
            if (mode=="torch"){
              FOG.KEY.CHK("c");
              FOG.SCREEN.CHAR.DROPTORCH(pt);
            }
            else{FOG.SCREEN.CHAR.CLICKED(pt);}
        }
        if (mode=="edit"){
          FOG.KEY.CHK(" ");
          //other Edit option
        }
        if (mode=="test"||mode=="fog"){/*
          var ex = e.clientX; //event.clientX =Math.round(pt.x-cpos.x+(window.innerWidth/2));
          var ey = e.clientY;
          
          var fx = ex+cpos.x+(pLeft/2);
          var fy = ey+cpos.y+(pTop/2);
          FOG.CORE.LOG(mode,fx,fy);*/
        }
       
        if(mode=="beam"){
          FOG.SCREEN.CHAR.BEAMON();
          FOG.KEY.CHK("c");
        }
      }
      var _onpath=false;
      var _svghit=function(pt){ 
        if (FOG.OPTS.GET("debug")=="admin"){return true;}
        var cMode=FOG.OPTS.GET("mode");
        FOG.OPTS.SET("mode","test");
        FOG.SCREEN.MAP.TRY(pt); var retBool=false;
        if (FOG.SCREEN.MAP.ONPATH){retBool=true;}
        FOG.SCREEN.MAP.ONPATH=false;
        FOG.OPTS.SET("mode",cMode);
        return retBool;
      };
      var _try=function(pt){      
        try{
          var rect = mappath.getBoundingClientRect();
          var sq = FOG.CORE.CHAR.AT().square; var cpos=FOG.OPTS.GET("cpos"); var cid=FOG.CORE.CHAR.AT().id;
            var cbox = document.getElementById(cid).getBoundingClientRect();
          var event = new Event('click');
          event.clientX =Math.round(pt.x-cpos.x +(window.innerWidth/2));
          event.clientY = Math.round(pt.y-cpos.y +cbox.top-sq);
          var element = document.elementFromPoint(FOG.SCREEN.GRID.NEAR(event.clientX), FOG.SCREEN.GRID.NEAR(event.clientY));
          if(element!=null&&element.id=="mappath"){
            element.dispatchEvent(event);
          }
        }catch(ex){FOG.CORE.LOG(["Exception thrown: clicking SVG failure.",ex,pt]);}
      };
      var _hitarray=function(arr,fail){
        var rArr=[],threshold=fail||3,misses=0;
        for (var i=0;i<arr.length;i++){
          if (FOG.SCREEN.MAP.HIT(arr[i])){
            rArr.push(arr[i])
          }
          else{misses++;}
          if (misses>threshold){break;}  
        }
        return rArr;
      };
      var _turn = function(){
        var cturn = FOG.OPTS.GET("time"); 
        FOG.OPTS.SET("time",FOG.OPTS.GET("time")+1);
        
        FOG.SCREEN.CHAR.NEWTURN();
      }
      return{SVG:_svginit,FIND:_center,LIGHTS:_lights,RESIZE:_resize,ZOOM:_scale,ONPATH:_onpath,HITA:_hitarray,HIT:_svghit,TRY:_try,CLICKING:_clickfunction,MODE:_clickmode,NEWTURN:_turn};
    }();
    var _char = function(){
      var _movechar=function(frompos,topos,index){
        index = index || FOG.OPTS.GET("active");
        var cc=FOG.OPTS.CHAR[index]; 
        cc.pos=topos;
        var ci = document.getElementById(cc.name.replace(/ /g, ''));
        ci.style.left=cc.pos.x+"px";
        ci.style.top=cc.pos.y+"px";
        FOG.CORE.DATA.SET(cc.name,cc); 
        cc.moves-=1;
            FOG.KEY.CHK("c");
      };
      var _march = function (index){
        if(FOG.OPTS.GET("march")==true && FOG.OPTS.CHAR[0].moves==0 && index==0){ 
          var oldpos=FOG.OPTS.GET("opos");
          var cInd = 1; 
          if (cInd>=FOG.OPTS.CHAR.length){}
          else{
            cEnd = FOG.OPTS.CHAR.length;
            var lPos={x:oldpos.x,y:oldpos.y}; var nPos={x:oldpos.x,y:oldpos.y};
            for (var m=cInd;m<cEnd;m++){
              if (FOG.OPTS.CHAR[m].name!="torch" && FOG.OPTS.CHAR[m].march){
                lPos={x:FOG.OPTS.CHAR[m].pos.x,y:FOG.OPTS.CHAR[m].pos.y};
                FOG.SCREEN.CHAR.MOVE(lPos,nPos,m) 
                nPos={x:lPos.x,y:lPos.y};
              }
            }
          }
          FOG.SCREEN.MAP.NEWTURN();
        }
      }
      var _charspecial=function(index){ 
        if (index==null){FOG.CORE.LOG("SPECIAL NO INDEX ARGUMENT");}
        var char=FOG.CORE.CHAR.AT(index);  
        if (char.special){
          var retcapture = FOG.CORE.CHAR.SPOW(char.special);
          
          //BAD!!!
          if (char.special.includes("arclight")){
            FOG.SCREEN.CHAR.BEAM(index);
          }
        }
      };
      var _allspecials=function(){
        for(a=0;a<FOG.OPTS.CHAR.length;a++){
          FOG.SCREEN.CHAR.SPECIAL(a);
        }
      }
      var _specialsbytype=function(types){
        
      }
      var _clickmove=function(pt){   
          var cc = FOG.CORE.CHAR.AT(); var index=FOG.OPTS.CHAR.findIndex(i => i.name == cc.name);  
          var dist =Math.sqrt(Math.pow(pt.x- cc.pos.x,2) + Math.pow(pt.y-cc.pos.y,2));
          var max = FOG.OPTS.GET("scale")*FOG.OPTS.GET("fogsize")/FOG.OPTS.GET("zoom")*5;                               // TO DO : distance reconcile
          if (/*dist<=max */true){
            FOG.OPTS.SET("opos",cc.pos);
            FOG.SCREEN.CHAR.MOVE(cc.pos,pt); 
            FOG.SCREEN.GRID.BEEN(FOG.SCREEN.GRID.SVGNEAR(pt));
          }          
          FOG.SCREEN.CHAR.MARCH(index);
        FOG.SCREEN.MAP.LIGHTS();
        FOG.SCREEN.MAP.FIND(); 
      };
      var _resetallmoves=function(){
          for (var c=0;c<FOG.OPTS.CHAR.length;c++){
            var cc=FOG.OPTS.CHAR[c];
            cc.moves=FOG.OPTS.GET("moves");  
            if(cc.timer && cc.timer<=FOG.OPTS.GET("time")){cc.lights=[];}
          }          
        FOG.OPTS.SET("active",0);
      };
      var _droptorch=function(pos){
        var torch = {name:"torch",
          pos:pos,
          lights:[FOG.SCREEN.CHAR.TORCH()],
          square:20,timer:5+FOG.OPTS.GET("time"),
          src:"https://vignette.wikia.nocookie.net/darksouls/images/c/c6/Torch_%28DSIII%29.png/revision/latest?cb=20160729181452"
        };
        FOG.OPTS.CHAR.push(torch);
        FOG.SCREEN.FULL(FOG.CORE.CHAR.PLACE(FOG.OPTS.CHAR.length-1),map);
        FOG.SCREEN.MAP.LIGHTS();
        FOG.SCREEN.MAP.FIND();
      };
      var _torch = function(radius,type){
        radius=radius||FOG.OPTS.GET("lradius");type=type||FOG.OPTS.GET("litclass");
        return{type:type,radius:radius};
      };
      var _infra = function(){
        return FOG.SCREEN.CHAR.TORCH(FOG.OPTS.GET("lradius")+1,FOG.OPTS.GET("infraclass"));
      };
      var _beamfrom=function(active){ if(FOG.SCREEN.CHAR.BEAMOFF()==true){} 
      else{
          var cc= FOG.CORE.CHAR.AT(active);
          var power = 100; var threshold=2; ;
          var _beamarray=function(start,direction){ direction=direction||"S";
            var barray=[];
            var xAmt=0,yAmt=0;var xOff=0;yOff=0;
            switch (direction){
              case "N": yAmt=-1; xOff=1;
                break;
              case "S": yAmt=1;  xOff=1;
                break;
              case "E": xAmt=1;  yOff=1;
                break;
              case "W": xAmt=-1; yOff=1;
                break;
            } 
            xAmt*=10; yAmt*=10; xOff*=10; yOff*=10;
            for (var b=0;b<power;b++){ 
              barray.push({x:FOG.SCREEN.GRID.NEAR(start.x+(xAmt*b)+xOff,20),y:FOG.SCREEN.GRID.NEAR(start.y+(yAmt*b)+yOff,20),radius:2,type:"lit"});
            }
            switch(direction){
              case "N": 
                barray.sort((a, b) => (a.y < b.y) ? 1 : (a.y === b.y) ? ((a.x > b.x) ? 1 : -1) : -1 );
                break;
              case "S": 
                barray.sort((a, b) => (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.x > b.x) ? 1 : -1) : -1 );
                break;
              case "E":
                barray.sort((a, b) => (a.x > b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1 );
                break;
              case "W": 
                barray.sort((a, b) => (a.x < b.x) ? 1 : (a.x === b.x) ? ((a.y > b.y) ? 1 : -1) : -1 );
                break;
            }
            return barray;
          }
          var pos={x:FOG.SCREEN.GRID.NEAR(cc.pos.x,20),y:FOG.SCREEN.GRID.NEAR(cc.pos.y,20)};
          var face=cc.orient;FOG.CORE.LOG("beam for",cc.name,pos);
          var ptsarray= FOG.CORE.DATA.DEDUPE(_beamarray(pos,face));
          
          var litarray=FOG.SCREEN.MAP.HITA(ptsarray,threshold);
          FOG.SCREEN.GRID.SEEN(litarray);
        }
      };
      var _beamoff= function(){return FOG.OPTS.GET("beamoff");}
      var _beamon=function(val){
        val = val || !FOG.SCREEN.CHAR.BEAMOFF();
        FOG.OPTS.SET("beamoff",val); 
        if (!val){
          //FOG.SCREEN.MAP.LIGHTS();
        }     
      };
      
      return{MOVE:_movechar,MARCH:_march,TORCH:_torch,INFRA:_infra,DROPTORCH:_droptorch,BEAM:_beamfrom,CLICKED:_clickmove,SPECIAL:_charspecial,SPOW:_allspecials,SPTYPE:_specialsbytype,NEWTURN:_resetallmoves,BEAMOFF:_beamoff,BEAMON:_beamon};
    }();
    
    return {OUT:_out,CSS:_css,HTML:_makeel,FULL:_fullElementArray,IMG:_imgHTML,XCSS:_rmClass,SVG:_makesvgtag,REGIONS:_regions,FOG:_fog,GRID:_grid,MAP:_map,CHAR:_char};
  }();
  //  ENTRY -- overhaul processes, last!
  FOG.ENTRY = function(){  
        // ASK
          // 
          /*
            --------------
            
            module to prompt
              * session SVG file; expected <svg $tag=value
                ** fog-start="xxx,yyy"  ------ first character entry point {x,y}
                ** fog-face="N"         ------ ie, "North" (N,S,E,W)
                ** fog-end="xxxx,yyyy"  ------ optional button to next map.svg crawl! include in opts.json core.svg["svg_path0",..]
              * char JSON
              * opts JSON
            
            --------------
          */
          //
        //  add SVG map, id+class = currMap, path id=mappath; 
    var _opts = function(){
      if(confirm("Do you have an options file?")){
        FOG.ENTRY.CONFIG();
      }
      else {FOG.ENTRY.SVG();}
    }
    var _config = function(){
      var sPath = prompt("Enter http/s path to your configuration json:","");
      var sData = FOG.CORE.JSON(sPath);
      FOG.CORE.DATA.SET("config",sData);
      function ProcessConfig(jfile){
        if(jfile.svg!=null){FOG.CORE.DATA.SET("svg",jfile.svg);}
        if(jfile.pos!=null){FOG.CORE.DATA.SET("pos",{x:jfile.pos.x,y:jfile.pos.y});}
        if(jfile.face!=null){FOG.CORE.DATA.SET("face",jfile.face);}
        if(jfile.char!=null){FOG.CORE.DATA.SET("charpath",jfile.char);}
      }
      ProcessConfig(sData);
    }
    // Path to Map SVG
    var _svg = function(){
      var sPath = prompt("Enter http/s path to your SVG map:","");
      FOG.CORE.DATA.SET("svg",sPath);
    };
    // Start position X,Y (if not present on SVG)
    var _pos = function(){
      var sX = prompt("Enter starting X coordinate:","");
      var sY = prompt("Enter starting Y coordinate:","");
      var sD = prompt("Enter starting facing (N/S/E/W):","");
      FOG.CORE.DATA.SET("pos",{x:sX,y:sY});
      FOG.CORE.DATA.SET("face",sD);
    };
    var _char = function(){
      var sPath = prompt("Enter http/s path to your Character json:","");
      var sData = FOG.CORE.JSON(sPath);
      FOG.CORE.DATA.SET("char",sData);
    };
    return {SVG:_svg,POS:_pos,CHAR:_char,OPTS:_opts,CONFIG:_config};
  }();
  FOG.INIT = function(){
    window[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? 'load' : 'onload', FOG.CORE.INIT );
  }();


  /*
    TO DO's, 5/6: 

      Cleanup - 

      Check-in

      ENTRY methods
        Regions add-in
  */