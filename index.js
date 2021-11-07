document.addEventListener('DOMContentLoaded',()=>{
    //AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('GET','https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    xhr.send();
    xhr.onload = ()=>{
        const dataset = JSON.parse(xhr.responseText)
        // console.log(dataset)
        const w = 800;
        const h = 500;
        const padding = 70;

        const xScale = d3.scaleLinear()
                        .domain([d3.min(dataset,(d)=>d.Year),d3.max(dataset,(d)=>d.Year)])
                        .range([padding,w-padding]);

        const yScale = d3.scaleLinear()
                        .domain([d3.min(dataset,(d)=>d.Seconds*1000),d3.max(dataset,(d)=>d.Seconds*1000)])
                        .range([h-padding,padding]);

        const chart = d3.select('main')
                        .select('div')
                        .append('svg')
                        .attr('width',w)
                        .attr('height',h);

        const tooltip = d3.select('main')
                        .append('p')
                        .attr('id','tooltip')

        chart.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .on('mouseover',(d)=>{
            tooltip.attr('data-year',d.target.__data__.Year);
            tooltip.text(d.target.__data__.Year);
            tooltip.style('visibility','visible');
            tooltip.style("top", (d.pageY-45)+"px").style("left",(d.pageX+10)+"px");
        })
        .on('mouseout',()=>{
            tooltip.style('visibility','hidden')
        })
        .attr('class','dot')
        .attr('data-xvalue',(d)=>d.Year)
        .attr('data-yvalue',(d)=>{
            const date = new Date(d.Seconds*1000)
            return date
        })
        .attr('cx',(d)=>xScale(d.Year))
        .attr('cy',(d)=>yScale(d.Seconds*1000))
        .attr('r',8)
        
        
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('Y'));
        chart.append('g')
            .attr('id','x-axis')
            .attr('transform',`translate(0,${h-padding})`)
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickFormat((d)=>{return d3.timeFormat('%M:%S')(d)});
        chart.append('g')
            .attr('id','y-axis')
            .attr('transform',`translate(${padding},0)`)
            .call(yAxis);

        chart.append('g').attr('id','legend').text('legend')
        }
        
});