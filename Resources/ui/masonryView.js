function APIGetRequest(url, callback, errorCallback) {
	var req = Titanium.Network.createHTTPClient({
		onload : callback,
		onerror : errorCallback,
		timeout : 60000
	});
	req.open("GET", url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send();
}

function mansoryView(context, data) {
	var scrollView = Titanium.UI.createScrollView({
		top : 0,
		layout : 'vertical',
		width : Ti.Platform.displayCaps.platformWidth
	});

	var main_container = Titanium.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : Titanium.UI.SIZE
	});
	scrollView.add(main_container);
	var position_left = 10, position_top = 10, col1 = data[0].height + 10, col2 = 0;
	for (var i = 0; i < data.length; i++) {
		if (i != 0) {
			// Ti.API.info('col1: ' + col1 + ' col2: ' + col2 + ' position_top: ' + position_top + ' position_left: ' + position_left);
			if (col1 > col2) {
				position_top = col2 + 10;
				col2 += (data[i].height + 10);
				position_left = ((Ti.Platform.displayCaps.platformWidth - 30) / 2) + 20;
			} else {
				position_top = col1 + 10;
				col1 += (data[i].height + 10);
				position_left = 10;
			}
		}
		var view = Titanium.UI.createView({
			top : position_top,
			height : data[i].height,
			width : (Ti.Platform.displayCaps.platformWidth - 30) / 2,
			left : position_left,
			//backgroundColor : 'green',
			backgroundImage : data[i].url
		});
		main_container.add(view);
	};
	var config = {
		left_ : position_left,
		top_ : position_top,
		col1_ : col1,
		col2_ : col2
	};
	var refresh_view = Titanium.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth,
		top : 10,
		height : 50,
		load_more : true,
		backgroundColor : 'gray'
	});
	//scrollView.add(refresh_view);

	var offset = null;
	scrollView.addEventListener('scroll', function(e) {
		Ti.API.info('e.y: ' + e.y + ' total: ' + (e.y + Titanium.Platform.displayCaps.platformHeight) + ' top: ' + config.top_ + ' is_loading: ' + context.is_loading);
		// //Ti.API.info('decelerating: ' e.decelerating + ' dragging: ' + e.dragging);
		if ((e.y + Titanium.Platform.displayCaps.platformHeight) > config.top_ && !context.is_loading) {
			//Ti.API.info('Container Height: ' + main_container.toImage().height);
			context.is_loading = true;
			scrollView.add(refresh_view);
			//loadMore(main_container, config, data, context, scrollView, refresh_view);
		}
		//offset = e.y;
	});
	scrollView.addEventListener('dragend', function(e) {
		Ti.API.info('offset is = ' + offset);
		if (offset > config.top_ && !context.is_loading) {
			Ti.API.info('offset is = ' + offset);
		}
	});

	return scrollView;
}

function loadMore(container, config, data, context, scrollView, refresh_view) {
	scrollView.remove(refresh_view);
	alert('Updating...!');
	for (var i = 0; i < data.length - 5; i++) {
		if (config.col1_ > config.col2_) {
			config.top_ = config.col2_ + 10;
			config.col2_ += (data[i] + 10);
			config.left_ = ((Ti.Platform.displayCaps.platformWidth - 30) / 2) + 20;
		} else {
			config.top_ = config.col1_ + 10;
			config.col1_ += (data[i] + 10);
			config.left_ = 10;
		}
		var view = Titanium.UI.createView({
			top : config.top_,
			height : data[i],
			width : (Ti.Platform.displayCaps.platformWidth - 30) / 2,
			left : config.left_,
			backgroundColor : 'yellow'
		});
		container.add(view);
	};
	// Ti.API.info('Container Height: ' + container.toImage().height);
	// Ti.API.info('Container Chlidren: ' + container.children.length);
	context.is_loading = false;
}

function mansoryViewCustom() {
	var context = this;
	this.self = Titanium.UI.createWindow({
		backgroundColor : '#fff'
	});

	var indStyle;
	if (!Titanium.Platform.Android) {
		indStyle = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	} else {
		indStyle = Titanium.UI.ActivityIndicatorStyle.DARK;
	}
	var actInd = Titanium.UI.createActivityIndicator({
		color : '#fff',
		height : 50,
		width : 30,
		style : indStyle
	});
	this.self.add(actInd);	
	actInd.show();
	
	var url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=Godfather';
	APIGetRequest(url, function(e) {
		var status = this.status;
		if (status == 200) {
			var resp = eval('(' + this.responseText + ')');
			alert(resp.responseData.results);
			actInd.hide();
			var pinterest_view = mansoryView(context, resp.responseData.results);
			context.self.add(pinterest_view);
		}
	}, function(e) {
		actInd.hide();
	});

	// var custom_height = [255, 100, 200, 320, 80, 555, 300, 200, 150, 125, 255, 100, 200, 320, 80, 555, 300, 200, 150, 125];
	// Ti.API.info(pinterest_view.toImage().height);
	return this.self;
}

module.exports = mansoryViewCustom;
