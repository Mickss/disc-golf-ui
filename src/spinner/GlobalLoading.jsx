import { Backdrop, CircularProgress } from "@mui/material";
import {useLoading} from "./LoadingProvider";

const GlobalLoading = () => {
    const { loading } = useLoading();

    return (
        <Backdrop open={loading}>
            <CircularProgress />
        </Backdrop>
    );
};

export default GlobalLoading;