import React, { Component } from "react";
import { connect } from "react-redux";
import "./SearchEbookByCategory.css";
import BookList from "../../components/BookList/BookList";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/action/rootActions";
import { clickedLink } from "../../util/helper";
import Pagination from "../../components/Pagination/Pagination";

class SearchEbookByCategory extends Component {
   state = {
      searchedName: "",
      query: "",
   };
   componentDidMount() {
      const searchedName = this.props.match.params.searched_category;
      const query = this.props.history.location.search;
      this.setState({ searchedName: searchedName, query: query });
      this.props.onSerachEbooksByCategory(searchedName, query);
   }

   componentDidUpdate() {
      const newSearchName = this.props.match.params.searched_category;
      const newQuery = this.props.history.location.search;
      if (
         this.state.searchedName !== newSearchName ||
         this.state.query !== newQuery
      ) {
         this.setState({ searchedName: newSearchName, query: newQuery });
         this.props.onSerachEbooksByCategory(newSearchName, newQuery);
         return true;
      } else {
         console.log("Component Didn't Update");
         return false;
      }
   }
   render() {
      let searchedBookLists;
      // Whether Show Spinner or Result page by checking loading
      if (this.props.loading) {
         searchedBookLists = <Spinner />;
      } else {
         const searchedName = this.state.searchedName.split("-");
         const bookLists = this.props.ebook_datas.map((ebook) => (
            <BookList
               key={ebook._id}
               {...ebook}
               clicked={() => clickedLink(ebook._id, this.props)}
            />
         ));
         searchedBookLists = (
            <div className="SearchEbookByCategory">
               <h1>Category: {searchedName.join(" ")}</h1>
               {bookLists}
               <Pagination />
            </div>
         );
      }

      return searchedBookLists;
   }
}

const stateToProps = (state) => {
   return {
      ebook_datas: state.ebook.searched_ebook_datas,
      loading: state.ebook.loading,
   };
};

const dispatchToProps = (dispatch) => {
   return {
      onSerachEbooksByCategory: (searchedName, query) =>
         dispatch(actions.onSerachEbooksByCategory(searchedName, query)),
   };
};

export default connect(stateToProps, dispatchToProps)(SearchEbookByCategory);
