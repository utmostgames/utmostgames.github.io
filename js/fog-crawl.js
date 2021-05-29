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
          console.log("unassigned VAL,",key);
          return null;
        }
      };
      var _list=[], _chars=[];      
          
      return {        SET:_set,GET:_get,LIST:_list,CHAR:_chars      };
  }();
  FOG.CORE = function(){
    var _log = function(msg,opts){
      if (FOG.OPTS.GET("debug")!=false){
        console.log(msg,opts);
      }
    }
    var _data = function(){
      var _ajaxx = function (url){
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(this.responseXML);
          };
          xhr.onerror = reject;
          xhr.open('GET', url);
          xhr.send();
        });
      }
      var _ajax = function (url){
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(this.responseText);
          };
          xhr.onerror = reject;
          xhr.open('GET', url);
          xhr.send();
        });
      }
      var _ajaxcall = function(url,func,args){
        FOG.CORE.DATA.AJAX(url)
          .then(function(result){
            func(result,args);
          })
          .catch(function(result) {
            console.log("catch",result,url);
          });
      }
      var _ajaxXMLcall = function(url,func,args){ 
        FOG.CORE.DATA.AJAXX(url)
          .then(function(result){
            func(result,args);FOG.OPTS.SET("CORS",true);
          })
          .catch(function(result) {
            console.log("Unable to load SVG due to CORS policy on target domain for file:",url,result);
            FOG.OPTS.SET("CORS",false); FOG.CORE.LAUNCH();
          });
      }
      var _svgload = function(url){
        if (url!=null){
          FOG.CORE.DATA.CALLX(url,FOG.CORE.LAUNCH);
        }
        else {console.log("SVG load failed; URL:",url);}
      }
      var _charjsonload = function(url){
        FOG.CORE.DATA.CALL(url,FOG.CORE.JLOG);
      }
      var _configjsonload = function(url){
        FOG.CORE.DATA.CALL(url,FOG.CORE.JCONFIG);
      }  
      var _fileselect = function(evt) {
        var files = evt.target.files; // FileList object
        if (files[0]!=null){
          return files[0];
        } else return null;
    
        // files is a FileList of File objects. List some properties. 
        /*
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
          output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                      f.size, ' bytes, last modified: ',
                      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                      '</li>');
        }
        document.getElementById('output').innerHTML = '<ul>' + output.join('') + '</ul>';
         <input type="file" id="files" name="files[]" multiple />
      document.getElementById('files').addEventListener('change', handleFileSelect, false); */
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
      var _clear=function(){localStorage.clear();FOG.OPTS.LIST=[];FOG.CORE.OPTS();}
      var _toggleDebug = function(){
        var togg = FOG.OPTS.GET("debug");
        if (togg){
          FOG.OPTS.SET("debug",false); 
          FOG.SCREEN.XCSS("debug","screen");
        }
        else {
          FOG.OPTS.SET("debug",true); 
          FOG.OPTS.SET("been",[]);
        }
        
      }
      var _timestamp=function(){
        var num = FOG.OPTS.GET("time");
        FOG.CORE.DATA.SET("time",num);
        var hours = Math.floor(num / 60);  
        var minutes = num % 60;
        return String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0')+ "<br/>"; 
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
      var _imsave=function(d){
        if (d!=null&&d!=""&&d!={}){
          var data = JSON.parse(d)||{};
          keys = Object.keys(data);
          for (i = 0; keys[i]; i++) {
            FOG.CORE.DATA.SET(keys[i],data[keys[i]]);
          } 
       }
      };
      var _exsave=function(){
        return JSON.stringify(localStorage).replace(/\\/g, "").replace(/\"\[/g, "[").replace(/\]\"/g, "]").replace(/\"\{/g, "{").replace(/\}\"/g, "}").replace(/\"\"/g, "\"");// braces, brackets, & backslashes bad; double double-quotes to once
      };
      var _getuseroptions=function(c){
        if (c==null){c=FOG.CORE.DATA.GET("config");}
        if (c!=null&&c.opts!=null&&c.opts.length>0){
          for (o=0;o<c.opts.length;o++){
            FOG.OPTS.SET(c.opts[o].key,c.opts[o].val);
          }
        }
      }
      return{SVG:_svgload,JSONCHAR:_charjsonload,JSONCONFIG:_configjsonload,FILE:_fileselect,AJAX:_ajax,AJAXX:_ajaxx,CALL:_ajaxcall,CALLX:_ajaxXMLcall,
        SET:_store,GET:_retrieve,DEL:_delete,CLEAR:_clear,ZERO:_zero,START:_start,TIMESTAMP:_timestamp,
        LAP:_lap,NOW:_time,DEBUG:_toggleDebug,DEDUPE:_dedupe,XDUPE:_xdupe,XDS:_xdupself,EXSAVE:_exsave,IMSAVE:_imsave,USEROPTS:_getuseroptions}
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
            var face = FOG.CORE.DATA.GET("face")||"N";
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
        if (FOG.CORE.DATA.GET("char")==null||FOG.CORE.DATA.GET("char")[0]==null){
          var path = FOG.CORE.DATA.GET("charpath");
          if (path==null || path.length<6){
            var c=JSON.stringify(FOG.CORE.CHAR.DEFAULT());FOG.CORE.LOG("setting default character array",c);FOG.CORE.JLOG(c);
          }
          else{
             FOG.CORE.DATA.JSONCHAR(path);        
          }
        }
      };
      var _charBuild = function(){
        var cArr=FOG.CORE.DATA.GET("char");
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
          cc.moves=FOG.OPTS.GET("moves"); 
          cc.torches=3;
          cc.march=FOG.OPTS.GET("march");
          
          FOG.OPTS.CHAR.push(cc);
        }
      };
      var _initChars = function(){
        FOG.CORE.CHAR.LOAD();
        FOG.CORE.CHAR.BUILD();
        FOG.SCREEN.FULL(FOG.CORE.CHAR.PLACECHARS(),map);
        FOG.CORE.FINISH();
      }
      var _defaultarrowchar=function(){
        return [
          {
            "name":"Arrow",
            "src":FOG.OPTS.GET("arrow"),
            "picOri":"N",
            "square":20
          }];
      }
      
      return{AT:_charAt,SPECIAL:_checkSpecial,PLACECHARS:_placeall,PLACE:_place,LOAD:_charJSON,
        BUILD:_charBuild,INIT:_initChars,SPOW:_specials,DEFAULT:_defaultarrowchar}
    }();
    var _init = function(){
        FOG.CORE.DATA.SVG(FOG.CORE.DATA.GET("svgpath"));
    }; 
    var _initOpts=function(){
      FOG.OPTS.SET("mode",null); 
      FOG.OPTS.SET("active",0);
      FOG.OPTS.SET("speed",10);
      FOG.OPTS.SET("scale",.999);
      FOG.OPTS.SET("zoom",1);
      FOG.OPTS.SET("fogsize",15);
      FOG.OPTS.SET("lradius",10); 
      FOG.OPTS.SET("zoomstep",1);
      FOG.OPTS.SET("cpos",{});   // this is the Centerpos searched for by FOG.SCREEN.MAP.FIND 
      FOG.OPTS.SET("been",FOG.CORE.DATA.GET("been")||[]);
      FOG.OPTS.SET("seen",[]);
      FOG.OPTS.SET("torch","https://vignette.wikia.nocookie.net/darksouls/images/c/c6/Torch_%28DSIII%29.png/revision/latest?cb=20160729181452");
      FOG.OPTS.SET("outtorch",'https://i.ibb.co/cTTzQXR/Torch-DSIII.webp');
      FOG.OPTS.SET("arrow","https://lh3.googleusercontent.com/fife/ABSRlIpqqBTVbtXByghtbIm0DcnMFKuSfZtGGPMHk-r8ilS9DE-sA4kU-LKV340y7-AL5AUB84AaVxU7jK9WlQgvy6K59xb9vyrcSsShOyZA6dzqGtkc7c71qvtdMFUzvC24CG-QeSsF9FXSBXlEJlbNLxZnLLQmpBpGDH8EVjLn1BZqhv6hnQOz1tlJMzqUePhE1BVP_Vda4YgA2SW_CqXikKsTaqjE-hV1vaC55Eh9iFoflj3uIR1hQOja9JHFjLeRxO_wmCbommcQ2m1XeO7btqm8OF6b2RBr9g_t-F1iIuPhXMjryBEHVbLjn1frPiaMMIFgDHRuw32oS1lX2weuGKxJU7OYkiMHsoRJPaXKEMkit0ZPBD_2cZq46GEcG2lw_rn-bBW8P5zwAdxxI_3pkXODgWJBQbbt91fLQQtbPiqEyx91k-MHoX5cn4-vOdRwCcS1tB568RuXWTmgQtuyaRHREfCidxmYoltxEPmwGWB54E_M8tnEvvLOQ-Ocv3P_lG9EGnX5rsTMqExWaTkDcmcuQ6T3jrH2grDGJxs44_zXgXB1l96Bkyk20O6n2CQjlxVfO9SeUaih_s9qC-OA8dQ8xkyxkX5E6ftX6hVDtrdFcTZRm6_mV1F6h35BEEZcqynx_j6XlJ7GUAHcdoJJr7x-iHnoECWCdcqLuF8rxHtLz1GTDiyAouxDaCFSj1QETdrvC8PxG2_vvPDeBFShlvIlPoDHMDcgSw=w3840-h1932-ft");//,"https://image.flaticon.com/icons/png/128/892/892692.png"
      FOG.OPTS.SET("torchtime",10);
      FOG.OPTS.SET("instr","v: map mode<br/><br/>c: character mode<br/><br/>SPACE: escape");
      FOG.OPTS.SET("charmode","click: step <br/>b/n: prev/next char<br/>&lt; - &gt;: rotate<br/>i: char info<br/><br/>SPACE: escape");
      FOG.OPTS.SET("mapmode","<br/>z/x: zoom in/out<br/>Arrows: pan<br/><br/>SPACE: escape");
      FOG.OPTS.SET("litclass","lit");
      FOG.OPTS.SET("beamclass","beam");
      FOG.OPTS.SET("fogclass","been");
      FOG.OPTS.SET("infraclass","infra");
      FOG.OPTS.SET("moves",2); // time tracker minimum
      FOG.OPTS.SET("time",0); // time tracker, in minutes
      FOG.OPTS.SET("march",true);
      FOG.OPTS.SET("beamoff",true);
      FOG.OPTS.SET("locked",false);
      // should be a better solution for stray tags like line & polylines :-(
      FOG.OPTS.SET("walkables", 'path,line,polyline,image');
      FOG.OPTS.SET("welcometitle","Welcome to FOG-Crawl!");
      FOG.OPTS.SET("welcometext", "<p>FOG-CRAWL is a map presentation tool for RPG Game Masters that keeps you in control. Pick any image to start mapping it!</p><p>Suggestions? Contributions?</p><p><a href='https://www.patreon.com/utmostgames'>Patreon</a></p><p><a href='https://twitter.com/utmost_games'>Twitter</a></p><p><a href='https://github.com/utmostgames/fog-crawl'>Github</a></p>");
      FOG.OPTS.SET("disclaimer","Whoops! It looks like your screen is too small to enjoy all the features of FOG-Crawl!  Please come back on a device over 900 pixels wide! We also recommend a mouse and keyboard to use all the features of FOG-Crawl.");

      FOG.OPTS.SET("debug",true);
      FOG.CORE.DATA.USEROPTS();
    }
    var _initFinish=function(){        
      FOG.SCREEN.MAP.FIND("initialized");
      FOG.SCREEN.MAP.LIGHTS();
      var storedtime = FOG.CORE.DATA.GET("time"); if (storedtime!=null){FOG.OPTS.SET("time",storedtime);}

      
      FOG.SCREEN.OUT(FOG.OPTS.GET("instr")); 
      FOG.SCREEN.OUT(FOG.CORE.DATA.TIMESTAMP(),false,document.getElementById("output0")); 
      FOG.SCREEN.XCSS("preload","currMap");          
      window.addEventListener("keydown", FOG.KEY.PRESS);
      window.addEventListener("resize", FOG.SCREEN.MAP.RESIZE);
      FOG.CORE.LOG("FOG: Finished loading.", FOG.CORE.DATA.NOW()-FOG.CORE.DATA.ZERO + "ms");
      FOG.TEST.ALL();
    }
    var _jlog=function(chardata){
      FOG.CORE.DATA.SET("char",JSON.parse(chardata)); 
      FOG.ENTRY.CHECKSVG();
    }
    var _jconfig=function(config){
      FOG.CORE.DATA.SET("config",JSON.parse(config));  
      FOG.ENTRY.CHECK();            
    }
    var _launch = function(svgdata){
      if (svgdata==null&&FOG.OPTS.GET("CORS")==false){
        FOG.SCREEN.MAP.SVGI();
      }else{
        FOG.SCREEN.MAP.SVGC(svgdata.documentElement);
      }
      FOG.SCREEN.MAP.SVG();
      FOG.SCREEN.FOG.SETFOG();
      FOG.CORE.CHAR.INIT();
    }
    return{LOG:_log,DATA:_data,CHAR:_char,INIT:_init,OPTS:_initOpts,LAUNCH:_launch,JLOG:_jlog,JCONFIG:_jconfig,FINISH:_initFinish};
  }();  
  FOG.KEY = function(){
    var _press = function(event){
      FOG.KEY.CHK(event.key.toLowerCase()); 
    }
    var _check = function(press){  
      function CheckMode(key){
            function startMapMode(){FOG.OPTS.SET("mode","map");    FOG.SCREEN.OUT(FOG.OPTS.GET("mapmode"));FOG.SCREEN.XCSS("char","map");}
            function startCharMode(){FOG.OPTS.SET("mode","char");  FOG.SCREEN.MAP.FIND("started char mode");  FOG.SCREEN.OUT(FOG.OPTS.GET("charmode")); FOG.SCREEN.ACSS("char","map");}
            function startNullMode(){FOG.OPTS.SET("mode",null);    FOG.SCREEN.OUT(FOG.OPTS.GET("instr"));FOG.SCREEN.XCSS("char","map");}
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
        if(key=="z"){
          if (FOG.OPTS.GET("zoom")>=1 && FOG.OPTS.GET("zoom")<(10*FOG.OPTS.GET("zoomstep"))){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")+FOG.OPTS.GET("zoomstep")); }
          else if (FOG.OPTS.GET("zoom")<1){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")+.1);}
        }
        if(key=="x"){
          if (FOG.OPTS.GET("zoom")>(FOG.OPTS.GET("zoomstep"))){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")-FOG.OPTS.GET("zoomstep"));}
          else if (FOG.OPTS.GET("zoom")>.1){FOG.OPTS.SET("zoom",FOG.OPTS.GET("zoom")-.1);}
        }
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
        FOG.SCREEN.MAP.FIND("panning");  
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
        while (FOG.OPTS.CHAR[testIndex].name.indexOf("torch")==0 || (!march && FOG.OPTS.CHAR[testIndex].moves<=0)){
          _loopList(up);
        }
        FOG.OPTS.SET("active",testIndex);
        var chr = FOG.OPTS.CHAR[FOG.OPTS.GET("active")];
        FOG.OPTS.SET("cpos",chr.pos); var spc=""; if (chr.special&&chr.special.name!="infra"){spc="* "+chr.special.name;}
        FOG.SCREEN.OUT("Char: <br/>"+chr.name+"<br/><br/>"+FOG.OPTS.GET("charmode"));
        if(FOG.OPTS.GET("active")==testIndex)
        {FOG.SCREEN.MAP.FIND("checked active character");}
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
        FOG.SCREEN.MAP.FIND("rotated");
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
            head.appendChild(style);
            style.appendChild(document.createTextNode(css));            
          };
    var _csslink = function(csslink){
        var head = document.head || document.getElementsByTagName('head')[0];
        var tag = document.createElement('link');
        tag.type = 'stylesheet';
        tag.src = csslink;
        head.appendChild(tag);
    }
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
      target=document.getElementsByTagName(target)[0] || document.getElementById(target);
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
    var _addClass=function(str,tgt){tgt=document.getElementById(tgt);
      try{tgt.classList.add(str);return true;}
      catch(ex){FOG.CORE.LOG(ex);}
    }
    var _rmClass=function(str,tgt){tgt=document.getElementById(tgt);
      try{tgt.classList.remove(str);return true;}
      catch(ex){FOG.CORE.LOG(ex);}
    }
    
    var _regions=function(){
      var region1 = {corners:{x:0,y:0,w:0,h:0},src:"https://fredhawk.neocities.org/i/fog/tunnel1.jpg",text:"Dark tunnel beneath Highcourt Castle"};
      var region2 = {corners:{x:0,y:0,w:0,h:0},src:"https://fredhawk.neocities.org/i/fog/tunnel2.jpg",text:"Further dark tunnels"};
      var region3 = {corners:{x:0,y:0,w:0,h:0},src:"https://fredhawk.neocities.org/i/fog/tunnel3.jpg",text:"Dark tunnel near a collapse; Centipedes"};
      var region4 = {corners:{x:0,y:0,w:0,h:0},src:"https://fredhawk.neocities.org/i/fog/tunnel4.jpg",text:"Yet further dark tunnels"};
      var _hittest = function(pt){
        var all = FOG.CORE.DATA.GET("regions");
        var scale = FOG.CORE.DATA.GET("scale");
        var any = []; 
        for (i=0;i<all.length;i++){
          if (pt.x>=(scale*all[i].corners.x) && pt.x<=(scale*(all[i].corners.x+all[i].corners.w)))
            if(pt.y>=(scale*all[i].corners.y) && pt.y<=(scale*(all[i].corners.y+all[i].corners.h))){
              any.push(all[i]);
            } 
        }
        for (j=0;j<any.length;j++){
          FOG.SCREEN.REGIONS.NEW(any[j]);
        }
      }
      var _new = function(rObj){ 
        var regions = document.getElementById("regions");
          var region = FOG.SCREEN.HTML("div","region",regions,"region");
          var eimg = FOG.SCREEN.HTML("div","eimg",region,"eimg");
          var etxt = FOG.SCREEN.HTML("div","etxt",region,"etxt");
          etxt.innerHTML=rObj.text; 
          
          FOG.SCREEN.FULL(FOG.SCREEN.IMG(rObj.src),eimg);
      };
              
      return{CHECK:_hittest,NEW:_new,R1:region1,R2:region2,R3:region3,R4:region4}
    }();
    
    var _fog = function(){
      // this function creates the Fog of War
      var _setfog=function (fogOn){
       if(fogOn!=false){   
         FOG.SCREEN.SVG('rect',null,"fog",{"x":"-50%","y":"-50%"},"currMap");
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
          //specials
          var spows = FOG.OPTS.GET("spows") ||[];
          for(i=0;i<spows.length;i++){
            FOG.SCREEN.CHAR.SPECIAL(spows[i]);
          }
      };
      // this function turns off all the current player lights by deleting current player lights and changing underlights to the 'been' status
      var _nolights=function(){        
        function resetLit(){
          var litup = document.querySelectorAll("svg > circle, svg > polygon"); 
          while (litup && litup.length && litup.length>0){          
            litup.forEach(function (){
              litup[0].remove();
            });
            litup = resetLit();
          } 
          var masklit = document.querySelectorAll("svg > defs > mask > .seen");
            masklit.forEach(function(){
              masklit[0].classList="been";
            });
          
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
            FOG.SCREEN.SVG('circle',null,lights[i].type+" seen",{"r":lights[i].radius,"cx":svgpt.x,"cy":svgpt.y},"currMap");
            //adds the underlight
            FOG.SCREEN.SVG('circle',null,lights[i].type+" seen",{"r":lights[i].radius,"cx":svgpt.x,"cy":svgpt.y},"mask");
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
      var _splitstartcsv = function(start){  
        var cpos={};      
        if(start!=null){
          var spl=start.split(",");
          try{
            var x=spl[0]; var y = spl[1];
            cpos.x=x;cpos.y=y;
          }catch(ex){}
          return cpos;
        }
      }
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
        var _arr= FOG.OPTS.GET(arrN); if (!Array.isArray(_arr)){_arr=[];}
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
            var dMap = document.getElementById("map"); 
            var px = dMap.style.left; var py = dMap.style.top;
            var scale = FOG.OPTS.GET("scale"); var r = FOG.OPTS.GET("lradius")/2;
              var cx=Math.floor((pt.x)/scale);
              var cy=Math.floor((pt.y)/scale);
          return {x:cx,y:cy};
        }
      return{OFFSET:_centeroffset,BEEN:_beenpush,SEEN:_seenpush,UNIQUE:_uniquepush,NEAR:_roundnearest,SVGNEAR:_svgnear,STARTPOS:_splitstartcsv};
    }();
    var _map = function(){
      var _svginit=function(){
        var elem = document.getElementById("currMap");
        var start=FOG.OPTS.GET("start");
        var scale=FOG.CORE.DATA.GET("scale")||1;
          FOG.OPTS.SET("scale",scale); console.log("SVG init Scale:",scale);
          var css = "svg{transform:scale("+scale+")";
          FOG.SCREEN.CSS(css);
          var userCSS=FOG.OPTS.GET("CSS");
          if (userCSS!=null){
            //add user CSS links, string[]
            FOG.SCREEN.STYLE(userCSS);
          }
        var cpos=FOG.CORE.DATA.GET("pos"); 
        if (cpos!=null){                  
          FOG.OPTS.SET("cpos",cpos);
        }
        else if(start!=null){
          var spl=start.split(",");
          try{
            var x=spl[0]; var y = spl[1];
            cpos.x=x;cpos.y=y;
          }catch(ex){}
            
          if (cpos.x!=null){            
            cpos={x:cpos.x*scale,y:cpos.y*scale};
            FOG.OPTS.SET("cpos",cpos);
            FOG.CORE.DATA.SET("pos",cpos);
          }
        } else{FOG.CORE.LOG("Unable to load Starting Postition",start,cpos);}
        
        var allWalkables = elem.querySelectorAll(FOG.OPTS.GET("walkables"));
        function walkPush(walk){this.onclick=FOG.SCREEN.MAP.CLICKING;}
        allWalkables.forEach(walkPush);
        function _initMask(){
          FOG.SCREEN.SVG("defs","defs",'',null,"currMap"); 
          FOG.SCREEN.SVG("mask","mask",null,null,"defs"); 

          FOG.SCREEN.SVG("radialGradient","litColorGrad",null,null,"defs");
          FOG.SCREEN.SVG("stop",null,null,{"offset":0,"stop-color":"white","stop-opacity":.5},"litColorGrad"); 
          FOG.SCREEN.SVG("stop",null,null,{"offset":.5,"stop-color":"white","stop-opacity":.05},"litColorGrad");
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
      var _svgImageInit=function(){
        FOG.SCREEN.SVG("svg","currMap","preload",null,"map");
        FOG.SCREEN.SVG("image","mappath",null,null,"currMap");
        var img = document.getElementById("mappath");
        img.setAttribute("href",FOG.CORE.DATA.GET("svgpath"));
      }
      var _svgCORSinit=function(elem){
        elem.id="currMap";elem.classList+="preload";
        map.appendChild(elem);
      }
      var _center=function(who){
        var pt=FOG.OPTS.GET("cpos"); 
        
        map.style.left=-pt.x+"px"; 
        map.style.top=-pt.y+"px"; 
        document.getElementById("regions").innerHTML="";
        FOG.SCREEN.REGIONS.CHECK(pt);
      };
      var _lights=function(){        
          FOG.SCREEN.FOG.NOLIGHT();
          FOG.SCREEN.FOG.LIGHT(); 
      }
      var _resize=function(){
        FOG.SCREEN.MAP.FIND("resized");}
      var _zoom=function(){         /// var scale=FOG.CORE.DATA.GET("scale"); /
        console.log("Zooming deprecated");
        //document.getElementById("currMap").style.transform="scale("+(zm*scale)+")"; 
        //center on active character
        //FOG.SCREEN.MAP.FIND("scaled");
      };
      var _clickfunction=function(e){
            FOG.SCREEN.MAP.MODE(e);
      };
      var _clickmode=function(e){
            var mode=FOG.OPTS.GET("mode");
            var zm=FOG.OPTS.GET("zoom");
            var onPath = false; switch (e.target.localName){
              case "path":
              case "line":
              case "polyline":
                onPath=true;
              case "image":
                if (FOG.OPTS.GET("CORS")==false){onPath=true;}
            }
        if ((mode=="char"||mode=="torch")&&onPath){
            var char = FOG.CORE.CHAR.AT();
            var sq = char.square;
            var cbox = document.getElementById(char.name).getBoundingClientRect();
            var px = e.clientX - cbox.left- sq*zm;
            var py = e.clientY - cbox.top- sq*zm;
            var pt = {x:px+char.pos.x,y:py+char.pos.y}; 
            if (mode=="torch"){
              FOG.KEY.CHK("c");
              if (FOG.OPTS.CHAR[FOG.OPTS.GET("active")].torches>0){
                FOG.SCREEN.CHAR.DROPTORCH(pt);
              }              
            }
            else if (!FOG.OPTS.GET("locked")){
                FOG.SCREEN.CHAR.CLICKED(pt);                            
            }
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
        FOG.OPTS.SET("time",cturn+1);
        FOG.SCREEN.OUT(FOG.CORE.DATA.TIMESTAMP(),false,document.getElementById("output0"));
        FOG.SCREEN.CHAR.NEWTURN();
      }
      return{SVG:_svginit,SVGI:_svgImageInit,SVGC:_svgCORSinit,FIND:_center,LIGHTS:_lights,RESIZE:_resize,ZOOM:_zoom,
        ONPATH:_onpath,HITA:_hitarray,HIT:_svghit,TRY:_try,CLICKING:_clickfunction,MODE:_clickmode,NEWTURN:_turn};
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
      var _moveattachedsvgs=function(cc,index){
        var asvgs = document.querySelectorAll("#special-"+cc.name,"#beam-"+cc.name,"#mask-"+cc.name);
        asvgs.forEach(el => el.remove());
        FOG.SCREEN.CHAR.SPECIAL(index);
      }
      var _charspecial=function(index,persist){ 
        if (index==null){FOG.CORE.LOG("SPECIAL NO INDEX ARGUMENT");}
        var char=FOG.CORE.CHAR.AT(index);  
        if (char.special){
          if (persist){
            var spows = FOG.OPTS.GET("spows")||[]; spows.push(index); FOG.OPTS.SET("spows",spows);
          }
            
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
            var max = FOG.OPTS.GET("scale")*FOG.OPTS.GET("fogsize")/2*(FOG.OPTS.GET("zoom"));  
          var _clickshort=function(){
            if (FOG.OPTS.GET("locked")){  
              setTimeout(function (){
                FOG.OPTS.SET("locked",false);
                FOG.SCREEN.XCSS("lock","map");},1000);
            }          
          }               
          if (dist<=max && !FOG.OPTS.GET("locked")){            
            FOG.OPTS.SET("locked",true);
            FOG.SCREEN.ACSS("lock","map");
            FOG.OPTS.SET("opos",cc.pos);
            FOG.SCREEN.CHAR.MOVE(cc.pos,pt); 
            FOG.SCREEN.GRID.BEEN(FOG.SCREEN.GRID.SVGNEAR(pt));
            _clickshort();
          }          
          FOG.SCREEN.CHAR.MARCH(index);
        FOG.SCREEN.MAP.LIGHTS();
        FOG.SCREEN.MAP.FIND("click moved");        
      };
      var _resetallmoves=function(){
          for (var c=0;c<FOG.OPTS.CHAR.length;c++){
            var cc=FOG.OPTS.CHAR[c];
            cc.moves=FOG.OPTS.GET("moves");
            if (cc.timer && cc.timer>0){
              cc.timer--;  FOG.OPTS.CHAR[c].timer=cc.timer;
              if(cc.timer && cc.timer<=FOG.OPTS.GET("time")){
                cc.lights=[];  //change img.src to unlit torch
                cc.src=FOG.OPTS.GET("outtorch");
                document.getElementById(cc.name).src=cc.src;
              }
            }  
          }          
        FOG.OPTS.SET("active",0);
      };
      var _droptorch=function(pos){
        var torch = {name:"torch"+pos.x+pos.y,
          pos:pos,
          lights:[FOG.SCREEN.CHAR.TORCH()],
          square:20,timer:FOG.OPTS.GET("torchtime")+FOG.OPTS.GET("time"),
          src:FOG.OPTS.GET("torch")
        };
        FOG.OPTS.CHAR.push(torch);
        // Find the active character, decrement their torches
        ;
        FOG.OPTS.CHAR[FOG.OPTS.GET("active")].torches--;

        FOG.SCREEN.FULL(FOG.CORE.CHAR.PLACE(FOG.OPTS.CHAR.length-1),map);
        FOG.SCREEN.MAP.LIGHTS();
        FOG.SCREEN.MAP.FIND("dropped torch");
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
          var cc= FOG.CORE.CHAR.AT(active); var scale = parseInt(FOG.CORE.DATA.GET("scale"))||1;
          var svgpt = FOG.SCREEN.GRID.SVGNEAR(cc.pos); 
          var power = 10; var threshold=2; var angle = 30;
          // here we need to check direction to nominate 3 points: cc.pos, ccwfar, cwfar
          // so, straight line out from cc.pos-> ccwfar -> cwfar -> cc.pos, then fill with radial gradient!
          var cx = svgpt.x+1; var cy=svgpt.y-.5;
          var ccw = {x:cx,y:cy};var cw = {x:cx,y:cy};
          var face=cc.orient;     console.log(face);
          var xAmt=0,yAmt=0,xOff=0,yOff=0;
          switch (face){
            case "S": yAmt=-1; xOff=-1;
              break;
            case "N": yAmt=1;  xOff=1;
              break;
            case "W": xAmt=1;  yOff=-1;
              break;
            case "E": xAmt=-1; yOff=1;
              break;
          }
          ccw.x+=(angle*xAmt)+ (power*xOff);ccw.y+=(angle*yAmt+(power*yOff));
          cw.x+=(angle*xAmt)- (power*xOff);cw.y+=(angle*yAmt-(power*yOff));

          var ptstr = cx+" "+cy+" "+ccw.x+" "+ccw.y+" "+cw.x+" "+cw.y+" "+cx+" "+cy; FOG.CORE.LOG("beam at",ptstr);
          FOG.SCREEN.SVG("polygon","beam-"+cc.name,"lit",{"points":ptstr,"stroke":"none"},"currMap");
          FOG.SCREEN.SVG("polygon","mask-"+cc.name,"seen",{"points":ptstr,"stroke":"none"},"mask");
          /*
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
          */
        }
      };
      var _beamoff= function(){return FOG.OPTS.GET("beamoff");}
      var _beamon=function(val){
        val = val || !FOG.SCREEN.CHAR.BEAMOFF(); 
        FOG.OPTS.SET("beamoff",val); 
        var a = FOG.OPTS.GET("active");
          document.querySelectorAll("svg > polygon #beam-"+FOG.CORE.DATA.GET("char")[a].name).forEach(el => el.remove());
        if (val){
            FOG.OPTS.SET("spows",(FOG.OPTS.GET("spows")||[]).filter(e => e !== a));
        }   else {FOG.SCREEN.CHAR.SPECIAL(a,true);}
          FOG.SCREEN.MAP.LIGHTS();
      };
      
      return{MOVE:_movechar,MARCH:_march,TORCH:_torch,INFRA:_infra,DROPTORCH:_droptorch,BEAM:_beamfrom,CLICKED:_clickmove,
        SPECIAL:_charspecial,SPOW:_allspecials,SPTYPE:_specialsbytype,NEWTURN:_resetallmoves,BEAMOFF:_beamoff,BEAMON:_beamon,ATTACHED:_moveattachedsvgs};
    }();
    
    var _init = function(){
      if (document.getElementById("screen")==null){
          
        var _debug="screen"; if (!!FOG.OPTS.GET("debug")){_debug+=" debug"};
        var ourscreen=FOG.SCREEN.HTML("div", "screen",document.body,_debug);
        var mapEl=FOG.SCREEN.HTML("div","map",ourscreen,"map");
        
        var ourout = FOG.SCREEN.HTML("div","outputdiv",ourscreen,"output");
        FOG.SCREEN.HTML("div","output0",ourout,"x");
        FOG.SCREEN.HTML("div","output",ourout,"x");
        FOG.SCREEN.HTML("div","output2",ourout,"x");
        
        var regions = FOG.SCREEN.HTML("div","regions",ourscreen,"regions");
      }
      FOG.CORE.OPTS();
    }
    return {OUT:_out,CSS:_css,STYLE:_csslink,HTML:_makeel,FULL:_fullElementArray,IMG:_imgHTML,ACSS:_addClass,XCSS:_rmClass,SVG:_makesvgtag,REGIONS:_regions,FOG:_fog,GRID:_grid,MAP:_map,CHAR:_char,INIT:_init};
  }();
  FOG.ENTRY = function(){  
    
        var _start = function(){      
          FOG.SCREEN.INIT();
            FOG.ENTRY.NEWUI();
        }
        var _startui = function(){

          var startdiv = document.getElementById("startdiv"); if (startdiv!=null){startdiv.remove();}
          startdiv = FOG.SCREEN.HTML("div","startdiv",document.getElementById("screen"),"splash");
          var startbtn = FOG.SCREEN.HTML("div","start",startdiv,"ui");
          startbtn.onclick=function(){
            document.getElementById("startdiv").remove();
          };
          startbtn.innerText="Start New";
          //if any stored Campaigns are found, present option to Use stored data
          var saves = FOG.ENTRY.SAVES();
          if (saves!=null && saves.config!=null){
            var expbtn = FOG.SCREEN.HTML("div","export",startdiv,"ui");
            expbtn.onclick=function(){
              FOG.ENTRY.FULL("export");
            };
            expbtn.innerText="Export Save Data";
          }
          var impbtn = FOG.SCREEN.HTML("div","import",startdiv,"ui");
          impbtn.onclick=function(){
            FOG.ENTRY.FULL("save");
          };
          impbtn.innerText="Import Save Data";
        }
        var _newcampaignui = function(){
          FOG.ENTRY.NONEW();
          var isNew=""; if (localStorage.length<1){isNew=" new";}
          newdiv = FOG.SCREEN.HTML("div","newdiv",document.getElementById("screen"),"splash"+isNew);
          //add "return" class to newdiv if return visitor
          var welcome = FOG.SCREEN.HTML("div","welcome",newdiv,"welcome");
          var wleft = FOG.SCREEN.HTML("div","wleft",welcome,"left");
          var wmiddle = FOG.SCREEN.HTML("div","wmiddle",welcome,"middle");
          var wright = FOG.SCREEN.HTML("div","wright",welcome,"right");
          var wtitle = FOG.SCREEN.HTML("h1",null,wmiddle,"title"); wtitle.innerText=FOG.OPTS.GET("welcometitle");
          var wtext = FOG.SCREEN.HTML("div",null,wmiddle,"text"); wtext.innerHTML=FOG.OPTS.GET("welcometext");
          var mbed='<iframe src="https://www.youtube.com/embed/7karfJbCTkc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
          wleft.innerHTML=mbed;        
          var wdisclaimer = FOG.SCREEN.HTML("div","wbottom",welcome,"disclaimer");
          wdisclaimer.innerText=FOG.OPTS.GET("disclaimer")
          FOG.SCREEN.HTML("p","space",newdiv,"clear");

          var datadiv = FOG.SCREEN.HTML("div","datadiv",newdiv,"wide");
          var deletebtn = FOG.SCREEN.HTML("div","delete",datadiv,"ui light red");
          deletebtn.onclick=function(){
            FOG.CORE.DATA.CLEAR();FOG.ENTRY.NEWUI();
          };
          deletebtn.innerHTML="<span class='dot'></span>Delete All (no undo!)";
          var importbtn = FOG.SCREEN.HTML("div","import",datadiv,"ui");
          importbtn.onclick=function(){
            FOG.ENTRY.FULL("import");
          };
          importbtn.innerHTML="<span class='dot'></span>Import Data";
          var exportbtn = FOG.SCREEN.HTML("div","export",datadiv,"ui");
          exportbtn.onclick=function(){
            FOG.ENTRY.FULL("export");
          };
          exportbtn.innerHTML="<span class='dot'></span>Export Data";

          var exportavailable=false;
          var detect = (FOG.CORE.DATA.GET("svgpath")!=null && FOG.CORE.DATA.GET("pos")!=null) ? " green" : "";
          if (detect!=""){exportavailable=true;}
          var cmapbtn = FOG.SCREEN.HTML("div","cmap",newdiv,"ui light red"+detect);
          cmapbtn.onclick=function(){
            FOG.ENTRY.NONEW();
            if (FOG.CORE.DATA.GET("svgpath")==null){
              FOG.ENTRY.PATH("svg");
            } else {FOG.ENTRY.CENTER();}
          };
          FOG.SCREEN.HTML("span",null,cmapbtn,"dot");
          cmapbtn.innerHTML="<span class='dot'></span>Center Map (required)";

          detect = FOG.CORE.DATA.GET("char")==null ? "" : " green";
          var charsbtn = FOG.SCREEN.HTML("div","chars",newdiv,"ui light yellow"+detect);
          charsbtn.onclick=function(){var chars=FOG.CORE.DATA.GET("char");
            if (chars==null||char[0]==null||char[0].name==null||char[0].name==""){
              FOG.ENTRY.PATH("char");
            } else {FOG.ENTRY.CHARUI();}
          };
          charsbtn.innerHTML="<span class='dot'></span>Choose Characters (optional)";

          detect = FOG.CORE.DATA.GET("config")==null ? "" : " green";
          var cfgbtn = FOG.SCREEN.HTML("div","cfg",newdiv,"ui light yellow"+detect);
          cfgbtn.onclick=function(){
            if (FOG.CORE.DATA.GET("config")==null){
              FOG.ENTRY.PATH("config");
            }
          };
          cfgbtn.innerHTML="<span class='dot'></span>Configure Campaign (fine control)";

          detect = exportavailable ? "go" : "disabled";
          var crawlbtn = FOG.SCREEN.HTML("div","crawl",newdiv,"ui light "+detect);
          if (exportavailable){
            crawlbtn.onclick=function(){
            FOG.ENTRY.FINISH();
           };
          }
          crawlbtn.innerHTML="<span class='dot'></span>Crawl!";
          
        }
        var _configui = function(){
          console.log("UI Configuration start (empty)");
        }
        var _charui = function(){
          console.log("UI Character Editor view");
        }
        var _checkui=function(){
          document.querySelectorAll(".ui.input,.ui.biginput").forEach(el => el.remove());
          FOG.ENTRY.NEWUI();
        }
        var _nonew = function(){var newdiv = document.getElementById("newdiv"); if (newdiv!=null){newdiv.remove();}}
        var _prompts = function(){
              FOG.ENTRY.PATH("config");
        }
              //check for paths to char & svg
        var _checkConfigPaths = function(){
             
          var config = FOG.CORE.DATA.GET("config");   
          if(config!=null){
            FOG.ENTRY.PARSECONFIG(config,true);
          }
        }
        var _checkCharpath = function(){  
          if (FOG.CORE.DATA.GET("char")==null){
            if (FOG.CORE.DATA.GET("charpath")==null){
              FOG.ENTRY.PATH("char");
            }
            else {FOG.CORE.DATA.JSONCHAR(FOG.CORE.DATA.GET("charpath"))}

          } else {FOG.ENTRY.CHECKSVG();} 
        }
        var _checkSvgPath = function(){
          if (FOG.CORE.DATA.GET("svgpath")==null){
              var config = FOG.CORE.DATA.GET("config");
              if(config!=null){            
                if(config.svg!=null && config.svg[0]!=null && config.svg[0].path!=null){
                  FOG.CORE.DATA.SET("svgpath",config.svg[0].path); 
                  FOG.ENTRY.LAUNCH();
                }
                else{    
                  FOG.ENTRY.PATH("svg");
                }
              } else {console.log("no config found, cannot continue!");}
          }
          else {FOG.ENTRY.LAUNCH();}
        }
        var _checkFatal = function(){      
          var fatal = false;
          if (FOG.CORE.DATA.GET("char")==null){
            FOG.CORE.LOG("No valid characters found! Confirm that your char.json file is valid.");
            fatal=true;
          } 
          if (FOG.CORE.DATA.GET("svgpath")==null && FOG.CORE.DATA.GET("svgraw")==null){
            FOG.CORE.LOG("No valid SVG found! Check your svg file in another program.");
            fatal=true;
          }
          //if (fatal){alert("Fatal exception(s)! Cannot continue. Check the console for errors.");}
        }
    
        var _generalentry = function(store,index,func,content1,content2,classes,twice){ 
          twice=twice||false; var option =""; if (!twice&&index!="fullexport"&&index!="fullimport"){option="- OR - "}
            var id = index; var d=document.getElementById(id);
            if (d==null){d = FOG.SCREEN.HTML("div",id,document.getElementById("screen"),"ui "+classes);}
            FOG.SCREEN.HTML("p",null,d).innerHTML=option+content1+store.toUpperCase()+content2;
            var btn = FOG.SCREEN.HTML("input",null,d); btn.type="submit"; btn.value="Submit";
            btn.onclick=func;      d.appendChild(btn);
            if (twice){
              FOG.ENTRY.FULL(store);
            }
        }
        var _parseconfig = function(config,fromJson){
              if(config!=null){
                if (!fromJson){FOG.CORE.DATA.SET("config",config);}
                  if(config.svg!=null && config.svg[0]!=null && config.svg[0].path!=null){
                    FOG.CORE.DATA.SET("svgpath",config.svg[0].path); 
                    if (config.svg[0].start!=null){
                      FOG.OPTS.SET("start",config.svg[0].start);
                    }
                    if (config.svg[0].face!=null){
                      FOG.OPTS.SET("face",config.svg[0].face);
                    }
                    if (config.svg[0].scale!=null){
                      FOG.OPTS.SET("scale",config.svg[0].scale);
                    }
                  }
                  if (config.charpath!=null&&FOG.CORE.DATA.GET("char")==null){
                    FOG.CORE.DATA.SET("charpath",config.charpath);
                  }
                FOG.ENTRY.CHECKCHAR();
              } else {console.log("No config found, cannot continue")}
        }
        var _pathentry = function(store){
          var config1 = "Paste the path to a well-formatted ";
          var config2 = ":<br/><input class='manualtxt' cols='50'></input><br/>";
          var stores=["config","char","svg"];
          var index=0; if (store==stores[1]){index=1}else if (store==stores[2]){index=2;}
          function configpath(){          
            var config = document.querySelector("#pathconfig .manualtxt");   
            if (config!=null&&config.value!=null&&config.value!=""){
              FOG.CORE.DATA.JSONCONFIG(config.value);
            }                
            FOG.ENTRY.CHECKUI();
          }
          function charpath(){          
            var char = document.querySelector("#pathchar .manualtxt");      
            if (char!=null&&char.value!=null&&char.value!=""){
              FOG.CORE.DATA.SET("charpath",char.value);
              FOG.CORE.DATA.JSONCHAR(char.value);
            }
            FOG.ENTRY.CHECKUI();
          }
          function svgpath(){
            var svg = document.querySelector("#pathsvg .manualtxt");   
            if(svg!=null&&svg.value!=null&&svg.value!=""&&FOG.CORE.DATA.GET("svgpath")==null)            {
              FOG.CORE.DATA.SET("svgpath",svg.value);
              FOG.CORE.DATA.SVG(svg.value);
              FOG.ENTRY.CENTER();
            } else {console.log("could not find svg, cannot continue!");}
            FOG.ENTRY.CHECKUI();
          }
          var func=[configpath,charpath,svgpath]
          console.log("path"+store);
          FOG.ENTRY.MANUAL(store,"path"+store,func[index],config1,config2,"input",true);
        }
        var _fileentry = function(){

        }
    
        var _fullentry = function(store){ 
            var config1 = "Paste the content from a well-formatted ";
            var config2 = ":<br/><textarea class='manualtxt' rows='10' cols='50'></textarea><br/>";
            
            var stores=["config","char","svgraw","save","export"];
            var index=0; if (store==stores[1]){index=1}else if (store==stores[2]){index=2;}else if (store==stores[3]){index=3;}else if (store==stores[4]){index=4;}
            var configfunc = function(){var c = document.querySelector("#fullconfig .manualtxt");
              if (c!=null&&c.value!=null&&c.value!=""){FOG.ENTRY.PARSECONFIG(JSON.parse(c.value));}  
              FOG.ENTRY.CHECKUI();
            };  
            var charfunc = function(){
              var char = document.querySelector("#fullchar .manualtxt");
              if (char!=null&&char.value!=null&&char.value!=""){FOG.CORE.DATA.SET("char", JSON.parse(char.value));}  
              FOG.ENTRY.CHECKUI();
              FOG.ENTRY.CHECKSVG();           
            }  
            var svgfunc = function(){
              var svg = document.querySelector("#fullsvg .manualtxt");
              if (svg!=null&&svg.value!=null&&svg.value!=""){FOG.CORE.DATA.SET("svgraw", svg.value);} 
              FOG.ENTRY.CHECKUI();
            }
            var savefunc = function(){
              var save = document.querySelector("#fullsave .manualtxt");
              if (save!=null&&save.value!=null&&save.value!=""){FOG.CORE.DATA.IMSAVE(save.value);}  
              FOG.ENTRY.CHECKUI();
            }
            var exportfunc = function(){
              FOG.ENTRY.CHECKUI();
            }
            var func=[configfunc,charfunc,svgfunc,savefunc,exportfunc]
    
            if (index==4){
              config1="Copy the below JSON data and keep it safe! ";
            }
            FOG.ENTRY.MANUAL(store,"full"+store,func[index],config1,config2,"biginput");
            if (index==4){
              document.querySelector("#fullexport .manualtxt").value=FOG.CORE.DATA.EXSAVE();
            }
        }    
        var _getsvgcenter = function(){
          document.querySelectorAll("#newui").forEach(el => el.remove());
          FOG.SCREEN.HTML("div","center",document.getElementById("screen"),"splash");
          FOG.SCREEN.SVG("svg","centersvg",null,null,"center");
          FOG.SCREEN.HTML("div","instr",document.getElementById("center"),"instr");  
          FOG.SCREEN.HTML("div","cbox",document.getElementById("center"));
          FOG.SCREEN.HTML("div","ctxt",document.getElementById("cbox")); ctxt.innerHTML="0,0";
          //gradient 
          FOG.SCREEN.SVG("defs","defs",'',null,"centersvg"); 

          FOG.SCREEN.SVG("radialGradient","radiusColorGrad",null,null,"defs");
          FOG.SCREEN.SVG("stop",null,null,{"offset":0,"stop-color":"red","stop-opacity":0},"radiusColorGrad"); 
          FOG.SCREEN.SVG("stop",null,null,{"offset":.2,"stop-color":"red","stop-opacity":.75},"radiusColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":.4,"stop-color":"red","stop-opacity":0},"radiusColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":.6,"stop-color":"red","stop-opacity":.75},"radiusColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":.8,"stop-color":"red","stop-opacity":0},"radiusColorGrad");
          FOG.SCREEN.SVG("stop",null,null,{"offset":1,"stop-color":"red","stop-opacity":.75},"radiusColorGrad");

          FOG.SCREEN.SVG("image","cimg",null,null,"centersvg"); 
          FOG.OPTS.SET("scale",1);

          function processXY(event){
            var x = (Math.round((event.clientX-FOG.ENTRY.SVGLEFT))); 
            var y = (Math.round((event.clientY-FOG.ENTRY.SVGTOP))); 
            FOG.ENTRY.CX=x; FOG.ENTRY.CY=y;
            //set a circle           
            document.querySelectorAll('.cir').forEach(e => e.remove());
            //given a 20 pixel character image, "10px"=1 foot; default lradius of 10 = 10ft diameter
            FOG.SCREEN.SVG('rect',"cir","cir",{"width":20,"height":20,"x":x-10,"y":y-10},"centersvg");
            FOG.SCREEN.SVG('circle',"radius","cir",{"r":10*FOG.OPTS.GET("lradius"),"cx":x,"cy":y},"centersvg");
            //show, save Start point
            var scale = FOG.OPTS.GET("scale") || 1;
            var out = Math.round(x/scale)+","+Math.round(y/scale);
            FOG.SCREEN.OUT(out,false,ctxt);
            FOG.OPTS.SET("start",out);   
            FOG.ENTRY.ZERO();
          }
          var img = document.getElementById("cimg");
          img.setAttribute("href",FOG.CORE.DATA.GET("svgpath"));
          var rect = img.getBoundingClientRect();
          FOG.ENTRY.SVGTOP=rect.top;FOG.ENTRY.SVGLEFT=rect.left;
          img.onclick = processXY;

          FOG.SCREEN.HTML("div","plus",cbox,"zoom");
          FOG.SCREEN.HTML("div","minus",cbox,"zoom");
          plus.setAttribute("data-zoom",true); minus.setAttribute("data-zoom",false);
          plus.onclick=function(){FOG.ENTRY.SCALE(true)};plus.innerHTML="+"
          minus.onclick=function(){FOG.ENTRY.SCALE(false)};minus.innerHTML="-";
          cimg.style.zindex="-10000";
          
          FOG.SCREEN.HTML("div","contbtn",cbox,"btn");
          contbtn.innerHTML="Continue";contbtn.onclick=function(){ 
            FOG.CORE.DATA.SET("scale",FOG.OPTS.GET("scale"));
            FOG.CORE.DATA.SET("pos",FOG.OPTS.GET("cpos")); 
            FOG.ENTRY.GETREGIONS();
          };
          var instr="Choose the starting position on your map, then zoom (+) to scale and readjust.  The green square is a 20-pixel person; the outside of the red circle is a 10-foot radius. Continue when done.";
          document.getElementById("instr").innerText=instr;
        }
        var _resetforregions=function(){
            FOG.OPTS.SET("scale",1);
            centersvg.style.left="0px"; 
            centersvg.style.top="0px"; 
            cimg.style.transform="scale(1)";
            var rect = document.getElementById("cimg").getBoundingClientRect();
            FOG.ENTRY.SVGTOP=rect.top;FOG.ENTRY.SVGLEFT=rect.left;
        }
        var _zero=function(){  
          var cpos = FOG.SCREEN.GRID.STARTPOS(FOG.OPTS.GET("start"));
          FOG.ENTRY.CPOS = cpos;
          if (cpos.x!=null){           
            var scale = FOG.OPTS.GET("scale");
            cpos={x:(cpos.x)*scale,y:(cpos.y)*scale}; console.log("setting Zero for",cpos);
            FOG.OPTS.SET("cpos",cpos);
            var w = parseInt(window.innerWidth*.3); var h = parseInt(window.innerHeight*.3);
            centersvg.style.left=(-parseInt(cpos.x)+w)+"px"; 
            centersvg.style.top=(-parseInt(cpos.y)+h)+"px"; 
          } 
          var rect = document.getElementById("cimg").getBoundingClientRect();
          FOG.ENTRY.SVGTOP=rect.top;FOG.ENTRY.SVGLEFT=rect.left;
        };
        var _setscale = function(incr){ 
          var scale = 1; var oS = parseInt(FOG.OPTS.GET("scale"));if (oS>0){scale=oS;}
          var cir = document.getElementById("cir");
          var radius = document.getElementById("radius");

          FOG.ENTRY.OSCALE=scale;

          if (incr){if (scale>=1){scale++;}else {scale+=.1;}}
          else { if (scale>1){scale--;}
            else if (scale<=1&&scale>.4){scale-=.1;} 
          }
          FOG.OPTS.SET("scale",scale);
          cimg.style.transform="scale("+scale+")";
          if (cir!=null&&FOG.ENTRY.CPOS!=null){
            var ox=FOG.ENTRY.CPOS.x*(scale); var oy=FOG.ENTRY.CPOS.y*(scale);
            cir.setAttribute("x",ox-10); cir.setAttribute("y",oy-10);
            radius.setAttribute("cx",ox); radius.setAttribute("cy",oy);
          }
          var Rs = document.querySelectorAll("#center svg rect.region"); 
          for (i=0;i<Rs.length;i++){
            var x = Rs[i].getAttribute("ox");
            var y = Rs[i].getAttribute("oy");
            var w = Rs[i].getAttribute("ow");
            var h = Rs[i].getAttribute("oh");
            Rs[i].setAttribute("x",x*scale);
            Rs[i].setAttribute("y",y*scale);
            Rs[i].setAttribute("width",w*scale);
            Rs[i].setAttribute("height",h*scale);
          }
          
          FOG.ENTRY.ZERO();
        }
        var _transform = function (){

        }
        var _getregions = function(){ var exists = FOG.CORE.DATA.GET("regions");
          if (exists!=null && exists[0]!=null){FOG.ENTRY.NEWUI();}else{
            FOG.ENTRY.RRESET();
            var instr="Now add any regions: Drag to draw a zone. Give it an image link and flavor text and click Add This. Add as many as you like!";
            document.getElementById("instr").innerText=instr;
            var cbox = document.getElementById("cbox");
            document.querySelectorAll('.cir').forEach(e => e.remove());
            document.getElementById("contbtn").remove();
            FOG.ENTRY.REGIONS=[];
            var uiRegions = document.getElementById("center");
            uiRegions.classList.add("region-menu");
            var img = document.getElementById("cimg"); img.onclick=null;
            FOG.SCREEN.HTML("div","newr",document.getElementById("cbox"),"btn");
            newr.innerHTML="New Region";newr.onclick=function(){ 
              FOG.ENTRY.ADDR(); 
              uiRegions.classList.add("region-add");
            }
            FOG.SCREEN.HTML("div","srcbox",cbox,"txtarea");
            (FOG.SCREEN.HTML("p","lsrc",srcbox)).innerText="(link to image) ";
            FOG.SCREEN.HTML("input","tsrc",srcbox);
            FOG.SCREEN.HTML("div","txtbox",cbox,"txtarea");
            (FOG.SCREEN.HTML("p","ltxt",txtbox)).innerText="(description) ";
            FOG.SCREEN.HTML("input","ttxt",txtbox);
            tsrc.onblur=function(){var v = this.value;console.log("src",v); FOG.ENTRY.R.src=v;}
            ttxt.onblur=function(){var v = this.value;console.log("txt",v); FOG.ENTRY.R.text=v;}
            
            FOG.SCREEN.HTML("div","addr",document.getElementById("cbox"),"btn");
            addr.innerHTML="Add This";addr.onclick=function(){ 
              document.getElementById("new-region").id="old";
              FOG.ENTRY.REGIONS.push(FOG.ENTRY.R);
              FOG.ENTRY.RBOX=null;            
              uiRegions.classList.remove("region-add");
            }

            FOG.SCREEN.HTML("div","canr",cbox,"btn");
            canr.innerHTML="Cancel";canr.onclick=function(){ 
              document.getElementById("new-region").remove();
              uiRegions.classList.remove("region-add");
            }
            FOG.SCREEN.HTML("div","contbtn",cbox,"btn");
            contbtn.innerHTML="Finished";contbtn.onclick=function(){ 
              FOG.CORE.DATA.SET("regions",FOG.ENTRY.REGIONS);
              document.getElementById("center").remove(); 
              FOG.ENTRY.NEWUI();
            };
            FOG.ENTRY.DRAG=false;
          }
        }
        var _startNewRegion = function(){ 
          document.getElementById("ttxt").value="";document.getElementById("tsrc").value="";
          FOG.ENTRY.R=FOG.ENTRY.NEWR();
          FOG.SCREEN.SVG('rect',"new-region","region",{"width":0,"height":0,"x":0,"y":0},"centersvg");
          FOG.ENTRY.RBOX=document.getElementById("new-region");
          var img = document.getElementById("cimg");
          
          var _regionDown = function(e){
            FOG.ENTRY.DRAG=true;
            var x = (Math.round((e.clientX-FOG.ENTRY.SVGLEFT))); 
            var y = (Math.round((e.clientY-FOG.ENTRY.SVGTOP))); 
            if (FOG.ENTRY.R!=null){ 
              var scale = FOG.OPTS.GET("scale") || 1;
              FOG.ENTRY.R.corners.x=x/scale;
              FOG.ENTRY.R.corners.y=y/scale;
              FOG.ENTRY.RBOX.setAttribute("x",x);
              FOG.ENTRY.RBOX.setAttribute("y",y); console.log("started r",x,x/scale,y,y/scale);
            }
          }
          var _regionDrag = function(e){
            if (FOG.ENTRY.DRAG){              
              var x = (Math.round((e.clientX-FOG.ENTRY.SVGLEFT))); 
              var y = (Math.round((e.clientY-FOG.ENTRY.SVGTOP)));
              var scale = FOG.OPTS.GET("scale") || 1; 
              var w = x-(FOG.ENTRY.R.corners.x*scale);
              var h = y-(FOG.ENTRY.R.corners.y*scale);
              FOG.ENTRY.RBOX.setAttribute("width",w);
              FOG.ENTRY.RBOX.setAttribute("height",h);
            }
          }
          var _regionRelease = function(e){
            if (FOG.ENTRY.DRAG){
              FOG.ENTRY.DRAG=false;
              var x = (Math.round((e.clientX-FOG.ENTRY.SVGLEFT))); 
              var y = (Math.round((e.clientY-FOG.ENTRY.SVGTOP))); 
              var scale = FOG.OPTS.GET("scale") || 1;
              FOG.ENTRY.R.corners.w=(x/scale)-FOG.ENTRY.R.corners.x;
              FOG.ENTRY.R.corners.h=(y/scale)-FOG.ENTRY.R.corners.y;
              FOG.ENTRY.RBOX.setAttribute("ox",FOG.ENTRY.R.corners.x);
              FOG.ENTRY.RBOX.setAttribute("oy",FOG.ENTRY.R.corners.y);
              FOG.ENTRY.RBOX.setAttribute("ow",FOG.ENTRY.R.corners.w);
              FOG.ENTRY.RBOX.setAttribute("oh",FOG.ENTRY.R.corners.h);
              console.log("region completed:",FOG.ENTRY.R);
            }
          }
          img.onmousedown=_regionDown;
          img.onmousemove=_regionDrag;
          img.onmouseup=_regionRelease;
        }
        var _newregion = function (){return {"corners":{x:-1,y:-1,w:-1,h:-1},"src":"","text":""};}
        var _findsaves = function(){
          var saves = {};
          saves.config=FOG.CORE.DATA.GET("config");
          return saves;
        }
        var _launchcentering = function(){
          //this means there is no stored START data (from Entry)
          var config=FOG.CORE.DATA.GET("config")||{};
          if (config.start==null&&FOG.OPTS.GET("start")==null&&FOG.CORE.DATA.GET("pos")==null){
            FOG.ENTRY.CENTER();
          }else{
            FOG.ENTRY.GETREGIONS();
          }
        }
        var _escape=function(){
          if (document.getElementById("center")!=null){document.getElementById("center").remove(); }
          if (document.getElementById("newdiv")!=null){document.getElementById("newdiv").remove(); }
          
          FOG.CORE.INIT();
        }
    
        return {START:_start,SAVES:_findsaves,PROMPT:_prompts,LAUNCH:_launchcentering,MANUAL:_generalentry,PATH:_pathentry,FILE:_fileentry,CHECKFATAL:_checkFatal,
                CHECK:_checkConfigPaths,CHECKCHAR:_checkCharpath,CHECKSVG:_checkSvgPath,FULL:_fullentry,FINISH:_escape,
                CHECKUI:_checkui,STARTUI:_startui,NONEW:_nonew,NEWUI:_newcampaignui,CONFIGUI:_configui,CHARUI:_charui,
                PARSECONFIG:_parseconfig,CENTER:_getsvgcenter,SCALE:_setscale,ZERO:_zero,GETREGIONS:_getregions,ADDR:_startNewRegion,NEWR:_newregion,RRESET:_resetforregions
        };
  }();
  FOG.TEST = function(){
    var _all = function(){
        //FOG.OPTS.SET("test",true);
        //FOG.CORE.LOG("Starting tests...");
      
        //FOG.CORE.LOG("Ending tests...");
        //FOG.OPTS.SET("test",false);
    }
    return{ALL:_all};
  }();
  FOG.INIT = function(){ var startup = FOG.CORE.INIT; startup = FOG.ENTRY.START();
    window[ addEventListener ? 'addEventListener' : 'attachEvent' ]( addEventListener ? 'load' : 'onload', startup );
  }();