const config = require('./config/config.js');

const express = require('express');
const session = require('express-session');

const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const layouts = require('express-ejs-layouts');

const path = require('path');
const root = path.join(__dirname, '../');
app.set("root",root);　

app.set('views',root + '/views'); 
app.set('view engine', 'ejs');
　
/* ejs-layouts setting -- default 로 사용*/
app.set('layout', root + '/views/layout/layout');
//app.set("layout extractScripts", true);


app.use(cors());

app.use(layouts);


app.use(bodyParser.urlencoded({
	extended: true
    ,limit: '30mb'
}));
app.use(bodyParser.json({ limit: '30mb' }));


//app.use(bodyParser());
//app.use(express.json());
//app.use(express.urlencoded());

/*정적요소 사용 디렉토리 선언*/
app.use(express.static('public'));

/*session 사용*/
app.use(
	session(
	{
		secret: 'sigmachain!@#$',
		resave: false,
		saveUninitialized: true
	}
));

/*session 변수 ejs 에 할당*/
app.use(function(req, res, next) {
  if(req.session.username) {
	  res.locals.sess_username = req.session.username;
	  res.locals.sess_password = req.session.password;
  } else {
	  res.locals.sess_username = "";
	  res.locals.sess_password = "";
  }
  next();
});


/*router 설정.. mvc의 c에 해당 할 것이라 판단함.*/
//require('./router/welcome')(app);
//require('./router/test')(app);
require('./router/api')(app);

//blockInfo callback
if(config.use_blockinfo) {
	const blockInfo = require('./service/blockinfo.js');
	blockInfo.getBlockInfo();
}

/*404 에러 캐치*/
app.use(function(req, res, next){
	res.locals.user = req.session.user;

	res.status(404).render('page/404', {
		layout:"layout/layout_404",
		title: "Sorry, page not found",
		description: "Sorry, page not found"
	});
});

app.listen(config.port, function(){
	console.log("start server. (port :: " + config.port + ")");		
});
