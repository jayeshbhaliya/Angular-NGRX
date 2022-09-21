
export interface SharedState {
  showLoading : boolean;
  errorMassage: string;
}

export const initialState : SharedState = {
  showLoading : false,
  errorMassage : '',
}
