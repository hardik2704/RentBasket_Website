import * as React from "react";

let toastCount = 0;
const listeners = [];
let memoryState = { toasts: [] };

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
}

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function toast({ title, description }) {
  const id = genId();

  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      title,
      description,
    },
  });

  return {
    id,
    dismiss: () =>
      dispatch({
        type: "REMOVE_TOAST",
        toastId: id,
      }),
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
  };
}

export { useToast, toast };
