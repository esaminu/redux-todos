const todos = (state = 0, action) => {
	switch(action.type){
  	  case 'ADDTODO': return [...state,{
					id: action.id,
					text: action.text,
					completed: false
			}];
      case 'TOGGLETODO': return state.map(todo => {
				if(todo.id != action.id){
					return todo;
				}

				return {
					id: todo.id,
					text: todo.text,
					completed: !todo.completed
				}
			});
      default: return state;
    }
};

const {createStore} = Redux;
const store = createStore(todos);

const testToggleTodos = () => {
	const stateBefore = [{
		id: 0,
		text: "Learn Redux",
		completed: false
	}];

	const stateAfter = [{
		id: 0,
		text: "Learn Redux",
		completed: true
	}];

	const action = {
		id: 0,
		type: 'TOGGLETODO',
	}

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore,action)).toEqual(stateAfter);
}

const testAddTodos = () => {
	const stateBefore = [];

	const stateAfter = [{
		id: 0,
		text: "Learn Redux",
		completed: false
	}];
	const action = {
		type: 'ADDTODO',
		id: 0,
		text: "Learn Redux"
	}

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore,action)).toEqual(stateAfter)
}

testAddTodos();
testToggleTodos();
console.log('All tests passed');
