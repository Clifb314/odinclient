import React, { useEffect, useState } from "react";
import { postList, getUserIcon } from "../utils/dataAccess";
import PostCard from "./postCard";
import MsgBox from "./slideInMsg";
import PopupForm from "./popupForm";
import { useParams } from "react-router-dom";

export default function Feed() {


  const replyTemplate = {
    type: "post", //post, reply, comment, edit, post is default
    postRef: null, //replying to a post (or comment), or editing a post
    commentRef: null, //if replying to a comment or editing a comment
  };
  const [PopUpOpts, setPopupOpts] = useState(replyTemplate);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [posts, setPosts] = useState([]);
  const [slideIn, setSlideIn] = useState(null);
  const sorting = useParams().sorting;


    async function getPosts() {
      const query = sorting ? sorting : 'top'
      const response = await postList(query);
      if (response.err) displaySlideIn('error', response.err)
      else setPosts(response)
    }
  
  
    useEffect(() => {
      getPosts();
  
      return () => setPosts([]);
    }, []);

    
  /* Alerts */

  function closeSlideIn() {
    setSlideIn(null);
  }

  function displaySlideIn(type, message) {
    setSlideIn({ type, message });
    setTimeout(closeSlideIn, 5 * 1000);
  }

  const slideInComponent = slideIn ? (
    <MsgBox
      type={slideIn.type}
      message={slideIn.message}
      close={closeSlideIn}
    />
  ) : null;



  /* New Post Button */
  function togglePopUp(keepOpen = false) {
    if (openPopUp) {
      setOpenPopUp(false);
      setPopupOpts(replyTemplate);
    } else {
      setOpenPopUp(true);
    }
  }

  function populatePopUp(type, postRef, commentRef) {
    setPopupOpts({ type, postRef, commentRef });
    togglePopUp(true);
  }

  const floatBtn = openPopUp ? (
    <div className="popup open">
      <div className="closeBtn" onClick={togglePopUp}>
        X
      </div>
      <PopupForm
        options={PopUpOpts}
        toggleOpen={togglePopUp}
        slideIn={displaySlideIn}
      />
    </div>
  ) : (
    <div className="popup closed" onClick={togglePopUp}>
      !
    </div>
  );


  /* Render Posts */
  const display =
    posts.length > 0 ? (
        posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard
                post={post}
                populateReply={populatePopUp}
                slideIn={displaySlideIn}
              />
            </div>
          );
        })
    ) : (
      <p>Feed is empty..</p>
    );

  return (
    <div className="feed">
      {display}
      {slideInComponent}
      {floatBtn}
    </div>
  );
}
