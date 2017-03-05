console.clear()
const { Component } = React
const NUM_POINTS = 3
const rnd = (a, b) => a + Math.random() * (b - a + 1)

const Point = (props) => (
	<circle id={props.id}
		      onMouseDown={props.onMouseDown}
		      onTouchStart={props.onTouchStart}
		      cx={props.coords.x} cy={props.coords.y} r="32" />
)

class App extends Component {
	
	constructor(props) {
		super(props)
		const w = innerWidth
		const h = innerHeight
		this.state = {
			width: w,
			height: h, 
			points: this.generatePoints(),
			mouseMoving: null,
			touches: []
		}
		Object.getOwnPropertyNames(App.prototype).forEach(methodName => {
			if (methodName.slice(0,6) === "handle") this[methodName] = this[methodName].bind(this)
		})
	}
	
	generatePoints() {
		let result = {}
		let w = innerWidth
		let h = innerHeight
		for(let i = 0; i < NUM_POINTS; i++) {
			result["pt"+i] = ({id: "pt" + i, x: rnd(0,w), y: rnd(0,h)})
		}
		return result
	}
	
	componentDidMount() {
		window.addEventListener("resize", () => this.setState({
			width: innerWidth, 
			height: innerHeight,
			points: this.generatePoints()
		}))
	}
	
	handleMouseDown(e) {
		if (this.state.touches.length > 0) return
		const id = e.target.id
		this.setState({mouseMoving: id})
	}
	
	handleMouseUp(e) {
		this.setState({mouseMoving: null})
	}
	
	movePoint(id, x, y) {
		this.setState((prev) => ({	
			points: {
				...prev.points, 
				[id]: { id: id, x: x, y: y }
			}
		})) 
	}
	
	handleMouseMove(e) {
		if (this.state && this.state.mouseMoving)	{
			this.movePoint(this.state.mouseMoving, e.clientX, e.clientY)
		} 
	}
	
	handleTouchStart(e) {
		// weirdness 1: e.changedTouches is undefined, have to use e.nativeEvent.changedTouches
		// weirdness 2: spread operator doesn't work: [...e.nativeEvent.changedTouches]
		//              returns [TouchList], not [Touch, Touch, ...]
		const changedTouches = Array.prototype.slice.call(e.nativeEvent.changedTouches)
		this.setState((prev) => ({
			touches: prev.touches.concat(changedTouches.map(t => ({id:t.identifier, targetId: t.target.id})))
		}))
	}
	
	handleTouchMove(e) {
		e.nativeEvent.preventDefault() 
		const changedTouches = Array.prototype.slice.call(e.nativeEvent.changedTouches)
		this.setState((prev) => {
			const newState = {
				points: { ...prev.points }
			}
			changedTouches.forEach(t => {
				if (prev.touches) {
					const touch = prev.touches.find(x => x.id === t.identifier)
					if (touch && newState.points[touch.targetId]) {
						newState.points[touch.targetId].x = t.clientX
						newState.points[touch.targetId].y = t.clientY
					}
				}
			})
			return newState
		})
	}

	handleTouchEnd(e) {
		const changedTouches = Array.prototype.slice.call(e.nativeEvent.changedTouches)
		this.setState((prev) => {
			return {touches: prev.touches.filter(touch => 
				// "multiple exclamation marks", he went on, shaking his head, 
				// "are a sure sign of a diseased mind." (Terry Prattchet in 'Eric')
				!!!changedTouches.find(changedTouch => changedTouch.identifier === touch.id)
			)}
		})
	}
	
	render() {
		const { state } = this
		let w = state.width 
		let h = state.height
		return (<div onMouseMove={this.handleMouseMove}
								 onMouseUp={this.handleMouseUp}
								 onTouchEnd={this.handleTouchEnd}
								 onTouchMove={this.handleTouchMove}>
				      <svg viewBox={`0 0 ${w} ${h}`}>
			        	{
									Object.keys(state.points).map(id => (
										<Point id={id} coords={state.points[id]} 
						        	     onMouseDown={this.handleMouseDown}
											     onTouchStart={this.handleTouchStart}/>))
								}
		          </svg>
				      <pre className="debug">{JSON.stringify(this.state, null, 2)}
				      </pre>
		       </div>)
	}
}


window.oncontextmenu = () => false 
ReactDOM.render(<App />, document.querySelector('.main'))