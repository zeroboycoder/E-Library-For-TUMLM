import * as actionTypes from "../action/actionTypes";

const initState = {
   ebook_datas: [],
   searched_ebook_datas: [],
   detail_of_ebook: null,
   pagination: {},
   errMsg: null,
   loading: false,
};

const ebookReducer = (state = initState, action) => {
   switch (action.type) {
      /* Fetch Ebooks */
      case actionTypes.FETCH_EBOOKS_START:
         return {
            ...state,
            loading: true,
         };
      case actionTypes.FETCH_EBOOKS_SUCCESS:
         return {
            ...state,
            ebook_datas: action.ebook_datas,
            pagination: action.pagination,
            loading: false,
         };
      case actionTypes.FETCH_EBOOKS_FAIL:
         return {
            ...state,
            errMsg: action.errMsg,
            loading: false,
         };
      /* Fetch Detail of Ebook */
      case actionTypes.FETCH_DETAIL_OF_EBOOK_START:
         return {
            ...state,
            loading: true,
         };
      case actionTypes.FETCH_DETAIL_OF_EBOOK_SUCCESS:
         return {
            ...state,
            detail_of_ebook: action.detail_of_ebook,
            loading: false,
         };
      case actionTypes.FETCH_DETAIL_OF_EBOOK_FAIL:
         return {
            ...state,
            loading: false,
            errMsg: action.errMsg,
         };
      /* Add Ebook Reducer */
      case actionTypes.ADD_EBOOK_START:
         return {
            ...state,
            loading: true,
         };
      case actionTypes.ADD_EBOOK_SUCCESS:
         return {
            ...state,
            loading: false,
         };
      case actionTypes.ADD_EBOOK_FAIL:
         return {
            ...state,
            loading: false,
         };
      /* Search Ebook By Category */
      case actionTypes.SEARCH_EBOOKS_BY_CATEGORY_START:
         return {
            ...state,
            loading: true,
         };
      case actionTypes.SEARCH_EBOOKS_BY_CATEGORY_SUCCESS:
         return {
            ...state,
            searched_ebook_datas: action.searched_ebook_datas,
            pagination: action.pagination,
            loading: false,
         };
      case actionTypes.SEARCH_EBOOKS_BY_CATEGORY_FAIL:
         return {
            ...state,
            errMsg: action.errMsg,
            loading: false,
         };
      /* Search Ebook By Input Name */
      case actionTypes.SEARCH_EBOOKS_BY_INPUT_NAME_START:
         return {
            ...state,
            loading: true,
         };
      case actionTypes.SEARCH_EBOOKS_BY_INPUT_NAME_SUCCESS:
         return {
            ...state,
            ebook_datas: action.ebook_datas,
            loading: false,
         };
      case actionTypes.SEARCH_EBOOKS_BY_INPUT_NAME_FAIL:
         return {
            ...state,
            loading: false,
            errMsg: action.errMsg,
         };
      default:
         return state;
   }
};

export default ebookReducer;
