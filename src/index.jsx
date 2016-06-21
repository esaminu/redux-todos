const {createStore} = Redux;
const {connect} = ReactRedux;
const {combineReducers} = Redux;
const {Component} = React;
const {Provider} = ReactRedux;

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

const todoApp = combineReducers({todos, visibilityFilter});

let newTodoId = 0;
const addTodo = text => {
	return {
		type: 'ADDTODO',
		text,
		id: newTodoId++
	};
}

const toggleTodo = id => {
	return {
		type:'TOGGLETODO',
		id
	};
}

const setFilter = filter => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter
	};
}

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

const Link = ({active,children,onClick}) => {
	if(active) {
		return (
			<span>{children}</span>
		);
	}
	return (
		<a href='#' onClick={e => {
				e.preventDefault();
				onClick();
			}}>
			{children}
		</a>
	);
};

const mapLinkStateToProps = (state,ownProps) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
}

const mapLinkDispatchToProps = (dispatch,ownProps) => {
		return {
			onClick: () => {
				dispatch(setFilter(ownProps.filter));
			}
		};
}

const FilterLink = connect(mapLinkStateToProps,mapLinkDispatchToProps)(Link);

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

const Todos = ({todos,onClick}) => {
	return(
		<ul>
			{todos.map(todo =>
				<li onClick={() => {
						onClick(todo.id);
					}}
					key={todo.id}
					style={{textDecoration:
						todo.completed ? 'line-through':'none'}}>
					{todo.text}</li>
			)}
		</ul>
	);
};

const mapListStateToProps = (state) => {
	return {
		todos: getVisibleTodos(state.todos,state.visibilityFilter)
	};
}

const mapListDispatchToProps = (dispatch) => {
	return{
		onClick: (id)=> {
			dispatch(toggleTodo(id));
		}
	};
}

const VisibleList = connect(mapListStateToProps,mapListDispatchToProps)(Todos)

let AddButton = ({dispatch}) => {
	let input;
	return(
		<div>
			<textarea ref = {node => {
					input = node;
				}}></textarea>
			<button onClick={()=>{
				dispatch(addTodo(input.value));
					input.value = '';
				}}>Add</button>
		</div>
	);
};
AddButton = connect()(AddButton);


const VisFilt = () => {
	return (
		<p>
			Show:
			{' '}
			<FilterLink filter='SHOW_ALL'>
				All
			</FilterLink>
			{' '}
			<FilterLink filter='SHOW_COMPLETED'>
				Completed
			</FilterLink>
			{' '}
			<FilterLink filter='SHOW_ACTIVE'>
				Active
			</FilterLink>
		</p>
	);
};

const TodoApp = ({visibilityFilter,todos}) => (
	<div>
		<AddButton />
		<VisibleList />
		<VisFilt />
	</div>
);


ReactDOM.render(<Provider store={createStore(todoApp)}>
									<TodoApp />
								</Provider>,
								document.getElementById('root'));
