import '../css/booknotes.scss';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const dbHelper = {
  createBook: (title, respAction) =>{
    fetch(
      '/booknotes/api',
      {
        method: "POST",
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
          comment: text
        })
      }
    )
      .then(res => res.json())
      .then(respAction)
      .catch(error => {
        console.log(error)
      });
  }
}


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
  <form id="newBookForm" className="border" onSubmit={onNewBookSubmit}>
    <input type="text" id="bookTitleToAdd" name="title" placeholder="New Book Title" style={{width: "295px"}} value={newBookName} onChange={handleNewBookNameChange}/>
    <button type="submit" value="Submit" id="newBook">Submit New Book!</button>
  </form>);
}

function BookItem(props){
  function onClickHandler() {
    props.onClick(props.book);
  };

  let numComments = props.book.comments.length;
  return (
    <li onClick={onClickHandler}>
      {props.book.title + " - " + numComments + (numComments == 1 ? " note" : " notes")}
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
    <ul>
      {bookItems}
    </ul>
  )
}

function Note(props){
  return <li>{props.text}</li>
}

function Notes(props){

  const [noteText, setNoteText] = useState("");

  function addNoteHandler(event){
    event.preventDefault();
    dbHelper.addNote(props.bookId, noteText, props.addNoteResp);
    setNoteText("");
  }

  function handleNoteTextChange(event){
    setNoteText(event.target.value);
  }

  let notes;
  if(props.notes != null) notes = props.notes.map((note, i)=>{
    return <Note key={i} text={note}/>
  })
  return <div>
    <ul>
      {notes}
    </ul>
    <form onSubmit={addNoteHandler}>
      <input style={{width: "300px"}} className="form-control" name="noteText" placeholder="New Note" value={noteText} onChange={handleNoteTextChange}></input>
      <input type="submit" value="Add Note"></input>
    </form>
  </div>;
}

function BookDetails(props){
  //console.log("BookDetails props", props);

  function deleteBookHandler(){
    dbHelper.deleteBook(props.book._id, props.deleteBookResp);
  }

  return (
    <div>
      {props.book == null ? <p>Select a book to see it's details and comments</p> 
      : 
      <div id="bookDetail" className="border">
      <p><b>{props.book.title}</b> {"(id: " + props.book._id + ")"}</p>
      <Notes notes={props.book.comments} bookId={props.book._id} addNoteResp={props.addNoteResp}/>
      <button className="btn btn-danger deleteBook" onClick={deleteBookHandler}>Delete Book</button>
      </div>
      }
    </div>
  )
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
    setBookItems([
      ...bookItems.slice(0,index),
      book,
      ...bookItems.slice(index+1)
    ]);
    setCurrentBook(book);
  }


  function useSelectBook(book){
    //console.log("selected book:", book);
    setCurrentBook(book);
  }

  useEffect(() => {
    fetch(
      '/booknotes/api',
      {
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);
        setBookItems(response);
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, []); //[] ensures fetch call only runs once

  return (
  <div>
    <SubmitNewBookForm newBookResp={useAddBookToList}/>
    {isLoading && <p>Loading Book Items...</p>}
    <BookItemList bookItems={bookItems} bookSelected={useSelectBook}/>
    <BookDetails book={currentBook} deleteBookResp={useRemoveBookFromList} addNoteResp={useModifyBook}/>
  </div>);
}


ReactDOM.render(<BookNotes/>, document.getElementById('react'));