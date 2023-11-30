let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
//const port=2410;
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {getConnection}=require("./mobDB.js");


app.get("/employees",function(req,res){
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    let connection=getConnection();
    let options="";
    let optionArr=[];
    if(department){
        options="WHERE department=? ";
        optionArr.push(department);
    }
    if(designation){
        options=options?`${options} AND  designation=? ` :" WHERE designation=?";
        optionArr.push(designation);
    }
    if(gender){
        options=options?`${options} AND  gender=? ` :" WHERE gender=?";
        optionArr.push(gender);
    }
   
   
    let sql=`SELECT * FROM employee ${options}`;
    connection.query(sql, optionArr,function(err,result){
        if(err) res.status(404).send(err);
        else  {
          
            res.send(result);
        }
    })
})
app.get("/employees/:empcode",function(req,res){
    let empcode=+req.params.empcode;
    let connection=getConnection();;
    let sql="SELECT * FROM employee WHERE empCode=?";
    connection.query(sql,empcode,function(err,result){
        if(err) res.status(404).send(err);
        else if(result.length===0)  res.status(404).send("No employee found");
       
             else res.send(result[0]);
         
      
    })
 });



 
app.post("/employees",function(req,res){
    let body=req.body;
    let connection=getConnection();
    let sql="INSERT INTO employee(empCode,name,department,designation,salary,gender) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],function(err,result){
        if(err) res.status(404).send("Error in inserting data");
        else{
            res.send(`Post success.Id of new employee is ${result.insertId}`);
    }
    })
})

app.put("/employees/:empcode", function(req,res){
    let empcode=+req.params.empcode;
    let body=req.body;
    let connection=getConnection();
    let sql="UPDATE employee SET empCode=?,name=?,department=?,designation=?,salary=?,gender=? WHERE empCode=?";
    let params=[empcode,body.name,body.department,body.designation,body.salary,body.gender,body.empCode];
    connection.query(sql,params,function(err,result){
        if(err) res.status(404).send("Error in updating data");
        else if (result.affectedRows===0) res.status(404).send("No  update happened");
         else res.send("Update success")
    })
 })


 app.delete("/employees/:empcode", function(req,res){
    let empcode=+req.params.empcode;
    let connection=getConnection();
    let sql="DELETE FROM employee WHERE empCode=?";
   
    connection.query(sql,empcode,function(err,result){
        if(err) res.status(404).send("Error in deleting data");
        else if (result.affectedRows===0) res.status(404).send("No  delete happened");
         else res.send("delete success")
    })
 })