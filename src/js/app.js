import * as d3 from 'd3'

var chartwidth = 700
var chartheight = 700
var centrepoint = chartwidth / 2;

d3.json('https://interactive.guim.co.uk/docsdata-test/1f9kwfxlZNeAQGJ8jl4ea_kcZiIkpzLT4hX0FEaLHbhc.json').then(resp => {
    var input = resp.sheets.output;

    var chartsvg = d3.select('.interactive-wrapper')
    .append('svg')
    .attr("class","gv-diverging-chart")
    .attr("width",chartwidth)
    .attr("height",chartheight);

    var xdomain = [0,100]
    var xrange = [0,350]

    var xscale = d3.scaleLinear().domain(xdomain).range(xrange)

    input.map(inp => {
        inp.posvalues = []
        inp.negvalues = []
        for (var prop in inp) {
            if (prop.includes('positive') || prop.includes('negative')) {
                inp[prop] = Number(inp[prop].replace("%",""));
                if (prop.includes('negative')){
                    inp.negvalues.push({
                        label: inp.Label,
                        key:[prop], 
                        value: inp[prop], 
                        sequence: prop.toString().split('-')[1]
                    })                    
                }
                else {
                    inp.posvalues.push({
                        label: inp.Label,
                        key:[prop], 
                        value: inp[prop], 
                        sequence: prop.toString().split('-')[1]
                    })
                }
            }
        }
        inp.negvalues.sort((a,b) => {
            if (a.sequence > b.sequence) {
                return -1
            } else if (a.sequence < b.sequence) {
                return 1
            } else {
                return 0;
            }
        })
        inp.posvalues.sort((a,b) => {
            if (a.sequence > b.sequence) {
                return -1
            } else if (a.sequence < b.sequence) {
                return 1
            } else {
                return 0;
            }
        }) 
        inp.posvalues.forEach((v,i) => {
            if (i == 0) {
                v.cumulative = 0;
            } else {
                v.cumulative = inp.posvalues[i-1].value + inp.posvalues[i-1].cumulative;
            }
        })

        inp.negvalues.forEach((v,i) => {
            if (i == 0) {
                v.cumulative = 0;
            } else {
                v.cumulative = inp.negvalues[i-1].value + inp.posvalues[i-1].cumulative;
            }
        })
    });






    var bars = chartsvg.append('g').attr("class","gv-bars")

    bars.selectAll('.row')
    .data(input)
    .enter().append('g')
    .attr("class","gv-row")
    // .attr("height",50)
    // .attr("width",50)
    .attr("transform", (d,i) => {
        return `translate(0,${55 * i})`
    })
    .attr("id",d => {
        return d.Label
    })


    bars.selectAll('label')
    .data(input)
    .enter().append('text')
    .text(d => d.Label)
    .attr("transform", (d,i) => {
        return `translate(0,${(55 * i) + 30})`
    })


    var countries = bars.selectAll('.gv-row')

    countries.selectAll('negrect')
    .data(d => d.negvalues)
    .enter().append('rect')
    .attr("height",30)
    .attr("width", d => xscale(Math.abs(d.value)))
    .attr("x", d => {
        console.log(d);
        return centrepoint - (xscale(d.cumulative) + xscale(d.value)) })
    .attr("id",d => d.key)

    countries.selectAll('posrect')
    .data(d => { console.log(d.posvalues)
        return d.posvalues})
    .enter().append('rect')
    .attr("height",30)
    .attr("width", d => xscale(d.value))
    .attr("x", d => {
            return centrepoint + xscale(d.cumulative)
        } )
    .attr("id",d => d.key)




    // countries.each((c,i) => {

    //     console.log(c)
    //     c.selectAll('.rect')
    //     .data(input[i].values)
    //     .enter().append('rect')
    //     .attr("height",200)
    //     .attr("width",200)
    //     .attr("fill","red") 
    // })





})