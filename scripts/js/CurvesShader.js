var CurvesShader = function(red, green, blue){
        function clamp(lo, value, hi) {
            return Math.max(lo, Math.min(value, hi));
        }
        function splineInterpolate(points) {
            var interpolator = new SplineInterpolator(points);
            var array = [];
            for (var i = 0; i < 256; i++) {
                array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
            }
            return array;
        }

        red = splineInterpolate(red);
        if (arguments.length == 1) {
            green = blue = red;
        } else {
            green = splineInterpolate(green);
            blue = splineInterpolate(blue);
        }
        // createCanvas(red, green, blue);
        var array = [];
        for (var i = 0; i < 256; i++) {
            array.splice(array.length, 0, red[i], green[i], blue[i], 255);
        }
        // console.log(array);
        curveMap = new THREE.DataTexture(array, 256, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
        curveMap.minFilter = curveMap.magFilter = THREE.LinearFilter;
        curveMap.needsUpdate = true;
        // var noiseSize = 256;
        var size = 256;
        var data = new Uint8Array( 4 * size );
        for ( var i = 0; i < size * 4; i ++ ) {
            data[ i ] = array[i] | 0;
        }
        var dt = new THREE.DataTexture( data, 256, 1, THREE.RGBAFormat );
        // dt.wrapS = THREE.ClampToEdgeWrapping;
        // dt.wrapT = THREE.ClampToEdgeWrapping;
        dt.needsUpdate = true;
        // console.log(dt);
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "texture"  : { type: "t", value: null },
                "origTex"  : { type: "t", value: null },
                "curveMap"  : { type: "t", value: dt },
                "alpha"  : { type: "t", value: null },
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: null },
                "id"  : { type: "i", value: null },
                "id2"  : { type: "i", value: null }

            }
        ]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        
        ].join("\n");
        
        this.fragmentShader = [
            
            "uniform sampler2D texture;",
            "uniform sampler2D origTex;",
            "uniform sampler2D alpha;",
            "uniform sampler2D curveMap;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform int id;",
            "uniform int id2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main(){",
            
            "   vec4 col = texture2D(texture, vUv);",
            "   vec3 alpha = texture2D(alpha, vUv).rgb;",

            "   vec4 curveColor = texture2D(texture, vUv);",
            "   curveColor.r = texture2D(curveMap, vec2(curveColor.r)).r;",
            "   curveColor.g = texture2D(curveMap, vec2(curveColor.g)).g;",
            "   curveColor.b = texture2D(curveMap, vec2(curveColor.b)).b;",

            "   if(dot(alpha, vec3(1.0))/3.0 > 0.1){",
            "        col.rgb = mix( col.rgb, curveColor.rgb, dot(alpha, vec3(1.0))/3.0);",
            "   }",

            "   gl_FragColor = vec4(col.rgb,1.0);",
            "}",


        
        ].join("\n");
}

function SplineInterpolator(points) {
    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function(a, b) {
        return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
        this.xa.push(points[i][0]);
        this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
        // This is the decomposition loop of the tridiagonal algorithm. 
        // y2 and u are used for temporary storage of the decomposed factors.
        var wx = this.xa[i + 1] - this.xa[i - 1];
        var sig = (this.xa[i] - this.xa[i - 1]) / wx;
        var p = sig * this.y2[i - 1] + 2.0;

        this.y2[i] = (sig - 1.0) / p;

        var ddydx = 
            (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - 
            (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

        this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
        this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
}

SplineInterpolator.prototype.interpolate = function(x) {
    var n = this.ya.length;
    var klo = 0;
    var khi = n - 1;

    // We will find the right place in the table by means of
    // bisection. This is optimal if sequential calls to this
    // routine are at random values of x. If sequential calls
    // are in order, and closely spaced, one would do better
    // to store previous values of klo and khi.
    while (khi - klo > 1) {
        var k = (khi + klo) >> 1;

        if (this.xa[k] > x) {
            khi = k; 
        } else {
            klo = k;
        }
    }

    var h = this.xa[khi] - this.xa[klo];
    var a = (this.xa[khi] - x) / h;
    var b = (x - this.xa[klo]) / h;

    // Cubic spline polynomial is now evaluated.
    return a * this.ya[klo] + b * this.ya[khi] + 
        ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
};

function createCanvas(red, green, blue){
    var canvas = document.createElement("canvas");
    
}