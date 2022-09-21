import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap, switchMap } from "rxjs";
import { PostService } from "src/app/services/post.service";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, loadPost, loadPostSuccess, updatePost, updatePostSuccess } from "./posts.actions";

@Injectable()
export class PostsEffects {
  constructor(private action$: Actions, private postService: PostService) { }

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
           const post = {...action.post, id : data.name};
           return addPostSuccess({ post })
          }));
      }));
  });
  updatePost$ = createEffect(()=>{
    return this.action$.pipe(
      ofType(updatePost),
      switchMap((action)=>{
        return this.postService.updatePost(action.post).pipe(
          map((data)=>{
            return updatePostSuccess({post : action.post});
          })
        );
      }));
  });
  deletePost$ = createEffect(()=>{
    return this.action$.pipe(
      ofType(deletePost),
      switchMap((action)=>{
        return this.postService.deletePost(action.id).pipe(
          map((data)=>{
            return deletePostSuccess({id : action.id});
          })
        );
      }));

  });
}
