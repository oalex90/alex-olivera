import '../css/booknotes.scss';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

//images used in react components
import iconExit from '../img/exit.svg';
import iconFavSelected from '../img/icon-fav-selected.svg';
import iconFavUnselected from '../img/icon-fav-unselected.svg';
import iconEditBlack from '../img/icon-edit-black.svg';
import iconEditWhite from '../img/icon-edit-white.svg';
import iconDelete from '../img/icon-delete.svg';
import iconSort from '../img/icon-sort.svg';
import iconHam from '../img/ham.svg';

const dbHelper = { //contains all db interaction functions
  getBooks: (respAction) => { //gets all books for the signed-in user, response returns array of books 
    fetch(
      '/booknotes/api',
      {
        method: "GET",
        credentials: 'include'
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => console.log(error));
  },

  createBook: (title, respAction) =>{ //creates a book in db for signed-in user, response returns new book
    fetch(
      '/booknotes/api',
      {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  updateImage: (bookId, newImg, respAction) => { //updates image prop for a given book, response returns updated book
    fetch(
      '/booknotes/api/',
      {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookId,
          img: newImg
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  updateBookTitle: (bookId, newTitle, respAction) => { //updates title prop for a given book, response returns updated book
    fetch(
      '/booknotes/api/',
      {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookId,
          title: newTitle
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  deleteBook: (id, respAction) =>{ //delete a book, response returns book id
    fetch(
      '/booknotes/api/',
      {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id
        })
      }
    )
      .then(res => res.json())
      .then(()=>{respAction(id)})
      .catch(error => {
        console.log(error)
      });
  },

  addNote: (bookId, text, respAction) => { //add note to notes array of a book, response returns updated book
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  removeNote: (bookId, noteId, respAction) => { //remove note from notes array of a book, response returns updated book
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note_id: noteId
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  updateNoteText: (bookId, noteId, noteText, respAction) => { //updates note text of given note, response returns updated book
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note_id: noteId,
          note_text: noteText
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  toggleIsFavorited: (bookId, noteId, isFavorited, respAction) => { //toogles isFavorited prop of given not, response returns updated book
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note_id: noteId,
          is_favorited: isFavorited
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  }
};

function toggleMenu(){ //shows/hides menu
  document.getElementById('title-list').classList.toggle('hide-mobile');
}

function AddBookForm(props){

  const [newBookName, setNewBookName] = useState("");

  function handleNewBookNameChange(event){
    setNewBookName(event.target.value);
  }

  function onNewBookSubmit(event){
    event.preventDefault();
    dbHelper.createBook(newBookName, props.newBookResp);
    setNewBookName("");
  }

  return (
  <form className="form-new-book" onSubmit={onNewBookSubmit}>
    <input type="text" name="title" placeholder="Book title..." value={newBookName} onChange={handleNewBookNameChange} required/>
    <input className="button" type="submit" value="Add Book"/>
  </form>);
}

function BookItem(props){
  function onClickHandler() {
    props.onClick(props.book);
  };

  let numNotes = props.book.notes.length;
  return (
    <li onClick={onClickHandler}>
      <h4>{props.book.title}</h4>
      <p>{"(" + numNotes + (numNotes == 1 ? " note" : " notes")+ ")"}</p>
    </li>
  )
}

function BookItemList(props){
  //console.log("bookItems", props.bookItems);
  let bookItems;
  bookItems = props.bookItems.map(item =>{
    //console.log("item", item);
    return <BookItem key={item._id} book={item} onClick={props.bookSelected}/>
  });

  return (
    <div id="title-list" className="list-container hide-mobile">
      <div>
        <a id="logout" href="/booknotes/logout">Log out</a>
        <a id="exit" href="#" className="exit-btn hide-desktop">
            <img src={iconExit} alt="exit menu" onClick={toggleMenu}/>
        </a> 
      </div>
      <h3>Book List</h3>
      <ul id="book-list">
        {bookItems}
      </ul>
    </div>
  )
}

function EditNoteForm(props){

  const [noteText, setNoteText] = useState(props.noteText);

  function spanOnClickHandler() {
    props.stopEditing();
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    dbHelper.updateNoteText(props.bookId, props.noteId, noteText, props.respAction);
    props.stopEditing();
  }

  function handleNoteTextChange(event) {
    setNoteText(event.target.value);
  }

  return (
    <div id="edit-note-modal" className="modal">
      <form className="modal-content" onSubmit={onSubmitHandler}>
        <span className="close" onClick={spanOnClickHandler}>&times;</span>
        <h4>Edit Note</h4>
        <textarea rows="1" type="text" placeholder="Note text..."
          value={noteText} onChange={handleNoteTextChange} required/>      
        <input className="button" type="submit" value="Update Note"/>
      </form>
    </div>
  );
}

function Note(props){
  const [isEditing , setIsEditing] = useState(false); 

  let note = props.note;

  function favOnClickHandler(e){
    dbHelper.toggleIsFavorited(props.bookId, note._id, note.is_favorited, props.respAction);
  }

  function deleteOnClickHandler(e){
    dbHelper.removeNote(props.bookId, note._id, props.respAction);
  }

  function editOnClickHandler() {
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
  }

  return (
    <li className="note">
      <a className="clickable">
        <img className="note-fav note-icon" src={note.is_favorited ? iconFavSelected : iconFavUnselected} 
            alt="Favorite Icon" onClick={favOnClickHandler}/>
      </a>
      <p className="note-date">{note.created_on}</p>
      <a className="clickable"><img className="note-edit note-icon" src={iconEditBlack} onClick={editOnClickHandler} alt="Edit Icon"/></a>
      <a className="clickable"><img className="note-delete note-icon" src={iconDelete} onClick={deleteOnClickHandler} alt="Delete Icon"/></a>
      <p className="note-text">{note.text}</p>
      {isEditing && <EditNoteForm bookId={props.bookId} noteId={note._id} noteText={note.text} respAction={props.respAction} stopEditing={stopEditing}/>}
    </li>
    
  );
}

function Notes(props){
  //sort options [1: date old-to-new, 2: date: new-to-old, 3: fav selected-to-unselect then data old-to-new, 4: fav unselected-to-selected]
  const [sortOption , setSortOption] = useState(1); 

  function favSortOnClick(){ 
    if(sortOption == 3){
      setSortOption(4);
    }else{
      setSortOption(3);
    }
  }

  function dateSortOnClick(){
    //console.log("date sort clicked");
    if(sortOption == 1){
      setSortOption(2);
    }else{
      setSortOption(1);
    }
  }

  function favSort(noteList, option){
    noteList.sort((a,b)=>{
      let comparison;
      if(a.is_favorited && !b.is_favorited){
        comparison = option? -1 : 1;
      }else if(!a.is_favorited && b.is_favorited){
        comparison = option? 1 : -1;
      }else {
        let dateA = new Date(a.created_on);
        let dateB = new Date(b.created_on);
        if(dateA.getTime() < dateB.getTime()){
          comparison = -1;
        }else{
          comparison = 1;
        }
      }
      return comparison;
    });
  }

  function getSortedNotes(){
    let noteList = [...props.notes];
    switch(sortOption){
      case 1:
        break;
      case 2:
        noteList.reverse();
        break;
      case 3:
        favSort(noteList, true);
        break;
      case 4:
        favSort(noteList, false);
        break;
    }
    return noteList;
  }

  //console.log("sort option:", sortOption);
  let notes;
  if(props.notes != null) notes = getSortedNotes().map((note, i)=>{
    return <Note key={i} note={note} bookId={props.bookId} respAction={props.respAction}/>
  })
  return (
    <div className="notes">
      <h4>Notes</h4>
      <div className="notes-container">
      <div className="notes-header">
        <a className="sort-fav sort clickable">
          <p onClick={favSortOnClick}>Fav</p>
          <img src={iconSort} alt="Sort Icon"/>
        </a>
        <a className="sort-date sort clickable">
          <p onClick={dateSortOnClick}>Date</p>
          <img src={iconSort} alt="Sort Icon"/>
        </a>
      </div>
      <ul>
        {notes}
      </ul>
    </div>
  </div>
  );
}

function AddNoteForm(props){

  const [noteText, setNoteText] = useState("");

  function handleNoteTextChange(event){
    setNoteText(event.target.value);
  }

  function addNoteHandler(event){
    event.preventDefault();
    dbHelper.addNote(props.bookId, noteText, props.addNoteResp);
    setNoteText("");
  }

  return (
    <form className="form-new-note" onSubmit={addNoteHandler}>
      <textarea rows="3" placeholder="Note text..." value={noteText} onChange={handleNoteTextChange} required></textarea>
      <input className="button" type="submit" value="Add Note"/>
    </form>
  );
}

function DeleteBookForm(props){

  function deleteBookHandler(event){
    event.preventDefault();
    dbHelper.deleteBook(props.bookId, props.deleteBookResp);
  }

  return (
    <form className="form-delete-book" onSubmit={deleteBookHandler}>
      <input className="button" type="submit" value="Delete book"/>
    </form>
  );
}

function EditImageForm(props){

  const [imgText, setImgText] = useState("");
  const [errorText, setErrorText] = useState("");

  function spanOnClickHandler() {
    //console.log("stopEditing...: ", props.stopEditingImg);
    props.stopEditing();
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if(imgText.match(/\.(jpeg|jpg|gif|png)$/) != null){
      dbHelper.updateImage(props.bookId, imgText, props.respAction);
      props.stopEditing();
    } else{
      setErrorText("Incorrect file type. Please only input a .jpeg, .jpg, .gif, or .png file");
    }
    
  }

  function handleImgTextChange(event) {
    setImgText(event.target.value);
    setErrorText("");
  }

  return (
    <div id="edit-img-modal" className="modal">
      <form id="edit-img-form" className="modal-content" onSubmit={onSubmitHandler}>
        <span className="close" onClick={spanOnClickHandler}>&times;</span>
        <h4>Edit Image</h4>
        <textarea rows="1" type="text" placeholder="image url (jpeg, jpg, gif or png only)..."
          value={imgText} onChange={handleImgTextChange} required/>
        
        <input className="button" type="submit" value="Update Image"/>
        <p>{errorText}</p>
      </form>
    </div>
  );
}

function EditTitleForm(props){

  const [titleText, setTitleText] = useState(props.title);

  function spanOnClickHandler() {
    props.stopEditing();
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    dbHelper.updateBookTitle(props.bookId, titleText, props.respAction);
    props.stopEditing();
  }

  function handleTitleTextChange(event) {
    setTitleText(event.target.value);
  }

  return (
    <div id="edit-title-modal" className="modal">
      <form className="modal-content" onSubmit={onSubmitHandler}>
        <span className="close" onClick={spanOnClickHandler}>&times;</span>
        <h4>Edit Title</h4>
        <textarea rows="1" type="text" placeholder="Title..."
          value={titleText} onChange={handleTitleTextChange} required/>      
        <input className="button" type="submit" value="Update Title"/>
      </form>
    </div>
  );
}

function BookDetails(props){
  const [isEditingImg , setIsEditingImg] = useState(false);
  const [isEditingTitle , setIsEditingTitle] = useState(false);  
  //console.log("BookDetails props", props);

  function imgOnClickHandler() {
    setIsEditingImg(true);
  }

  function stopEditingImg() {
    setIsEditingImg(false);
  }

  function editTitleOnClickHandler() {
    setIsEditingTitle(true);
  }

  function stopEditingTitle() {
    setIsEditingTitle(false);
  }

  let book = props.book;
  //console.log("current book", book);
  
  return (
    <div className="book-container">
      {book == null ? <p>Select a book from the Book List to see it's details and notes</p> 
      :<div>
      <div className="book-header">
        <h3>{book.title}</h3>
        <a className="clickable"><img src={iconEditWhite} onClick={editTitleOnClickHandler} alt="Edit Icon"/></a>
        {isEditingTitle && <EditTitleForm bookId={book._id} title={book.title} respAction={props.addNoteResp} stopEditing={stopEditingTitle}/>}
      </div>
      <img className="book-image clickable" src={book.img} alt="Book Image" onClick={imgOnClickHandler}/>
      
      {isEditingImg && <EditImageForm bookId={book._id} respAction={props.addNoteResp} stopEditing={stopEditingImg}/>}

      <div className="form-content">
        <AddNoteForm bookId={book._id} addNoteResp={props.addNoteResp}/>
        <DeleteBookForm bookId={book._id} deleteBookResp={props.deleteBookResp}/>
      </div>

      <Notes notes={book.notes} bookId={book._id} respAction={props.addNoteResp}/>

      </div>}
    </div>
  )
}

function BookNotes(props){
  const [bookItems, setBookItems] = useState([]);
  const [name, setName] = useState();
  const [currentBook, setCurrentBook] = useState();
  const [isLoading, setIsLoading] = useState(true);

  function useAddBookToList(newBook){
    //console.log("newBook", newBook);
    setBookItems([
      ...bookItems,
      newBook
    ]);
    setCurrentBook(newBook);
  }

  function useRemoveBook(bookId){
    //console.log("bookId");
 
    setBookItems(bookItems.filter(book=> book._id != bookId));
    setCurrentBook(null);

  }

  function useModifyBook(book){
    
    let bookId = book._id;
    let index = bookItems.findIndex(item => item._id == bookId);
    //console.log("bookId", bookId);
    //console.log("index", index);

    setBookItems([
      ...bookItems.slice(0,index),
      book,
      ...bookItems.slice(index+1)
    ]);
    setCurrentBook(book);
  }

  function useSelectBook(book){
    setCurrentBook(book);
    toggleMenu();
  }

  useEffect(() => {
    dbHelper.getBooks((response)=>{
      console.log(response);
      setBookItems(response.books);
      setName(response.name);
      setIsLoading(false);
      if(response.error != null) {
        alert(response.error);
      }
    });
  }, []); //[] ensures fetch call only runs once

  return (
    <div id="app">
      <a id="a-menu" href="#" className="hide-desktop">
        <img id="menu" src={iconHam} alt="hamburger" onClick={toggleMenu}/>
      </a>
      <div>
        {isLoading && <p>Loading Book Items...</p>}
        <BookItemList bookItems={bookItems} bookSelected={useSelectBook}/>

        <div className="main-container">
        <h2>Welcome {name}!</h2>
        <AddBookForm newBookResp={useAddBookToList}/>
        <BookDetails book={currentBook} deleteBookResp={useRemoveBook} addNoteResp={useModifyBook}/>
        </div>
      </div>
    </div>
  );
}


ReactDOM.render(<BookNotes/>, document.getElementById('react'));