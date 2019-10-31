//Uses ReactBootstrap with minimal html and css

//Use to reset the localStorage variables if needed
/* 
localStorage.removeItem("recipes"); 
localStorage.removeItem("eventKeyCurNum"); 
*/

//default values
var defaultEventKeyCurNum = 0;
var defaultRecipes = [
  {
    eventKey: defaultEventKeyCurNum++, //increment after every use to insure unique eventKeys
    title: "Pumpkin Puree",
    ingredients: "Pumpkin Puree, Sweetened Condensed Milk, Eggs, Pumpkin Pie Spice, Pie Crust"
  },
  {
    eventKey: defaultEventKeyCurNum++,
    title: "Spaghetti",
    ingredients: "Noodles, Tomato Sauce, (Optional) Meatballs"
  },
  {
    eventKey: defaultEventKeyCurNum++,
    title: "Onion Pie",
    ingredients: "Onion, Pie Crust, Sounds Yummy right?"
  },
];

class MyModal extends React.Component{//used for New and Edit ReactBootstrap.Modal objects
  
  render(){
    var type = this.props.type;
    var typeLower = type.toLowerCase(); //convert to lower case
    
    return (
      <ReactBootstrap.Modal show={this.props.show} onHide={this.props.onHide}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>{type + " Recipe"}</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
          <form>
            <ReactBootstrap.FormGroup
              controlId={typeLower + "RecipeForm"}>
              <ReactBootstrap.ControlLabel>
                Recipe
              </ReactBootstrap.ControlLabel>
              <ReactBootstrap.FormControl
                id = {typeLower + "TitleFormControl"}
                defaultValue = {this.props.defaultTitle}
                componentClass = 'input'
                type = "text"
                placeholder = "Recipe Name"
                />
              <br/>
              <ReactBootstrap.ControlLabel>
                Ingredients
              </ReactBootstrap.ControlLabel>
              <ReactBootstrap.FormControl
                id={typeLower + "IngredientsFormControl"}
                componentClass='textarea'
                defaultValue={this.props.defaultIngredients}
                placeholder="Enter Ingredients,Seperated,By Commas"
                style= {{resize: 'vertical'}}
                />
            </ReactBootstrap.FormGroup>
          </form>
        </ReactBootstrap.Modal.Body>
        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button variant="primary" onClick={this.props.onAffirmClick}>{type + " Recipe"}</ReactBootstrap.Button>
          <ReactBootstrap.Button onClick={this.props.onCloseClick}>Close</ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    );
  }
}

class Recipe extends React.Component{//inside content of each individual ReactBootstrap.Panel tag/object
  
  render(){
    
    //take in string of ingredients, split them into individual components and make ListGroupItems from each 
    var listGroupItems = []; //array of ReactBootstrap.ListGroupItems tags
    var ingredientsArr = this.props.ingredients.split(","); //use .split() to separate ingredients string
    
    for(var i=0; i<ingredientsArr.length; i++){//cycle through each ingredient and make ListGroupItem
      var curIngredient = ingredientsArr[i];
      var curListGroupItem = (
        <ReactBootstrap.ListGroupItem>
          {curIngredient}
        </ReactBootstrap.ListGroupItem>
      );
      listGroupItems.push(curListGroupItem);
    }
      
    return (
      <div>
        <h4 style={{textAlign:'center'}}>Ingredients</h4>
        <ReactBootstrap.ListGroup>
          {listGroupItems}
        </ReactBootstrap.ListGroup>
        <ReactBootstrap.Button
          id={"btnDel-"+ this.props.eventKey}
          bsStyle="danger"
          onClick={this.props.onDeleteClick}>
          Delete
        </ReactBootstrap.Button>
        <ReactBootstrap.Button
          id={"btnEdit-"+ this.props.eventKey}
          onClick={this.props.onEditClick}
          style={{marginLeft:'5px'}}>
          Edit
        </ReactBootstrap.Button>
      </div>);
  }
}

class Recipes extends React.Component{//ReactBoostrap.Accordion object/tag which contains all the recipes
  
  render(){
    var panels = []; //array of <ReactBootstrap.Panel objects
    
    for(var j=0; j<this.props.recipeObjs.length; j++){ //cycle through each recObj to make Panel
      var curRecipeObj = this.props.recipeObjs[j];
      var curPanel = (
        <ReactBootstrap.Panel
          header = {curRecipeObj.title}
          variant = "danger"
          eventKey = {curRecipeObj.eventKey}>
          <Recipe 
            ingredients = {curRecipeObj.ingredients}
            onDeleteClick = {this.props.onDeleteClick}
            onEditClick = {this.props.onEditClick}
            eventKey = {curRecipeObj.eventKey}/>
        </ReactBootstrap.Panel>
      );
      panels.push(curPanel);
    }
    
    return (
      <ReactBootstrap.Accordion>
        {panels}
      </ReactBootstrap.Accordion>);
  }
}

class RecipeBox extends React.Component{
  constructor(props) {
    super(props);
    
    var eventKeyCurNum;
    var recipes;
    
    //check localStorage and see if there are existing variables. If so, set states to localStorage variables. If not, set states to default.
    if (typeof(Storage) !== "undefined") { //check if browser supports localStorage before proceeding
      if(typeof(localStorage.recipes) === "undefined"){ //if localStorage variables don't exist, then set to default values
        //set to default values
        eventKeyCurNum = defaultEventKeyCurNum;
        recipes = defaultRecipes;

        //set localStorage variables
        localStorage.recipes = JSON.stringify(recipes); //need to store object array as a string 
        localStorage.eventKeyCurNum = eventKeyCurNum;

      } else{ //if localStorage variables exist, set global variables
        eventKeyCurNum = localStorage.eventKeyCurNum;
        recipes = JSON.parse(localStorage.recipes); //need to convert stored string to object array
      }
    } else { //output message if browser does not support localStorage
      alert("Sorry! No Web Storage support.");
      //set to default values
      eventKeyCurNum = defaultEventKeyCurNum;
      recipes = defaultRecipes;
    }
    
    this.state = {//set initial state variables
      showNewModal: false,
      showEditModal: false,
      recObjs: recipes,
      eventKeyCurNum: eventKeyCurNum,
      curRecObj:  {}
      };
    
    this.convertIDToRecObj         = this.convertIDToRecObj.bind(this);
    this.closeNewRecipe         = this.closeNewRecipe.bind(this);
    this.openNewRecipe         = this.openNewRecipe.bind(this);
    this.closeEditRecipe         = this.closeEditRecipe.bind(this);
    this.openEditRecipe         = this.openEditRecipe.bind(this);
    this.addNewRecipe         = this.addNewRecipe.bind(this);
    this.deleteRecipe         = this.deleteRecipe.bind(this);
    this.editRecipe         = this.editRecipe.bind(this);
  }
  
  //used to find recObj from ID
  convertIDToRecObj(idStr) {
    var numStr = idStr.split("-")[1]; //ID format: btnEdit-# or btnDel-# so want second part after using .split(). # = eventKey number
    var eventKey = parseInt(numStr); //convert string into number
    
    for(var k=0; k < this.state.recObjs.length; k++){//find recObj with matching eventKey
      var curRecObj = this.state.recObjs[k];
      if (curRecObj.eventKey == eventKey){
        return curRecObj;
      }
    }
    return "not found"; //return "not found" if no matching eventKeyNum is found
  }
  
  closeNewRecipe() {//for closing New Recipe Modal
    this.setState({ showNewModal: false });
  }

  openNewRecipe() {//for opening New Recipe Modal
    this.setState({ showNewModal: true });
  }
  
  closeEditRecipe(){ //for closing Edit Recipe Modal
    this.setState({ showEditModal: false});
  }

  openEditRecipe(e) {//for opening Edit Recipe Modal
    this.setState({
      showEditModal: true,
      curRecObj: this.convertIDToRecObj(e.target.id)
    });
  }
  
  addNewRecipe(){ //new recipe button click handler
    var newTitle = $("#newTitleFormControl").val(); //get input from title FormControl
    var newIngredients = $("#newIngredientsFormControl").val(); //get current input from ingredients FormControl
    
    if(newTitle == "") //if no title input then set default title
      {newTitle = "Untitled";}
    
    var newRecipeObj = { //create new recipe object
      eventKey: this.state.eventKeyCurNum++,
      title: newTitle,
      ingredients: newIngredients
    }; 
    this.state.recObjs.push(newRecipeObj); //add new recipe to recipe list
    this.closeNewRecipe();
  }
  
  deleteRecipe(e){ //delete recipe button click handler
    
    var curRecObj = this.convertIDToRecObj(e.target.id);
    var index = 0; //index of recipe being edited within recipe list
    var recObjs = this.state.recObjs;
    for (index; index<recObjs.length; index++){ //find recipe with matching eventKey within recipe list
      if(curRecObj.eventKey == recObjs[index].eventKey){
        break;
      }
    }
    recObjs.splice(index,1); //use splice to take out deleted recipe from recipe list
    this.setState({ //call this setState to initiate a render to update the screen
      recObjs: recObjs
    });
  }
  
  editRecipe(){ //edit recipe button click handler
    var newTitle = $("#editTitleFormControl").val(); //get input from title formcontrol
    var newIngredients = $("#editIngredientsFormControl").val(); //get input from ingredients formcontrol
    var curRecObj = this.state.curRecObj;
    
    if(newTitle != curRecObj.title){ //only update title if value was changed
      curRecObj.title = newTitle;
    }
    if(newIngredients != curRecObj.ingredients){ //only update ingredients if value was changed
      curRecObj.ingredients = newIngredients
    }
    this.closeEditRecipe();
  }

  render(){
    
    if (typeof(Storage) !== "undefined") { //update localStorage variables if browswer support localStorage
      localStorage.recipes = JSON.stringify(this.state.recObjs);
      localStorage.eventKeyCurNum = this.state.eventKeyCurNum;
    }
    
    return (
      <div>
        <div className="well" 
          style={{
            padding:'20px',
            marginTop: "15px",
            marginBottom: "10px",
            border: '1px solid #dee0ba',
            backgroundColor: '#f7f9d4',
            borderRadius: '8px'}}>
          <ReactBootstrap.Accordion>
            <Recipes 
              recipeObjs = {this.state.recObjs}
              onEditClick = {this.openEditRecipe}
              onDeleteClick = {this.deleteRecipe}/>
          </ReactBootstrap.Accordion>
        </div>
          <ReactBootstrap.Button
            variant = "primary"
            onClick = {this.openNewRecipe}
            style = {{marginLeft:'30px'}}>
            Add Recipe
          </ReactBootstrap.Button>
        
        <MyModal 
          type = {"Edit"}
          show = {this.state.showEditModal}
          onHide = {this.closeEditRecipe}
          defaultTitle = {this.state.curRecObj.title}
          defaultIngredients = {this.state.curRecObj.ingredients}
          onAffirmClick = {this.editRecipe}
          onCloseClick = {this.closeEditRecipe}/>
        
        <MyModal 
          type = {"New"}
          show = {this.state.showNewModal}
          onHide = {this.closeNewRecipe}
          onAffirmClick = {this.addNewRecipe}
          onCloseClick = {this.closeNewRecipe}/>
      </div>
      );}

}

ReactDOM.render(<RecipeBox/>, document.getElementById('app')); //standard render call of our parent React variable

