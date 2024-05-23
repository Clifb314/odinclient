import React, { useEffect, useState } from "react";
import {
  getAccount,
  editAccount,
  editIcon,
  getIcon,
} from "../utils/dataAccess";
import FriendsList from "./FriendsList";
import PostCard from "./postCard";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../utils/useAuth";
import Icons from "../utils/svgHelper";
import FormHelper from "../utils/formHelper";
import { v4 as uuid } from "uuid";

export default function Account() {
  const previewTemplate = {
    url: null,
    size: null,
    file: null,
  };

  const [myPage, setMyPage] = useState(null);
  const [editting, setEditting] = useState(false);
  const [iconBlob, setIconBlob] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(previewTemplate);

  const { user, logoutUser } = useAuthContext();
  const redirect = useNavigate();

  const getUser = async () => {
    if (!user) redirect("/login");
    else {
      const fetchUser = await getAccount();
      if (fetchUser.err) {
        logoutUser();
        return redirect("/login");
      }

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
      if (modifiedUser.birthdate) {
        modifiedUser.birthdate = new Date(fetchUser.userDetails.birthdate)
          .toISOString()
          .slice(0, 10);
      }

      const names = modifiedUser.fullName.split(" ");
      setMyPage({
        ...fetchUser,
        userDetails: { ...modifiedUser },
        posts: updatePosts,
        password: "",
        checkPW: "",
        oldPW: "",
        fName: names[0],
        lName: names[1],
      });
      if (fetchUser.icon) {
        const blob = await getIcon();
        const imgURL = URL.createObjectURL(blob);
        setIconBlob(imgURL);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
    //error handling here
    else {
      getUser();

    }
    return () => setMyPage(null);
  }, []);



  /* Functions */

  function toggle() {
    editting ? setEditting(false) : setEditting(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { lName, fName } = e.target.name;
    //const body = JSON.parse(e.target)
    const body = {
      ...myPage,
      userDetails: {
        fullName: fName + " " + lName,
      },
    };
    const submit = editAccount(body);
    if (submit.err) return submit.err; //handle error
    //abort icon update if above fails
    else if (previewIcon.file) {
      const iconBody = new FormData();
      iconBody.append("icon", previewIcon.file);
      const submitIcon = editIcon(iconBody);
      if (submitIcon.err) console.log(submitIcon.err);
      else setPreviewIcon(previewTemplate);
    }
    toggle();
    return submit.message; //display submit.message
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setMyPage({ ...myPage, [name]: value });
  }

  function handleChangeIcon(e) {
    const { files } = e.target;
    setPreviewIcon({
      url: URL.createObjectURL(files[0]),
      size: files[0].size + "bytes",
      file: files[0],
    });
  }

  /* constants, conditionals */

  const myPosts =
    myPage?.posts.length > 0 ? (
      <div className="feed acct">
        {myPage.posts.map((post) => {
          return (
            <div key={post._id}>
              <PostCard post={post} userid={myPage._id} />
            </div>
          );
        })}
      </div>
    ) : (
      <p>Nothing's here... Try posting something!</p>
    );

  const imgSettings = editting ? (
    <div className="editIcon">
      <input
        accept="image/*"
        name="icon"
        id="icon"
        type="file"
        onChange={handleChangeIcon}
      />
      <p>Preview: </p>
      {previewIcon.url ? (
        <img className="icon" alt='Current icon' src={previewIcon.url} />
      ) : (
        <img className="icon" alt="Updated icon" src={iconBlob} />
      )}
      <button type="button" onClick={() => setPreviewIcon(previewTemplate)}>
        Clear
      </button>
      <p>Size: {previewIcon.size}</p>
    </div>
  ) : iconBlob ? (
    <img className="icon" alt="Current icon" src={iconBlob} />
  ) : (
    <p>Try Uploading an icon!</p>
  );

  const displayInfo = myPage ? (
    <div>
      <h1>{userDetails.username}</h1>
      <p>Name: {userDetails.userDetails.fullName}</p>
      <p>Age: {userDetails.getAge}</p>
      <p>Birthday: {userDetails.birthdate}</p>
      <p>Email: {userDetails.userDetails.email}</p>
    </div>
  ) : (
    <p>Must be logged in to access this page</p>
  );

  const formOpts = [
    { field: "name", label: "Name" },
    { field: "email", label: "e-mail" },
    { field: "fName", label: "First Name" },
    { field: "lName", label: "Last Name" },
    { field: "birthdate", label: "Birthday" },
    { field: "password", label: "New Password" },
    { field: "checkPW", label: "Re-enter New Password" },
    { field: "oldPW", label: "Old Password" },
  ];

  const displayForm =
    myPage && myPage.userDetails ? (
      <form id="accountForm" onSubmit={handleSubmit}>
        <p>User Details: </p>
        {formOpts.map((input) => {
          return (
            <FormHelper
              key={uuid()}
              field={input.field}
              label={input.label}
              value={myPage[input.field]}
              change={handleChange}
            />
          );
        })}

        <div className="icon-acct">
          <p>Change Icon: </p>
          <div className="icon">{imgSettings}</div>
        </div>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    ) : (
      <p>Must be logged in to access this page</p>
    );

  const friendsListDiv = myPage?.friends?.length > 0 ? (
    <FriendsList />
  ) : (
    <div>Friend list is empty..</div>
  );

  return (
    <div className="accountPage">
      <div className="userDetails">
        {iconBlob ? (
          <div className="icon">
            <img alt={myPage.username + "'s icon"} src={iconBlob} />
          </div>
        ) : null}
        {editting ? displayForm : displayInfo}
        <div className="interactBtn">
          <span onClick={toggle}>
            <Icons iconName={editting ? "delete" : "edit"} />
          </span>
        </div>
        {friendsListDiv}
      </div>
      {myPosts}
    </div>
  );
}
