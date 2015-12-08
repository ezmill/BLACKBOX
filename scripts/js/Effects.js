var Effect = function(NAME){
	this.shaders;
	this.blendId;
	this.name = NAME;
	this.init = function(){
		switch(this.name){
			case "warp":
				this.shaders = this.warpEffect();
				this.useMask = true;
				break;
			case "color blur":
				this.shaders = this.colorBlurEffect();
				// this.useMask = true;
				break;
			case "darken":
				this.shaders = this.darkenEffect();
				break;	
			case "revert":
				this.shaders = this.revertEffect();
				this.useMask = true;
				break;
			case "mix":
				this.shaders = this.mixEffect();
				break;			
			case "rgb shift":
				this.shaders = this.rgbShiftEffect();
				this.useMask = true;
				break;
			case "oil paint":
				this.shaders = this.oilPaintEffect();
				this.useMask = true;
				break;	
			case "median blur":
				this.shaders = this.medianBlurEffect();
				this.useMask = true;
				break;		
			case "warm filter":
				this.shaders = this.filterEffect("warm");
				this.useMask = true;
				break;	

			case "cool filter":
				this.shaders = this.filterEffect("cool");
				this.useMask = true;
				break;	
			case "barrel blur":
				this.shaders = this.barrelBlurEffect();
				this.useMask = true;
				break;		
			case "repos":
				this.shaders = this.reposEffect();
				this.useMask = true;
				break;	
			case "flow":
				this.shaders = this.flowEffect();
				break;
			case "gradient":
				this.shaders = this.gradientEffect();
				this.useMask = true;
				break;	
			case "warp flow":
				this.shaders = this.warpFlowEffect();
				this.useMask = true;
				break;		
			case "stained glass":
				this.shaders = this.stainedGlassEffect();
				this.useMask = true;
				break;																			
			case "edge detect":
				this.shaders = this.edgeDetectionEffect();
				this.useMask = true;
				break;
			case "curves":
				var curves = [[], [], []];
				for(var i = 0; i < 3; i++){
					for(var j = 0; j < (Math.floor(Math.random()) + 2); j++){
						// for(var k = 0; k < 2; k++){
							// curves[i][j].push(Math.random());							
							curves[i][j] = [Math.random(), Math.random()];						
						// }
					}
				}
				this.shaders = this.curvesEffect(
					[[0, 0], [0.25, 0.2], [0.6, 0.7], [1, 1]],
					[[0, 0], [1, 1]],
					[[0, 0.19], [0.18, 0.47], [0.85, 0.8], [1, 1]]
					// curves[0],
					// curves[1],
					// curves[2]
					);
				this.useMask = true;
				break;	
			case "neon glow":
				this.shaders = this.neonGlowEffect();
				this.useMask = true;
				break;
		}
	}
	this.warpEffect = function(){
		var customShaders = new CustomShaders();
		var shaders = [
	       	customShaders.passShader,
	        customShaders.diffShader2, 
	        customShaders.passShader,
	        customShaders.warp2
		]
		return shaders;
	}
	this.colorBlurEffect = function(){
		var denoiseShader = new DenoiseShader();
		var customShaders = new CustomShaders();
	    shaders = [ 
	       	customShaders.colorShader,
	        customShaders.diffShader, 
	        customShaders.colorBlurShader,
	        customShaders.passShader
	    ];
		return shaders;

	}
	this.darkenEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var blendShader = new BlendShader();
		var denoiseShader = new DenoiseShader();
		var shaders = [
	        blendShader,
	        customShaders.diffShader, 
	        customShaders.blurShader,
	        customShaders.passShader
		]
		this.blendId = 14;
		return shaders;
	}
	this.revertEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var revertShader = new RevertShader();
		var denoiseShader = new DenoiseShader();
		var shaders = [
	        // blendShader,
	        customShaders.passShader,
	        customShaders.diffShader2, 
	        customShaders2.passShader,
	        revertShader


		]
		// this.blendId = 15;
		// this.blendId = 4;
		return shaders;
	}
	this.mixEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var mixShader = new MixShader();
		var shaders = [
	        customShaders.passShader,
	        customShaders.diffShader2, 
	        customShaders2.passShader,
	        mixShader
		]
		// this.blendId = 15;
		this.blendId = 4;
		return shaders;
	}	
	this.rgbShiftEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var rgbShiftShader = new RgbShiftShader();
		var shaders = [
	        customShaders2.passShader,
	        customShaders.diffShader, 
	        customShaders.passShader,
	        rgbShiftShader
		]
		return shaders;
	}
	this.oilPaintEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var oilPaintShader = new OilPaintShader();
		var shaders = [
	        customShaders.passShader, 
	        customShaders.diffShader2,
	        customShaders2.passShader,
    		oilPaintShader
		]
		return shaders;
	}
	this.medianBlurEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var denoiseShader = new DenoiseShader();
		var shaders = [
	        customShaders.passShader, 
	        customShaders.diffShader2,
	        customShaders2.passShader,
    		denoiseShader
		]
		return shaders;
	}	
	this.filterEffect = function(TYPE){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var filterShader = new FilterShader(TYPE);
		var shaders = [
	        customShaders.passShader, 
	        customShaders.diffShader2,
	        customShaders2.passShader,
    		filterShader
		]
		return shaders;
	}
	this.barrelBlurEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var barrelBlurShader = new BarrelBlurShader(12.0);
		// var barrelBlurShader2 = new BarrelBlurShader(12.0);
		var shaders = [
	        customShaders.passShader,
	        // barrelBlurShader, 
	        customShaders.diffShader2,
	        customShaders2.passShader,
    		barrelBlurShader
		]
		return shaders;
	}
	this.reposEffect = function(){
		var customShaders = new CustomShaders();
		var denoiseShader = new DenoiseShader();
		var customShaders2 = new CustomShaders();
		var shaders = [
	        customShaders.reposShader,
	        customShaders.diffShader,
	        customShaders.passShader,
	        customShaders2.passShader,
		]
		return shaders;
	}
	this.flowEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var shaders = [
	        customShaders.flowShader,
	        customShaders.diffShader,
	        customShaders.passShader,
	        customShaders2.passShader,
		]
		return shaders;
	}
	this.gradientEffect = function(){
		var customShaders = new CustomShaders();
		var gradientShader = new GradientShader();
		var customShaders2 = new CustomShaders();
		var shaders = [
	        customShaders.blurShader,
	        customShaders.diffShader,
	        customShaders.blurShader,
	        gradientShader,
		]
		return shaders;
	}
	this.warpFlowEffect = function(){
		var customShaders = new CustomShaders();
		var warpFlowShader = new WarpFlowShader();
		var gradientShader = new GradientShader();
		var shaders = [
	        customShaders.flowShader,
	        customShaders.diffShader,
	        warpFlowShader,
	        customShaders.passShader,
		]
		return shaders;
	}	
	this.stainedGlassEffect = function(){
		var customShaders = new CustomShaders();
		var stainedGlassShader = new StainedGlassShader();
		var gradientShader = new GradientShader();
		var shaders = [
	        customShaders.passShader,
	        customShaders.diffShader2,
	        customShaders.passShader,
	        stainedGlassShader
		]
		return shaders;
	}	
	this.edgeDetectionEffect = function(){
		var customShaders = new CustomShaders();
		var sobelShader = new SobelShader();
		var gradientShader = new GradientShader();
		var shaders = [
	        customShaders.passShader,
	        customShaders.diffShader2,
	        customShaders.passShader,
	        sobelShader
		]
		return shaders;
	}		
	this.curvesEffect = function(red, green, blue){
		var customShaders = new CustomShaders();
		var curvesShader = new CurvesShader(red, green, blue);
		var gradientShader = new GradientShader();
		var shaders = [
	        customShaders.reposShader,
	        customShaders.diffShader2,
	        customShaders.passShader,
	        curvesShader
		]
		return shaders;
	}	
	this.neonGlowEffect = function(){
		var customShaders = new CustomShaders();
		var customShaders2 = new CustomShaders();
		var neonGlowShader = new NeonGlowShader();
		var shaders = [
	        customShaders2.passShader,
	        customShaders.diffShader2,
	        customShaders.passShader,
	        neonGlowShader
		]
		return shaders;
	}				
}