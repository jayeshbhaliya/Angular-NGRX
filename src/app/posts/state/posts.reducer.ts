import { Action, createReducer, on } from "@ngrx/store";
import { addPostSuccess, deletePostSuccess, loadPostSuccess, updatePostSuccess } from "./posts.actions";
import { initialState, PostsState } from "./posts.state";

const _postsReducer = createReducer(initialState,
  on(addPostSuccess,(state,action)=>{
    let posts = {...action.post};
    // posts.id = (state.posts.length + 1).toString();
  return {
    ...state,
    posts: [...state.posts, posts],
  };
}),
on(updatePostSuccess,(state,action) => {
  const updatedPost = state.posts.map(post=>{
    return action.post.id === post.id ? action.post : post;
  })
  return {
    ...state,
    posts : updatedPost,
  }
}),
on(deletePostSuccess,(state, action)=>{
  const updatedPost = state.posts.filter(post => {
    return post.id !== action.id;
  });
  return {
    ...state,
    posts : updatedPost,
  };
}),on(loadPostSuccess,(state,action)=>{
  return {
    ...state,
    posts : action.posts,
  }
})
);

export function postsReducer (state: PostsState ,action: Action) {
  return _postsReducer(state,action);
}
