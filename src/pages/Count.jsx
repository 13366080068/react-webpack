import React from 'react'

export default class Count extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0
        }
    }

    handleClick() {
        this.setState(state => ({ count: ++state.count }))
    }

    render() {
        return (
            <div>
                当前count值：{this.state.count}<br/>>
                <button style={{ border: '1px dashed blue' }} onClick={() => this.handleClick()}>增加1</button>
            </div>
        )
    }
}
