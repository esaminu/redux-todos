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
const {Provider} = ReactRedux;
const todoApp = combineReducers({todos, visibilityFilter});

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

class FilterLink extends Component{

	componentDidMount() {
		const {store} = this.context;
		store.subscribe(()=>{
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render(){
		const {store} = this.context;
		let state = store.getState();
		return(
			<Link active = {this.props.filter === state.visibilityFilter}
				onClick={()=>{
					store.dispatch({
						type: 'SET_VISIBILITY_FILTER',
						filter: this.props.filter
					});
				}}>{this.props.children}</Link>
		);
	}
}
FilterLink.contextTypes = {
	store: React.PropTypes.object
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

class VisibleList extends Component {

	componentDidMount() {
		const {store} = this.context;
		store.subscribe(()=>{
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render(){
		const {store} = this.context;
		let state = store.getState();
		return(
			<Todos todos={getVisibleTodos(state.todos,state.visibilityFilter)}
				onClick={id=>{
					store.dispatch({
						type:'TOGGLETODO',
						id
					});
				}}/>
		);
	}
}
VisibleList.contextTypes = {
	store: React.PropTypes.object
}

const AddButton = ({onClick},{store}) => {
	let input;
	return(
		<div>
			<textarea ref = {node => {
					input = node;
				}}></textarea>
			<button onClick={()=>{
				store.dispatch({type: 'ADDTODO',
												text: input.value,
												id: newTodoId++});
					input.value = '';
				}}>Add</button>
		</div>
	);
};
AddButton.contextTypes = {
	store: React.PropTypes.object
};

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

let newTodoId = 0;
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
