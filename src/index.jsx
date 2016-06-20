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

const FilterLink = ({filter,children,currentFilter,onClick}) => {
	if(filter === currentFilter) {
		return (
			<span>{children}</span>
		);
	}
	return (
		<a href='#' onClick={e => {
				e.preventDefault();
				onClick(filter);
			}}>
			{children}
		</a>
	);
};

const getVisibleTodos = (todos, filter) => {
	console.log(filter);

	switch(filter) {
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
		default:
			return todos;
	}
}

const Todos = ({visibilityFilter,todos,toggle}) => {
	let filter = visibilityFilter;
	if(visibilityFilter.filter != undefined){
		filter = visibilityFilter.filter
	}
	const visibletodos = getVisibleTodos(todos, filter);
	return(
		<ul>
			{visibletodos.map(todo =>
				<li onClick={() => {
						toggle(todo.id);
					}}
					key={todo.id}
					style={{textDecoration:
						todo.completed ? 'line-through':'none'}}>
					{todo.text}</li>
			)}
		</ul>
	);
};

const AddButton = ({onClick}) => {
	let input;
	return(
		<div>
			<textarea ref = {node => {
					input = node;
				}}></textarea>
			<button onClick={()=>{
					onClick(input.value);
					input.value = '';
				}}>Add</button>
		</div>
	);
};

const VisFilt = ({visibilityFilter,onClick}) => {
	let filter = visibilityFilter;
	if(visibilityFilter.filter != undefined){
		filter = visibilityFilter.filter
	}
	return (
		<p>
			Show:
			{' '}
			<FilterLink filter='SHOW_ALL' currentFilter = {filter} onClick={onClick}>
				All
			</FilterLink>
			{' '}
			<FilterLink filter='SHOW_COMPLETED' currentFilter = {filter} onClick={onClick}>
				Completed
			</FilterLink>
			{' '}
			<FilterLink filter='SHOW_ACTIVE' currentFilter = {filter} onClick={onClick}>
				Active
			</FilterLink>
		</p>
	);
};

let newTodoId = 0;
const TodoApp = ({visibilityFilter,todos}) => (
	<div>
		<AddButton onClick={input => {
				store.dispatch({type: 'ADDTODO',
												text: input,
												id: newTodoId++});
		}} />
		<Todos visibilityFilter={visibilityFilter}
			todos={todos}
			toggle={id => {
				store.dispatch({
					type:'TOGGLETODO',
					id
				});
			}}/>
		<VisFilt visibilityFilter={visibilityFilter}
			onClick={(filter) => {
				store.dispatch({
				type:'SET_VISIBILITY_FILTER',
				filter
			})}} />
	</div>
);

const render = () => {
	ReactDOM.render(<TodoApp {...store.getState()} />, document.getElementById('root'));
};

store.subscribe(render);
render();
