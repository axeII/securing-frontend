/**
* Data and some code is taken from http://jvectormap.com/documentation/. On this code has GPL licence.
* From here as well https://github.com/d3/d3/wiki, lince is  BSD-3-Clause.
*/

function generateDataPoint() {
    var rand = Math.round(Math.random()) % 2;
    var types = ["rules.sql_injection", "rules.bots,", "rules.xss_attack", "rules.dir_traverse"];
    return {
      "command": rand == 1 ? "GET" : "POST",
      "date": "",
      "accept_encoding": "gzip, deflate",
      "total_exploit": 1,
      "total_dataflow": 401,
      "accept_language": "cs-cz",
      "port": "55905",
      "referer": "http://localhost:8887/",
      "attacktype": types[Math.round(Math.random() * 8) % 8],
      "date": "2017-0"+ (Math.round(Math.random() * 8) % 8 + 1)+"-0" + (Math.round(Math.random() * 8) % 8 + 1),
      "connection": "keep-alive",
      "ip": "32.43.144.134",
      "time": "01:55:38",
      "_id": "b9f6c13aa87211e697055cf9389ef842",
      "path": "/css/style.css",
      "socket_info": "AddressFamily.AF_INET,SocketKind.SOCK_STREAM,Protocol 0",
      "second_id": "2702199991456805572558931407295343143",
      "version": "HTTP/1.1",
      "country": "US",
      "error": "None",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
      "accept": "text/css,*/*;q=0.1",
      "host": "localhost:8887"
    };
}
  

var yearRingChart = dc.pieChart("#commands"),
      number1 = dc.numberDisplay("#num1"),
      number2 = dc.numberDisplay("#num2"),
      exploitRowChart = dc.rowChart("#exploit-row-chart"),
      dateChart = dc.lineChart("#date-attacks");
    
  
d3.json('/exploits/list/', function (data) {
    var dateFormat = d3.time.format('%Y-%m-%d');
    var numberFormat = d3.format('.2f');

    var mapData = {};
	data.forEach(function(object) {
	if ((object.country) in mapData) {
  		mapData[(object.country)] += 1;
	} else {
		mapData[(object.country)] = 0;
	}
});
  //generating mock data  
if(window.location.pathname == '/login') {
   if (confirm("Vygenerují se ukázková data") == true) {
		var data = [];
        for (var i = 0; i < 768; i++) {
   			data.push(generateDataPoint());
  		}
    } else {
        data = data
    }
  } 
  

$(function(){
  $('#world-map-gdp').vectorMap({
    map: 'world_mill',
    series: {
      regions: [{
        values: mapData,
        scale: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial'
      }]
    },
    onRegionTipShow: function(e, el, code){
      el.html(el.html()+' (Počet útoku - '+mapData[code]+')');
    }
  });
});

$(function() {
   $('#alert-box').show().fadeOut(4000);
});

	var ndx = crossfilter(data),
	    info = ndx.dimension(function(d) {
	      return d.time;
	    }),
	    parseDate = dateFormat.parse,
	    dateDimension = ndx.dimension(function(d){
				return parseDate(d.date);
	    }),
	    commandDimension = ndx.dimension(function(d) {
	      return d.command;
	    }),
	    totalDimension = ndx.dimension(function(d) {
	      return d.total_exploit;
	    }),
	    culcDimension = totalDimension.group().reduceSum(function (d) {
	            return d.total_exploit;
	    }),
	    total2Dimension = ndx.dimension(function(d) {
	      return d.total_dataflow;
	    }),
	    culc2Dimension = totalDimension.group().reduceSum(function (d) {
	            return d.total_dataflow;
	    }),
	    exploitDimension = ndx.dimension(function(d) {
	      return d.attacktype;
	    }),
	    hits = dateDimension.group().reduceSum(function (d) {
	            return d.total_exploit;
	    }); 
	
	 	var minDate = dateDimension.bottom(1)[0]["date"];
		var maxDate = dateDimension.top(1)[0]["date"];
	 
	  var commandGroup = commandDimension.group();
	  var exploitGroup = exploitDimension.group();
	  
	  yearRingChart.width(250).height(250)
	    .dimension(commandDimension)
	    .group(commandGroup);
	
	  exploitRowChart.width(300).height(250)
	    .dimension(exploitDimension)
	    .group(exploitGroup)
	    .elasticX(true);
	    
	  number1
			.formatNumber(d3.format("d"))
	    .dimension(totalDimension)
			.group(culcDimension)
			.formatNumber(d3.format(".3s"));
	    
	  number2
			.formatNumber(d3.format("d"))
	    .dimension(total2Dimension)
			.group(culc2Dimension)
			.formatNumber(d3.format(".3s"));
		
	  dateChart
			.width(650).height(225)
			.dimension(dateDimension)
      .renderArea(true)
			.group(hits)
			.x(d3.time.scale().domain([String(minDate),String(maxDate)].map(parseDate)))
      .mouseZoomable(true)
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .group(hits)
      .renderHorizontalGridLines(true);
	    
		
	  dc.renderAll();
}); 
 


