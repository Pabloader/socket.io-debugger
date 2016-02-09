export function createReducer(reducers, initialState) {
    return (state = initialState, action = {}) => {
        let reducer = reducers[action.type];
        if (typeof reducer === 'function') {
            return reducer(state, action);
        }
        return state;
    }
}

export function simpleAction(type, ...argNames) {
    return function (...args) {
        let action = {type};
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        });
        return action;
    }
}
