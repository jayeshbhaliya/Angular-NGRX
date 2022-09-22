import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Post } from "src/app/model/posts.model"


export interface PostsState  extends EntityState<Post>{}

export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: sortByName
});

export const initialState : PostsState = postsAdapter.getInitialState();

export function sortByName(a: Post, b: Post): number {
  return a.title.localeCompare(b.title);
}
