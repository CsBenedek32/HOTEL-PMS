import { RouterProvider } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import { authRouter, mainRouter } from "./router";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { Provider, useAtom } from "jotai";
import { ErrorAlert } from "./components/ErrorAlert";
import { LoadingModal } from "./components/LoadingModal";
import { SuccessAlert } from "./components/SuccessAlert";
import { store } from "./state/store";
import { userAtom } from "./state/userState";
import { darkTheme } from "./theme/theme";

function AppContent() {
	const [user] = useAtom(userAtom);

	if (!user) {
		return (
			<>
				<CssBaseline />
				<ErrorAlert />
				<SuccessAlert />
				<LoadingModal />
				<RouterProvider router={authRouter} />
			</>
		);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
			<CssBaseline />
			<ErrorAlert />
			<SuccessAlert />
			<LoadingModal />
			<RouterProvider router={mainRouter} />
		</LocalizationProvider>
	);
}

function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<Provider store={store}>
				<ErrorBoundary>
					<AppContent />
				</ErrorBoundary>
			</Provider>
		</ThemeProvider>
	);
}

export default App;
