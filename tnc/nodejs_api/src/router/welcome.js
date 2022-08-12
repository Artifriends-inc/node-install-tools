module.exports = function(app) {
	
	app.get('/',function(req,res){
		res.render('page/index', {
			layout:"layout/layout_index",
			title: "main",
			description: "main"
		})
	});
}
