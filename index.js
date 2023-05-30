require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const database = require('./config/db');
const hepler = require('./utils/helper');
const PORT = process.env.PORT;
app.use(bodyparser());

database.connect((err)=>{
  if(err){
    console.log('err+++', err)
  }else {
    console.log('database connected successfully');
  }
  const userTable = `create table if not exists users(
    id int primary key auto_increment,
    name varchar(255)not null default 'admin',
    email varchar(255)not null,
    password varchar(255)not null
    )`;
  database.query(userTable, (err) => {
    if(err){
      console.log('err++', err.message)
    }
  })
  database.end();
});

app.get('/',(req,res)=>{
  res.send('hii you are in sql data base')
});

app.post('/createuser', async (req,res)=>{
  await database.connect(async ()=>{
    const { name,email,password } = req.body;
    const user = `INSERT INTO users(name,email,password) VALUES("${name}","${email}","${password}")`;
    await database.promise().query(user);
    database.end();
    res.send(req.body);
  });

});

app.get('/getalluser', async (req,res) => {
  database.connect((err)=>{
    if(err){
      console.log('err+++', err)
    }else {
      console.log('database connected successfully');
    }
  });
  getAllUserQurey = `SELECT * FROM users`;
  const Users = await database.promise().query(getAllUserQurey);
  database.end();
  res.send(Users[0]);
})

app.get('/user/:id', async (req,res)=>{
  database.connect((err)=>{
    if(err){
      console.log('err+++', err)
    }else {
      console.log('database connected successfully');
    }
  });
  let userQurey = `SELECT * FROM users WHERE id=` + req.params.id ;
  const User = await database.promise().query(userQurey);
  database.end();
  if(User[0][0]){
    res.send(User[0][0])
  }else {
    res.send(404).json({massage: 'user not found'})
  }
})

app.post('/updateuser/:id', async (req,res)=>{
  database.connect((err)=>{
    if(err){
      console.log('err+++', err)
    }else {
      console.log('database connected successfully');
    }
  });
  const updateUser = `UPDATE users
                     SET ?
                     WHERE ?`;

  const userData = [req.body, {id: req.params.id}];
  const User = await database.promise().query(updateUser,userData);
  database.end();
  if(User.length && User[0]?.affectedRows){
    res.status(200).json({massage: 'data updated successfully'})
  }else {
    res.status(500).json({massage: 'data not updated'})
  }
});

app.get('/deleteuser/:id', async (req,res) => {
  database.connect((err)=>{
    if(err){
      console.log('err+++', err)
    }else {
      console.log('database connected successfully');
    }
  });
  const deleteUser = `DELETE FROM users WHERE id = ?`;
  const userId = req.params.id;
  const user = await database.promise().query(deleteUser,userId);
  database.end();
  if(user.length && user[0]?.affectedRows){
    res.status(200).json({massage: 'data deleted successfully'})
  }else {
    res.status(500).json({massage: 'data not deleted'})
  }

})

app.listen(PORT, ()=>{
  console.log('server is started');
});
