const todos = (state = [], action) => {
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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter
		default:
			return state
	}
}

const {createStore} = Redux;
const {combineReducers} = Redux;
const {Component} = React;
const todoApp = combineReducers({todos, visibilityFilter});
const store = createStore(todoApp);

const testToggleTodos = () => {
	const stateBefore = [{
		id: 0,
		text: "Learn Redux",
		completed: false
	},
	{
		id: 1,
		text: "Learnt Redux",
		completed: true
	}];

	const stateAfter = [{
		id: 0,
		text: "Learn Redux",
		completed: false
	},
	{
		id: 1,
		text: "Learnt Redux",
		completed: false
	}];

	const action = {
		id: 1,
		type: 'TOGGLETODO',
	}

	deepFreeze(stateBefore);
	deepFreeze(action);
	console.l
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
console.log(store.getState().todos);
console.log('All tests passed');

let newTodoId = 0;
class TodoApp extends Component {
	render() {
		return (
			<div>
				<textarea ref = {node => {
						this.input = node;
					}}></textarea>
				<button onClick={() => {
						store.dispatch({type: 'ADDTODO',
														text: this.input.value,
														id: newTodoId++});
						this.input.value = '';
				}}>Add</button>
				<ul>
					{this.props.todos.map(todo =>
						<li key={todo.id}>{todo.text}</li>
					)}
				</ul>
			</div>
		);
	}
}

const render = () => {
	ReactDOM.render(<TodoApp todos={store.getState().todos} />, document.getElementById('root'));
}

store.subscribe(render);
render();
