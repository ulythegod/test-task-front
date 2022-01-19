import React from 'react';
import Subcomment from './Subcomment';

function Comment(props) {
    const [isOpened, setIsOpened] = React.useState(false);
    const [isOpenForm, setIsOpenForm] = React.useState(false);
    const [formData, setFormData] = React.useState({});
    const [subcomments, setSubcomments] = React.useState(props.subcomments);
    const [editedSubcommentId, setEditedSubcommentId] = React.useState(0);

    let subcommentsElements = [];
    let hiddenSubcommentsElements = [];

    if (subcomments && subcomments.length > 0) {
      subcomments.forEach((commentElement, index) => {
        if (index < 2) {
          subcommentsElements.push(<Subcomment 
            editPic={props.editPic} 
            deletePic={props.deletePic} 
            key={commentElement.id}
            id={commentElement.id}
            commentText={commentElement.commentText}
            commentLevel={commentElement.commentLevel}
            date={commentElement.date}
            commentParent={commentElement.commentParent}
            handleCommentDelete={handleCommentDelete}
            handleEdit={handleEdit}
          />);
        } else {
          hiddenSubcommentsElements.push(<Subcomment 
            editPic={props.editPic} 
            deletePic={props.deletePic} 
            key={commentElement.id}
            id={commentElement.id}
            commentText={commentElement.commentText}
            commentLevel={commentElement.commentLevel}
            date={commentElement.date}
            commentParent={commentElement.commentParent}
            handleCommentDelete={handleCommentDelete}
            handleEdit={handleEdit}
          />);
        }
      });
    }

    function openSubcomments() {
        setIsOpened(prevIsOpened => !prevIsOpened);
    }

    function openSubcommentsForm() {
        setIsOpenForm(prevIsOpenForm => !prevIsOpenForm);
    }

    function handleChange(event) {
      setFormData({
          [event.target.name]: event.target.value
      });
    }

    function handleSubmit(event) {
      event.preventDefault();
      
      let url = props.urlServer;
      if (editedSubcommentId) {
        url += "?mode=update&commentText=" + formData.comment + "&commentId=" + editedSubcommentId;
      } else {
        url += "?mode=create&commentText=" + formData.comment + "&commentLevel=second&commentParent=" + props.id;
      }
      
      fetch(url)
      .then(res => res.json())
      .then((data) => {
        if (data) {
          if (data.success == 'Y') {
            if (editedSubcommentId) {
              setSubcomments((prevComments) => {
                let updatedComments = prevComments.map((comment) => {
                  if (comment.id == data.commentId) {
                    return {
                      ...comment,
                      "commentText": data.commentText
                    }
                  } else {
                    return comment;
                  }
                });
  
                return updatedComments;
              });
  
              setEditedSubcommentId(0);
              setIsOpenForm(prevIsOpenForm => !prevIsOpenForm);
            } else {
              setSubcomments((prevSubcomments) => {
                if (prevSubcomments) {
                  prevSubcomments.unshift(data);
                } else {
                  prevSubcomments = [];
                  prevSubcomments.push(data);
                }
                
                return prevSubcomments;
              });
            }
                        
            setFormData({
                ["comment"]: ""
            });
          }
        }
      });
    }

    function handleCommentDelete(event, commentId) {
      event.preventDefault();
  
      if (commentId) {
        let url = props.urlServer + "?mode=delete&commentId=" + commentId;
  
        fetch(url)
        .then(res => res.json())
        .then((data) => {
          if (data) {
            if (data.success == 'Y') {
              setSubcomments(prevSubcomments => prevSubcomments.filter(el => el.id != data.commentId));
            }
          }
        });
      }
    }

    function handleEdit(event, commentText, commentId) {
      event.preventDefault();

      setIsOpenForm(prevIsOpenForm => !prevIsOpenForm);
      
      setFormData({
        ["comment"]: commentText
      });
  
      setEditedSubcommentId(commentId);
    }

    return (
        <div className="comment">
          <div className="comment-header">
            <span className="comment-date">{props.date}</span>
            <button className="comments-button" onClick={(event) => props.handleEdit(event, props.commentText, props.id)}>
              <img className="action-icon" src={props.editPic} />
            </button>
            <button className="comments-button" onClick={(event) => props.handleCommentDelete(event, props.id)} >
              <img className="action-icon" src={props.deletePic} />
            </button>
          </div>
          <p className="comment-text">
            {props.commentText}
          </p>
          <button onClick={openSubcommentsForm} className="comment-response-button comments-button">Ответить</button>
          {isOpenForm && 
            <form onSubmit={(event) => handleSubmit(event)} className="add-subcomments-form">         
              <textarea 
                className="comments-textarea" 
                placeholder="Введите комментарий"
                name="comment"
                onChange={(event) => handleChange(event)}
                value={formData.comment}                
              />
              <input className="comments-button" type="submit" value="Добавить комментарий" />
            </form>
          }
          <div className="subcomments-list">
            {subcommentsElements}
            {(hiddenSubcommentsElements.length > 0) && <button className="comments-button load-more-button" onClick={openSubcomments}>{isOpened ? "Скрыть" : "Показать все"}</button>}
            <div className={isOpened ? "subcomments-list loaded-subcomments" : "hidden-subcomments"}>
                {hiddenSubcommentsElements}
            </div>
          </div>
        </div>
    )
}

export default Comment;
