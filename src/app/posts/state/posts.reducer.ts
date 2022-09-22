import { Action, createReducer, on } from "@ngrx/store";
import { addPostSuccess, deletePostSuccess, loadPostSuccess, updatePostSuccess } from "./posts.actions";
import { initialState, postsAdapter, PostsState } from "./posts.state";

const _postsReducer = createReducer(initialState,
  on(addPostSuccess,(state,action)=>{
    return postsAdapter.addOne(action.post,state);
}),
on(updatePostSuccess,(state,action) => {
  return postsAdapter.updateOne(action.post, state)
}),
on(deletePostSuccess,(state, {id})=>{
  return postsAdapter.removeOne(id,state)
})
,on(loadPostSuccess,(state,action)=>{
  return postsAdapter.setAll(action.posts, state)
})
);

export function postsReducer (state: PostsState ,action: Action) {
  return _postsReducer(state,action);
}
