var width = window.innerWidth,
    height = window.innerHeight;

var n = (width * height)/10000, // number of particles
    m = 12, // I am not sure what this variable does
    degrees = 180 / Math.PI;

var fluparticles = d3.range(n).map(function () {
    var x = Math.random() * width,
        y = Math.random() * height;
    return {
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        path: d3.range(m).map(function () {
            return [x, y];
        }),
        count: 0
    };
});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.selectAll("g")
    .data(fluparticles)
    .enter().append("g");

var head = g.append("svg:image")
    .attr("xlink:href", "fluparticle.svg")
    .attr("width", function() { return 20 + Math.floor(Math.random() * 20); })

d3.timer(function () {
    for (var i = -1; ++i < n;) {
        var particle = fluparticles[i],
            path = particle.path,
            dx = particle.vx,
            dy = particle.vy,
            x = path[0][0] += dx,
            y = path[0][1] += dy,
            speed = Math.sqrt(dx * dx + dy * dy),
            count = speed * 10,
            k1 = -5 - speed / 3;

        // Bounce off the walls.
        if (x < 0 || x > width) particle.vx *= -1;
        if (y < 0 || y > height) particle.vy *= -1;

        // Swim!
        for (var j = 0; ++j < m;) {
            var vx = x - path[j][0],
                vy = y - path[j][1],
                k2 = Math.sin(((particle.count += count) + j * 3) / 300) / speed;
            path[j][0] = (x += dx / speed * k1) - dy * k2;
            path[j][1] = (y += dy / speed * k1) + dx * k2;
            speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
        }
    }

    head.attr("transform", headTransform);
});

function headTransform(d) {
    return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
}

function tailPath(d) {
    return "M" + d.join("L");
}
