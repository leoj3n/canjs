steal("can/view/parser","can-simple-dom", "can/util",function(canParser, simpleDOM, can){
	
	
	var oldBuildFrag = can.buildFragment;
	
	
	can.buildFragment = function(text, context){
		if(context && ((context.ownerDocument || context )!= can.global.document)) {
			
			var parser = new simpleDOM.HTMLParser(function(string){
				
				var tokens = [];
				var currentTag,
					currentAttr;
				canParser(string, {
			    	start: function( tagName, unary ){
			    		currentTag = { type: "StartTag", attributes: [], tagName: tagName };
			    	},
					end: function( tagName, unary ){
						tokens.push(currentTag);
						currentTag = undefined;
					},
					close:     function( tagName ){
						tokens.push({type: "EndTag", tagName: tagName});
					},
					attrStart: function( attrName ){
						currentAttr = [attrName, ''];
						currentTag.attributes.push(currentAttr);
					},
					attrEnd:   function( attrName ){},
					attrValue: function( value ){
						currentAttr[1] += value;
					},
					chars:     function( value ){
						tokens.push({type:"Chars", chars: value});
					},
					comment:   function( value ){
						tokens.push({type:"Comment", chars: value});
					},
					special:   function( value ){},
					done:      function( ){}
			   });
			   
			   return tokens;
			}, context.ownerDocument || context, simpleDOM.voidMap);
			
			return parser.parse(text);
			
		} else {
			return oldBuildFrag.apply(this, arguments);
		}
	};
	
});