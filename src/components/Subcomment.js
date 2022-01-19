import React from 'react';

function Subcomment(props) {
    return (
        <div className="subcomment">
          <div className="comment-header">
            <span className="comment-date">{props.date}</span>
            <button className="comments-button" onClick={(event) => props.handleEdit(event, props.commentText, props.id)}>
              <img className="action-icon" src={props.editPic} />
            </button>
            <button className="comments-button" onClick={(event) => props.handleCommentDelete(event, props.id)}>
              <img className="action-icon" src={props.deletePic} />
            </button>
          </div>
          <p className="comment-text">
            {props.commentText}
          </p>
        </div>
    )
}

export default Subcomment;
