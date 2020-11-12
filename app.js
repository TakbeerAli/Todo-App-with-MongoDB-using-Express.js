const express = require("express");
const BodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const _= require("lodash");


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

  const listShema = {  // schema for dynamic routing
      name:String,
      items:[itemsSchema]
  };

  const List = mongoose.model("List", listShema); // for dynamic    routing

  

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
    const listName = req.body.list;  // get value for where to store items

    const item = new Item({  // adding data to DB dynamically from form  & this item is based on upr schema
        name: newItem
    });

    if(listName ==="Today")  // checking where to store items
    {
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}, function(err,foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);

        });
    } 
});

app.post("/delete", function(req,res){
const CheckedId = req.body.checkedbox;
const listName = req.body.listName;
if(listName ==="Today")
{
    Item.findByIdAndRemove(CheckedId,function(err){
        if(!err){
         console.log("Succesfully Deleted");
         res.redirect("/");
       }
      });

}else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id: CheckedId}}}, function(err, foundList){
      if(!err){
          res.redirect("/" + listName);
      }
    });

}


});


app.get("/:customeListName", function(req,res){
  const customeListName = _.capitalize(req.params.customeListName);

  List.findOne({name:customeListName}, function(err, foundList){  //this for found of link is found then show it other wise don't repeat it
if(!err){
    if(!foundList){
        const list = new List({

            name:customeListName,
            items: DefaultItems
          });
          list.save();
          res.redirect("/" + customeListName);
    }else{
        res.render("list",{listTitle:foundList.name , newItems :foundList.items });
    }
}

  });
  
});


app.listen(process.env.PORT || 3000, function(req,res){    
    console.log("App is running on port 3000");

})




