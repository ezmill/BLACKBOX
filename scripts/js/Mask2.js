function Mask(){
	this.scene, this.camera, this.renderer;
	this.mesh, this.material, this.geometry;
	this.shader;
	this.radius = 0.0;
	this.counter = 0;
	this.renderTarget1, this.renderTarget2;
	this.mouse;
	this.init = function(){
		this.scene = new THREE.Scene();

	    this.camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
	   	this.camera.position.set(0,0,0);

		this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
		this.renderer.setSize( renderSize.x, renderSize.y );
		this.renderer.setClearColor(0xffffff,1.0);
		this.renderer.autoClearColor = false;

		this.geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
		this.shader = new MaskShader();
		this.material = new THREE.ShaderMaterial({
			uniforms: this.shader.uniforms,
			fragmentShader: this.shader.fragmentShader,
			vertexShader: this.shader.vertexShader,
			transparent: true
		});
		this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
		this.material.uniforms["white"].value = THREE.ImageUtils.loadTexture("assets/textures/white.jpg");
		this.material.uniforms["white"].value.minFilter = THREE.LinearFilter;
		this.material.uniforms["white"].value.magFilter = THREE.LinearFilter;
		this.material.uniforms["black"].value = THREE.ImageUtils.loadTexture("assets/textures/black.jpg");
		this.material.uniforms["black"].value.minFilter = THREE.LinearFilter;
		this.material.uniforms["black"].value.magFilter = THREE.LinearFilter;
		this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);

		this.renderTarget1 = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
		this.renderTarget1.minFilter = this.renderTarget1.magFilter = THREE.LinearFilter;
		this.renderTarget2 = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
		this.renderTarget2.minFilter = this.renderTarget2.magFilter = THREE.LinearFilter;
	}
	this.update = function(){
		// this.erase();
		this.material.uniforms["r2"].value = this.radius;
		// this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
		// this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
		this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);

		this.material.uniforms["time"].value = time;
		if(mouseDown){
			this.radius = 0.5;
		} else {
			this.radius = 0.0;
		}
		this.renderer.render(this.scene, this.camera);
		this.renderer.render(this.scene, this.camera, this.renderTarget1);
		// this.renderer.render(this.scene, this.camera, this.renderTarget2);
		this.material.uniforms["black"].value = this.renderTarget1;
		this.swapBuffers();

	}
	this.swapBuffers = function(){
		var temp = this.renderTarget1;
		this.renderTarget1 = this.renderTarget2;
		this.renderTarget2 = temp;
	}
	this.resize = function(){
		this.renderer.setSize(renderSize.x, renderSize.y);
		this.renderTarget1.setSize(renderSize.x, renderSize.y);
		this.renderTarget2.setSize(renderSize.x, renderSize.y);
		this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
		this.camera.left = renderSize.x / - 2;
        this.camera.right = renderSize.x / 2;
        this.camera.top = renderSize.x / 2;
        this.camera.bottom = renderSize.x / - 2;
	}
}
function MaskShader(){
        this.uniforms = THREE.UniformsUtils.merge([
            {
                "mouse"  : { type: "v2", value: null },
                "resolution"  : { type: "v2", value: null },
                "time"  : { type: "f", value: 0.0 },
                "r2"  : { type: "f", value: null },
                "white"  : { type: "t", value: null },
                "black"  : { type: "t", value: null }
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

            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform sampler2D white;",
            "uniform sampler2D black;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",
            "	vec2 q = vUv;",
            "	vec2 p = -1.0 + 2.0*q;",
            "	p.x *= resolution.x/resolution.y;",
            "	vec2 m = mouse;",
            "	m.x *= resolution.x/resolution.y;",
            "	float r = sqrt( dot((p - m), (p - m)) );",
            "	float a = atan(p.y, p.x);",
            "	vec4 white = vec4(texture2D(white, vUv).rgb, 1.0);",
            "	vec4 black = vec4(texture2D(black, vUv).rgb, 1.0);;",
            "	if(r < r2){",
            "		float f = smoothstep(r2, r2 - 1.0, r);",
            "		black = mix( black, white, f);",
            "	}",
            "	gl_FragColor = black;",
            // "    float t=time;",
            // "    if(t<0.1)",
            // "    {",
            // "        gl_FragColor=black;",
            // "        return;",
            // "    }",
            // "    if(length(gl_FragCoord.xy-mouse.xy)>r2){",
            // "    	if(smoothstep()){",
            // "    		discard;",
            // "		}",
            // "	 }",
            // "	gl_FragColor = white;",
            "}",


        
        ].join("\n");
}