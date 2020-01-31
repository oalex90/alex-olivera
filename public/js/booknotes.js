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
      '/booknotes/api/',
      {
        method: "DELETE",
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

  removeNote: (bookId, noteId, respAction) => {
    fetch(
      '/booknotes/api/' + bookId,
      {
        method: "DELETE",
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

function toggleMenu(){
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
  let note = props.note;

  function favOnClickHandler(e){
    dbHelper.toggleIsFavorited(props.bookId, note._id, note.is_favorited, props.respAction);
  }

  function deleteOnClickHandler(e){
    dbHelper.removeNote(props.bookId, note._id, props.respAction);
  }

  return (
    <li className="note">
      <a className="clickable">
        <img className="note-fav note-icon" src={note.is_favorited ? iconFavSelected : iconFavUnselected} 
            alt="Favorite Icon" onClick={favOnClickHandler}/>
      </a>
      <p className="note-date">{note.created_on}</p>
      <a className="hidden" href="#"><img className="note-edit note-icon" src={iconEditBlack} alt="Edit Icon"/></a>
      <a className="clickable"><img className="note-delete note-icon" src={iconDelete} onClick={deleteOnClickHandler} alt="Delete Icon"/></a>
      <p className="note-text">{note.text}</p>
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
    console.log("date sort clicked");
    if(sortOption == 1){
      setSortOption(2);
    }else{
      setSortOption(1);
    }
  }

  function favSort(noteList){
    noteList.sort((a,b)=>{
      let comparison;
      if(a.is_favorited && !b.is_favorited){
        comparison = 1;
      }else if(!a.is_favorited && b.is_favorited){
        comparison = -1;
      }else {
        let dateA = new Date(a.created_on);
        let dateB = new Date(b.created_on);
        if(dateA.getTime() < dateB.getTime()){
          comparison = 1;
        }else{
          comparison = -1;
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
        noteList.sort((a,b)=>{
          let comparison;
          if(a.is_favorited && !b.is_favorited){
            comparison = -1;
          }else if(!a.is_favorited && b.is_favorited){
            comparison = 1;
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
        break;
      case 4:
        noteList.sort((a,b)=>{
          let comparison;
          if(a.is_favorited && !b.is_favorited){
            comparison = 1;
          }else if(!a.is_favorited && b.is_favorited){
            comparison = -1;
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
        break;
    }
    return noteList;
  }

  console.log("sort option:", sortOption);
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

function BookDetails(props){
  //console.log("BookDetails props", props);

  let book = props.book;
  
  return (
    <div className="book-container">
      {book == null ? <p>Select a book from the Book List to see it's details and notes</p> 
      :<div>
      <div className="book-header">
        <h3>{book.title}</h3>
        <a className="remove" href="#"><img src={iconEditWhite} alt="Edit Icon"/></a>
      </div>
      <img className="book-image" src={imageBook} alt="Book Image"/>

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
        <AddBookForm newBookResp={useAddBookToList}/>
        <BookDetails book={currentBook} deleteBookResp={useRemoveBook} addNoteResp={useModifyBook}/>
        </div>
      </div>
    </div>
  );
}


ReactDOM.render(<BookNotes/>, document.getElementById('react'));