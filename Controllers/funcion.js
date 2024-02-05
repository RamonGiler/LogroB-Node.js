const conexion = require('../DATABASE/DB');

exports.save=(req, res)=>{
    const Nombre =req.body.Nombre;
    const Departamento = req.body.Departamento;
    const FechaContratacion = req.body.FechaContratacion;
    const Salario = req.body.Salario;
    const Horastrabajadas = req.body.Horastrabajadas;
    conexion.query('INSERT INTO empleados SET ?', {Nombre:Nombre, Departamento:Departamento, FechaContratacion:FechaContratacion, Salario:Salario,
        Horastrabajadas:Horastrabajadas}, (error, resultados) =>{
            if(error){
                throw error;
            }else{
                res.redirect('/');
            }
    })
}



exports.tareas = (req, res) =>{
    const tarea = req.body.tarea;
    const horasdispuesta = req.body.horasdispuesta;
    const idEmpleado= req.body.id_empleado;
    conexion.query('SELECT HorasTrabajadas FROM  empleados  WHERE id = ?',[idEmpleado],(error, resultados)=>{
        if(error){
            console.log(error);
            res.redirect('/');
        }

        const horasDeTrabajo = resultados[0].HorasTrabajadas;
        if(horasDeTrabajo<horasdispuesta){
           
            res.redirect('tareas');
        }else{
            conexion.query('INSERT INTO tareas SET?',{tarea:tarea,horasdispuesta:horasdispuesta,id_empleado:idEmpleado}, (error)=>{
                if(error){
                    console.log(error);
                    return res.redirect('/');
                }
                
                conexion.query(`UPDATE empleados SET HorasTrabajadas = ${horasDeTrabajo - horasdispuesta} WHERE Id = ${idEmpleado}`);
                conexion.query(`UPDATE empleados SET Estado = ${1} WHERE HorasTrabajadas = ${0}`);
                conexion.query('SELECT * FROM empleados',(error, results)=>{
                    if(error){
                        console.log(error);
                    return res.redirect('/');
                    }

                    res.render('tareas', {con:false, resultados:results})
                    // res.redirect('/tareas')
                })
                
            })
        }

    })
}
