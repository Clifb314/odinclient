import React, { useEffect, useState } from "react";
import { getAccount, editAccount } from "../utils/dataAccess";
import FriendsList from "./FriendsList";
import PostCard from "./postCard";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../utils/useAuth";
import Icons from "../utils/svgHelper";

export default function Account() {
  const [myPage, setMyPage] = useState(null);
  const [editting, setEditting] = useState(false);

  const { user, logoutUser } = useAuthContext();
  const redirect = useNavigate();

  //could get from token instead
  const getUser = async () => {
    //const user = await getAccount()
    //console.log(user)
    if (!user) redirect("/login");
    else {
      // let postList = [...user.posts]
      // const addAuthor = postList.map(post => {
      //     return {...post, author: {
      //         username: user.username,
      //         _id: user._id,
      //         icon: user.icon
      //     }}
      // })
      const fetchUser = await getAccount();
      console.log(fetchUser)
      if (fetchUser.err) {
        logoutUser()
        return redirect("/login");
      }
      //console.log(fetchUser)
      let updatePosts = [...fetchUser.posts].map((post) => {
        return {
          ...post,
          author: {
            username: user.username,
            _id: user._id,
            icon: user.icon,
          },
        };
      });
      let modifiedUser = { ...fetchUser.userDetails };
      console.log(modifiedUser);
      modifiedUser.birthdate = new Date(
        fetchUser.userDetails.birthdate
      ).toLocaleDateString();
      const names = modifiedUser.fullName.split(" ");
      setMyPage({
        ...fetchUser,
        userDetails: {...modifiedUser},
        posts: updatePosts,
        password: "",
        checkPW: "",
        oldPW: "",
        fName: names[0],
        lName: names[1],
      });
    }
  };

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
    //error handling here
    else {
      getUser();

      //set icon from blob?
    }
    return () => setMyPage(null);
  }, []);

  function toggle() {
    editting ? setEditting(false) : setEditting(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { lname, fname } = e.target.name;
    //const body = JSON.parse(e.target)
    const body = {
      ...myPage,
      userDetails: {
        fullName: fname + " " + lname,
      },
    };
    const submit = editAccount(body);
    if (submit.err) return submit.err; //handle error
    else {
        toggle()
        return submit.message; //display submit.message
    }
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setMyPage({ ...myPage, [name]: value });
  }

  const myPosts =
    myPage?.posts.length > 0 ? (
      <div className="feed acct">
        {myPage.posts.map((post) => {
          return (
            <div>
              <PostCard post={post} userid={myPage._id} />
            </div>
          );
        })}
      </div>
    ) : (
      <p>Nothing's here... Try posting something!</p>
    );

  const display =
    myPage && myPage.userDetails ? (
      <form id="accountForm" onSubmit={handleSubmit}>
        <p>User Details: </p>
        <input
          id="username"
          name="username"
          value={myPage.username}
          disabled={!editting}
          onChange={handleChange}
        />
        <input
          id="email"
          name="email"
          value={myPage.userDetails.email}
          disabled={!editting}
          onChange={handleChange}
        />
        <input
          id="fname"
          name="name"
          value={myPage.fName}
          disabled={!editting}
          onChange={handleChange}
        />
        <input
          id="lname"
          name="name"
          value={myPage.lName}
          disabled={!editting}
          onChange={handleChange}
        />
        <input
          type={editting ? "date" : "text"}
          id="bday"
          name="bday"
          value={myPage.userDetails.birthdate}
          disabled={!editting}
          onChange={handleChange}
        />
        <div hidden={!editting}>
          <input
            id="password"
            name="password"
            type="password"
            value={myPage.password}
            onChange={handleChange}
          />
          <input
            id="checkPW"
            name="checkPW"
            type="password"
            value={myPage.checkPW}
            onChange={handleChange}
          />
          <input
            id="oldPW"
            name="oldPW"
            type="password"
            value={myPage.oldPW}
            onChange={handleChange}
          />
        </div>
      </form>
  
    ) : (
      <p>Must be logged in to access this page</p>
    );

  const friendsListDiv = myPage?.friends ? (
    <FriendsList />
  ) : (
    <div>Friend list is empty..</div>
  );

  return (
    <div className="accountPage">
      <div className="userDetails">
        {display}
        <div className="interactBtn">
              {!editting ?
                  <span onClick={toggle}>
                      <Icons iconName={'edit'} />
                  </span>
                  :
                  <button type="submit" onClick={handleSubmit}>
                  Submit
                </button>
              }
          </div>
        {friendsListDiv}
      </div>
      {myPosts}
    </div>
  );
}
