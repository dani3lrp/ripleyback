var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nedb = require('nedb');
var expressNedbRest = require('express-nedb-rest');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// create  NEDB datastore
var datastore = new nedb({filename: __dirname + '/data/banco.dat', autoload: true});

// buscar si existe registro
datastore.find({ rut: '13049587-7' }, function (err, docs) {

  //si no existe registro, crearlo
  if ( docs.length < 1) {
     
      datastore.insert(
          {
              activo: true,
              rut: "13049587-7",
              nombre: "Daniel Roa Petrasic",
              telefono: "+56940135096",
              correo: "danielroapetrasic@gmail.com",
              numCuenta: "111-11111-111",
              password: "123",
              saldo: "1000000",
              movimientos: [{
                      destinatario: {
                          activo: true,
                          nombre: "Carlos Menem",
                          rut: "19901163-4",
                          correo: "carlos@gmail,com",
                          telefono: "123456789",
                          cuenta: [{
                              activo: true,
                              banco: "Banco Desarrollo",
                              tipo: "vista",
                              numCuenta: "222-22222-222",
                              transaccion: [{
                                  egresoIngreso: "egreso",
                                  monto: "500"
                              }]
                          }]
                      }
                  },
                  {
                      destinatario: {
                          activo: true,
                          nombre: "Cecilia Bolocco",
                          rut: "6926419-0",
                          correo: "cecilia@gmail.com",
                          telefono: "123456789",
                          cuenta: [{
                              activo: true,
                              banco: "Banco Desarrollo",
                              tipo: "vista",
                              numCuenta: "222-22222-222",
                              transaccion: [{
                                  egresoIngreso: "ingreso",
                                  monto: "10000"
                              }]
                          }]
                      }
                  }
              ]
          }, function(err, record) {
          if (err) {
              console.error(err);
              return;
          }
          console.log(record);
      
      });
  }

});

// create rest api router and connect it to datastore  
var restApi = expressNedbRest();
restApi.addDatastore('cliente', datastore);

//********************************************** */
// Configure Header HTTP 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
//********************************************** */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// setup express server to serve rest service
app.use('/api', restApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
