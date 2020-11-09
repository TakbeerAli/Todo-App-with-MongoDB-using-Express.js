const express = require("express");
const BodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');


const  app = express();
app.set('view engine', 'ejs');
 app.use(BodyParser.urlencoded({extended:true}));  
 app.use(express.static("public"));
 mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true}); //DB connect

 const itemsSchema ={ // creating schema how we store data in DB
     name: String
 };

 const Item = mongoose.model("Item", itemsSchema); //creating model of DB according to schema


  const item1 = new Item ({   // inserting value
      name:"Item1"
  });
  const item2 = new Item({   // inserting value
        name:"itme2"
  });

  const item3 = new Item ({   // inserting value
     name:"item3"
  });

  const DefaultItems = [item1,item2,item3];  // inserting all value in array

  

app.get("/", function(req,res){

    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            Item.insertMany(DefaultItems, function(err){  // saveing data in DB using ( insertMany ) function 
                if(err){
                    console.log(err)
                }else{
                    console.log("Successfully saved")
                }
                });
                res.redirect("/");
        }else{
            res.render("list",{listTitle:"Today" , newItems :foundItems });
        }
       
    }); 
    


});

app.post("/" ,function(req,res) {   // defined 2 forms in sigle post

    var newItem = req.body.newItem;  

    const item = new Item({  // adding data to DB dynamically from form  & this item is based on upr schema
        name: newItem
    })

    item.save();

    res.redirect("/");
   
   
    
  
});

app.get("/work", function(req,res){

    res.render("list",{ listTitle:"Work", newItems:workItems });
});



app.listen(process.env.PORT || 3000, function(req,res){    
    console.log("App is running on port 3000");

})




