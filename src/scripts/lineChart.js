export function lineChart(data, topPlayerData) {

    const margin = { top: 70, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;
  
    const x = d3
        .scaleLinear()
        .range([0, width])
        .domain([1,17]);
    ;

    const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([-2, 55]);
  
    const svg = d3
        .select("#line-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
     const line = d3
        .line()
        .x((d) => x(d.week))
        .y((d) => y(d.value));

    svg.append("rect")
        .attr("width", "120%")
        .attr("height", "80%")
        .attr("fill", "#e6e6e8");
    
    svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr('id', 'Player')
        .attr("d", line);

    const topPlayerLine = d3
        .line()
        .x((d) => x(d.week))
        .y((d) => y(d.value));    

    svg
        .append("path")
        .datum(topPlayerData)
        .attr("fill", "none")
        .attr('id', 'TopatPOS')
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", topPlayerLine); 

    svg
        .append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 5})`)
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .attr("font-family", "Source Sans Pro")
        .style("color", "grey")
        .text("Week");
        
    const circles = svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'Player')
        .attr('fill', 'green')
        .attr('stroke', 'none')
        .attr('cx', function(d) { return x(d.week) })
        .attr('cy', function(d) { return y(d.value) })
        .attr('r', 5);
    
    const topPlayerCircles = svg
        .selectAll('.topatPOS')
        .data(topPlayerData)
        .enter()
        .append('circle')
        .attr('class', 'TopatPOS')
        .attr('fill', 'black')
        .attr('stroke', 'none')
        .attr('cx', function(d) { return x(d.week) })
        .attr('cy', function(d) { return y(d.value) })
        .attr('r', 5);

        svg.append("text")
        .text("Season Stats")
        .attr("font-family", "Source Sans Pro")
        .attr("text-anchor", "middle")
        .style("fill", "grey")
        .attr("transform", `translate(${margin.left + (200)}, ${margin.top / 2})`)
        .attr("dx", "1em")
        .attr("dy", "0.5em")
        .attr("y", -margin.top);

    svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "grey")
        .attr("font-family", "Source Sans Pro")
        .text("Fantasy Points");
    
    const tooltip = d3.select('#line-chart-container')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    circles.on('mouseover', (event, d) => {
        d3.select(event.target).attr('r', 10);
        let [x, y] = d3.pointer(event);
        tooltip.transition()
            .duration(200)
            .style('opacity', 1.4);
        tooltip.html(`Week: ${d.week}<br/>Pts: ${d.value}`)
            .style('left', `${x + margin.left}px`)
            .style('top', `${y + margin.top + 250}px`);
    });

    circles.on('mouseout', (d) => {
        d3.select(event.target).attr('r', 6);
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    topPlayerCircles.on('mouseover', (event, d) => {
        d3.select(event.target).attr('r', 10);

        let [x, y] = d3.pointer(event);
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html(`Week: ${d.week}<br/>Pts: ${d.value}`)
            .style('left', `${x + margin.left}px`)
            .style('top', `${y + margin.top + 250}px`); 
    });

    topPlayerCircles.on('mouseout', (d) => {
        d3.select(event.target).attr('r', 6);
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
  
    svg.append("g").call(d3.axisLeft(y));

    const legend = svg.selectAll('.legend')
        .data([{color: 'green', name: 'Player'}, {color: 'black', name: 'TopatPOS'}]) 
        .enter()
        .append('g')
        .style("fill", "grey")
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20 + 5})`);

    legend.append('line')
        .attr('x1', width - 90)
        .attr('x2', width - 70)
        .attr('y1', 9)
        .attr('y2', 9)
        .style('stroke', d => d.color);

    legend.append('circle') 
    .attr('cx', width - 80)
    .attr('cy', 9)
    .attr('r', 5)
    .style('fill', d => d.color)
    .on('click', (event, d) => {
        const isActive = d.active ? false : true;
        const newOpacity = isActive ? 0 : 1;
        d3.select(`#${d.name}`).style('opacity', newOpacity); 
        d3.selectAll(`.${d.name}`).style('opacity', newOpacity); 
        d.active = isActive;
    })
    .on('mouseover', function(event, d) {
        d3.select(event.target).attr('r', 10);
        let [x, y] = d3.pointer(event);
        tooltip.transition()
          .duration(200)
          .style('opacity', 1.4);
        tooltip.html('Click to toggle')
          .style('left', `${x + margin.left - 30}px`)
          .style('top', `${y + margin.top + 250}px`);
      })      
      .on('mouseout', function() {
        d3.select(this).attr('r', 5);
        tooltip.transition().duration(500).style('opacity', 0);
      });

    //   d3.select(event.target).attr('r', 10);
    //     let [x, y] = d3.pointer(event);
    //     tooltip.transition()
    //         .duration(200)
    //         .style('opacity', 1.4);
    //     tooltip.html(`Week: ${d.week}<br/>Pts: ${d.value}`)
    //         .style('left', `${x + margin.left}px`)
    //         .style('top', `${y + margin.top + 250}px`);
    
    
    legend.append('text')
        .attr('x', width - 60)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .style('font-size', '14px')
        .text(d => d.name);
}

