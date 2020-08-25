import React, { Component } from "react";
import { connect } from "react-redux";
import "./EbookDetail.css";
import * as actions from "../../store/action/rootActions";
import cover from "../../assets/ss.jpg";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";

class EbookDetail extends Component {
   componentDidMount() {
      const book_id = this.props.match.params.book_id;
      this.props.onFetchDetailOfEbook(book_id);
   }
   render() {
      let ebookDetail = null;
      // Whether Show Spinner or Result page by checking loading
      if (this.props.loading) {
         ebookDetail = <Spinner />;
      } else {
         // if not loading
         // then check detail of ebook
         if (this.props.detail_of_ebook) {
            ebookDetail = (
               <div className="EbookDetail">
                  <h1 className="EbookDetail__Heading">
                     {this.props.detail_of_ebook.bookName}
                  </h1>
                  <div className="EbookDetail__BookCover">
                     <img src={cover} alt="Book Cover" />
                  </div>
                  <p>Author : {this.props.detail_of_ebook.author}</p>
                  <p>
                     Released Date : {this.props.detail_of_ebook.releasedYear}
                  </p>
                  <p>Pages : {this.props.detail_of_ebook.pages}</p>
                  <p>File Size : {this.props.detail_of_ebook.fileSize} MB</p>
                  <p>Description : {this.props.detail_of_ebook.description}</p>
                  <a
                     href={this.props.detail_of_ebook.pdfLocation}
                     className="EbookDetail__DownloadBtn"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <Button padding="12px 34px">Download</Button>
                  </a>
               </div>
            );
         }
      }
      return ebookDetail;
   }
}

const stateToProps = (state) => {
   return {
      detail_of_ebook: state.ebook.detail_of_ebook,
      loading: state.ebook.loading,
   };
};

const dispatchToProps = (dispatch) => {
   return {
      onFetchDetailOfEbook: (book_id) =>
         dispatch(actions.onFetchDetailOfEbook(book_id)),
   };
};

export default connect(stateToProps, dispatchToProps)(EbookDetail);
