import { createFeatureSelector, createSelector, props } from "@ngrx/store";
import { RouterStateUrl } from "src/app/store/router/custom-serializer";
import { getCurrrentRoute } from "src/app/store/router/router.selector";
import { PostsState } from "./posts.state";
export const POSTS_STATE_NAME = 'posts';
const getPostsState = createFeatureSelector<PostsState>(POSTS_STATE_NAME);

export const getPosts = createSelector(getPostsState,(state)=>{
  return state.posts;
});

export const getPostById = createSelector(getPosts, getCurrrentRoute , (posts, route : RouterStateUrl) => {
  return posts?  posts.find((post)=>post.id === route.params['id']) : null;
});
// export const getPostById = createSelector(getPostsState, (state: { posts: any[]; } ,props: { id: string; }) => {
//   return state.posts.find((post: { id: any; })=>post.id === props.id);
//   // return state.posts[props.id -1 ];
// });
