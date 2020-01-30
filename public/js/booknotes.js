import '../css/booknotes.scss';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import iconExit from '../img/exit.svg';
import iconFavSelected from '../img/icon-fav-selected.svg';
import iconFavUnselected from '../img/icon-fav-unselected.svg';
import iconEditBlack from '../img/icon-edit-black.svg';
import iconEditWhite from '../img/icon-edit-white.svg';
import iconDelete from '../img/icon-delete.svg';
import iconSort from '../img/icon-sort.svg';
import iconHam from '../img/ham.svg';

import imageBook from '../img/img-book.png';

const dbHelper = {
  getBooks: (respAction) => {
    fetch(
      '/booknotes/api',
      {
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => console.log(error));
  },

  createBook: (title, respAction) =>{
    fetch(
      '/booknotes/api',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          user: "guest"
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  },

  deleteBook: (id, respAction) =>{
    fetch(
      '/booknotes/api/' + id,
      {
        method: "DELETE"
      }
    )
      .then(res => res.json())
      .then(()=>{respAction(id)})
      .catch(error => {
        console.log(error)
      });
  },

  addNote: (bookId, text, respAction) => {
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "POST",
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

  toggleIsFavorited: (bookId, noteId, isFavorited, respAction) => {
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "PUT",
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

function SubmitNewBookForm(props){

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
        <a className="hidden" id="logout" href="#">Log out</a>
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

function Note(props){
  function favOnClickHandler(e){
    dbHelper.toggleIsFavorited(props.bookId, props.note._id, props.note.is_favorited, props.respAction);
  }

  return (
    <li className="note">
      <a className="clickable">
        <img className="note-fav note-icon" src={props.note.is_favorited ? iconFavSelected : iconFavUnselected} 
            alt="Favorite Icon" onClick={favOnClickHandler}/>
      </a>
      <p className="note-date">{props.note.created_on}</p>
      <a className="hidden" href="#"><img className="note-edit note-icon" src={iconEditBlack} alt="Edit Icon"/></a>
      <a className="hidden" href="#"><img className="note-delete note-icon" src={iconDelete} alt="Delete Icon"/></a>
      <p className="note-text">{props.note.text}</p>
    </li>
  );
}

function Notes(props){

  let notes;
  if(props.notes != null) notes = props.notes.map((note, i)=>{
    return <Note key={i} note={note} bookId={props.bookId} respAction={props.respAction}/>
  })
  return (
    <div className="notes">
      <h4>Notes</h4>
      <div className="notes-container">
      <div className="notes-header">
        <a className="sort-fav sort" href="#">
          <p>Fav</p>
          <img src={iconSort} alt="Sort Icon"/>
        </a>
        <a className="sort-date sort" href="#">
          <p>Date</p>
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

function BookDetails(props){
  //console.log("BookDetails props", props);
  const [noteText, setNoteText] = useState("");

  function addNoteHandler(event){
    event.preventDefault();
    dbHelper.addNote(props.book._id, noteText, props.addNoteResp);
    setNoteText("");
  }

  function handleNoteTextChange(event){
    setNoteText(event.target.value);
  }

  function deleteBookHandler(event){
    event.preventDefault();
    dbHelper.deleteBook(props.book._id, props.deleteBookResp);
  }

  return (
    <div className="book-container">
      {props.book == null ? <p>Select a book from the Book List to see it's details and notes</p> 
      :<div>
      <div className="book-header">
        <h3>{props.book.title}</h3>
        <a className="remove" href="#"><img src={iconEditWhite} alt="Edit Icon"/></a>
      </div>
      <img className="book-image" src={imageBook} alt="Book Image"/>

      <div className="form-content">
        <form className="form-new-note" onSubmit={addNoteHandler}>
          <textarea rows="3" placeholder="Note text..." value={noteText} onChange={handleNoteTextChange} required></textarea>
          <input className="button" type="submit" value="Add Note"/>
        </form>
        <form className="form-delete-book" onSubmit={deleteBookHandler}>
          <input className="button" type="submit" value="Delete book"/>
        </form>
      </div>

      <Notes notes={props.book.notes} bookId={props.book._id} respAction={props.addNoteResp}/>

      </div>}
    </div>
  )
}
function toggleMenu(){
  document.getElementById('title-list').classList.toggle('hide-mobile');
}

function BookNotes(props){
  const [bookItems, setBookItems] = useState([]);
  const [currentBook, setCurrentBook] = useState();
  const [isLoading, setIsLoading] = useState(true);

  function useAddBookToList(newBook){
    console.log("newBook", newBook);
    setBookItems([
      ...bookItems,
      newBook
    ]);
    setCurrentBook(newBook);
  }

  function useRemoveBookFromList(bookId){
    console.log("bookId");
 
    setBookItems(bookItems.filter(book=> book._id != bookId));
    setCurrentBook(null);

  }

  function useModifyBook(book){
    
    let bookId = book._id;
    let index = bookItems.findIndex(item => item._id == bookId);
    console.log("bookId", bookId);
    console.log("index", index);

    setBookItems([
      ...bookItems.slice(0,index),
      book,
      ...bookItems.slice(index+1)
    ]);
    setCurrentBook(book);
  }

  function useToggleIsFavorited(resp){
    console.log("does this thing work");
    console.log("toggleFavResp", resp);
  }


  function useSelectBook(book){
    //console.log("selected book:", book);
    setCurrentBook(book);
    toggleMenu();
  }

  useEffect(() => {
    dbHelper.getBooks((response)=>{
      console.log(response);
      setBookItems(response);
      setIsLoading(false);
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
        <h2>Welcome Guest!</h2>
        <SubmitNewBookForm newBookResp={useAddBookToList}/>
        <BookDetails book={currentBook} deleteBookResp={useRemoveBookFromList} addNoteResp={useModifyBook} toggleFavResp={useToggleIsFavorited}/>
        </div>
      </div>
    </div>
  );
}


ReactDOM.render(<BookNotes/>, document.getElementById('react'));