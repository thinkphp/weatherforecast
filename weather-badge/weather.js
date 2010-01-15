var yahooweatherbadge = function(){

    var container, units, style;

    function init() {

        var sc = document.getElementsByTagName('script');

            for(var i=0;i<sc.length;i++) {

                if(sc[i].src.indexOf('weather.js') != -1) {
  
                   units = 'f';      

                   var elem = sc[i];

                   var content = elem.innerHTML.split(',');

                   var city = content[0].split(":")[1];  

                       if(city && typeof city === 'string') {

                               var location = encodeURIComponent(city);
                       } 

                   var u = content[1].split(":")[1];

                       units = (u === 'c') ? 'c' : 'f';

                       style = content[2].split(":")[1];

                       break;                           

                };//endif

            };//endfor     

                container = document.createElement('div');

                container.className = 'yahooweather';

                container.appendChild(document.createTextNode('Weather loading...')); 

                elem.parentNode.insertBefore(container,elem);

                elem.parentNode.removeChild(elem);

                var endpoint = 'http://query.yahooapis.com/v1/public/yql?q=';

                var yql = 'use "http://thinkphp.ro/apps/YQL/weather-forecast/weather.woeid.xml" as weather; select * from weather where location="'+location+'" and unit="'+units+'"';

                var src = endpoint + encodeURIComponent(yql) + '&format=json&callback=yahooweatherbadge.seed';

                loadScript(src,function(){if(window.console){console.log(yql)}}); 

    }//end function

    function seed(o) {

      var wdata = o.query.results.weather.rss.channel;

          if(wdata.title.indexOf('Error') == -1) {

                   var elem = document.getElementById('weather');

                   var title = wdata.title, link = wdata.link, temperature = wdata.item.condition.temp;

                   var weather = wdata.item.condition.text;

                   var type = wdata.units.temperature;

                   var pic = wdata.item.description.match(/src="([^"]+)".*/)[1];

                   var forecast = '';
                  
                   var all = wdata.item.forecast.length;

                   for(var i=0,j=all;i<j;i++) {

                         var curr = wdata.item.forecast[i];

                             forecast += '<li><strong>'+curr.date+'</strong>: '+curr.text+' , low: '+curr.low+' high: '+curr.high+'</li>';
                   }//endfor

                  var badge = '<h5>'+wdata.title+'</h5>'+

                              '<p class="condition">'+

                              '<img src="'+pic+'" alt="">'+

                              '<span>'+temperature+' '+type+', '+weather+'<span>'+

                              '</p>'+

                              '<h6>Forecast: </h6>'+

                              '<ul>'+forecast+'</ul>'+

                              '<p class="byline">'+'Get the full weather forecast on '+'<a href="'+link+'"> Yahoo Weather</a>'+

                              ' Powered By '+

                              '<a href="http://weather.com"> The Weather Channel</a></p>';

          } else {

                  var badge = '<h5>Cannot find weather data for this location.</h5>';
          }

          var styles = 'div.yahooweather *{font-size: 12px;margin:0;padding:0;}'+

                       'div.yahooweather{border: 2px solid #ccc;-moz-border-radius:5px;background:#eee;padding:5px;}'+

                       'div.yahooweather h5{margin:2px 0;font-size:14px;}'+

                       'div.yahooweather ul{margin:5px 0;list-style:none;}'+

                       'div.yahooweather li{list-style:none;}'+

                       'div p.byline{margin:5px 0;color:#999;font-size:10px;text-align: center;}'+

                       'div p.byline a{color:#666;font-size:10px;}'; 

          if(style === 'false') { container.innerHTML = badge; }

                            else
 
                                {container.innerHTML = '<style>'+styles+'</style>'+badge;}
    };//end function


      function loadScript(url, callback){

                 var script = document.createElement("script");

                     script.type = "text/javascript";

                 if (script.readyState){  //IE

                            script.onreadystatechange = function(){

                                   if (script.readyState == "loaded" ||

                                              script.readyState == "complete"){

                                                     script.onreadystatechange = null;

                                                     callback();
                                               }
                 };

                 } else {  //Others

                          script.onload = function(){

                          callback();
                       };
               }

               script.src = url;

               document.getElementsByTagName("head")[0].appendChild(script);

    }//end function

    function addEvent(elem,evType,fn,useCapture) {

             if(elem.addEventListener) {

                elem.addEventListener(evType,fn,useCapture);

                return true; 
  
             } else if(elem.attachEvent) {

                var r = elem.attachEvent('on'+evType,fn);

                return r;

             } else {

                elem['on'+evType] = fn;
             }

    }//end function

    return{init: init,seed: seed,addEvent: addEvent};
}();
/* yahooweatherbadge.init() */
yahooweatherbadge.addEvent(window,'load',yahooweatherbadge.init,false);