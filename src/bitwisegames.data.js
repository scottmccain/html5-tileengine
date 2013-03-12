bitwisegames.data = function() {

	this.request = function(uri, callback) {

		$.ajax({
			  url: uri,
			  dataType: 'json',
			  success: function(data) {
				  
				  if(callback) {
					  callback(data);
				  }
			  }
			});
	};
};

bitwisegames.data.prototype.load = function(uri, callback) {
	this.request(uri, callback);
};