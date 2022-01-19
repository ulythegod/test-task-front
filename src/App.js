import React from 'react';
import Comment from './components/Comment';
import deletePic from './images/delete.png'
import editPic from './images/editing.png'

function App() {
  const [urlServer, seturlServer] = React.useState("https://ulythegod.beget.tech/index.php");
  const [comments, setComments] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [formData, setFormData] = React.useState({});
  const [editedCommentId, setEditedCommentId] = React.useState(0);
  const [showedCommentsIds, setShowedCommentsIds] = React.useState([]);

  React.useEffect(function() {
      let url = urlServer + "?mode=get&currentPage=" + page;
      if (showedCommentsIds && page > 1) {
        url += "&showedCommentsIds=" + showedCommentsIds.join('_');
      }

      fetch(url)
      .then(res => res.json())
      .then((data) => {
        if (data.pageCount > 0) {
          setPageCount(data.pageCount);
        }
        
        if (data.comments.length > 0) {
          if (page == 1) {
            setComments(prevComments => data.comments);
            setShowedCommentsIds(prevShowedCommentsIds => {
              return data.comments.map(comment => comment.id);
            })
          } else {
            setComments(prevComments => {
              return prevComments.concat(data.comments);
            });

            setShowedCommentsIds(prevShowedCommentsIds => {
              data.comments.forEach(element => {
                prevShowedCommentsIds.push(element.id);
              });

              return prevShowedCommentsIds;
            });
          }
        }
      })
  }, [page]);

  function showMore() {    
    setPage(page + 1);
  }

  function handleChange(event) {
    setFormData({
        [event.target.name]: event.target.value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    let url = urlServer;
    if (editedCommentId) {
      url += "?mode=update&commentText=" + formData.comment + "&commentId=" + editedCommentId;
    } else {
      url += "?mode=create&commentText=" + formData.comment + "&commentLevel=first";
    }
    
    fetch(url)
    .then(res => res.json())
    .then((data) => {
      if (data) {
        if (data.success == 'Y') {
          if (editedCommentId) {
            setComments((prevComments) => {
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

            setEditedCommentId(0);
          } else {
            setComments((prevComments) => {
              if (prevComments) {
                prevComments.unshift(data);
              } else {
                prevComments = [];
                prevComments.push(data);
              }

              return prevComments;
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
      let url = urlServer + "?mode=delete&commentId=" + commentId;

      fetch(url)
      .then(res => res.json())
      .then((data) => {
        if (data) {
          if (data.success == 'Y') {
            setComments(prevComments => prevComments.filter(el => el.id != data.commentId));
          }
        }
      });
    }
  }

  function handleEdit(event, commentText, commentId) {
    event.preventDefault();
    
    setFormData({
      ["comment"]: commentText
    });

    setEditedCommentId(commentId);
  }

  return (
    <div className="comments">
        <form onSubmit={(event) => handleSubmit(event)} className="add-comments-form">         
          <textarea 
            className="comments-textarea" 
            placeholder="Введите комментарий"
            name="comment"
            onChange={(event) => handleChange(event)}
            value={formData.comment}
          />
          <input className="comments-button" type="submit" value={editedCommentId ? "Изменить" : "Добавить комментарий"} />
        </form>
        <div className="comments-list">
          {
              comments.map((commentElement) => {
                return <Comment
                  key={commentElement.id}
                  id={commentElement.id}
                  deletePic={deletePic} 
                  editPic={editPic} 
                  commentText={commentElement.commentText}
                  commentLevel={commentElement.commentLevel}
                  date={commentElement.date}
                  subcomments={commentElement.subcomments}
                  handleCommentDelete={handleCommentDelete}
                  handleEdit={handleEdit}
                  urlServer={urlServer}
                />
              })
            }
        </div>
        {(pageCount > page) && 
          <button className="comments-button" onClick={showMore}>
            Загрузить ещё
          </button>
        }
    </div>
  );
}

export default App;
