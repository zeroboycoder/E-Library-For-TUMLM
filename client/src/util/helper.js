export const clickedLink = (book_id, props) => {
   props.history.replace(`/ebooks/${book_id}`);
};
