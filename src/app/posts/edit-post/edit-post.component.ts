import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/model/posts.model';
import { AppState } from 'src/app/store/app.state';
import { updatePost } from '../state/posts.actions';
import { getPostById } from '../state/posts.selector';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  editPostForm: FormGroup;
  post: Post;
  postSubscription: Subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.postFormInit()
    this.postSubscription = this.store.select(getPostById).subscribe((post) => {
      if (post) {
        this.post = post;
        this.editPostForm.patchValue({
          title: post.title,
          description: post.description,
        });
      }
    });
    // this.route.paramMap.subscribe((params) => {
    //   const id = params.get('id');
    //   this.postSubscription = this.store.select(getPostById, { id }).subscribe((data) => {
    //     this.post = data;
    //     console.log(this.post);
    //     this.postFormInit();
    //   });
    // });
  }
  postFormInit() {
    this.editPostForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }


  onUpdatePost() {
    if (!this.editPostForm.valid) {
      return;
    }

    const title = this.editPostForm.value.title;
    const description = this.editPostForm.value.description;

    const post: Post = {
      id: this.post.id,
      title,
      description,
    };

    this.store.dispatch(updatePost({ post }));
    this.router.navigate(['/posts']);
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}




