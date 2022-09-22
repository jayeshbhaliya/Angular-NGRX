import { createFeatureSelector, createSelector, props } from "@ngrx/store";
import { RouterStateUrl } from "src/app/store/router/custom-serializer";
import { getCurrrentRoute } from "src/app/store/router/router.selector";
import { postsAdapter, PostsState } from "./posts.state";

export const POSTS_STATE_NAME = 'posts';
export const postSelectors = postsAdapter.getSelectors();
const getPostsState = createFeatureSelector<PostsState>(POSTS_STATE_NAME);

export const getPosts = createSelector(getPostsState,postSelectors.selectAll);

export const getPostEntities = createSelector(
  getPostsState,
  postSelectors.selectEntities
);

export const getPostById = createSelector(
  getPostEntities, getCurrrentRoute , (posts, route : RouterStateUrl) => {
  return posts ?  posts[route.params['id']]: null;
});
// export const getPostById = createSelector(getPostsState, (state: { posts: any[]; } ,props: { id: string; }) => {
//   return state.posts.find((post: { id: any; })=>post.id === props.id);
//   // return state.posts[props.id -1 ];
// });
