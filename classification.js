function start()
	{		
	//get list of concepts schemes from service, transform from xml to JSON via PHP
			$.post("xmlParser.php", {inputfile: 'http://grlc.io/api/digst/classification/Classifications', sheet: 'trans1.xsl.xml'}, 
				
								function(data, status){
									$("#klassifikationerDiv").empty();
									theData = JSON.parse(data)
									//for each concept scheme, make clickable entry, append to div
									$(theData.classifications).each(function(){
						
										var clasKnap = document.createElement("div");
										clasKnap.className = "clasKnap"
										$(clasKnap).attr('id',this.id);
										//store definition in element
										$(clasKnap).attr('data-def',this.definition)
	
										var label = document.createTextNode(this.name);
										$(clasKnap).append(label);
										$("#klassifikationerDiv").append(clasKnap);
										
										$(clasKnap).on( "click", function( event ) {
											clasKnapklik(event);
										});
						
						
						
						
									})
								
								
							}, "html");		   
	}
	function bygTrae(inddata,clickevent){
		cName = clickevent.target.innerText
		var uddata = {"name":cName,"children":[]};
		$(inddata.concepts).each(function(){
			if (this.rod !="") {
				var knude = {"name": this.name,"id": this.id}
				uddata.children.push(knude)
				fyldPaa(knude,inddata)
				//console.log(uddata);
			}
		})
		return uddata
		
	}
	
	function fyldPaa (knude,inddata){
		$(inddata.concepts).each(function(){
			if (this.mor == knude.id) {
				var NyKnude = {"name": this.name,"id": this.id}
				if (knude.children)  {}
				else {knude.children = []}
				knude.children.push(NyKnude)
				
				fyldPaa(NyKnude,inddata)
				//console.log(uddata);
			}
		})
	}
	
	//load classification
	//function triggered by click on concept scheme name
	function clasKnapklik(clickevent){ 
		
		$('.clasKnap').css("font-weight","normal")
		$(clickevent.target).css("font-weight","bold")
		//Get classification elements from service, using data from clicked entry, transform to JSON 
		var Ulla = 'http://grlc.io/api/digst/classification/ConceptsInScheme?schemeuri=' + clickevent.target.attributes['id'].value
		//console.log (Ulla)
			$.post("xmlParser.php", {inputfile: Ulla.replace("#",'%23'), sheet: 'trans2.xsl.xml'}, 
										
									function(data, status){
										raaData = JSON.parse(data)
										//console.log(raaData)
										//make tree with data transformed intom tree data by auxilliary function 
										root = bygTrae(raaData,clickevent)
										root.x0 = h / 2;
										root.y0 = 0;
										  function toggleAll(d) {
										    if (d.children) {
										      d.children.forEach(toggleAll);
										      toggle(d);
										    }
										  }

										  //collapse all nodes		
											
										  root.children.forEach(toggleAll);
										// Initialize the display to show a few nodes.
											
										  /*toggle(root.children[1]);
										  toggle(root.children[1].children[2]);
										  toggle(root.children[9]);
										  toggle(root.children[9].children[0]);
*/
										  update(root);
										 	   
											
										  $('#tabeldiv').empty()
										  //make table of classification elements 
										  var tabel = document.createElement("table");
										  
										  $(tabel).attr('id','elementtabel');
										  $(tabel).attr('class','display');
										  $(tabel).attr('style','width:85%');
										  //Caption has info on classification as such
										var $capt = $("<caption>").html("Klassifikationen <b>" +  clickevent.target.innerHTML + "</b><br/> med definitionen </br/>&ldquo;<i>" +  clickevent.target.attributes["data-def"].value + "</i>&rdquo; </br>har følgende elementer (<a href='http://grlc.io/api/digst/classification/ConceptsInScheme?schemeuri=" + clickevent.target.attributes["id"].value.replace("#","%23") + "'>Hent alle elementer</a>):").appendTo(tabel) 
										var $header = $('<thead>').append($('<tr>').append(
												$('<th>').text('Navn'),
												$('<th>').text('URI'),
												$('<th>').text('Definition'),
												$('<th>').text('Link')
												)).appendTo(tabel);
										
										var $bod = $("<tbody>").appendTo(tabel);
									    $.each(raaData.concepts, function(i, concept) {
											        var $tr = $('<tr>').append(
											            $('<td>').text(concept.name),
											            $('<td>').text(concept.id),
											            $('<td>').text(concept.definition),
											            $('<td>').html("<a href='http://grlc.io/api/digst/classification/Concept?concepturi=" + concept.id.replace("#",'%23') + "'>Hent</a>")
											            ).appendTo($bod);
											    });
										    $(tabel).appendTo('#tabeldiv');
										    
										    //use DataTable plugin for neat diaplay 
											 $('#elementtabel').DataTable( {
											        "scrollY":        "700px",
											        "scrollCollapse": true,
											        "paging":         false,
											        "searching": false
											    } );									
										   
								
								
							}, "html");	
		}
	
	//D3 tree manipulation functions
	function update(source) {
		  var duration = d3.event && d3.event.altKey ? 5000 : 500;

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse();

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = vis.selectAll("g.node")
		      .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("svg:g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		      .on("click", function(d) { toggle(d); update(d); });

		  nodeEnter.append("svg:circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("svg:text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = vis.selectAll("path.link")
		      .data(tree.links(nodes), function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("svg:path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		      })
		    .transition()
		      .duration(duration)
		      .attr("d", diagonal);

		  // Transition links to their new position.
		  link.transition()
		      .duration(duration)
		      .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration(duration)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
		}

		// Toggle children.
		function toggle(d) {
		  if (d.children) {
		    d._children = d.children;
		    d.children = null;
		  } else {
		    d.children = d._children;
		    d._children = null;
		  }
		}
