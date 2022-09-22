import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { ROUTER_NAVIGATION, RouterNavigatedAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { filter, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { dummyAction } from "src/app/auth/state/auth.actions";
import { Post } from "src/app/model/posts.model";
import { PostService } from "src/app/services/post.service";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, loadPost, loadPostSuccess, updatePost, updatePostSuccess } from "./posts.actions";
import { getPosts } from "./posts.selector";

@Injectable()
export class PostsEffects {
  constructor(private action$: Actions, private postService: PostService, private store: Store) { }

  loadPosts$ = createEffect(() => {
    return this.action$.pipe(ofType(loadPost),
      mergeMap((action) => {
        return this.postService.getPost().pipe(map(posts => {
          return loadPostSuccess({ posts })
        }))
      }))
  });

  addPost$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addPost),
      mergeMap(action => {
        return this.postService.addPost(action.post).pipe(
          map(data => {
            const post = { ...action.post, id: data.name };
            return addPostSuccess({ post })
          }));
      }));
  });
  updatePost$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updatePost),
      switchMap((action) => {
        return this.postService.updatePost(action.post).pipe(
          map((data) => {
            const updatedPost: Update<Post> = {
              id: action.post.id,
              changes: {
                ...action.post,
              }
            }
            return updatePostSuccess({ post: updatedPost });
          })
        );
      }));
  });
  deletePost$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deletePost),
      switchMap((action) => {
        return this.postService.deletePost(action.id).pipe(
          map((data) => {
            return deletePostSuccess({ id: action.id });
          })
        );
      }));
  });
  getSinglePost$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigatedAction) => {
        return r.payload.routerState.url.startsWith('/posts/details');
      }),
      map((r: any) => {
        return r.payload.routerState['params']['id'];
      }),
      withLatestFrom(this.store.select(getPosts)),
      switchMap(([id, posts]) => {
        if (!posts.length) {
          return this.postService.getPostById(id).pipe(
            map((post) => {
              const postData = [{ ...post, id }];
              return loadPostSuccess({ posts: postData });
            })
          );
        }
        return of(dummyAction());
      })
    );
  });

}
