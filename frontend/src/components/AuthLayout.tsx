import { Outlet } from "react-router";
import { ErrorAlert } from "./ErrorAlert";
import { SuccessAlert } from "./SuccessAlert";

function AuthLayout() {
	return (
		<>
			<ErrorAlert />
			<SuccessAlert />
			<Outlet />
		</>
	);
}

export default AuthLayout;
