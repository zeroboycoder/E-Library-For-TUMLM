import React from "react";
import "./BookList.css";

const BookList = (props) => {
   let description = props.description;
   if (description.length > 200) {
      description = props.description.substring(0, 200) + "...";
   }
   return (
      <div className="BookList">
         <div className="BookList__BookImage">
            <img
               src={props.bookCoverLocation}
               alt={props.bookName}
               onClick={props.clicked}
            />
         </div>
         <div className="BookList__Body">
            <h2 className="BookList__Body__BookTitle" onClick={props.clicked}>
               {props.bookName}
            </h2>
            <small>By : {props.author}</small>
            <p>{description}</p>
         </div>
      </div>
   );
};

export default BookList;
