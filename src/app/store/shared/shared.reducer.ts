import { Action, createReducer, on } from "@ngrx/store";
import { setErrorMassage, setLoadingSpinner } from "./shared.action";
import { initialState, SharedState } from "./shared.state";

const _sharedReducer = createReducer(initialState,
  on(setLoadingSpinner, (state, action) => {
    return {
      ...state,
      showLoading: action.status,
    }
  }),
  on(setErrorMassage, (state, action) => {
    return {
      ...state,
      errorMassage : action.massage,
    }
  })
)
export function SharedReducer(state: SharedState | undefined , action: Action) {
  return _sharedReducer(state, action);
}
