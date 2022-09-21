import { createAction, props } from "@ngrx/store";

export const SET_LOADING_ACTION = '[shared state] set loading spinner';
export const SET_ERROR_MASSAGE = '[shared state] set error massage';

export const setLoadingSpinner = createAction(SET_LOADING_ACTION ,props<{status : boolean}>());

export const setErrorMassage = createAction(SET_ERROR_MASSAGE ,props<{massage : string}>());
