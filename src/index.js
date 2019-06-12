import React from "react"
import ReactDOM from "react-dom"
import { AppContainer } from "react-hot-loader"
import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import $ from "jquery"
import { add } from "./math.js"

add(66)
// 初始化
renderWithHotReloader(Router)

// 热更新
if (module.hot) {
    module.hot.accept('./router/index.js', () => {
        const Router = require('./router/index.js').default
        renderWithHotReloader(Router)
    })
}

$(() => console.log('Test jquery'))

function renderWithHotReloader(Router) {
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter>
                <Router />>
            </BrowserRouter>
        </AppContainer>,
        document.getElementById("app")
    )
}

// Test if the browser supports serviceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('service-worker registed'))
        .catch(err => console.log(`service-worker registed error is ${err}`))
    })
}
