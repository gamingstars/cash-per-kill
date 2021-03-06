import * as React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import App from "./components/App";

import {BrowserRouter} from 'react-router-dom'

const rootEl = document.getElementById("root");

render(
	<AppContainer>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</AppContainer>,
	rootEl
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
	module.hot.accept("./components/App", () => {
		const NewApp = require("./components/App").default;

		render(
			<AppContainer>
				<BrowserRouter>
					<NewApp/>
				</BrowserRouter>
			</AppContainer>,
			rootEl
		);
	});
}
