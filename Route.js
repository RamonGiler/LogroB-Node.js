const express = require('express')
const router = express.Router()
const conexion = require('./DATABASE/DB.js')

router.get('/', (req, res)=>{
   const buscar = req.query.buscar;

   // Verifica si hay un valor en el campo de búsqueda
   if (buscar) {
       // Si hay un valor, realiza la consulta con filtro
       conexion.query(`SELECT * FROM empleados WHERE departamento LIKE '%${buscar}%'`, (err, resultados) => {
           if (err) {
               throw err;
           } else {
               res.render('index', { resultados: resultados, buscar: buscar });
           }
       });
   } else {
       // Si no hay un valor, muestra todos los empleados
       conexion.query('SELECT * FROM empleados', (err, resultados) => {
           if (err) {
               throw err;
           } else {
               res.render('index', { resultados: resultados });
           }
       });
   }
   
})



// ruta para acceder a la viste de crear registro 
router.get('/create',(req , res)=>{
   res.render('empleados');
})

router.get('/tareas',(req, res)=>{
   const cons = true
   conexion.query('SELECT * FROM empleados', (err, resultados)=>{
      if(err){
         throw err
      }else{
         res.render('tareas', {con:cons, resultados:resultados});
      }
   })
})

router.get('/empleadosPagados',(req, res)=>{
    conexion.query(`SELECT *
    FROM empleados
    WHERE Estado = ${1}
    ORDER BY FechaContratacion;`, (err, resultados) => {
        if (err) {
            throw err;
        } else {
            conexion.query(`SELECT SUM(salario) AS total FROM empleados WHERE Estado = ${1};`,(error, results)=>{
                if (error) {
                    throw error;
                } else {
                  res.render('empleadosPagados', {resultados:resultados, user:results[0]})
                }
            })
           
        }
    });
    
})



const funcion = require('./Controllers/funcion.js');
router.post('/save', funcion.save);
router.post('/saveTareas', funcion.tareas);


module.exports = router