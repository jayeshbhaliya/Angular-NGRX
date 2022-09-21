import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/posts.model';
import { AppState } from 'src/app/store/app.state';
import { deletePost, loadPost } from '../state/posts.actions';
import { getPosts } from '../state/posts.selector';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
posts : Observable<Post[]>;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.posts = this.store.select(getPosts);
    this.store.dispatch(loadPost());
  }

  onDeletePost(id : any){
    if(confirm('Are you sure you want to delete ?')){
      this.store.dispatch(deletePost({id}))
    }
  }

}
